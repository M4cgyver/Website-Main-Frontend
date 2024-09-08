"use client"

import { Dispatch, MutableRefObject, SetStateAction, createContext, useContext, useRef } from "react";
import { WarcFile, WarcRecord } from "./libs";
import { WarcOfflineTreeNode } from "./list copy";

interface WarcOfflineContextType {
    iframeRef: MutableRefObject<HTMLIFrameElement | null> | null;
    
    records: MutableRefObject<WarcRecord[]> | null;
    recordsTree: MutableRefObject<WarcOfflineTreeNode[]> | null;
    files: MutableRefObject<WarcFile[]> | null;
    loading: MutableRefObject<boolean> | null;
}

export const defaultWarcOfflineContext: WarcOfflineContextType = {
    iframeRef: null,
    
    records: null,
    recordsTree: null,
    files: null,
    loading: null,
}

export const WarcOfflineContext = createContext<WarcOfflineContextType>(defaultWarcOfflineContext);