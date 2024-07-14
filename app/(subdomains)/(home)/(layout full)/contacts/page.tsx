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

export const metadata: Metadata = {
  title: 'Contact and Socials.',
  description: 'Heres my contact infomation and my socials. If you need or want to reach out for whatever these are the easiest methods!',

  keywords: ["m4cgyver", "contact", "socials", "social media"],

  creator: 'M4cgyver',
  publisher: 'M4cgyver',

  openGraph: {
    title: 'Contact and Socials.',
    description: 'Heres my contact infomation and my socials. If you need or want to reach out for whatever these are the easiest methods!',
    url: 'https://m4cgyver.com/contacts',
    locale: 'en-US',
    type: 'website',
  }
};

export default function ContactsPage() {
  return (<>
    <div id="title" className={`${mainWebsiteStyles.title} ${win9xStyles.window}`}>
      <div className={win9xStyles.title} >Introduction</div>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
    </div>

    <ViewsWidget path="/contacts" />

    <div id="content" className={mainWebsiteStyles.content}>
      <div className={`${win9xStyles.window} ${styles.contact}`} >
        <div className={`${win9xStyles.title}`}>
          Contact and Socials
        </div>

        <div className={fontToshibaTxL1.className} style={{ paddingTop: 20 }}>
          <h1>Fell free to reachout however you want. NOTE: I am extreamly lazy and may not check my socials please be pacient.</h1>
          <ul>
            <li>
              <Image src={icoNewgrounds} alt="" height={64}></Image> <br />
              <Link href="https://m4cgyver.newgrounds.com/" target={"_blank"}>Newgrounds</Link>
            </li>


            <li>
              <Image src={icoPleroma} alt="" height={64}></Image> <br />
              <Link href="http://fed.m4cgyver.net/users/m4c" target={"_blank"}>Fediverse (Pleroma)</Link>
            </li>

            <li>
              <Image src={icoYoutube} alt="" height={64}></Image> <br />
              <Link href="https://www.youtube.com/@smgamingcoder3564" target={"_blank"}>Youtube</Link>
            </li>

            <li>
              <Image src={icoGmail} alt="" height={64}></Image> <br />
              <Link href="mailto:recipient@example.com">m4cgyverisvoid@gmail.com</Link>
            </li>
          </ul>

          <Image className={styles.snek} src={icoSnek} alt="" height={200} quality={100} />

        </div>
      </div>
    </div>
  </>
  );
}
