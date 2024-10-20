'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { GlobalContextType, WarcFile, WarcRecord, WarcTreeNode } from './types'
import { addRecordToTree } from './cactions'

  
const GlobalContext = createContext<GlobalContextType | undefined>(undefined)
  
export function GlobalProvider({ children }: { children: ReactNode }) {
  const [warcRecords, setWarcRecords] = useState<WarcRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingRecord, setIsLoadingRecord] = useState(false)
  const [files, setFiles] = useState<WarcFile[]>([])
  const [iframeSrc, setIframeSrc] = useState<string | null>(null)
  const [warcTree, setWarcTree] = useState<WarcTreeNode[]>([])

  const addRecordToTreeWrapper = (record: WarcRecord) => {
    setWarcTree(prevTree => {
      // Ensure prevTree is an array; fallback to empty array if null or undefined
      const newTree = addRecordToTree(prevTree ?? [], record) ?? [];
      //console.log("Total TREE", newTree);
      return newTree;
    });
  };
  

  return (
    <GlobalContext.Provider 
      value={{ 
        warcRecords, 
        setWarcRecords, 
        isLoading, 
        setIsLoading,
        isLoadingRecord,
        setIsLoadingRecord, 
        files, 
        setFiles,
        iframeSrc,
        setIframeSrc,
        warcTree,
        setWarcTree,
        addRecordToTree: addRecordToTreeWrapper
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider')
  }
  return context
}