import stylesLayout from "./layout.module.css"

export default function BlogsNextjs13OrderedLayoutsExample2Index() {
    return <>

        {/*The title element for the page*/}
        <div className={stylesLayout.title}>
            Title: Index page!
        </div>

        {/*The content for the page*/}
        <div className={stylesLayout.content}>
            This is the index page, Hello World!
        </div>
    </>
}