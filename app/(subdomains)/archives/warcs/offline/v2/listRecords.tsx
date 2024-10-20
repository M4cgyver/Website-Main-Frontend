'use client'

import styles from "./listRecords.module.css"
import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { formatFileSize, getParsedRecord } from "./cactions"
import { useGlobalContext } from "./context"
import { WarcTreeNode } from './types'

function WarcRecordsListEntry({ node, depth }: { node: WarcTreeNode; depth: number }) {
    const [isOpen, setIsOpen] = useState(node.opened)
    const { setIframeSrc, setIsLoadingRecord, warcRecords } = useGlobalContext()

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }

    const hasChildren = node.child.length > 0
    const record = node.record
    const emptyStr = (record?.location && record.location) ? "Redir" : "N/A"

    const handleLinkClick = (e: any) => {
        e.preventDefault();

        if (!record) return;

        setIsLoadingRecord(true);

        getParsedRecord(record, { records: warcRecords, redirect: true })
            .then(({ objectURL }) => {
                setIframeSrc(objectURL);
                setIsLoadingRecord(false);
                console.log(objectURL);
            })
            .catch(e=>{
                setIsLoadingRecord(false);
            });
    }

    return (
        <li className="mb-1">
            <div className="flex items-center hover:bg-gray-100 rounded-md transition-colors duration-150">
                <div
                    className={`flex-grow flex items-center overflow-hidden ${depth > 0 ? 'ml-4' : ''}`}
                    style={{ paddingLeft: `${depth * 16}px` }}
                >
                    <span style={{ minWidth: 32 }}>
                        {hasChildren && (
                            <button
                                onClick={toggleOpen}
                                className="mr-1 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        )}
                    </span>

                    {(record) ?
                        <a className={`truncate text-sm underline cursor-pointer ${styles.viewablelink}`} title={node.key} onClick={handleLinkClick}>
                            {node.key}
                        </a> :
                        <span className="truncate text-sm" title={node.key}>
                            {node.key}
                        </span>
                    }

                </div>

                <span className="w-1/5 truncate text-sm text-gray-600" title={record?.contentType}>
                    {record?.contentType || emptyStr}
                </span>

                <span className="w-16 text-center text-sm text-gray-600">
                    {record?.status || emptyStr}
                </span>

                <span className="w-20 text-right text-sm text-gray-600">
                    {record?.size ? formatFileSize(Number(record.size)) : 'N/A'}
                </span>
            </div>

            {hasChildren && isOpen && (
                <ul className="mt-1">
                    {node.child
                        .filter(n => n.key.trim() !== '' || !n.key)
                        .map(childNode => (
                            <WarcRecordsListEntry key={childNode.key} node={childNode} depth={depth + 1} />
                        ))}
                </ul>
            )}
        </li>
    )
}

export default function WarcRecordsList() {
    const { warcTree } = useGlobalContext()

    return (
        <div className="overflow-x-auto">
            <ul className="min-w-full p-1">
                <li className="flex items-center font-semibold text-sm text-gray-700 border-b border-gray-200 pb-2 mb-2">
                    <span className="flex-grow">URL</span>
                    <span className="w-1/5">Content Type</span>
                    <span className="w-16 text-center">Status</span>
                    <span className="w-20 text-right">Size</span>
                </li>
                {warcTree.map((node) => (
                    <WarcRecordsListEntry key={node.key} node={node} depth={0} />
                ))}
            </ul>
        </div>
    )
}