import { hashDJB2, hashSHA3 } from "@/libs/algorithm";
import { fontToshibaTxL1 } from "@/libs/fonts";
import { ViewsForSite, ViewsForPage, ViewTrackerImage } from ".";

import mainWebsiteStyles from "@/libs/styles/maincontent.module.css"
import win9xStyles from "@/libs/styles/win9x.module.css";

export const ViewsWidget = ({path}:{path:string}) => {
    const documentid = hashDJB2(hashSHA3(path)); 

    return <div id="view-statistics" className={`${mainWebsiteStyles.viewStatistics} ${win9xStyles.window}`}>
      <span className={win9xStyles.title}>Views Counter</span>

      <ViewTrackerImage documentId={documentid} path={path}/>

      <table className={`${mainWebsiteStyles.viewStatisticsTable} ${fontToshibaTxL1.className}`}>
        <thead>
          <tr>
            <th></th>
            <th>Website</th>
            <th>Page</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Views</td>
            <td><ViewsForSite /></td>
            <td><ViewsForPage documentId={documentid} /></td>
          </tr>
        </tbody>
      </table>
    </div>
}