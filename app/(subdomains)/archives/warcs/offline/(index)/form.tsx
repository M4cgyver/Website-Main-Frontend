'use client'

import React, { useState, useCallback } from 'react'
import { useWarcOfflineViewer } from './context'
import ListFiles from './listFiles'
import { WarcFile, WarcRecord, WarcTreeNode } from './types'
import { addRecordToTree, mWarcParseResponseContentStream, parseFiles, streamFromFile } from './cactions'
import { mWarcParseResponseContent } from '@/libs/mwarc'

const UploadForm: React.FC = () => {
  const { warcFilesRef, setWarcFilesRef, setRecords, records, setRecordCount, tree } = useWarcOfflineViewer()
  const [localWarcFiles, setLocalWarcFiles] = useState<WarcFile[]>(warcFilesRef.current)

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newWarcFiles: WarcFile[] = Array.from(files).map(file => ({
        file,
        status: 'idle',
        progress: 0,
        update: (status: 'idle' | 'processing' | 'complete', progress: number) => {
          // Implement the update logic here
          console.log(`Updating ${file.name}: status=${status}, progress=${progress}`);
          // You might want to trigger a re-render or update state here
        },
      }))

      setLocalWarcFiles(prevFiles => [...prevFiles, ...newWarcFiles])
      setWarcFilesRef(prevFiles => [...prevFiles, ...newWarcFiles])
    }
  }, [setWarcFilesRef])

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Here you would typically start processing the files
    console.log('Files to process:', localWarcFiles);

    parseFiles(localWarcFiles.filter(file => file.status === 'idle'), (newRecord) => {
      const newRecordWithContent: any = {
        ...newRecord,

        content: async () => {
          const slice = await newRecord.file.slice(Number(newRecord.offset), Number(newRecord.offset + newRecord.size)).arrayBuffer().then(slice => Buffer.from(slice));
          if (newRecord.http && newRecord.http['transfer-encoding'] === "chunked") {
            console.log("chunked")
            return mWarcParseResponseContent(slice, "chunked");
          } else {
            return slice;
          }
        },

        stream: mWarcParseResponseContentStream(newRecord.file, newRecord.http?.['transfer-encoding'] ?? undefined, { start: newRecord.offset, size: newRecord.size })
      };

      //console.log("new record", newRecordWithContent)

      const newRecords = setRecords(prevRecords => [...prevRecords, newRecordWithContent]);

      setRecordCount(newRecords.length);

      const warcFile = localWarcFiles.find(file => file.file.name === newRecord.file.name);

      //console.log(localWarcFiles, warcFile);
      if (warcFile?.update)
        warcFile.update("processing", Number(newRecord.offset) / newRecord.file.size * 100)

      if (tree.current) {
        let node = addRecordToTree(tree.current, newRecordWithContent);
        let updateListFunc = null;

        while (node) {
          if (node.updateList) {
            updateListFunc = node.updateList;
            break;
          }
          node = node.parrent;
        }

        if (typeof updateListFunc === 'function') {
          updateListFunc();
        }
      }
    });

  }, [localWarcFiles])

  const removeFile = useCallback((fileToRemove: WarcFile) => {
    /*
    const checkNode = (node: WarcTreeNode) => {
      // Filter out records that match fileToRemove
      node.records = node.records.filter(r => r.file !== fileToRemove.file);

      // Iterate through children and check recursively
      node.child = node.child.filter(c => {
        const { needToRemove } = checkNode(c);
        return !needToRemove; // Keep children that do not need to be removed
      });

      if(node.updateList)
      node.updateList();

      // Determine if this node needs to be removed
      return { needToRemove: node.records.length === 0 && node.child.length === 0 };
    };*/

    setLocalWarcFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove))
    setWarcFilesRef(prevFiles => prevFiles.filter(file => file !== fileToRemove))
    
    //setRecords(records => records.filter(r => r.file !== fileToRemove.file));

    /*
    if (tree.current) {
      tree.current.child.length = 0;

      if (tree.current.updateList)
        tree.current.updateList();

      records.current?.forEach(r => {
        if (tree.current !== null)
          addRecordToTree(tree.current, r)
      });

    }
    */
  }, [setWarcFilesRef])

  return (
    <form onSubmit={handleSubmit} className="w-full h-full flex flex-col">
      <div className="flex-grow space-y-4 p-3">
        <div>
          <label htmlFor="warc-files" className="block text-sm font-medium text-gray-700 mb-2">
            Upload WARC Files
          </label>
          <div className="relative">
            <input
              type="file"
              id="warc-files"
              multiple
              accept=".warc,.warc.gz"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="warc-files"
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <span className="mr-2">📁</span> Choose files
            </label>
          </div>
        </div>

        <ListFiles files={localWarcFiles} removeFile={removeFile} />
      </div>

      <div className="mt-auto p-3">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Upload and Process Files
        </button>
      </div>
    </form>
  )
}

export default UploadForm