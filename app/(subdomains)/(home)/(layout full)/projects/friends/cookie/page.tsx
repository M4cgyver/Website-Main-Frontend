import { Metadata } from "next";
import Image from "next/image";

import imgPaper from "@/public/static/images/paper.gif"

import styles from "./page.module.css";
import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import { ViewsWidget } from "@/components/views/widget";
import Link from "next/link";
import { fontToshibaTxL1 } from "@/libs/fonts";
import { StickyBoard } from "@/components/stickyboard";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";

export const metadata: Metadata = {
    title: '#FreeCookie Political Movement!',
    description: 'Our friend Cookie, also known as David, is in jail for allegedly stealing copper wire. While it\'s a mistake, I don\'t think he should be in jail for it. Getting him back into our friend group is important because he\'s a valuable member of our Stardew Valley lobby, skilled at CSGO2, and a funny guy.',

    creator: 'M4cgyver',
    publisher: 'M4cgyver',

    openGraph: {
        title: '#FreeCookie Political Movement!',
        description: 'Our friend Cookie, also known as David, is in jail for allegedly stealing copper wire. While it\'s a mistake, I don\'t think he should be in jail for it. Getting him back into our friend group is important because he\'s a valuable member of our Stardew Valley lobby, skilled at CSGO2, and a funny guy.',
        url: 'https://m4cgyver.com/projects/friends/cookie',
        locale: 'en-US',
        type: 'website',
    }
};

export default function ContactsPage() {
    const path = "/projects/friends/cookie";
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
                <div className={win9xStyles.title}>Sign our petition today</div>

                <div className={styles.cookie} style={{ position: "relative", backgroundImage: `url(${imgPaper.src})` }}>
                    <div style={{ padding: ".25em" }}>
                        <div style={{ overflow: "auto" }}>
                            <h1 style={{ float: "left" }}>Help, Our friend needs your help!</h1>
                            <h2 style={{ float: "right" }}>#FreeCookie</h2>
                        </div>
                        <p>Jontavious higgle bottom, otherwise known as David is apperently in fucking jail or something because he tried to steal copper wire. Dont get me wrong this is incredibly fucking retarded but I dont think he should be in jail, yall acting as if he robbed a gass station or something. Its incredibly important that we get him back into our friend group for the main reasons listed down below:</p>

                        <h2>Hes in our Stardew Valley lobby</h2>
                        <p>Ill admit I fucked up Gusses Stardew character in order to get other people to join. In fairness though Casmier didnt toggle the option for other players to join so theres enough blame to go around :D</p>
                        <p>If we loose cookie that is a lot of slave labor going out the window on Gusses account. Since I bew up a lot of shit with a megabomb and we need to make up that profit</p>

                        <h2>Hes god at CSGO2</h2>
                        <p>Well, imagine a guy who always has a funny one-liner ready, even in the most intense moments of a Counter-Strike: Global Offensive (CSGO) match. Hes quick with a joke and always keeps his teammates laughing and relaxed. But when it comes to gameplay, hes a force to be reckoned with. He seems to have an uncanny ability to predict where the enemy is hiding and always manages to pull off clutch plays that turn the tide of the match in his teams favor. In fact, hes so good that some opponents might even accuse him of cheating! But despite any accusations, he remains cool and collected, continuing to make incredible plays while cracking jokes and keeping his teams spirits high.</p>

                        <h2>Hes a funny guy</h2>
                        <p>Ive known David for about half a decade now and I can say for certain he is a great guy. A little bit retarted but hes a great guy. I have no complaints about metting him or knowing him. Im sure that if the $(COUNTY) understands that the economy is going to shit and inflation has really hit hard on the perc4s he can be released without question.</p>
                    </div>

                </div>
            </div>

            <br />

            <StickyBoard documentId={documentId} path={path} />

            <br />

        </div>
    </>
    );
}
