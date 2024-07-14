import { Metadata } from "next";

import websiteIcon from "@/public/favicon.ico"
import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import { ViewsWidget } from "@/components/views/widget";
import { fontEagleSpCGA_Alt2x2, fontHP100LX6x8, fontHandrawn, fontPixelPirate, fontVerite9x14 } from "@/libs/fonts";
import Link from "next/link";
import Image from "next/image";
import imageMiner from "@/public/static/images/PXL_20230322_080050245.jpg"
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: 'M4cgyvers Repurposed Mining Rig! ',
  description: 'Welcome to my (M4cgyver) website / resume (depending on whos reading). Written in NextJS 13 and NodeJs all within Docker!',

  creator: 'M4cgyver',
  publisher: 'M4cgyver',

  referrer: 'origin-when-cross-origin',

  openGraph: {
    title: 'M4cgyvers Repurposed Mining Rig! ',
    description: 'Welcome to my (M4cgyver) website / resume (depending on whos reading). Written in NextJS 13 and NodeJs all within a Docker container!',
    url: 'https://m4cgyver.com',
    locale: 'en-US',
    type: 'website',

    images: websiteIcon.src,

  }
};

export default function HomePage() {
  return (<>
    <div id="title" className={`${mainWebsiteStyles.title} ${win9xStyles.window}`}>
      <div className={win9xStyles.title} >Introduction</div>
      <h1>{metadata.title?.toString()}</h1>
      <h2>{metadata.description?.toString()}</h2>
    </div>

    <ViewsWidget path="/" />

    <div id="content" className={mainWebsiteStyles.content}>
      <div className={win9xStyles.window}>
        <div className={`${win9xStyles.title}`}>Homepage</div>
        <div style={{ display: 'block', padding: 6 }}>
          <div className={fontEagleSpCGA_Alt2x2.className} style={{ marginTop: -16 }}>
            <div className={fontHandrawn.className} style={{ fontSize: 80, marginBottom: -28, marginRight: 4, float: "left" }}>Hello World!</div>
            <div style={{ paddingTop: 32 }}>My name is Logan Rios, a California native with a passion for computer technology in GITA. I attended BOHS for high school, where I honed my skills in computer science. Currently, I&apos;m pursuing a degree in computer science and technology at Grand Canyon University in Arizona, where I&apos;m constantly exploring and expanding my knowledge in this field, though I always prefer self-taught methods such as YouTube videos and blog websites. My favorite form of learning is through creating fun projects that can be repurposed and reused in the future whenever needed.</div>
          </div>
          <div style={{ height: "2vh" }} />
          <div className={fontEagleSpCGA_Alt2x2.className}>            
            <Link href="/static/images/PXL_20230322_080050245.jpg" target={"_blank"}>
              <Image src={imageMiner} alt="stupid mining rig" width={275} height={150} quality={10} style={{float: "left", marginRight: 4, marginBottom: -18, width: "calc(min(1.5vw, 1.7vh)*16)", height: "calc(min(1.5vw, 1.7vh)*9)" }} placeholder='blur' />
            </Link>

            In my free time, I enjoy creating unique and innovative hardware gimmicks, such as my gameboy that doubles as a keyfob or use an old mining rig to host a website and train AI models ready for everyone and anyone. I also have a strong interest in software development and enjoy pushing the boundaries of what&apos;s possible with obscure concepts and designs. One of my biggest software projects was creating a complete x86 operating system (it booted and ran programs, that&apos;s about it. Could never figure out how to program interrupts so I just had a jump table). I always have a love for old retro tech. If it&apos;s games or just old computers parts I always love to make use of them. For example, I&apos;m using a stack of Floppy Disks to prop up my monitor because it broke on the way to college :D. My passion for technology has led me on a journey of exploration and creativity, and I&apos;m excited to see where it takes me in the future.</div>
          <div style={{ height: "2vh" }} />
          <div className={fontEagleSpCGA_Alt2x2.className}>Honestly, that&apos;s about it. I&apos;ll be posting blog updates on locations, tips, projects, and games. Anyone else that posts more than that on the internet has really bad opsec, bad with personal data, or isn&apos;t Kenenough.</div>
        </div>

      </div>
    </div>
  </>
  );
}
