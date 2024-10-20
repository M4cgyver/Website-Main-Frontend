'use client'

import React from 'react'
import { useGlobalContext } from './context'

export default function RecordCounter() {
  const { warcRecords, isLoading } = useGlobalContext()

  return (
    <div>
      {isLoading ? (
        <span>Updating records... {warcRecords.length}</span>
      ) : (
        <span>Total Records:{warcRecords.length}</span>
      )}
    </div>
  )
}