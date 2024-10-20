import { WarcOfflineViewerProvider } from "./context";
import RecordsCounter from "./counter";
import UploadForm from "./form";
import IFrameOffline from "./iframe";

import winStyles from "@/libs/styles/windows.archives.module.css"
import WarcRecordsList from "./listRecords";
import IFrameOfflineHook from "./iframeHook";

export default function WARCOfflineViewerPage() {
    return (
        <WarcOfflineViewerProvider>
            <div style={{ width: "85%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

                <div className={`${winStyles.window}`}>
                    <div className={`${winStyles.title}`}>.WARC Window
                        <span style={{ float: "right" }}>
                            <RecordsCounter />
                        </span>
                    </div>

                    <IFrameOffline />
                    <IFrameOfflineHook />
                </div>

                <div className={`${winStyles.window}`}>
                    <div className={`${winStyles.title}`}>File Upload</div>
                    <UploadForm />
                </div>


                <div className={`${winStyles.window}`}>
                    <div className={`${winStyles.title}`}>Record Listing</div>
                    <WarcRecordsList /> 
                </div>
            </div>

        </WarcOfflineViewerProvider>
    )
}