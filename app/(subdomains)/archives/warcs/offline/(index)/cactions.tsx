'use client';

import { mWarcParseResponseContent, mWarcParseResponses } from "@/libs/mwarc";
import { WarcRecord, WarcTreeNode } from "./types";

export const parseFile = async (
    file: File,
    onRecordParsed: (record: WarcRecord) => void,
    setProgress: (progress: number) => void,
): Promise<WarcRecord[]> => {
    try {
        const newRecords: WarcRecord[] = [];

        console.log("Parsing ", file);

        const read = (offset: bigint, size: bigint) =>
            file.slice(Number(offset), Number(offset + size)).arrayBuffer()
                .then(slice => Buffer.from(slice));

        for await (const record of mWarcParseResponses(read, { skipContent: true })) {
            const [header, http, metadata] = record;

            const size = http['content-length'] && !isNaN(Number(http['content-length'])) ? BigInt(http['content-length']) : 0n;
            const offset = BigInt(metadata['recordContentOffset']);

            const newRecord: WarcRecord = {
                uri: header['warc-target-uri']?.replace(/<|>/g, ''),
                status: http['status'],
                ip: header['warc-ip-address'],
                size: size,
                date: new Date(header['warc-date']),
                location: http['location'] ?? http['Location'],
                contentType: http['content-type'],
                file,
                content: async () => {
                    const slice = await file.slice(Number(offset), Number(offset + size)).arrayBuffer().then(slice => Buffer.from(slice));
                    if (http['transfer-encoding'] === "chunked") {
                        return mWarcParseResponseContent(slice, "chunked");
                    } else {
                        return slice;
                    }
                }
            };

            newRecords.push(newRecord);
            onRecordParsed(newRecord);  // Call the callback function for each parsed record

            setProgress(Number(offset) / file.size);
        }

        console.log("Parsed ", file);

        return newRecords;
    } catch (error) {
        console.error("Error parsing files:", error);
        throw error;
    }
};

export const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    else if (sizeInBytes < 1024 ** 2) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    else if (sizeInBytes < 1024 ** 3) return `${(sizeInBytes / 1024 ** 2).toFixed(2)} MB`;
    else if (sizeInBytes < 1024 ** 4) return `${(sizeInBytes / 1024 ** 3).toFixed(2)} GB`;
    else return `${(sizeInBytes / 1024 ** 4).toFixed(2)} TB`;
};

// Function to add a WarcRecord to the appropriate tree based on its URI
export function addRecordToTree(urlTrees: WarcTreeNode[], record: WarcRecord) {
    // Ensure the record has a URI; skip if undefined
    if (!record.uri) return;

    // Extract the protocol (http:// or https://) and the rest of the URL
    const protocolMatch = record.uri.match(/^(https?:\/\/)/);
    const protocol = protocolMatch ? protocolMatch[0] : '';
    const restOfUrl = record.uri.slice(protocol.length);

    // Normalize the URL by removing trailing slashes and the 'www.' prefix
    let normalizedUrl = restOfUrl.replace(/\/+$/, '');
    normalizedUrl = normalizedUrl.replace(/^www\./, '');

    // Split the normalized URL into base URL and path parts
    const [baseUrl, ...urlParts] = normalizedUrl.split('/');

    // Combine protocol with the base URL to maintain full base URL
    const fullBaseUrl = `${protocol}${baseUrl}`;

    // Recursive function to insert a record into the appropriate node
    function insertIntoNode(node: WarcTreeNode, pathParts: string[], record: WarcRecord) {
        // Base case: if there are no more path parts, add the record to this node
        if (pathParts.length === 0) {
            node.record = record;
            return;
        }

        // Find or create the child node corresponding to the current path part
        const nextPart = pathParts.shift()!;
        let childNode = node.child.find(child => child.key === nextPart);

        if (!childNode) {
            childNode = { key: nextPart, child: [], record: null, opened: false };
            node.child.push(childNode);
        }

        // Recurse into the child node
        insertIntoNode(childNode, pathParts, record);
    }

    // Check if the base URL already exists as a top-level node
    let existingNode = urlTrees.find(tree => tree.key === fullBaseUrl);

    if (existingNode) {
        // If a node with the full base URL already exists, insert into it
        insertIntoNode(existingNode, urlParts, record);
    } else {
        // If no matching top-level node was found, create a new one
        const newNode: WarcTreeNode = { key: fullBaseUrl, child: [], record: null, opened: false };
        urlTrees.push(newNode);
        insertIntoNode(newNode, urlParts, record);
    }

    return urlTrees;
}

