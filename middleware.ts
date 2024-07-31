import { NextResponse, NextRequest } from 'next/server';
import { hashDJB2, hashSHA3 } from './libs/algorithm';

// RegExp for matching public files
const PUBLIC_FILE = /\.(.*)$/;

/* Parse SUBDOMAINS from process.env
const subdomainsString = process.env.SUBDOMAINS;
let subdomains: Record<string, string> = {}; // Initialize as empty object

if (subdomainsString) {
    try {
        subdomains = JSON.parse(subdomainsString);
        console.log(subdomains);
    } catch (error) {
        console.error('Error parsing SUBDOMAINS:', error);
    }
} */

const subdomains = JSON.parse(process.env.SUBDOMAINS ?? "{}");
const ssrroutes = JSON.parse(process.env.SSRROUTES ?? "{}");

// Function to get a valid subdomain from the host
const getValidSubdomain = (host?: string | null): string | null => {
    if (!host && typeof window !== 'undefined') {
        // On the client side, get the host from window.location
        host = window.location.host;
    }
    if (host && host.includes('.')) {
        // Split the host to extract the subdomain candidate
        const candidate = host.split('.')[0];

        // Return the candidate if it's valid (not 'localhost')
        if (candidate && !candidate.includes('localhost')) {
            return candidate;
        }
    }
    return null;
};

// Function to get a valid ssr route
const getValidSSRRoute = (path: string): string | null => {
    // Trim trailing slashes for consistency
    const trimmedPath = path.replace(/\/$/, "");

    // Initialize variables for tracking the best match
    let bestMatch: string | null = null;
    let longestMatchLength = 0;

    // Iterate over the SSR routes
    for (const [nonSSR, ssr] of Object.entries(ssrroutes)) {
        // Trim trailing slashes from nonSSR for consistency
        const trimmedNonSSR = nonSSR.replace(/\/$/, "");

        // Check if the path starts with the non-SSR route and verify it's a complete segment match
        if (
            trimmedPath.startsWith(trimmedNonSSR) &&
            (trimmedPath.length === trimmedNonSSR.length || trimmedPath[trimmedNonSSR.length] === '/')
        ) {
            const currentMatchLength = trimmedNonSSR.length;
            // Update the best match if the current match is longer
            if (currentMatchLength > longestMatchLength) {
                longestMatchLength = currentMatchLength;
                bestMatch = (ssr) ? (ssr as string) : null;
            }
        }
    }

    // Return the best match or null if no match is found
    return bestMatch;
};

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    /// Check if the request is for a public file or a Next.js internal file
    if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes('_next')) {
        return NextResponse.next();
    }

    /// Check if the request is due for a subdomain redirect
    const host = request.headers.get('host');

    for (const subdomain in subdomains) {
        const path = subdomains[subdomain];

        if (request.nextUrl.pathname.startsWith(path)) {
            const protocol = request.nextUrl.protocol.startsWith('https') ? 'https' : 'http';
            const newPath = request.nextUrl.pathname.substring(path.length); // Adjust the new path

            const newurl = `${protocol}://${subdomain}.${host}${newPath}`;

            console.log(`Redirecting ${request.nextUrl.pathname} to ${newurl}`);
            return NextResponse.redirect(newurl);
        }
    }

    /// If a valid subdomain is found and exists in subdomains, rewrite the URL
    const subdomain = getValidSubdomain(host);

    if (subdomain && subdomain in subdomains && !url.pathname.replace(subdomains[subdomain], "").startsWith("/next_") && !url.pathname.replace(subdomains[subdomain], "").startsWith("/api")) {
        console.log(`>>> Rewriting: ${url.pathname} to ${subdomains[subdomain]}${url.pathname}`);
        url.pathname = `${subdomains[subdomain]}${url.pathname}`;
    }

    /// Check the ssr cookie and check the paths
    // needs to be after subdomian
    const cookiessr = request.cookies.get("noscript")?.value;

    console.log(cookiessr);

    const ssrroute = getValidSSRRoute(url.pathname);
    console.log(`>>> SSR enabled ${url.pathname} ${ssrroute}`)

    if (ssrroute && cookiessr != 'true') {
        if (cookiessr != 'true') {
            console.log(`>>> SSR: ${url.pathname} to ${ssrroute}`)
            url.pathname = ssrroute;
        }
    }

    /// Finish the rewrite
    const response = NextResponse.rewrite(url);

    /// Compute user ID and document ID using hashing algorithms
    const userid = hashDJB2(hashSHA3(request.ip + (process.env.HASH_IP_DEFAULT_SALT ?? "")) + "salt 2");
    const documentid = hashDJB2(hashSHA3(request.nextUrl.basePath));

    // Set cookies and headers in the response
    response.cookies.set("userid", userid.toString(), { path: "*" });
    response.headers.set('x-url', request.url);
    response.headers.set('x-path', request.nextUrl.basePath);
    response.headers.set('x-id', documentid.toString());

    if (ssrroute && cookiessr != 'true') {
        response.cookies.set('noscript', 'false');
    }

    return response;
}
