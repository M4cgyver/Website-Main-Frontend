"use client";

import Overlay from "@/components/overlay";
import { useGlobalContext } from "./context";

export const WarcRecordIframe = () => {
    const { iframeSrc, isLoadingRecord } = useGlobalContext();

    return iframeSrc ?
        <span style={{ position: "relative", backgroundColor: "white", width: "100%", height: "100%", }}>
            <iframe style={{ width: "100%", height: "85vh", resize: 'vertical' }} src={iframeSrc} />

            {isLoadingRecord && <Overlay button={false} header={"Loading..."} />}
        </span> :
        isLoadingRecord ?
            <div style={{ position: "relative", width: "100%", aspectRatio: "3000/1080" }}>
                <Overlay button={false} header={"Loading..."} />
            </div>
            :
            <div style={{ position: "relative", width: "100%", aspectRatio: "3000/1080" }}>
                <Overlay button={false}>
                    <p style={{ padding: 12 }}>Get started by parsing some files and selecting the link you want to view! </p>
                </Overlay>
            </div>
}