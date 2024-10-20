"use client"

import { useRef, useCallback, useEffect } from "react";
import { useWarcOfflineViewer } from "../(index)/context";
import { getParsedRecord } from "./cactions";
import { WarcRecord } from "./types";

export default function WarcRecordIframeHook() {
    const { records, iframeRef, setIframeState } = useWarcOfflineViewer()
    const lastListenerRef = useRef<((event: MessageEvent) => void) | null>(null)

    const displayRecord = useCallback((record: WarcRecord) => {
        setIframeState('loading');

        getParsedRecord(record, { records: records.current ?? undefined, redirect: true })
            .then(({ objectURL }) => {
                if (iframeRef.current) {
                    iframeRef.current.src = objectURL;
                }
                setIframeState('idle');
            })
            .catch((e) => {
                console.error("Error loading record:", e);
                setIframeState('idle');
            })
    }, [records, iframeRef, setIframeState])

    useEffect(() => {
        const handler = (e: MessageEvent) => {
            const data = e.data
            const { action, url } = data

            if (action === 'redirect' && typeof url === 'string') {
                const record = records.current?.find(r => r.uri === decodeURIComponent(url))
                if (record) {
                    displayRecord(record)
                } else {
                    console.error("Record not found for URL:", url)
                }
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
    }, [records, displayRecord]) // Include dependencies in the useEffect

    return <></>
}