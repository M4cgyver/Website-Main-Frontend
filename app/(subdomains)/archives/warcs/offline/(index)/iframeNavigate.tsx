'use client'

import React, { useState } from 'react'
import { useWarcOfflineViewer } from './context'

//MOSTLY USED FOR DEBUGGING PURPOSES

const IFrameNavigate: React.FC = ({ }) => {
  const [url, setUrl] = useState('about:blank')
  const { iframeRef } = useWarcOfflineViewer()

  const handleNavigate = () => {
    if (iframeRef.current) {
      iframeRef.current.src = url
    }
  }

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL or WARC file path"
        className="flex-grow px-3 py-2 border rounded text-black"
      />
      <button
        onClick={handleNavigate}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Load
      </button>
    </div>
  )
}

export default IFrameNavigate