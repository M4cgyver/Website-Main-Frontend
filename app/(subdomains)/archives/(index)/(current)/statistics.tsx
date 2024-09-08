import Link from "next/link";
import { getFileProgress, getStatisticsCount } from "./actions";
import Loading from "@/components/loading";
import Overlay from "@/components/overlay";

// Type definitions for the response data
interface Statistics {
    used: number;
    free: number;
    totalViews: number;
}

interface Progress {
    [key: string]: number;
}

export const StatisticsLatestCount = async () => {
    // Fetch data on the server using .then chains
    return Promise.all([getFileProgress(), getStatisticsCount()])
        .then(([progressData, statisticsData]) => {
            // Sort progress by value in descending order
            const sortedProgress = Object.entries(progressData).sort(
                ([, a], [, b]) => Number(b) - Number(a)
            );

            console.log("stats", progressData, sortedProgress);

            const { used, free, totalViews } = statisticsData;

            // Convert bytes to MB
            const usedMB = (used / (1024 * 1024)).toFixed(2);
            const freeMB = (free / (1024 * 1024)).toFixed(2);

            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                        flexGrow: 1,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            textAlign: "center",
                        }}
                    >
                        <div>
                            <b>Used Space:</b> {usedMB} MB
                        </div>
                        <div>
                            <b>Free Space:</b> {freeMB} MB
                        </div>
                        <div>
                            <b>Total Views:</b> {totalViews} Views
                        </div>
                    </div>

                    {progressData.length === 0 ? (
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: 1920 / 500,
                                padding: 16,
                            }}
                        >
                            <Overlay button={false} backgroundColor="#00000000">
                                <h3 style={{ width: "75%", textAlign: "center" }}>
                                    Looks like there was an issue requesting the archive statistics!
                                    My mining rig may be offline.
                                </h3>
                            </Overlay>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                padding: 8,
                                gap: "24px",
                                height: '100%',
                                overflowY: "scroll",
                            }}
                        >
                            {/* URI Column */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flexGrow: 1,
                                    minWidth: 0,
                                }}
                            >
                                <b style={{ width: "100%", textAlign: "center" }}>File</b>
                                {sortedProgress.map(([key], index) => (
                                    <span key={index} style={{ whiteSpace: "nowrap" }}>
                                        {key}
                                    </span>
                                ))}
                            </div>

                            {/* Value Column */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: 0,
                                }}
                            >
                                <b style={{ width: "100%", textAlign: "center" }}>Percent</b>
                                {sortedProgress.map(([key, value], index) => (
                                    <span key={index} style={{ whiteSpace: "nowrap" }}>
                                        {value ? `${value}%` : "N/A"}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        })
        .catch(error => {
            return (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: 1920 / 500,
                        padding: 16,
                    }}
                >
                    <Overlay button={false} backgroundColor="#00000000">
                        <h3 style={{ width: "75%", textAlign: "center" }}>
                            Looks like there was an issue requesting the archive statistics! My
                            mining rig may be offline.
                        </h3>
                    </Overlay>
                </div>
            );
        });
};
