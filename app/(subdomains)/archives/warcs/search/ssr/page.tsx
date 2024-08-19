import Link from "next/link";
import { format, isValid } from "date-fns";
import styles from "./page.module.css";
import Overlay from "@/components/overlay";
import { getRandomDarkPastelColor } from "./actions";

type SearchParams = {
    [key: string]: string | undefined;
};

export default async function WarcSearchPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const uri = encodeURIComponent(searchParams.uri ?? "");
    const total = parseInt(searchParams.total ?? "32");
    const page = parseInt(searchParams.page ?? "1");
    const type = searchParams.type ?? "";

    let response: Response | null = null;
    let latestArchivedWebsites: Array<any> | null = null;

    try {
        const apiendpoint = `${process.env.ARCHIVES_INTERNAL_API}/search?uri=${uri}&total=${total}&page=${page}&type=${encodeURIComponent(type)}`;
        //console.log("url ssr ", apiendpoint)
        response = await fetch(apiendpoint, { cache: 'no-store' });
        if (!response.ok) {
            const responseBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}\n${responseBody}`);
        }
        latestArchivedWebsites = await response.json();
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
            <div className={styles.error}>
                Invalid data format received. Please contact support.
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
