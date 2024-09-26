import { addCachedViewCount } from "@/components/views";
import { getCookie } from "cookies-next";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// 1x1 transparent SVG
const pixelData = Buffer.from('<svg/>');

// Define headers for JSON error responses
const ERR_HEADERS = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
};

// Define headers for SVG response
const SVG_HEADERS = {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
};

export async function GET(req: NextRequest) {
    // Get the document ID, user ID, and path from the request
    const documentid = req.nextUrl.searchParams.get("documentid");
    const userid = req.cookies.get("userid")?.value;
    const path = req.nextUrl.searchParams.get("path");

    // Validate the document ID, user ID, and path
    if (!documentid || isNaN(parseInt(documentid))) {
        return new NextResponse(JSON.stringify({ error: "Invalid document ID" }), {
            status: 400,
            headers: ERR_HEADERS
        });
    }

    if (!userid || isNaN(parseInt(userid))) {
        return new NextResponse(JSON.stringify({ error: "Invalid user ID" }), {
            status: 400,
            headers: ERR_HEADERS
        });
    }

    if (!path) {
        return new NextResponse(JSON.stringify({ error: "Invalid path" }), {
            status: 400,
            headers: ERR_HEADERS
        });
    }

    const documentId = parseInt(documentid);
    const userId = parseInt(userid);

    console.log(`${userId} vieweing ${documentid}.`)

    try {
        // Add cached view count and a view entry in the database
        const { newViewer } = await addCachedViewCount(userId, { documentId });

        if (newViewer) {
            revalidatePath(path);
        }

        // Log the document ID and Referer header for debugging purposes
        //console.log('Document ID:', documentId);
        const referer = req.headers.get('referer');
        //console.log('Referer:', referer);

        // Return a 1x1 transparent SVG
        return new NextResponse(pixelData, {
            headers: SVG_HEADERS
        });
    } catch (error) {
        // Handle errors during database operations
        console.error('Error adding view:', error);
        return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: ERR_HEADERS
        });
    }
}
