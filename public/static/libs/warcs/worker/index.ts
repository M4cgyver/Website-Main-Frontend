// prevents TS errors
declare var self: Worker;

import { mWarcParseResponses } from "../../../../../libs/mwarc"

const readFile = (file: File) => (offset: bigint, size: bigint) => {
    // Convert BigInt to Number safely
    const start = Number(offset);
    const end = Number(offset + size);

    // Ensure start and end are within file bounds
    if (start < 0 || end > file.size) {
        return Promise.reject(new Error('Invalid range'));
    }

    const blob = file.slice(start, end);

    return blob.text();
};


self.onmessage = async (event: MessageEvent) => {
    const { action } = event.data;

    switch (action) {
        case "parse":
            const { file } = event.data;

            for await (const record of mWarcParseResponses(readFile(file), { skipContent: true })) {
                const [header, http, metadata, content] = record;

                const size = http['content-length'] && !isNaN(Number(http['content-length'])) ? BigInt(http['content-length']) : 0n;
                const offset = BigInt(metadata['recordContentOffset']);

                const recordJSON = {
                    uri: header['warc-target-uri']?.replace(/<|>/g, ''),
                    status: http['status'],
                    ip: header['warc-ip-address'],
                    size: size,
                    offset,
                    date: new Date(header['warc-date']),
                    location: http['location'] ?? http['Location'],
                    contentType: http['content-type'],
                    file,

                    'transfer-encoding': http['transfer-encoding']
                }

                self.postMessage({action:'record', record: recordJSON});
            }

            break;
        default:
            break;
    }
};