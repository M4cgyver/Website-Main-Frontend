'use client'

import React, { createContext, useContext, useRef, useCallback, MutableRefObject, Dispatch, SetStateAction } from 'react'
import { WarcFile, WarcTreeNode, IFrameState, WarcOfflineViewerContextType } from './types'
import { WarcRecord } from './types'

const WarcOfflineViewerContext = createContext<WarcOfflineViewerContextType | undefined>(undefined)

export const WarcOfflineViewerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const records = useRef<WarcRecord[]>([])
  const warcFilesRef = useRef<WarcFile[]>([])
  const setRecordCountRef = useRef<Dispatch<SetStateAction<number>> | null>(null)
  const setIframeStateRef = useRef<Dispatch<SetStateAction<IFrameState>> | null>(null)
  const tree = useRef<WarcTreeNode>({
    key: "",
    child: [],
    records: [],
    opened: true,
    updateList: null,
    parrent: null,
  })

  const setRecords = useCallback((callback: (oldRecords: WarcRecord[]) => WarcRecord[]) => {
    records.current = callback(records.current)
    return records.current
  }, [])

  const setWarcFilesRef = useCallback((callback: (oldWarcFiles: WarcFile[]) => WarcFile[]) => {
    warcFilesRef.current = callback(warcFilesRef.current)
  }, [])

  const setRecordCount: Dispatch<SetStateAction<number>> = useCallback((value) => {
    if (setRecordCountRef.current) {
      setRecordCountRef.current(value)
    }
  }, [])

  const setRecordCountDispatch = useCallback((dispatch: Dispatch<SetStateAction<number>>) => {
    setRecordCountRef.current = dispatch
  }, [])

  const setIframeState: Dispatch<SetStateAction<IFrameState>> = useCallback((value) => {
    if (setIframeStateRef.current) {
      setIframeStateRef.current(value)
    }
  }, [])

  const setIframeStateDispatch = useCallback((dispatch: Dispatch<SetStateAction<IFrameState>>) => {
    setIframeStateRef.current = dispatch
  }, [])

  return (
    <WarcOfflineViewerContext.Provider value={{
      iframeRef,
      records,
      setRecords,
      setRecordCount,
      setRecordCountDispatch,
      warcFilesRef,
      setWarcFilesRef,
      tree,
      setIframeState,
      setIframeStateDispatch
    }}>
      {children}
    </WarcOfflineViewerContext.Provider>
  )
}

export const useWarcOfflineViewer = () => {
  const context = useContext(WarcOfflineViewerContext)
  if (context === undefined) {
    throw new Error('useWarcOfflineViewer must be used within a WarcOfflineViewerProvider')
  }
  return context
}