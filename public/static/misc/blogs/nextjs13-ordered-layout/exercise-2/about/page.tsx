import stylesLayout from "../layout.module.css"

export default function BlogsNextjs13OrderedLayoutsExample2Contact() {
    return <>

        {/*The title element for the page*/}
        <div className={stylesLayout.title}>
            About this site
        </div>

        {/*The content for the page*/}
        <div className={stylesLayout.content}>
            This is an example site for flexbox and order in NextJS 13.
        </div>
    </>
}