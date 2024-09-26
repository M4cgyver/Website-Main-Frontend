"use client"

import { useEffect, useRef } from 'react'
import { getParsedRecord } from "./cactions"
import { useGlobalContext } from "./context"

export default function WarcRecordIframeHook() {
    const { setIframeSrc, setIsLoadingRecord, warcRecords } = useGlobalContext()
    const lastListenerRef = useRef<((event: MessageEvent) => void) | null>(null)

    useEffect(() => {
        const displayRecord = (newHref: string) => {
            setIsLoadingRecord(true);

            getParsedRecord(decodeURIComponent(newHref), { records: warcRecords, redirect: true })
                .then(({ objectURL }) => {
                    setIframeSrc(objectURL)
                    setIsLoadingRecord(false);
                })
                .catch((e) => {
                    console.log(e)
                    setIsLoadingRecord(false);
                })
        }

        const handler = (e: MessageEvent) => {
            const data = e.data
            const { action, url } = data

            if (action === 'redirect' && typeof url === 'string') {
                displayRecord(url)
            }
        }

        // Remove the previous event listener if it exists
        if (lastListenerRef.current) {
            window.removeEventListener('message', lastListenerRef.current)
        }

        // Add the new event listener
        window.addEventListener('message', handler)
        lastListenerRef.current = handler

        // Cleanup function
        return () => {
            if (lastListenerRef.current) {
                window.removeEventListener('message', lastListenerRef.current)
            }
        }
    }, [warcRecords, setIframeSrc]) // Include dependencies in the useEffect

    return <></>
}