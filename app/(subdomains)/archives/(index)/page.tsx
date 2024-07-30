import { fontEagleSpCGA_Alt2x2, fontHP100LX6x8, fontTerminal, fontToshibaTxL1, fontToshibaTxL2, fontVerite9x14 } from "@/libs/fonts";

import styles from "./page.module.css"
import winStyles from "@/libs/styles/windows.archives.module.css"
import Link from "next/link";
import { Metadata } from "next";
import { ViewTrackerImage, getCachedViewCount } from "@/components/views";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";
import { StatisticsLatestArchived } from "./latest";
import { Suspense } from "react";
import { StatisticsLatestCount } from "./statistics";

export const metadata: Metadata = {
    title: 'M4cgyvers Online Archives ',
    description: 'I have some archives of stuff (websites, software, torrents, etc.) that I have downloaded over the years and I wanted to share. Feel free to check anything out!',

    creator: 'M4cgyver',
    publisher: 'M4cgyver',

    referrer: 'origin-when-cross-origin',

    openGraph: {
        title: 'M4cgyvers Online Archives ',
        description: 'I have some archives of stuff (websites, software, torrents, etc.) that I have downloaded over the years and I wanted to share. Feel free to check anything out!',
        url: 'https://archives.m4cgyver.com',
        locale: 'en-US',
        type: 'website',

    }
};

export default async function ArchivesPage({
}: {
    }) {
    const path = "/archives/";
    const documentId = hashDJB2(hashSHA3(path));

    return <main>
        <ViewTrackerImage documentId={documentId} path={path} />

        <div className={`${styles.intro} ${fontToshibaTxL2.variable} ${fontEagleSpCGA_Alt2x2.variable}`}>
            <h1>M4cgyvers Online Archives</h1>
            <h2>I have some archives of stuff (websites, software, torrents, etc.) that I have downloaded over the years and I wanted to share. Feel free to check anything out!</h2>
        </div>

        <div className={`${styles.spacer}`}></div>

        <div className={`${styles.warcInfo}`}>
            <div className={`${winStyles.window}`}>
                <div className={`${winStyles.title}`}>.WARC Backup Latest</div>
                <div className={fontToshibaTxL2.className}>
                    <div className={fontToshibaTxL1.className} style={{ textAlign: 'center', width: '87.5%', margin: "8px auto" }}>Here are the latest web-content I have downloaded, click the link!</div>

                    <div style={{ marginTop: 16 }} />

                    <div className={styles.warcUris} style={{ display: "flex", width: "100%", padding: 0 }}>

                        <StatisticsLatestArchived />

                    </div>
                </div>
            </div>

            <div className={`${winStyles.window}`}>
                <div className={`${winStyles.title}`}>.WARC Backup Statistics</div>
                <div className={fontToshibaTxL2.className}>
                    <div style={{ display: "flex", flexDirection: "column", height: "90%" }}>
                       
                        <div className={fontToshibaTxL1.className} style={{ textAlign: 'center', width: '87.5%', margin: "8px auto" }}>Simple debug statistics on how much content I have backed up / free space.</div>

                        <div style={{ marginTop: 16 }} />

                        <StatisticsLatestCount />
                    </div>
                </div>
            </div>

            <div className={`${winStyles.window} ${styles.offline}`}>
                <div className={`${winStyles.title}`}>.WARC Offline Viewer</div>
                <Link href="/warcs/offline" style={{ textAlign: "center" }}>
                    <div style={{ padding: "3%" }}>
                        <h3>You can also <u>click here </u> to view .warc files you have! No file uploads, no 3rd libs, all locally in the browser.</h3>
                        <br />
                        <h4><em>JavaScript Required!</em></h4>
                    </div>
                </Link>
            </div>
        </div>
    </main >;
}