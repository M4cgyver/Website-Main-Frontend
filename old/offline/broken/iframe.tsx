import { useContext } from "react"
import { WarcOfflineContext } from "./store"

export const WarcRecordIframe = () => {
    const {iframeRef} = useContext(WarcOfflineContext);
    
    return <iframe style={{ width: "100%", aspectRatio: 2, resize: 'vertical' }} ref={iframeRef}/>
}