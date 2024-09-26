'use client';

import React, { useRef, useCallback } from 'react';
import { useGlobalContext } from './context';
import { WarcRecord, WarcFile, WarcTreeNode } from './types';
import { formatFileSize, parseFile } from './cactions';

export default function WarcUploadForm() {
    const { files, setFiles, isLoading, setIsLoading, warcRecords, setWarcRecords, setWarcTree, addRecordToTree } = useGlobalContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            const warcFiles = newFiles.filter(file => file.name.endsWith('.warc'));

            if (warcFiles.length !== newFiles.length) {
                setError('Some files were not .warc files and were ignored.');
            }

            // Create WarcFile objects with default status and progress
            const newWarcFiles: WarcFile[] = warcFiles.map(file => ({
                file,
                status: 'idle',
                progress: 0
            }));

            setFiles(prevFiles => [...prevFiles, ...newWarcFiles]);
        }
    };

    const onRecordParsed = useCallback(
        (newRecord: WarcRecord) => {
            addRecordToTree(newRecord);
            setWarcRecords(prevRecords => [...prevRecords, newRecord]);
        },
        [setWarcRecords]
    );

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        /*
        parseFiles(files.map(file => file.file), onRecordParsed)
            .then(() => {
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
        */

        files.forEach(wfile => wfile.status = 'processing');

        const promises = files.map(wfile =>
            parseFile(wfile.file, onRecordParsed, (p: number) => {
                wfile.progress = p
                setFiles(prev => prev);
                //console.log(p)
            })
                .then(() => {
                    wfile.status = 'complete'
                })
        );

        Promise.allSettled(promises).then(() => {
            setIsLoading(false);
        })
    };

    //console.log("FINAL TREE", warcTree);

    const removeFileFromTree = (nodes: WarcTreeNode[], fileToRemove: WarcFile): WarcTreeNode[] => {
        const result: WarcTreeNode[] = [];

        nodes.forEach(node => {
            // Recursively filter child nodes
            const filteredChildren = removeFileFromTree(node.child, fileToRemove);

            // Only include the current node if it should not be removed
            if (node.record?.file !== fileToRemove.file) {
                result.push({
                    ...node,
                    child: filteredChildren,
                });
            }
        });

        return result;
    };


    const removeFile = (fileToRemove: WarcFile) => {
        setFiles(prevFiles => prevFiles.filter(file => file.file !== fileToRemove.file));
        setWarcRecords(prevRecords => prevRecords.filter(record => record.file !== fileToRemove.file));
        setWarcTree(prevTree => removeFileFromTree(prevTree, fileToRemove));

    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label htmlFor="warc-files" style={{ display: 'block', marginBottom: '0.5rem' }}>Upload WARC Files</label>
                    <input
                        id="warc-files"
                        type="file"
                        multiple
                        accept=".warc"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                        ref={fileInputRef}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>
                {error && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '4px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Error</p>
                        <p>{error}</p>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isLoading || files.length === 0}
                    style={{
                        backgroundColor: isLoading || files.length === 0 ? '#9ca3af' : '#3b82f6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: isLoading || files.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Processing...' : 'Upload and Process'}
                </button>
            </form>

            <ul className="mt-4 pb-1">
                {files.map((warcFile, index) => (
                    <li
                        key={index}
                        className="flex gap-2 m-2 p-1 items-center justify-between py-2 rounded-s"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.1) ${warcFile.status === 'complete' ? 100 : warcFile.progress * 100
                                }%, transparent ${warcFile.status === 'complete' ? 100 : warcFile.progress * 100
                                }%)`,
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                            transition: 'background-image 0.5s ease-in-out',
                        }}
                    >
                        <button
                            onClick={() => removeFile(warcFile)}
                            className={`px-2 py-1 text-sm text-white rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 ${warcFile.status === 'processing'
                                    ? 'bg-red-300 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                                }`}
                            style={{
                                width: 75,
                            }}
                            disabled={warcFile.status === 'processing'}
                        >
                            Remove
                        </button>

                        <span className="grow"> {warcFile.file.name}</span>

                        <span style={{ width: 90, textAlign: 'center' }}>
                            {formatFileSize(warcFile.file.size)}
                        </span>

                        <span style={{ width: 90, textAlign: 'right' }}>
                            {warcFile.status === 'complete'
                                ? '100%'
                                : (warcFile.progress * 100).toFixed(2) + '%'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
