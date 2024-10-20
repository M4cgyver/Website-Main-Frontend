import { mWarcHeaderMap } from "@/libs/mwarc";
import { Dispatch, SetStateAction, MutableRefObject } from "react";

export type IFrameState = 'empty' | 'idle' | 'loading'

export type WarcRecord = {
  uri: string | undefined;
  status: number | undefined;
  ip: string | undefined;
  size: bigint;
  date: Date;
  location: string | undefined;
  contentType: string | undefined;
  file: File;
  content: () => Promise<Buffer> | Buffer;
  stream: () =>  Promise<ReadableStream<Uint8Array>> | ReadableStream<Uint8Array>;
  offset: bigint;
  transferEncoding: string | undefined | null;
  http: mWarcHeaderMap | null | undefined;
};

export type WarcOfflineViewerContextType = {
  iframeRef: React.RefObject<HTMLIFrameElement>
  records: React.RefObject<WarcRecord[]>
  setRecords: (callback: (oldRecords: WarcRecord[]) => WarcRecord[]) => WarcRecord[]
  setRecordCount: Dispatch<SetStateAction<number>>
  setRecordCountDispatch: (dispatch: Dispatch<SetStateAction<number>>) => void
  warcFilesRef: MutableRefObject<WarcFile[]>
  setWarcFilesRef: (callback: (oldWarcFiles: WarcFile[]) => WarcFile[]) => void
  tree: React.RefObject<WarcTreeNode>
  setIframeState: Dispatch<SetStateAction<IFrameState>>
  setIframeStateDispatch: (dispatch: Dispatch<SetStateAction<IFrameState>>) => void
}

export type WarcFile = {
  file: File;
  status: 'idle' | 'processing' | 'complete';
  progress: number;
  update: (status: 'idle' | 'processing' | 'complete', progress: number) => void | undefined | null;
};

export interface WarcTreeNode {
  key: string; // Full URL path of the node
  child: WarcTreeNode[]; // Children nodes
  records: WarcRecord[]; // WARC records associated with the node
  opened: boolean; // Boolean flag for future use
  updateList: null | (() => void);
  parrent: WarcTreeNode | null;
}