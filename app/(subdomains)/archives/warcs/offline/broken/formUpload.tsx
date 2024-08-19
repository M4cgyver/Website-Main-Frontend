"use client";

import winStyles from "@/libs/styles/windows.archives.module.css"
import { useContext, useRef } from "react";
import { WarcOfflineContext } from "./store";
import { WarcFile, WarcRecord, updateRecordsList } from "./libs";
import { mWarcParseResponseContent } from "@/libs/mwarc";

export const FormUpload = () => {
    const forumRef = useRef<HTMLInputElement>(null);

    const { files, records, recordsTree, loading } = useContext(WarcOfflineContext);

    const workerUrl = "/static/libs/warcs/worker/index.js";

    const updateLoading = (l: boolean) => {
        if (loading?.current !== undefined) loading.current = l;
    }

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        updateLoading(true);

        //Clear all of the existing files
        for (let file = files?.current.pop(); file !== undefined; file = files?.current.pop()) {
            file.worker.onmessage = null;
            file.worker.terminate();
        }

        //Get all the files and parse
        if (forumRef.current && files?.current && records?.current) {

            console.log("parsing files... ");

            Array.from(forumRef.current.files as FileList).forEach(file => {
                const worker = new Worker(workerUrl);

                worker.onmessage = (event: MessageEvent<any>) => {
                    const { action } = event.data;
                
                    switch (action) {
                        case 'record':
                            const { record } = event.data;
                            const recordToInsert = {
                                ...record,
                
                                content: async () => {
                                    const slice = await record.file.slice(Number(record.offset), Number(record.offset + record.size));
                
                                    if (record['transfer-encoding'] === "chunked") {
                                        return mWarcParseResponseContent(slice, "chunked");
                                    } else {
                                        return slice;
                                    }
                                }
                            }

                            //if(recordsTree)
                            //updateRecordsList(recordToInsert, recordsTree.current);

                            records.current.push(recordToInsert)
                
                            break;
                
                        default:
                            break;
                    }
                }

                worker.postMessage({ 'action': 'parse', file })

                files.current.push({
                    file,
                    worker,
                    progress: 0
                })
            });
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <link rel="prefetch" href={workerUrl} />
            <label htmlFor="file-upload">Upload WARC files:</label>
            <input
                id="file-upload"
                type="file"
                accept=".warc"
                ref={forumRef}
                multiple
            />
            <button type="submit" className={winStyles.button}>Submit Files</button>
        </form>
    );
}