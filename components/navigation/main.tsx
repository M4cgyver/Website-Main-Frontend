import "@/app/globals.css";
import { getBlogListing } from "@/libs/database/blogs";

import styles from "./main.module.css"
import mainWebsiteStyles from "@/libs/styles/maincontent.module.css";
import win9xStyles from "@/libs/styles/win9x.module.css";
import Link from "next/link";

export const NavigationRHS = async ({ }) => {
    const blogs = await getBlogListing();

    return (
        <div id="navigation-rhs" className={`${mainWebsiteStyles.navigationRhs} ${win9xStyles.window}`}>
            <span className={win9xStyles.title}>Navigation</span>
            <ul>
                <li><Link href="/" prefetch={true}>Homepage</Link></li>
                <li><Link href="/contacts" prefetch={true}>Contact / Socials</Link></li>
                <li><Link href="/content" prefetch={true}>Games / MoviesClips</Link></li>
                <li>
                    <Link href="/blogs" prefetch={true}>Blog Postings</Link>
                    <ul>
                        {blogs.slice(Math.max(0, blogs.length - 3), blogs.length).map(blog => (
                            <li key={blog.location}><Link href={blog.location} className={styles.aNew}>{blog.title}</Link></li>
                        ))}
                        <li><Link href="/blogs" prefetch={true}>....</Link></li>
                    </ul>
                </li>
                <li>
                    <Link href="/projects" prefetch={true}>Projects</Link>
                    <ul>
                        <li style={{ marginBottom: 8 }}><Link href="/archives" prefetch={true}>Public Archives</Link></li>
                        <li style={{ marginBottom: 8 }}>Nintendo DSi Gallery</li>
                        <li style={{ marginBottom: 8 }}>Friends Custom Pages
                            <ul>
                                <li><Link href="/projects/friends/bic" prefetch={true}>Bic</Link></li>
                                <li><Link href="/projects/friends/casmier" prefetch={true}>Casmier</Link></li>
                                <li><Link href="/projects/friends/cliffard" prefetch={true}>Cliffard</Link></li>
                                <li><Link href="/projects/friends/cookie" prefetch={true}>Cookie</Link></li>
                                <li><Link href="/projects/friends/neo" prefetch={true}>Neo</Link></li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}
