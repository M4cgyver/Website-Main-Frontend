'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { useWarcOfflineViewer } from "./context"
import { WarcTreeNode, WarcRecord } from './types'
import { formatFileSize, getParsedRecord } from "./cactions"

function formatDate(date: Date): string {
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
}

function WarcRecordsListEntry({ node, depth }: { node: WarcTreeNode; depth: number }) {
    const [isOpen, setIsOpen] = useState(node.opened)
    const [, forceUpdate] = useState({})
    const { records, iframeRef, setIframeState } = useWarcOfflineViewer();

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    const updateList = useCallback(() => {
        //console.log("update", node.child)
        forceUpdate({})
    }, []);

    useEffect(() => {
        node.updateList = updateList
        return () => {
            node.updateList = null
        }
    }, [node, updateList])

    const hasChildren = node.child.length > 0

    const displayRecord = (record: WarcRecord) => {
        if (setIframeState)
            setIframeState('loading');

        getParsedRecord(record, { records: records.current ?? undefined, redirect: true })
            .then(({ objectURL }) => {
                if (iframeRef.current) {
                    iframeRef.current.src = objectURL;
                }
                console.log(objectURL);
            })
            .then(() => {
                setIframeState('idle')

                iframeRef.current?.focus();
            })
            .catch(e => {
                console.error("Error loading record:", e);
                setIframeState('idle')
                iframeRef.current?.focus();
            })
    }

    const hasRecords = node.records.some(r => r.uri !== undefined) || node.child.some(n => n.records.some(r => r.uri !== undefined))

    const types = Array.from(new Set(node.records.map(r => ({ contentType: r.contentType, record: r }))))
        .filter(item => item.contentType)
        .map(({ contentType, record }, index, array) => (
            <span key={`${index}_${contentType}`}>
                <a href="#" className="hover:underline" onClick={(e) => {
                    e.preventDefault()
                    displayRecord(record)
                }}>{contentType}</a>
                {index < array.length - 1 ? ", " : ""}
            </span>
        ));

    const statuses = Array.from(
        node.records.reduce((acc, r) => {
            if (r.status !== undefined) {
                if (!acc.has(r.status)) {
                    acc.set(r.status, { count: 1, records: [r] });
                } else {
                    const item = acc.get(r.status)!;
                    item.count++;
                    item.records.push(r);
                }
            }
            return acc;
        }, new Map<number, { count: number; records: WarcRecord[] }>())
    ).map(([status, { count, records }], index, array) => (
        <span key={`${index}_${status}`}>
            <a
                href="#"
                className="hover:underline"
                onClick={(e) => {
                    e.preventDefault();
                    // Display the first record with this status
                    displayRecord(records[0]);
                }}
                title={`${count} record${count > 1 ? 's' : ''} with status ${status}`}
            >
                {status}{count > 1 ? ` (${count})` : ''}
            </a>
            {index < array.length - 1 ? ", " : ""}
        </span>
    ));

    const sizes = Array.from(new Set(node.records.map(r => ({ size: r.size ? formatFileSize(Number(r.size)) : null, record: r }))))
        .filter(item => item.size)
        .map(({ size, record }, index, array) => (
            <span key={`${index}_${size}`}>
                <a href="#" className="hover:underline" onClick={(e) => {
                    e.preventDefault()
                    displayRecord(record)
                }}>{size}</a>
                {index < array.length - 1 ? ", " : ""}
            </span>
        ));

    const dates = Array.from(new Set(node.records.map(r => ({ date: r.date ? formatDate(r.date) : null, record: r }))))
        .filter(item => item.date)
        .map(({ date, record }, index, array) => (
            <span key={date}>
                <a href="#" className="hover:underline" onClick={(e) => {
                    e.preventDefault()
                    displayRecord(record)
                }}>{date}</a>
                {index < array.length - 1 ? ", " : ""}
            </span>
        ));

    return (depth > 0) ? (
        <li className="mb-1">
            <div className="flex items-center hover:bg-gray-100 rounded-md transition-colors duration-150">
                <div
                    className="flex-grow flex items-center overflow-hidden"
                    style={{ paddingLeft: `${depth * 16}px` }}
                >
                    <span style={{ minWidth: 32 }}>
                        {hasChildren && (
                            <button
                                onClick={toggleOpen}
                                className="mr-1 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                aria-expanded={isOpen}
                                aria-label={isOpen ? "Collapse" : "Expand"}
                            >
                                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        )}
                    </span>

                    {node.records.length > 0 ? (
                        <a
                            className="truncate text-sm cursor-pointer hover:underline"
                            title={node.key}
                            href="#"
                            role="button"
                            onClick={(e) => {
                                e.preventDefault()
                                const recordWithHighestDate = node.records.reduce((highest, current) => {
                                    if (!highest || (current.date && current.date > highest.date)) {
                                        return current;
                                    }
                                    return highest;
                                }, null as WarcRecord | null);

                                if (recordWithHighestDate) {
                                    displayRecord(recordWithHighestDate);
                                } else {
                                    console.warn('No valid records found with dates');
                                }
                            }}
                        >
                            {node.key}
                        </a>
                    ) : (
                        <span className="truncate text-sm" title={node.key}>
                            {node.key}
                        </span>
                    )}
                </div>

                <span className="w-1/5 truncate text-sm text-gray-600">
                    {types.length > 0 ? types : <span>N/A</span>}
                </span>

                <span className="w-16 text-center text-sm text-gray-600">
                    {statuses.length > 0 ? statuses : <span>N/A</span>}
                </span>

                <span className="w-20 text-right text-sm text-gray-600">
                    {sizes.length > 0 ? sizes : <span>N/A</span>}
                </span>

                <span className="w-40 text-right text-sm text-gray-600">
                    {dates.length > 0 ? dates : <span>N/A</span>}
                </span>
            </div>

            {hasChildren && isOpen && (
                <ul className="mt-1">
                    {node.child
                        .filter(n => n.key.trim() !== '')
                        .map(childNode => (
                            <WarcRecordsListEntry key={childNode.key} node={childNode} depth={depth + 1} />
                        ))}
                </ul>
            )}
        </li>
    ) : <>
        {hasChildren && isOpen && (
            <ul className="mt-1">
                {node.child
                    .filter(n => n.key.trim() !== '')
                    .map(childNode => (
                        <WarcRecordsListEntry key={childNode.key} node={childNode} depth={depth + 1} />
                    ))}
            </ul>
        )}
    </>
}

export default function WarcRecordsList() {
    const { tree } = useWarcOfflineViewer()

    return (
        <div className="overflow-x-auto">
            <ul className="min-w-full p-1">
                <li className="flex items-center font-semibold text-sm text-gray-700 border-b border-gray-200 pb-2 mb-2">
                    <span className="flex-grow">URL</span>
                    <span className="w-1/5">Content Type</span>
                    <span className="w-16 text-center">Status</span>
                    <span className="w-20 text-right">Size</span>
                    <span className="w-40 text-right">Date</span>
                </li>
                {tree.current && <WarcRecordsListEntry node={tree.current} depth={0} />}
            </ul>
        </div>
    )
}