"use client";

import styles from "./page.module.css";
import winStyles from "@/libs/styles/windows.archives.module.css"
import { RecordsCounter } from "./recordsCounter";
import { WarcRecordIframe } from "./iframe";
import { FormUpload } from "./formUpload"; 
import { WarcOfflineList } from "./list";

export default function WarcOfflineBrokenPage() {
    return <main>

        <div className={`${winStyles.window} ${styles.window}`} style={{marginTop: "1vh"}}>
            <div className={winStyles.title}>
                Local .WARC Viewer
                <span style={{ float: "right" }}><RecordsCounter /></span>
            </div>
            <div className={styles.flexthis}>
                <span style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
                    <WarcRecordIframe />
                </span>
            </div>
        </div>

        <div className={`${winStyles.window} ${styles.window} ${styles.upload}`}>
            <div className={winStyles.title}>Upload</div>
            <FormUpload />
        </div>

        <div className={`${winStyles.window} ${styles.window} ${styles.records}`}>
            <div className={winStyles.title}>Records</div>
            <WarcOfflineList />
        </div>

    </main>
}
