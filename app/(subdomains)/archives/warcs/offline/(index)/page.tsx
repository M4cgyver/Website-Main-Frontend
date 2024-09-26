"use client"

import { GlobalProvider } from "./context"
import RecordCounter from "./counter"
import WarcUploadForm from "./form"

import styles from "./page.module.css";
import winStyles from "@/libs/styles/windows.archives.module.css"
import { Metadata } from "next";
import { WarcRecordIframe } from "./iframe";
import WarcRecordsList from "./listRecords";
import WarcRecordIframeHook from "./iframeHook";

export default async function ArchivesOfflinePage({ }) {
    return <GlobalProvider>
        <main>

            <div className={`${winStyles.window} ${styles.window}`}>
                <div className={winStyles.title}>
                    Local .WARC Viewer
                    <span style={{ float: 'right' }}><RecordCounter /></span>
                </div>
                <div className={styles.flexthis}>
                    <span style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
                        <WarcRecordIframeHook />
                        <WarcRecordIframe />
                    </span>
                </div>
            </div>

            <div className={`${winStyles.window} ${styles.window} ${styles.upload}`}>
                <div className={winStyles.title}>Upload</div>
                <WarcUploadForm />
            </div>

            <div className={`${winStyles.window} ${styles.window} ${styles.upload}`}>
                <div className={winStyles.title}>Records</div>
                <WarcRecordsList />
            </div>

        </main>
    </GlobalProvider>
}