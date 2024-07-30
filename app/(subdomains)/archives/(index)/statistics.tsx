"use client"

import Link from "next/link";
import { getFileProgress, getStatisticsCount } from "./actions";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import Overlay from "@/components/overlay";

export const StatisticsLatestCount = () => {
    const [statistics, setStatistics] = useState<Record<string, string | number> | null>(null);
    const [progress, setProgress] = useState<Record<string, string | number> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)

    const { used, free, totalViews } = statistics ?? { used: 0, free: 0, totalViews: 0 };

    useEffect(() => {
        Promise.all([
            getFileProgress().then(files => setProgress(files)),
            getStatisticsCount().then(sites => setStatistics(sites))
        ])
            .then(() => setLoading(false))
            .catch(err => setError(true));
    }, []);

    // Sort progress by value in ascending order
    const sortedProgress = progress
        ? Object.entries(progress)
            .sort(([_, a], [__, b]) => Number(b) - Number(a))
        : [];

    return (error) ? <div style={{ position: 'relative', width: "100%", aspectRatio: 1920 / 500, padding: 16 }}>
        <Overlay button={false} backgroundColor="#00000000">
            <h3 style={{ width: "75%", textAlign: 'center'}}>Looks like there was an issue requesting the archive statistics! My mining rig may be offline.</h3>
        </Overlay>
    </div> :
        (loading) ? <div style={{ position: 'relative', width: "100%", aspectRatio: 1920 / 500, padding: 16 }}>
            <Loading backgroundColor="#00000000" />
        </div> :
            <div style={{ display: "flex", flexDirection: "column", gap: '18px', flexGrow: 1}}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", textAlign: "center" }}>
                    <div><b>Used Space:</b> {(parseFloat(used.toString()) / (1024 * 1024)).toFixed(2)} MB</div>
                    <div><b>Free Space:</b> {(parseFloat(free.toString()) / (1024 * 1024)).toFixed(2)} MB</div>
                    <div><b>Total Views:</b> {totalViews} Views </div>
                </div>

                <div style={{ display: "flex", width: "100%", padding: 8, gap: '24px', height: 450, overflowY: "scroll"}}>
                    {/* URI Column */}
                    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
                        <b style={{ width: "100%", textAlign: "center" }}>File</b>
                        {sortedProgress.map(([key], index) => (
                            <span key={index} style={{ whiteSpace: "nowrap" }}>
                                {key}
                            </span>
                        ))}
                    </div>

                    {/* Value Column */}
                    <div style={{ display: "flex", flexDirection: "column", padding: 0 }}>
                        <b style={{ width: "100%", textAlign: "center" }}>Percent</b>
                        {sortedProgress.map(([key, value], index) => (
                            <span key={index} style={{ whiteSpace: "nowrap" }}>
                                {value}%
                            </span>
                        ))}
                    </div>
                </div>
            </div>

}
