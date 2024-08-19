"use client";

import { useContext, useEffect, useRef } from "react"
import { WarcOfflineContext } from "./store"

export const RecordsCounter = () => {
    const tpsDelta = Math.ceil(1000 / 10)
    const counterRef = useRef<HTMLSpanElement | null>(null);
    const { loading, records } = useContext(WarcOfflineContext);

    const updateCounter = () => {
        //console.log(loading, loading?.current, records, records?.current)

        if (counterRef.current) {
            counterRef.current.textContent = `${records?.current.length ?? 0} ${loading?.current ? 'Loading...' : 'Records'}`;
        }
    };

    setInterval(updateCounter, tpsDelta);

    return <span ref={counterRef}>{records?.current.length ?? 0} {loading?.current ? 'Loading...' : 'Records'}</span>
}