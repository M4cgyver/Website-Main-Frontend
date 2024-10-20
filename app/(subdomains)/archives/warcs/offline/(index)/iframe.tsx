'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useWarcOfflineViewer } from './context'
import { IFrameState } from './types'
import Overlay from '@/components/overlay'

interface HistoryEntry {
  title: string;
  url: string;
}

const IFrameOffline: React.FC = () => {
  const { iframeRef, setIframeStateDispatch } = useWarcOfflineViewer()
  const [iframeState, setIframeState] = useState<IFrameState>('empty')
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [pageTitle, setPageTitle] = useState('No content loaded')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showDropup, setShowDropup] = useState(false)
  const dropupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (setIframeStateDispatch) {
      setIframeStateDispatch(setIframeState)
    }
  }, [setIframeStateDispatch])

  const updateNavState = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const iframeWindow = iframeRef.current.contentWindow
      const currentTitle = iframeWindow.document.title || 'Untitled Page'
      const currentUrl = iframeWindow.location.href

      setCanGoBack(iframeWindow.history.length > 1)
      setCanGoForward(false)
      setPageTitle(currentTitle)

      setHistory(prevHistory => {
        const newEntry = { title: currentTitle, url: currentUrl }
        if (prevHistory.length === 0 || prevHistory[prevHistory.length - 1].url !== currentUrl) {
          return [...prevHistory, newEntry]
        }
        return prevHistory
      })
    }
  }, [iframeRef])

  const navigate = (direction: 'back' | 'forward') => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (direction === 'back') {
        iframeRef.current.contentWindow.history.back()
      } else {
        iframeRef.current.contentWindow.history.forward()
      }
    }
  }

  const navigateToHistoryEntry = (url: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.location.href = url
    }
    setShowDropup(false)
  }

  useEffect(() => {
    if (iframeState !== 'empty' && iframeRef.current) {
      iframeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [iframeState])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropupRef.current && !dropupRef.current.contains(event.target as Node)) {
        setShowDropup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-4">
      {iframeState === 'empty' ? (
        <div className="w-full h-96 border rounded flex items-center justify-center text-gray-500" style={{ position: 'relative' }}>
          <Overlay button={false}>
            <span style={{ width: '75%', textAlign: 'center' }}>
              No content has been loaded yet! Upload some files and click the links in the records to view the archived content!
            </span>
          </Overlay>
        </div>
      ) : (
        <div className="relative">
          {iframeState === 'loading' && <Overlay button={false} header='Loading...' />}
          
          <iframe
            ref={iframeRef}
            onLoad={updateNavState}
            className="w-full h-[calc(100vh-200px)] border rounded"
            title="WARC Content Viewer"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gray-100/80 backdrop-blur-sm p-2 flex justify-between items-center border-t width-1/2" style={{ width: 'fit-content', minWidth: '200px', maxWidth: '100%', margin: '0 auto' }}
              onMouseLeave={() => setShowDropup(false)}>
            <button
              onClick={() => navigate('back')}
              disabled={!canGoBack}
              className="px-2 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 flex-shrink-0"
              aria-label="Go back"
            >
              &#8592; {/* Left arrow */}
            </button>
            <div 
              className="relative"
              onMouseEnter={() => setShowDropup(true)}
              ref={dropupRef}
            >
              <span className="text-sm font-medium truncate mx-2 cursor-pointer" style={{ maxWidth: '50%' }}>
                {pageTitle}
              </span>
              {showDropup && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-300 rounded shadow-lg">
                  <ul className="py-1 max-h-48 overflow-y-auto flex flex-col-reverses">
                    {history.slice(1, history.length).map((entry, index) => (
                      <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigateToHistoryEntry(entry.url)}>
                        {entry.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('forward')}
              disabled={!canGoForward}
              className="px-2 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 flex-shrink-0"
              aria-label="Go forward"
            >
              &#8594; {/* Right arrow */}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default IFrameOffline