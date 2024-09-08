import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";
import { ViewsWidget } from "@/components/views/widget";
import Overlay from "@/components/overlay";

export default function LoadingSlimPage() {
  return (<>
    <div id="title" className={`${mainWebsiteStyles.title} ${win9xStyles.window}`}>
      <div className={win9xStyles.title} >Introduction</div>
      <h1>Loading...</h1>
      <h2>Pleasw wait while we serve your webpage!</h2>
    </div>

    <div id="content" className={`${mainWebsiteStyles.content} ${win9xStyles.window}`}>
    <div style={{ position: "relative", width: "100%", aspectRatio: "3000/1080" }}>
            <Overlay button={false}>
                <p style={{padding: 12, color:"black"}}>Loading... </p>
            </Overlay>
        </div>
    </div>
  </>
  );
}
