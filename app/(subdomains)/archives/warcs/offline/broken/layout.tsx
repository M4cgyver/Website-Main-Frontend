"use client";

import { ReactNode, useRef, useState } from "react";
import { WarcOfflineContext, defaultWarcOfflineContext } from "./store";
import { Metadata } from "next";

export default function WarcOfflineBrokenLayout({
    children,
}: {
    children: ReactNode
}) {
    const iframeRef = useRef(null);

    const records = useRef([]);
    const recordsTree = useRef([]);
    const files = useRef([]);
    const loading = useRef(false);

    return <WarcOfflineContext.Provider value={{ ...defaultWarcOfflineContext, iframeRef, records, recordsTree, files, loading }}>
        {children}
    </WarcOfflineContext.Provider>
}