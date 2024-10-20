'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { formatFileSize } from './cactions';
import { WarcFile } from './types';

interface ListFilesProps {
  files: WarcFile[];
  removeFile: (file: WarcFile) => void;
}

interface FileListingProps {
  file: WarcFile;
  removeFile: (file: WarcFile) => void;
}

const FileListing: React.FC<FileListingProps> = React.memo(({ file, removeFile }) => {
  const [, forceUpdate] = useState({});
  const progressRef = useRef<HTMLDivElement>(null);

  const handleUpdate = (newStatus: 'idle' | 'processing' | 'complete', newProgress: number) => {
    file.status = newStatus;
    file.progress = newProgress;
    
    if (progressRef.current) {
      progressRef.current.style.width = `${newProgress}%`;
    }
    
    // Force a re-render to update the displayed status and progress
    forceUpdate({});
  };

  useEffect(() => {
    file.update = handleUpdate;
  }, [file, handleUpdate]);

  return (
    <li className="flex gap-2 m-2 p-1 items-center justify-between py-2 rounded-s relative overflow-hidden">
      <div
        ref={progressRef}
        className="absolute left-0 top-0 h-full bg-blue-100 transition-all duration-50 ease-in-out"
        style={{ width: `${file.progress}%` }}
      />
      <button
        onClick={() => removeFile(file)}
        className={`px-2 py-1 text-sm text-white rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
          file.status === 'processing'
            ? 'bg-red-300 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
        } relative z-10`}
        style={{ width: 75 }}
        disabled={file.status === 'processing'}
      >
        Remove
      </button>

      <span className="grow relative z-10">{file.file.name}</span>

     <span className="relative z-10 w-[90px] text-center">
        {formatFileSize(file.file.size)}
      </span>

      <span className="relative z-10 w-[90px] text-right">
        {file.status[0].toUpperCase() + file.status.slice(1).toLowerCase()}
      </span>

      <span className="relative z-10 w-[90px] text-right">
        {file.progress.toFixed(2)}%
      </span>
    </li>
  )
});

FileListing.displayName = 'FileListing';

const ListFiles: React.FC<ListFilesProps> = ({ files, removeFile }) => {
  return (
    <ul className="mt-4 pb-1">
      {files.map((file) => (
        <FileListing
          key={file.file.name}
          file={file}
          removeFile={removeFile}
        />
      ))}
    </ul>
  )
}

export default ListFiles