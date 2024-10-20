"use client";

import { WarcFile, WarcRecord, WarcTreeNode } from "./types";

export const parseFiles = (
    files: WarcFile[],
    setRecords: ((newRecord: WarcRecord) => void)
) => {
    console.log("files", files);

    const workers = files.map(file => {
        const worker = new Worker("/static/projects/archiver/mwarcs/build/index.js");

        worker.onmessage = event => {
            const { status, action, message, error } = event.data;

            if (status) {
                console.log("WORKER", status, message, error);

                switch (status) {
                    case "completed":
                        file.update("complete", 100)
                        worker.terminate();
                        break;
                }
            } else {
                switch (action) {
                    case "newRecord":
                        setRecords(message);
                        break;
                    default:
                        console.warn("Unknown action received from worker:", action);
                }
            }
        };

        worker.onerror = event => {
            console.error("WORKER ERROR", {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });

            alert(`Error in worker: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
        };

        worker.postMessage({ action: "parse", file: file.file });

        return worker;
    });

    console.log(workers);

    return workers;
};

// Function to add a WarcRecord to the appropriate tree based on its URI
export function addRecordToTree(node: WarcTreeNode, record: WarcRecord) {
    // Ensure the record has a URI; skip if undefined
    if (!record.uri) return null;

    const urlTrees = node.child;

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
    function insertIntoNode(node: WarcTreeNode, pathParts: string[], record: WarcRecord, parrent: WarcTreeNode) {
        // Base case: if there are no more path parts, add the record to this node
        if (pathParts.length === 0) {
            node.records.push(record);
            return node;
        }

        // Find or create the child node corresponding to the current path part
        const nextPart = pathParts.shift()!;
        let childNode = node.child.find(child => child.key === nextPart);

        if (!childNode) {
            childNode = { key: nextPart, child: [], records: [], opened: false, updateList: null, parrent };
            node.child.push(childNode);
        }

        // Recurse into the child node
        return insertIntoNode(childNode, pathParts, record, node);
    }

    // Check if the base URL already exists as a top-level node
    let existingNode = urlTrees.find(tree => tree.key === fullBaseUrl);

    if (existingNode) {
        // If a node with the full base URL already exists, insert into it
        return insertIntoNode(existingNode, urlParts, record, node);
    } else {
        // If no matching top-level node was found, create a new one
        const newNode: WarcTreeNode = { key: fullBaseUrl, child: [], records: [], opened: false, updateList: null, parrent: node };
        urlTrees.push(newNode);
        return insertIntoNode(newNode, urlParts, record, node);
    }
}

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

let cache: Map<WarcRecord, {
    blob: Blob;
    objectURL: string;
    foundRecord: WarcRecord;
}> = new Map();

export const getParsedRecord = async (
    record: WarcRecord | string,
    options: {
        records?: WarcRecord[]; redirect?: boolean; referenced?: WarcRecord[]; dateNear?: Date
    } = {}
): Promise<{ blob: Blob | null; objectURL: string; foundRecord: WarcRecord }> => {
    console.log("Getting record ", record);

    // Destructure with default values
    const {
        redirect = false,
        records = [],
        referenced = [],
        dateNear,
    } = options;

    //const foundRecord = typeof record === "string" ? records.find(r => r.uri === record) : record;
    const foundRecord = typeof record === "string"
        ? (dateNear
            ? records
                .filter(r => r.uri === record)
                .reduce((closest, current) => {
                    if (!closest) return current;
                    const closestDiff = Math.abs(closest.date.getTime() - dateNear.getTime());
                    const currentDiff = Math.abs(current.date.getTime() - dateNear.getTime());
                    return currentDiff < closestDiff ? current : closest;
                }, null as WarcRecord | null)
            : records.find(r => r.uri === record))
        : record;

    if (!foundRecord || !foundRecord.uri || foundRecord.status === undefined) {
        throw new Error(`Record not found: ${record}`);
    }

    referenced.push(foundRecord);

    console.log("Loading record", record, referenced.map(r => r.uri).join(" >>> "));

    const redirectStatuses = [301, 302, 303, 307, 308];

    if (redirectStatuses.includes(foundRecord.status)) {
        return getParsedRecord(
            foundRecord.location ?? `ERR_REDIRECT_BUT_NO_LOCATION_${encodeURIComponent(foundRecord.uri)}`,
            { ...options, referenced: [...referenced], dateNear: foundRecord.date }
        );
    }

    const cachedValue = cache.get(foundRecord);
    if (cachedValue !== undefined) {
        console.log('cache', cachedValue)
        return Promise.resolve(cachedValue);
    }

    ///HELPER FUNCITONS
    const parseCss = async (str: string) => {
        const urlPattern = /url\((['"]?)([^'")]*?)\1\)/gi;
        const matches: { fullMatch: string; url: string | undefined }[] = [];
        let match: RegExpExecArray | null;

        while ((match = urlPattern.exec(str)) !== null) {
            matches.push({ fullMatch: match[0], url: match[2] || match[3] });
        }

        for (const { fullMatch, url } of matches) {
            if (url && !url.startsWith("data:")) {
                const newUrl = new URL(url, foundRecord.uri);
                const result = referenced.find(r => r.uri === newUrl.href)
                    ? `ERR_SELF_REF_RECORD_${encodeURIComponent(newUrl.href)}`
                    : await getParsedRecord(newUrl.href, { records, redirect: true, referenced: [...referenced], dateNear: foundRecord.date }).catch(err => { console.log(err); });

                const newElem = fullMatch.replace(url, typeof result === "string" ? result : result?.objectURL ?? `ERR_NO_RECORD_FOUND_${encodeURIComponent(newUrl.href)}`);
                str = str.replace(fullMatch, newElem);
            }
        }

        return str
    }

    if (redirect && foundRecord.contentType?.includes("text/html")) {
        //console.log("Handling redirect", foundRecord.uri, foundRecord.contentType);

        let content = await (typeof foundRecord.content === "function" ? foundRecord.content() : Promise.resolve(foundRecord.content));

        ///REPLACE ALL src IN <img> ELEMENTS
        let str = content.toString();
        const rSrcHrefNoLink = /<(?!a\b)[^>]*?\s(?:src|href)\s*=\s*["']([^"']+)["'][^>]*?>/gi;
        const matches = [];
        let match;

        while ((match = rSrcHrefNoLink.exec(str)) !== null) {
            matches.push({ fullMatch: match[0], url: match[1] });
        }

        for (const { fullMatch, url } of matches) {
            if (url) {
                const newUrl = new URL(url, foundRecord.uri);
                const result = referenced.find(r => r.uri === newUrl.href)
                    ? `ERR_SELF_REF_RECORD_${encodeURIComponent(newUrl.href)}`
                    : await getParsedRecord(newUrl.href, { records, redirect: true, referenced: [...referenced], dateNear: foundRecord.date })
                        .catch(err => { console.log(err); });

                const newElem = fullMatch.replace(url, typeof result === "string" ? result : result?.objectURL ?? `ERR_NO_RECORD_FOUND_${encodeURIComponent(newUrl.href)}`);
                str = str.replace(fullMatch, newElem);
            }
        }

        ///REPLACE ALL hrefs IN <a> to actually redir
        const rHrefInA = /<a\s+[^>]*href="([^"]*)"[^>]*>/gi;
        matches.length = 0;
        while ((match = rHrefInA.exec(str)) !== null) {
            matches.push({ fullMatch: match[0], url: match[1] });
        }

        for (const { fullMatch, url } of matches) {
            if (url && !url.startsWith("data:")) {
                const newUrl = new URL(url, foundRecord.uri);
                const encodedUrl = encodeURIComponent(newUrl.href);
                const newElem = fullMatch.replace(
                    `href="${url}"`,
                    `href="#" onclick="window.parent.postMessage({action: 'redirect', url: '${encodedUrl}'}, '*'); return false;"`
                );
                str = str.replace(fullMatch, newElem);
            }
        }

        ///PARSE ALL styles TAGS IN ALL ELEMENTS
        const styleRegex = /style\s*=\s*["']([^"']*url\([^"']*\)[^"']*)["']/gi;
        const styleMatches = [];

        // Find all matches
        while ((match = styleRegex.exec(str)) !== null) {
            styleMatches.push(match); // Store the entire match object.
        }

        // Replace each matched style with a parsed version
        for (const fullMatch of styleMatches) {
            const styleContent = fullMatch[1]; // Extract the captured style content
            const parsedStyle = await parseCss(styleContent); // Parse the style
            str = str.replace(fullMatch[0], `style="${parsedStyle}"`); // Replace the full match with parsed version
        }

        /// PARSE ALL <style> TAGS IN ALL ELEMENTS
        const styleTagRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi; // Matches <style>...</style>
        const stylesElemMatches = [];

        // Find all <style> matches
        while ((match = styleTagRegex.exec(str)) !== null) {
            stylesElemMatches.push(match); // Store the entire match object.
        }

        // Replace each matched style content with a parsed version
        for (const fullMatch of stylesElemMatches) {
            const styleContent = fullMatch[1]; // Extract the captured style content
            const parsedStyle = await parseCss(styleContent); // Parse the style
            str = str.replace(fullMatch[0], `<style>${parsedStyle}</style>`); // Replace the full match with parsed version
        }

        ///Set the content and return
        content = Buffer.from(str);
        const headers = new Headers();
        headers.append('Content-Type', foundRecord.contentType ?? "text/plain");

        const blob = await new Response(content, { headers }).blob();
        const objectURL = URL.createObjectURL(blob);

        referenced.splice(referenced.findIndex(r => r === foundRecord));

        const ret = { blob, objectURL, foundRecord };

        cache.set(foundRecord, ret);

        //if (setCacheAfterDone) prevCache = cache;

        return ret;
    } else if (redirect && foundRecord.contentType?.includes("text/css")) {
        let content = await (typeof foundRecord.content === "function" ? foundRecord.content() : Promise.resolve(foundRecord.content));
        //console.log("Handling redirect", foundRecord.uri, foundRecord.contentType);

        content = Buffer.from(await parseCss(content.toString()));

        const headers = new Headers();
        headers.append('Content-Type', foundRecord.contentType ?? "text/plain");

        const blob = await new Response(content, { headers }).blob();
        const objectURL = URL.createObjectURL(blob);

        referenced.splice(referenced.findIndex(r => r === foundRecord), 1);

        const ret = { blob, objectURL, foundRecord };

        cache.set(foundRecord, ret);
        //if (setCacheAfterDone) prevCache = cache;

        return ret;
    } else {
        const headers = new Headers();
        headers.append('Content-Type', foundRecord.contentType ?? "text/plain");

        // Ensure that `stream` is a resolved ReadableStream<Uint8Array>
        const stream = await (typeof foundRecord.stream === 'function'
            ? foundRecord.stream()
            : foundRecord.stream);
        //TOOD: bugged

        const content = await (typeof foundRecord.content === "function" ? foundRecord.content() : Promise.resolve(foundRecord.content));

        const blob = await new Response(content, { headers }).blob();
        const objectURL = URL.createObjectURL(blob);

        referenced.splice(referenced.findIndex(r => r === foundRecord), 1);

        const ret = { blob, objectURL, foundRecord };

        cache.set(foundRecord, ret);
        //if (setCacheAfterDone) prevCache = cache;

        return ret;
    }
};

export function hexToBn(hex: string, options?: { unsigned?: boolean }): bigint {
    const unsigned = options?.unsigned ?? false;

    if (hex.length % 2 || hex.length === 0) {
        hex = '0' + hex;
    }

    const bn = BigInt('0x' + hex);

    if (unsigned) {
        return bn;
    }

    const highByte = parseInt(hex.slice(0, 2), 16);
    if (highByte >= 128) {
        const flipped = bn ^ ((1n << BigInt(hex.length * 4)) - 1n);
        return -flipped - 1n;
    }

    return bn;
}

export const streamFromFile = async (
    file: File,
    options: { start?: bigint; end?: bigint; chunkSize?: bigint } = {}
): Promise<ReadableStream<Uint8Array>> => {
    const start = options.start ?? 0n;
    const end = options.end ?? BigInt(file.size);
    const chunkSize = options.chunkSize ?? 128n * 1024n; // Default 128KB
    const effectiveEnd = BigInt(Math.min(Number(end), file.size));

    return new ReadableStream<Uint8Array>({
        async pull(controller) {
            let offset = start;

            while (offset < effectiveEnd) {
                const nextOffset = BigInt(Math.min(Number(offset + chunkSize), Number(effectiveEnd)));
                const chunk = file.slice(Number(offset), Number(nextOffset));
                const buffer = await chunk.arrayBuffer();
                controller.enqueue(new Uint8Array(buffer));
                offset = nextOffset;

                if (controller.desiredSize && controller.desiredSize <= 0) {
                    return;
                }
            }

            controller.close();
        },
    });
};

export const mWarcParseResponseContentStream = async (
    file: File,
    transferEncoding: "chunked" | "compress" | "deflate" | "gzip" | undefined,
    options: { start?: bigint; size?: bigint; chunkSize?: bigint } = {}
): Promise<ReadableStream<Uint8Array>> => {
    const start = options.start ?? 0n;
    const size = options.size ?? BigInt(file.size);
    const chunkSize = options.chunkSize ?? 128n * 1024n; // Default 128KB

    switch (transferEncoding) {
        case "chunked": {
            let chHex = "";
            let chOffset = 0n;
            let chPosition = start;

            return new ReadableStream<Uint8Array>({
                async pull(controller) {
                    while (chPosition < size) {
                        const chunk = await file
                            .slice(Number(chPosition), Number(chPosition + chunkSize))
                            .arrayBuffer();
                        const chunkBuffer = new Uint8Array(chunk);

                        let offset = 0;
                        while (offset < chunkBuffer.length) {
                            const char = String.fromCharCode(chunkBuffer[offset++]);
                            chHex += char;

                            if (chHex.endsWith("\r\n")) {
                                if (chHex === "0\r\n") {
                                    controller.close(); // End of stream
                                    return;
                                }

                                chOffset = hexToBn(chHex.slice(0, -2), { unsigned: true });
                                chHex = "";

                                const chunkEnd = BigInt(offset) + chOffset;
                                const endChunk = Math.min(Number(chunkEnd), chunkBuffer.length);
                                controller.enqueue(chunkBuffer.slice(offset, endChunk));
                                offset = endChunk + 2; // Skip \r\n after chunk data
                            }
                        }

                        chPosition += BigInt(chunkBuffer.length);

                        if (controller.desiredSize && controller.desiredSize <= 0) {
                            return;
                        }
                    }
                    controller.close();
                },
            });
        }

        case "compress":
        case "deflate":
        case "gzip":
            // Placeholder for future encodings (add logic when needed)
            console.warn(`Encoding "${transferEncoding}" is not yet supported.`);
            return streamFromFile(file, { start, end: start + size, chunkSize });

        default:
            // Default behavior for non-encoded files
            return streamFromFile(file, { start, end: start + size, chunkSize });
    }
};
