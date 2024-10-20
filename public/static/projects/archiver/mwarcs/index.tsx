declare var self: Worker;

type mWarcHeaderMap = { [key: string]: any };
type mWarcReadFunction = (offset: bigint, size: bigint) => Promise<Uint8Array | string>
type mWarcCallbackFunction = (header: mWarcHeaderMap, content?: Blob) => void;
type mWarcAsyncItter = AsyncIterable<[mWarcHeaderMap, Uint8Array?]>;
type mWarcResponsesAsyncItter = AsyncIterable<[mWarcHeaderMap, mWarcHeaderMap, mWarcHeaderMap, Uint8Array?]>;

interface mWarcParseWarcOptions {
    callback?: mWarcCallbackFunction;
    skipContent?: boolean;
    readBufferSize?: bigint;
    signal?: AbortSignal;
}

function hexToBn(hex: string, options?: { unsigned?: boolean }): bigint {
    const unsigned = options?.unsigned ?? false;

    if (hex.length % 2 || hex.length === 0) {
        hex = '0' + hex;
    }

    const bn = BigInt('0x' + hex);

    if (unsigned) {
        return bn;
    }

    // Check if the highest bit of the highest byte is set (sign bit)
    const highByte = parseInt(hex.slice(0, 2), 16);
    if (highByte >= 128) {
        // Calculate two's complement (flip bits, add one)
        const flipped = bn ^ ((1n << BigInt(hex.length * 4)) - 1n);
        return -flipped - 1n;
    }

    return bn;
}


const mWarcParseHeader = (s: string): mWarcHeaderMap => {
    const lines = s.split("\r\n");

    const firstLine = lines[0];
    const httpRegex = /^HTTP\/(\d+\.\d+)\s+(\d+)\s+(.*)$/;
    const httpMatches = firstLine.match(httpRegex);

    const httpHeader = httpMatches ? {
        http: httpMatches[1],
        status: parseInt(httpMatches[2], 10),
        message: httpMatches[3].trim()
    } : {};

    const headers = lines
        .slice(1)
        .filter(line => line.trim() !== "")
        .reduce((acc: mWarcHeaderMap, line) => {
            const index = line.indexOf(":");
            if (index !== -1) {
                const key = line.slice(0, index).trim().toLowerCase();
                const value = line.slice(index + 1).trim();
                return { ...acc, [key]: value };
            }
            return acc;
        }, {});

    return { ...headers, ...httpHeader };
};

