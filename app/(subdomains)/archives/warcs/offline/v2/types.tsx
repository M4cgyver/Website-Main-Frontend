
// Define the WarcRecord type
export type WarcRecord = {
    uri: string | undefined;
    status: number | undefined;
    ip: string | undefined;
    size: bigint;
    date: Date;
    location: string | undefined;
    contentType: string | undefined;

    file: File,
    content: () => Promise<Buffer> | Buffer;
};

export type WarcFile = {
    file: File,
    status: 'idle' | 'processing' | 'complete'
    progress: number,
}

export interface WarcTreeNode {
    key: string; // Full URL path of the node
    child: WarcTreeNode[]; // Children nodes
    record: WarcRecord | null; // WARC record associated with the node
    opened: boolean; // Boolean flag for future use
}

export type GlobalContextType = {
    warcRecords: WarcRecord[];
    setWarcRecords: React.Dispatch<React.SetStateAction<WarcRecord[]>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isLoadingRecord: boolean;
    setIsLoadingRecord: React.Dispatch<React.SetStateAction<boolean>>;
    files: WarcFile[];
    setFiles: React.Dispatch<React.SetStateAction<WarcFile[]>>;
    iframeSrc: string | null;
    setIframeSrc: React.Dispatch<React.SetStateAction<string | null>>;
    warcTree: WarcTreeNode[];
    setWarcTree: React.Dispatch<React.SetStateAction<WarcTreeNode[]>>;
    addRecordToTree: (record: WarcRecord) => void;
}