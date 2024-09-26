import { fontEagleSpCGA_Alt2x2, fontHP100LX6x8, fontTerminal, fontToshibaTxL1, fontToshibaTxL2, fontVerite9x14 } from "@/libs/fonts";

import styles from "./page.module.css"
import winStyles from "@/libs/styles/windows.archives.module.css"
import Link from "next/link";
import { Metadata } from "next";
import { ViewTrackerImage, getCachedViewCount } from "@/components/views";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";
import { Suspense } from "react";
import { StatisticsLatestArchived } from "./latest";
import Overlay from "@/components/overlay";
import { StatisticsLatestCount } from "./statistics";
import SearchForm from "../../warcs/search/(current)/search";

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

const path = "/archives/";
const documentId = hashDJB2(hashSHA3(path));

export default function ArchivesPage({
}: {
    }) {

    return <main>
        <ViewTrackerImage documentId={documentId} path={path} />

        <div className={`${styles.intro} ${fontToshibaTxL2.variable} ${fontEagleSpCGA_Alt2x2.variable}`}>
            <h1>M4cgyvers Online Archives</h1>
            <h2>I have some archives of stuff (websites, software, torrents, etc.) that I have downloaded over the years and I wanted to share. Feel free to check anything out!</h2>
        </div>

        <div className={`${styles.spacer}`}></div>

        <div className={styles.sections}>

            <div className={`${winStyles.window}`}>
                <div className={`${winStyles.title}`}>.WARC Backup Latest</div>
                <div className={fontToshibaTxL2.className}>
                    <div className={fontToshibaTxL1.className} style={{ textAlign: 'center', width: '87.5%', margin: "8px auto" }}>Here are the latest web-content I have downloaded, click the link to view!</div>
                    <div className={styles.warcUris} style={{ display: "flex", width: "100%", padding: 0, flexDirection: "column" }}>

                        <Suspense fallback={<div style={{ position: "relative", width: "100%", aspectRatio: "3000/1080" }}>
                            <Overlay button={false} backgroundColor="#00000000">
                                <h3 style={{ width: "75%", textAlign: 'center' }}>Loading most recent added sites to the archives...</h3>
                            </Overlay>
                        </div>}>
                            <StatisticsLatestArchived />

                            <div style={{ padding: 8, paddingTop: 16}}>
                                <div style={{textDecoration: "underline"}}>Go ahead and search the archives to find what your looking for!</div>
                                <SearchForm />
                            </div>
                        </Suspense>
                    </div>
                </div>
            </div>


            <div className={`${winStyles.window}`}>
                <div className={`${winStyles.title}`}>.WARC Backup Statistics</div>
                <div className={fontToshibaTxL2.className}>
                    <div style={{ display: "flex", flexDirection: "column", height: "90%" }}>

                        <div className={fontToshibaTxL1.className} style={{ textAlign: 'center', width: '87.5%', margin: "8px auto" }}>Simple debug statistics on how much content I have backed up / free space.</div>

                        <StatisticsLatestCount />
                    </div>
                </div>
            </div>

            <div className={`${winStyles.window}`}>
                <div className={`${winStyles.title}`}>.WARC Offline Viewer</div>
                <div className={fontToshibaTxL2.className}>
                    <Link href="/warcs/offline" style={{ display: "flex", flexDirection: "column", height: "90%" }}>
                        <span style={{ padding: "2%", textAlign: 'center', paddingBottom: "5%" }}>
                            Click here to use the .WARC offline viewer! Upload your files to the browser to view the webpages you want.
                        </span>
                    </Link>
                </div>
            </div>

        </div>

    </main >
}