const mWarcParseResponses = (
    read: mWarcReadFunction,
    options?: {
        skipContent?: boolean;
        readBufferSize?: bigint;
        signal?: AbortSignal;
    }
): mWarcResponsesAsyncItter => {
    const skipContent = options?.skipContent || false;
    const readBufferSize = options?.readBufferSize || 512n + 256n;
    const abortSignal = options?.signal;

    let backbuffer: string = "";
    let offset = 0n;
    let done = false;

    return {
        [Symbol.asyncIterator](): AsyncIterator<[mWarcHeaderMap, mWarcHeaderMap, mWarcHeaderMap, Uint8Array?]> {
            return {
                async next(): Promise<IteratorResult<[mWarcHeaderMap, mWarcHeaderMap, mWarcHeaderMap, Uint8Array?]>> {
                    if (done) {
                        return { done: true, value: undefined as any };
                    }

                    let content: Uint8Array | undefined = undefined;
                    let header: mWarcHeaderMap | undefined;
                    let http: mWarcHeaderMap = {};
                    let metadata: mWarcHeaderMap = {
                        recordWarcOffset: 0n,
                        recordResponseOffset: 0n,
                        recordContentOffset: 0n,
                    };

                    try {
                        do {
                            abortSignal?.throwIfAborted();
                            let bufferToParse: string = backbuffer;
                            let bufferChunks: Array<string> = [];
                            metadata.recordWarcOffset = offset - BigInt(bufferToParse.length);

                            while (bufferChunks.length < 2) {
                                const newChunks = bufferToParse.split("\r\n\r\n");
                                bufferChunks = newChunks.length > 1 ? newChunks : bufferChunks;

                                if (bufferChunks.length < 2) {
                                    abortSignal?.throwIfAborted();
                                    const possiblePromise = await read(offset, readBufferSize);

                                    if (!possiblePromise || possiblePromise.length === 0) {
                                        done = true;
                                        return { done: true, value: undefined as any };
                                    }

                                    bufferToParse += typeof possiblePromise === 'string' ? possiblePromise : new TextDecoder().decode(possiblePromise);
                                    offset += readBufferSize;
                                }
                            }

                            header = mWarcParseHeader(bufferChunks[0]);

                            const contentLength = header['content-length'] ? BigInt(header['content-length']) : 0n;

                            if (header['warc-type'] !== 'response' || contentLength === 0n) {
                                const remainingBytes = contentLength - BigInt(bufferToParse.length - bufferChunks[0].length - 4);
                                offset += remainingBytes > 0n ? remainingBytes : 0n;
                                backbuffer = remainingBytes < 0n ? bufferToParse.slice(bufferToParse.length + Number(remainingBytes) + 4) : "";

                            } else {
                                while (bufferChunks.length < 3) {
                                    const newChunks = bufferToParse.split("\r\n\r\n");
                                    bufferChunks = newChunks.length > 2 ? newChunks : bufferChunks;

                                    if (bufferChunks.length < 3) {
                                        abortSignal?.throwIfAborted();
                                        const possiblePromise = await read(offset, readBufferSize);

                                        if (!possiblePromise || possiblePromise.length === 0) {
                                            done = true;
                                            return { done: true, value: undefined as any };
                                        }

                                        bufferToParse += typeof possiblePromise === 'string' ? possiblePromise : new TextDecoder().decode(possiblePromise);
                                        offset += readBufferSize;
                                    }
                                }

                                http = mWarcParseHeader(bufferChunks[1]);
                                const httpContentLength = contentLength - BigInt(bufferChunks[1].length);

                                const remainingBytes = httpContentLength - BigInt(bufferToParse.length - bufferChunks[0].length - bufferChunks[1].length - 8);
                                content = skipContent ? undefined :
                                    new TextEncoder().encode(
                                        bufferToParse.slice(
                                            bufferChunks[0].length + bufferChunks[1].length + 8,
                                            bufferChunks[0].length + bufferChunks[1].length + 8 + Number(httpContentLength)
                                        ) +
                                        ((remainingBytes > 0n) ?
                                            (await read(offset, remainingBytes)).toString() :
                                            ""
                                        )
                                    );

                                offset += remainingBytes > 0n ? remainingBytes : 0n;
                                backbuffer = remainingBytes < 0n ? bufferToParse.slice(bufferToParse.length + Number(remainingBytes) + 4) : "";

                                metadata.recordResponseOffset = metadata.recordWarcOffset + BigInt(bufferChunks[0].length + 4);
                                metadata.recordContentOffset = metadata.recordResponseOffset + BigInt(bufferChunks[1].length + 4);

                                http['content-length'] = httpContentLength;
                            }
                        } while (header && header['warc-type'] !== 'response');

                        if (!header) {
                            done = true;
                            return { done: true, value: undefined as any };
                        }

                        return {
                            done: false,
                            value: [header, http, metadata, content],
                        };
                    } catch (err) {
                        if (abortSignal?.aborted) {
                            done = true;
                            return { done: true, value: undefined as any };
                        }
                        if (err instanceof RangeError) {
                            done = true;
                            return { done: true, value: undefined as any };
                        } else {
                            throw err;
                        }
                    }
                }
            };
        }
    };
};

self.onmessage = async (event: MessageEvent) => {
    const { action, file } = event.data;

    if (action === 'parse' && file instanceof File) {
        try {
            self.postMessage({ status: 'started' });

            const read = async (offset: bigint, size: bigint): Promise<Uint8Array> => {
                const slice = await file.slice(Number(offset), Number(offset + size)).arrayBuffer();
                return new Uint8Array(slice);
            };

            try {
                for await (const record of mWarcParseResponses(read, { skipContent: true })) {
                    const [header, http, metadata] = record;

                    const size = http['content-length'] && !isNaN(Number(http['content-length'])) ? BigInt(http['content-length']) : 0n;
                    const offset = BigInt(metadata['recordContentOffset']);

                    const newRecord = {
                        uri: header['warc-target-uri']?.replace(/<|>/g, ''),
                        status: http['status'],
                        ip: header['warc-ip-address'],
                        size: size,
                        date: new Date(header['warc-date']),
                        location: http['location'] ?? http['Location'],
                        contentType: http['content-type'],
                        file,
                        offset,
                        transferEncoding: http['transfer-encoding'],
                        http
                    };

                    self.postMessage({ action: "newRecord", message: newRecord });
                } 
            } catch (e) {
                //TODO: Error handling
            }

            self.postMessage({ status: 'completed' });
        } catch (error: any) {
            self.postMessage({ status: 'error', error: error.message });
        }
    } else {
        self.postMessage({ status: 'error', error: 'Invalid action or file' });
    }
};