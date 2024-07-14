import Link from "next/link";
import Image from "next/image";

import styles from "./SlideshowWidget.module.css"
import imageNextJS13OrderedLayout from "@/public/static/images/blogsnextjs13flexandordericon.jpeg"
import imageAlbanian from "@/public/static/images/flagalbainain.png";
import imageNeo from "@/public/static/images/neocrying.png";
import imageTate from "@/public/static/images/photofunny.net_.jpg";
import imageStardew from "@/public/static/images/stardew2.webp";
import { fontEagleSpCGA_Alt2x2 } from "@/libs/fonts";
import { Slideshow } from "../slideshow";
import { getBlogListing } from "@/libs/database/blogs";
import { getProjectsListing } from "@/libs/database/projects";

export default async function SlideshowWidget() {
    const blogs = await getBlogListing();
    const projects = await getProjectsListing();

    const listings = [...blogs, ...projects].sort((a, b) => {
        const dateA = a.published instanceof Date ? a.published.getTime() : a.published;
        const dateB = b.published instanceof Date ? b.published.getTime() : b.published;
        return dateA + dateB;
    });

    return (
        <div className={`${fontEagleSpCGA_Alt2x2.variable}`}>
            <Slideshow buttonsClassName={styles.buttons} slideClassName={styles.slide}>
                {listings.map((item, index) => {
                    return <Link key={index} href={item.location} prefetch={true} style={{ display: "block", width: "min(25vh, 25vw)", aspectRatio: "1920/1080" }}>
                        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", width:"100%", height:"100%" }}>
                            <Image src={item.icon} alt="" placeholder="blur" layout="fill" objectFit="cover" />
                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "var(--font-eaglespcga_alt2x2y)", color: "black", padding: 4, backgroundColor: "rgba(214, 183, 157, .7)" }}>
                                <span style={{ position: "absolute", top: "55%", height: "100%" }}>
                                    <h1 style={{ fontSize: "min(1.5vw, 1.5vh)" }}> 
                                        <strong>{item.category}: </strong>{item.title}
                                    </h1>
                                    <h3 style={{ fontSize: "min(1.25vw, 1.25vh)", marginTop: -4, lineHeight: 1 }}>{item.descShort}</h3>
                                </span>
                            </div>
                        </div>
                    </Link>

                })}

            </Slideshow>
        </div>
    );
}