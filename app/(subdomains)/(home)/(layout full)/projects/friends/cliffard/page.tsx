import { Metadata } from "next";
import Image from "next/image";

import icoPleroma from "@/public/static/images/pleroma_logo_vector_nobg_nopan.svg"
import icoYoutube from "@/public/static/images/youtube-icon-logo-png-transparent.png"
import icoNewgrounds from "@/public/static/images/ngicon.png"
import icoGmail from "@/public/static/images/Gmail_Icon_(2013-2020).svg"
import icoSnek from "@/public/static/images/1562d08139595a93957619d7bab7f6354b479e278bb8859303ecbea7ba4d527e_1 (1).png"

import styles from "./page.module.css";
import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import { ViewsWidget } from "@/components/views/widget";
import Link from "next/link";
import { fontToshibaTxL1 } from "@/libs/fonts";
import { StickyBoard } from "@/components/stickyboard";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";

export const metadata: Metadata = {
    title: '',
    description: '',

    creator: 'M4cgyver',
    publisher: 'M4cgyver',

    openGraph: {
        title: 'Clffard',
        description: 'Clffard',
        url: 'https://m4cgyver.com/projects/friends/cliffard',
        locale: 'en-US',
        type: 'website',
    }
};

export default function FriendsCliffardPage() {
    const path = "/projects/friends/cliffard";
    const documentId = hashDJB2(hashSHA3(path));

    return (<>
        <div id="title" className={`${mainWebsiteStyles.title} ${win9xStyles.window}`}>
            <div className={win9xStyles.title} >Introduction</div>
            <h1>{metadata.title?.toString()}</h1>
            <h2>{metadata.description?.toString()}</h2>
        </div>

        <ViewsWidget path={path} />

        <div id="content" className={mainWebsiteStyles.content}>

            <div className={`${win9xStyles.window}`} style={{ backgroundColor: "cyan", color: "black" }}>
                <div className={win9xStyles.title}>Alban*ans</div>
                watnts to stick his dick in furfags want to wape women <br />
                as we are speaking right now this man is showing more furry porn than the nearest hotel at a furry convention i shit you not<br />
                apprently also hates csgo <br />
                il ike csgo <br />
                fuck u
            </div>

            <br />

            <StickyBoard documentId={documentId} path={path} />

            <br />

        </div>
    </>
    );
}
