import styles from "./page.module.css"

import Loading from "@/components/loading";
import { getRandomDarkPastelColor } from "./actions";

export default async function WarcSearchLoadingPage({
}: {
}) {

    return <div className={styles.results} style={{position: 'relative', height: "25vh", width: "100%", backgroundColor: getRandomDarkPastelColor()}}>
        <Loading backgroundColor="#00000000" />
    </div>
}