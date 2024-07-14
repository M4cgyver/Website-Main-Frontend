import stylesLayout from "../layout.module.css"

export default function BlogsNextjs13OrderedLayoutsExample2Contact() {
    return <>

        {/*The title element for the page*/}
        <div className={stylesLayout.title}>
            Contact Us!
        </div>
        
        {/*The content for the page*/}
        <div className={stylesLayout.content}>
            I live at 3828 Piermont Dr, Albuquerque, NM. <br/><br/>
            Pull up
        </div>
    </>
}