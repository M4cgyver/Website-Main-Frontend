'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'
import { getRandomDarkPastelColor } from './actions';

const MIME_TYPES = [
    "application/atom+xml; charset=UTF-8",
    "application/gzip",
    "application/java-archive",
    "application/ld+json",
    "application/msword",
    "application/octet-stream",
    "application/octet-stream; charset=utf-8",
    "application/pdf",
    "application/pkcs8",
    "application/rss+xml; charset=UTF-8",
    "application/vnd.amazon.ebook",
    "application/vnd.apple.installer+xml",
    "application/vnd.ms-excel",
    "application/vnd.ms-fontobject",
    "application/vnd.oasis.opendocument.presentation",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.visio",
    "application/xml",
    "application/x-bzip",
    "application/x-bzip2",
    "application/x-freearc",
    "application/x-font-truetype",
    "application/x-httpd-php",
    "application/x-sh",
    "application/x-shockwave-flash",
    "application/x-tar",
    "application/x-7z-compressed",
    "application/zip",
    "audio/aac",
    "audio/midi",
    "audio/mpeg",
    "audio/ogg",
    "audio/opus",
    "audio/wav",
    "audio/webm",
    "audio/x-midi",
    "audio/3gpp",
    "audio/3gpp2",
    "font/otf",
    "font/ttf",
    "font/woff",
    "font/woff2",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/png; charset=utf-8",
    "image/svg+xml",
    "image/tiff",
    "image/vnd.microsoft.icon",
    "image/webp",
    "model/3mf",
    "model/vrml",
    "text/calendar",
    "text/css",
    "text/csv",
    "text/html",
    "text/javascript",
    "text/plain",
    "text/xml",
    "video/mp2t",
    "video/mp4",
    "video/ogg",
    "video/webm",
    "video/x-msvideo",
    "video/3gpp",
    "video/3gpp2"
];


interface SearchBarProps {
  uri?: string
  page?: number
  total?: number
  type?: string
  pageVisible?: boolean
  totalVisible?: boolean
}

export default function SearchForm({
  uri = '',
  page = 1,
  total = 10,
  type = '',
  pageVisible = true,
  totalVisible = true,
}: SearchBarProps) {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState({ uri, page, total, type })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const queryParams = new URLSearchParams()
    
    if (searchParams.uri) queryParams.append('uri', encodeURIComponent(searchParams.uri))
    if (pageVisible) queryParams.append('page', searchParams.page.toString())
    if (totalVisible) queryParams.append('total', searchParams.total.toString())
    if (searchParams.type) queryParams.append('type', searchParams.type)

    router.push(`/warcs/search?${queryParams.toString()}`)
  }

  return (
    <div className="w-full p-2 rounded-lg shadow-md" style={{ backgroundColor: getRandomDarkPastelColor(50, 80)}}>
      <form method='/warcs/search' onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2 text-s">
        <div className="flex-grow min-w-[400px]">
          <label htmlFor="uri" className="sr-only">Search URI</label>
          <div className="relative">
            <input
              type="text"
              id="uri"
              name="uri"
              value={searchParams.uri}
              onChange={handleChange}
              className="w-full pl-7 pr-2 py-1 border border-gray-600 rounded bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter search URI"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        <div className="w-64">
          <label htmlFor="type" className="sr-only">MIME Type</label>
          <div className="relative">
            <select
              id="type"
              name="type"
              value={searchParams.type}
              onChange={handleChange}
              className="w-full appearance-none pl-2 pr-6 py-1 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Type</option>
              {MIME_TYPES.map((mimeType) => (
                <option key={mimeType} value={mimeType}>
                  {mimeType.split('/')[1]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {pageVisible && (
          <div className='flex flex-row items-center gap-2' >
            <label htmlFor="page" >Page</label>
            <input
              type="number"
              id="page"
              name="page"
              value={searchParams.page}
              onChange={handleChange}
              className="w-20 px-2 py-1 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              min={1}
              placeholder="Page"
            />
          </div>
        )}

        {totalVisible && (
          <div className='flex flex-row items-center gap-2' >
            <label htmlFor="total" className='flex flex-row items-center gap-2'>Total</label>
            <input
              type="number"
              id="total"
              name="total"
              value={searchParams.total}
              onChange={handleChange}
              className="w-20 px-2 py-1 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              min={1}
              placeholder="Total"
            />
          </div>
        )}

        <button
          type="submit"
          className="px-3 py-1 font-medium text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          style={{ backgroundColor: getRandomDarkPastelColor(80, 100)}}
        >
          Search
        </button>
      </form>
    </div>
  )
}