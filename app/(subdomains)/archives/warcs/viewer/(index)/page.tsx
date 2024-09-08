import { Suspense } from "react";
import { WarcViewerIFrame } from "./viewer";
import Overlay from "@/components/overlay";

export default function WarcViewerPage() {
  return <Suspense fallback={
    <div style={{ position: 'relative', width: "100%", aspectRatio: 1920 / 500, padding: 16 }}>
        <Overlay button={false} >
            <h3>Loading...</h3>
        </Overlay>
    </div>}>
    <WarcViewerIFrame />   
  </Suspense>
  
}
