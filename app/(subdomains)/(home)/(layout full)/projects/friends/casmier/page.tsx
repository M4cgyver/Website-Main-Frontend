import { Metadata } from "next";
import Image from "next/image";

import imageCryingSad from "@/public/static/images/crying-sad.gif"
import imageStardew2 from "@/public/static/images/stardew2.webp"
import imageSoyjack from "@/public/static/images/IfIpVKM.png"
import imageShitAsin from "@/public/static/images/Screenshot_20230409_214634.png"
import imageMeatboy from "@/public/static/images/1679456597836.png"
import imagePizzaTower from "@/public/static/images/pizza.png"

import styles from "./page.module.css";
import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import { ViewsWidget } from "@/components/views/widget";
import Link from "next/link";
import { fontToshibaTxL1 } from "@/libs/fonts";
import { StickyBoard } from "@/components/stickyboard";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";

export const metadata: Metadata = {
    title: 'Casmier has gone completly awol!',
    description: 'Casmier lastname gargincy has been groomed by a fed for at least two weeks now! It is with deep concern that we need to get him back onto Stardew and send him off to the mines where he belongs.',

    creator: 'M4cgyver',
    publisher: 'M4cgyver',

    openGraph: {
        title: 'Casmier has gone completly awol!',
        description: 'Casmier lastname gargincy has been groomed by a fed for at least two weeks now! It is with deep concern that we need to get him back onto Stardew and send him off to the mines where he belongs.',
        url: 'https://m4cgyver.com/projects/friends/casmier',
        locale: 'en-US',
        type: 'website',
    }
};

export default function ContactsPage() {
    const path = "/projects/friends/casmier";
    const documentId = hashDJB2(hashSHA3(path));

    return (<>
        <div id="title" className={`${mainWebsiteStyles.title} ${win9xStyles.window}`}>
            <div className={win9xStyles.title} >Introduction</div>
            <h1>{metadata.title?.toString()}</h1>
            <h2>{metadata.description?.toString()}</h2>
        </div>

        <ViewsWidget path={path} />

        <div id="content" className={mainWebsiteStyles.content}>

            <div className={`${win9xStyles.window}`} style={{ color: "black" }}>
                <div className={win9xStyles.title}>Twitter Art*st</div>

                <div style={{ position: "relative", overflow: "hidden" }}>

                    <Image src={imageStardew2} width={1200} height={600} alt="stardew" style={{ width: "100%", height: "auto" }} quality={75} placeholder='blur' />
                    <Image src={imageSoyjack} width={1200} height={600} alt="soyjack" style={{ position: "absolute", top: "50%", left: 0, right: 0, width: "100%", height: "75%", transform: "translateY(-34.4%)" }} quality={75} placeholder='blur' />

                    <div style={{ position: "absolute", top: "10%", left: "10%" }}>
                        <Image src={imageShitAsin} width={75} height={50} alt="stardew" style={{ float: "left" }} quality={75} placeholder='blur' />
                        <span style={{ color: "white" }}> ← His ass is possibly a furry! <br />Cute icon tho</span>
                    </div>

                    <div style={{ position: "absolute", top: "10%", left: "90%" }}>
                        <span style={{ color: "red" }}>Warning!</span>
                        <span style={{ color: "white" }}>We just recieved confirmation that he is possibly Polish!</span>
                    </div>


                    <div style={{ position: "absolute", top: "70%", left: "22%", width: "50%" }}>
                        <span style={{ color: "red", textShadow: "black 0px 0px 2px" }}>Casmiers girlfriend, whose name remains unknown, has become the center of his world. He spends most of his time with her, neglecting his other interests and hobbies. One of his favorite pastimes used to be playing Stardew Mines, a popular video game where players explore a mining cave and fight monsters. But lately, he hasnt been playing much of it, as he would rather spend his free time with his girlfriend.</span>
                    </div>

                    <span className={styles.clearfix} />
                </div>

                <div style={{ backgroundImage: "url(/static/images/43389f93a7876ed.png)", color: "black" }}>
                    <div>
                        <h1 style={{ margin: "0", padding: "0" }}>Known Artworks:</h1>
                        <h2 style={{ margin: "0", padding: "0", fontSize: "medium" }}>Pretty good shit good shit not gonna lie!</h2>
                    </div>

                    <Image src={imageMeatboy} width={250} height={175} alt="meatboy" style={{ float: "left", border: "1px solid black" }} quality={100} placeholder='blur' />
                    <Image src={imagePizzaTower} width={250} height={175} alt="pizza" style={{ float: "left", border: "1px solid black" }} quality={100} placeholder='blur' />

                    <span className={styles.clearfix} />


                </div>
            </div>

            <br />

            <StickyBoard documentId={documentId} path={path} />

            <br />

        </div>
    </>);
}
