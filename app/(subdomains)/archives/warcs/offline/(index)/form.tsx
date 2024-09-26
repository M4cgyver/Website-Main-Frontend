'use client'

import React, { useRef, useCallback } from 'react'
import { useGlobalContext } from './context'
import { WarcFile, WarcRecord } from './types'
import { formatFileSize, parseFile } from './cactions'

export default function WarcUploadForm() {
  const { setFiles, isLoading, setIsLoading, setWarcRecords, setWarcTree, addRecordToTree, updateRecordCount } = useGlobalContext()
  const filesRef = useRef<WarcFile[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      const warcFiles = newFiles.filter(file => file.name.endsWith('.warc'))

      if (warcFiles.length !== newFiles.length) {
        setError('Some files were not .warc files and were ignored.')
      }

      const newWarcFiles: WarcFile[] = warcFiles.map(file => ({
        file,
        status: 'idle',
        progress: 0
      }))

      filesRef.current = [...filesRef.current, ...newWarcFiles]
      setFiles(filesRef.current)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    let newRecordsCount = 0

    const promises = filesRef.current.map(wfile =>
      parseFile(wfile.file, (newRecord: WarcRecord) => {
        addRecordToTree(newRecord)
        newRecordsCount++
        updateRecordCount(newRecordsCount)
      }, (p: number) => {
        wfile.progress = p
        setFiles([...filesRef.current])
      })
        .then(() => {
          wfile.status = 'complete'
          setFiles([...filesRef.current])
        })
    )

    Promise.allSettled(promises).then(() => {
      setIsLoading(false)
      setFiles([...filesRef.current])
    })
  }

  const removeFile = (fileToRemove: WarcFile) => {
    filesRef.current = filesRef.current.filter(file => file.file !== fileToRemove.file)
    setFiles([...filesRef.current])
  }

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
          disabled={isLoading || filesRef.current.length === 0}
          style={{
            backgroundColor: isLoading || filesRef.current.length === 0 ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: isLoading || filesRef.current.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>

      <ul className="mt-4 pb-1">
        {filesRef.current.map((warcFile, index) => (
          <li
            key={index}
            className="flex gap-2 m-2 p-1 items-center justify-between py-2 rounded-s"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.1) ${warcFile.status === 'complete' ? 100 : warcFile.progress * 100}%, transparent ${warcFile.status === 'complete' ? 100 : warcFile.progress * 100}%)`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              transition: 'background-image 0.5s ease-in-out',
            }}
          >
            <button
              onClick={() => removeFile(warcFile)}
              className={`px-2 py-1 text-sm text-white rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                warcFile.status === 'processing'
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
  )
}