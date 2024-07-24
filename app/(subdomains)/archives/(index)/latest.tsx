"use client"

import Link from "next/link";
import { getLatestArchived } from "./actions";
import { useEffect, useState } from "react";

import styles from "./page.module.css"
import Loading from "@/components/loading";
import Overlay from "@/components/overlay";

export const StatisticsLatestArchived = () => {
    const [sites, setSites] = useState<Array<any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getLatestArchived().then(sites => {
            setSites(sites)
            setLoading(false)
        })
            .catch(err => setError(true));
    }, []);

    return (error) ? <div style={{ position: 'relative', width: "100%", aspectRatio: 1920 / 500, padding: 16 }}>
        <Overlay button={false} backgroundColor="#00000000">
            <h3 style={{ width: "75%", textAlign: 'center' }}>Looks like there was an issue requesting the archive statistics! My mining rig may be offline.</h3>
        </Overlay>
    </div> :
        (loading) ? <div style={{ position: 'relative', width: "100%", aspectRatio: 1920 / 500, padding: 16 }}><Loading backgroundColor="#00000000" /></div> :
            <div className={styles.warcUris} style={{ display: "flex", width: "100%", padding: 4 }}>
                {/* URI Column */}
                <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
                    <b style={{ width: "100%", textAlign: "center" }}>URI</b>
                    {sites?.map((entry: any, index: number) => (
                        <Link href={`/warcs/viewer?uri=${encodeURIComponent(entry.uri)}`} prefetch={false} key={index} style={{ width: "100%", overflow: "hidden", textWrap: "nowrap", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                            {entry.uri}
                        </Link>
                    ))}
                </div>


                {/* Date Column */}
                <div style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                    <b style={{ width: "100%", textAlign: "center" }}>Date</b>
                    {sites?.map((entry: any, index: number) => (
                        <span key={index} style={{ textWrap: "nowrap", whiteSpace: "nowrap" }}>
                            {new Date(entry.date).toLocaleDateString('en-US', {
                                month: '2-digit',
                                day: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    ))}
                </div>
            </div>
}