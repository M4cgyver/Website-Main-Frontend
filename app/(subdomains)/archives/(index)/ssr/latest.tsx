import Link from "next/link";
import { getLatestArchived } from "./actions";
import styles from "./page.module.css";
import Loading from "@/components/loading";
import Overlay from "@/components/overlay";

// Define the type for a single site entry based on new data structure
interface SiteEntry {
    uri_r: string;  // URI field from the new response
    date_added_r: string;  // Date field from the new response
}

// Define the component
export const StatisticsLatestArchived = async () => {
    try {
        // Fetch data from the server
        const sites: SiteEntry[] = await getLatestArchived();

        if (!sites || sites.length === 0) {
            throw new Error("No sites available");
        }

        return (
            <div
                className={styles.warcUris}
                style={{ display: "flex", width: "100%", padding: 4 }}
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
                    <b style={{ width: "100%", textAlign: "center" }}>URI</b>
                    {sites.map((entry: SiteEntry, index: number) => (
                        <Link
                            href={`/warcs/viewer?uri=${encodeURIComponent(entry.uri_r)}`}
                            prefetch={false}
                            key={index}
                            style={{
                                width: "100%",
                                overflow: "hidden",
                                textWrap: "nowrap",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {entry.uri_r}
                        </Link>
                    ))}
                </div>

                {/* Date Column */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 0,
                    }}
                >
                    <b style={{ width: "100%", textAlign: "center" }}>Date</b>
                    {sites.map((entry: SiteEntry, index: number) => (
                        <span
                            key={index}
                            style={{ textWrap: "nowrap", whiteSpace: "nowrap" }}
                        >
                            {new Date(entry.date_added_r).toLocaleDateString("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
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
                        mining rig may be offline, or there are no sites archived yet.
                    </h3>
                </Overlay>
            </div>
        );
    }
};