export const getParsedRecord = async (
    record: WarcRecord | string,
    options: { records?: WarcRecord[]; redirect?: boolean; referenced?: WarcRecord[] } = {}
): Promise<{ blob: Blob; objectURL: string; foundRecord: WarcRecord }> => {
    //console.log("Getting record ", record);

    const { redirect = false, records = [], referenced = [] } = options;

    const foundRecord = typeof record === "string" ? records.find(r => r.uri === record) : record;

    if (!foundRecord || !foundRecord.uri || foundRecord.status === undefined) {
        throw new Error(`Record not found: ${record}`);
    }
    
    referenced.push(foundRecord);

    const redirectStatuses = [301, 302, 303, 307, 308];

    if (redirectStatuses.includes(foundRecord.status)) {
        return getParsedRecord(
            foundRecord.location ?? `ERR_REDIRECT_BUT_NO_LOCATION_${encodeURIComponent(foundRecord.uri)}`,
            { ...options, referenced }
        );
    }

    let content = await (typeof foundRecord.content === "function" ? foundRecord.content() : Promise.resolve(foundRecord.content));

    if (redirect && foundRecord.contentType?.includes("text/html")) {
        //console.log("Handling redirect", foundRecord.uri, foundRecord.contentType);

        let str = content.toString();
        const rSrcHrefNoLink = /(<(?!a\b)[^>]*(?:\ssrc="([^"]*)"|\shref="([^"]*)").*?>)/gi;
        const matches: { fullMatch: string; url: string | undefined }[] = [];
        let match: RegExpExecArray | null;

        while ((match = rSrcHrefNoLink.exec(str)) !== null) {
            matches.push({ fullMatch: match[0], url: match[2] || match[3] });
        }

        for (const { fullMatch, url } of matches) {
            if (url) {
                const newUrl = new URL(url, foundRecord.uri);
                const result = referenced.find(r => r.uri === newUrl.href)
                    ? `ERR_SELF_REF_RECORD_${encodeURIComponent(newUrl.href)}`
                    : await getParsedRecord(newUrl.href, { records, redirect: true, referenced }).catch(err => { console.log(err); });

                //console.log("new url", fullMatch, url, newUrl.href, result);

                const newElem = fullMatch.replace(url, typeof result === "string" ? result : result?.objectURL ?? `ERR_NO_RECORD_FOUND_${encodeURIComponent(newUrl.href)}`);
                str = str.replace(fullMatch, newElem);
            }
        }

        const rHrefInA = /<a\s+[^>]*href="([^"]*)"[^>]*>/gi;
        matches.length = 0;

        while ((match = rHrefInA.exec(str)) !== null) {
            matches.push({ fullMatch: match[0], url: match[1] });
        }

        for (const { fullMatch, url } of matches) {
            if (url) {
                const newUrl = new URL(url, foundRecord.uri);
                const encodedUrl = encodeURIComponent(newUrl.href);
                const newElem = fullMatch.replace(
                    `href="${url}"`,
                    `href="#" onclick="window.parent.postMessage({action: 'redirect', url: '${encodedUrl}'}, '*'); return false;"`
                );
                str = str.replace(fullMatch, newElem);
            }
        }

        content = Buffer.from(str);
    } else if (redirect && foundRecord.contentType?.includes("text/css")) {
        //console.log("Handling redirect", foundRecord.uri, foundRecord.contentType);

        let str = content.toString();
        const urlPattern = /url\((['"]?)([^'")]*?)\1\)/gi;
        const matches: { fullMatch: string; url: string | undefined }[] = [];
        let match: RegExpExecArray | null;

        while ((match = urlPattern.exec(str)) !== null) {
            matches.push({ fullMatch: match[0], url: match[2] || match[3] });
        }

        for (const { fullMatch, url } of matches) {
            if (url) {
                const newUrl = new URL(url, foundRecord.uri);
                const result = referenced.find(r => r.uri === newUrl.href)
                    ? `ERR_SELF_REF_RECORD_${encodeURIComponent(newUrl.href)}`
                    : await getParsedRecord(newUrl.href, { records, redirect: true, referenced }).catch(err => { console.log(err); });

                const newElem = fullMatch.replace(url, typeof result === "string" ? result : result?.objectURL ?? `ERR_NO_RECORD_FOUND_${encodeURIComponent(newUrl.href)}`);
                str = str.replace(fullMatch, newElem);
            }
        }

        content = Buffer.from(str);
    }

    const headers = new Headers();
    headers.append('Content-Type', foundRecord.contentType ?? "text/plain");

    const blob = await new Response(content, { headers }).blob();
    const objectURL = URL.createObjectURL(blob);

    return { blob, objectURL, foundRecord };
};