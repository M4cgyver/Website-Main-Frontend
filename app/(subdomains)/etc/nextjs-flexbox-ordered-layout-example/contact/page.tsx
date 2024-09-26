import Link from "next/link"
import stylesLayout from "../layout.module.css"

export default function BlogsNextjs13OrderedLayoutsExample2Index() {
    return <>

        {/*The title element for the page*/}
        <div className={stylesLayout.title}>
            Contact me!
        </div>

        {/*The content for the page*/}
        <div className={stylesLayout.content}>
            This is a dummy page lmao! If you actually want to contact me my socials are <Link href="/contacts" target="_blank">here</Link>
        </div>
    </>
}