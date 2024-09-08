// components/WarcList.tsx
import { format, isValid } from "date-fns";
import Link from "next/link";
import styles from "./page.module.css";
import Overlay from "@/components/overlay";
import { fetchData, getRandomDarkPastelColor } from "./actions";

type WarcListProps = {
    uri: string;
    total: number;
    page: number;
    type: string;
};

export default async function WarcList({
    uri,
    total,
    page,
    type,
}: WarcListProps) {
    let latestArchivedWebsites: Array<any> | null = null;

    try {
        latestArchivedWebsites = await fetchData(uri, total, page, type);
    } catch (error: any) {
        return (
            <div style={{ position: 'relative', width: "100%", aspectRatio: 1920 / 500, padding: 16 }}>
                <Overlay button={false} backgroundColor={getRandomDarkPastelColor()}>
                    <h3 style={{ width: "75%", textAlign: 'center' }}>Looks like there was an issue requesting the archive statistics! My mining rig may be offline.</h3>
                </Overlay>
            </div>
        );
    }

    if (!latestArchivedWebsites) {
        return (
            <div className={styles.results}>
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
            </div>
        );
    }

    if (latestArchivedWebsites.length === 0) {
        return (

            <div className={styles.results}>
                <div style={{ position: 'relative', width: "100%", aspectRatio: 1920 / 500, padding: 16 }}>
                    <Overlay button={false} backgroundColor={getRandomDarkPastelColor()}>
                        <h3 className={styles.overlayText}>No items found. Please try a different search or check back later.</h3>
                    </Overlay>
                </div>
            </div>
        );
    }

    // Aggregate data by URI
    const aggregatedArchivedWebsites = latestArchivedWebsites.reduce((acc: { [key: string]: any }, record: any) => {
        if (!acc[record.uri_r]) {
            acc[record.uri_r] = { types: new Set(), datesArchived: new Set() };
        }
        acc[record.uri_r].types.add(record.content_type_r);
        acc[record.uri_r].datesArchived.add(record.meta_r.date);

        return acc;
    }, {});

    // Convert sets to arrays for rendering
    const aggregatedList = Object.entries(aggregatedArchivedWebsites).map(([uri, info]: [uri: any, info: any]) => {
        return {
            uri,
            types: Array.from(info.types),
            datesArchived: Array.from(info.datesArchived).sort((a: any, b: any) => new Date(a).getTime() - new Date(b).getTime()),
        };
    });

    return (
        <div className={styles.results}>
            <ul>
                {aggregatedList.map(({ uri, types, datesArchived }) => (
                    <li key={uri} className={styles.result} style={{ backgroundColor: getRandomDarkPastelColor() }}>
                        <b>Url: </b><Link prefetch={false} href={`/warcs/viewer?uri=${encodeURIComponent(uri)}`}>{uri}</Link>
                        <ul>
                            <li><b>Type: </b>{types.join(', ')}</li>
                            <li><b>Dates Archived: </b>
                                <ul>
                                    {datesArchived.map((date: any, index) => {
                                        const parsedDate = new Date(date);
                                        return (
                                            <li key={index}>
                                                {isValid(parsedDate) ? format(parsedDate, "MMMM do, yyyy '(Coordinated Universal Time)'") : 'Invalid date'}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}
