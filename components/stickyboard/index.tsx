import { Delicious_Handrawn, Just_Another_Hand } from "next/font/google"
import styles from "./index.module.css"
import { SubmitNote } from "./form";
import { getComments } from "@/libs/database";
import { randomInt } from "crypto";

const font_delicious = Delicious_Handrawn({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-delicious',
    weight: '400',
});

const font_another_hand = Just_Another_Hand({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-another-hand',
    weight: '400',
});

export const StickyBoard = async ({ documentId, path }: { documentId: number, path: string }) => {
    const comments = await getComments(documentId);

    return <div className={`${styles.notes} ${font_delicious.variable} ${font_another_hand.variable}`}>
        <SubmitNote documentId={documentId} path={path} />

        {comments.map((comment, index) => {
            const formatDate = (dateString: string) => {
                const options: Intl.DateTimeFormatOptions = {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZoneName: 'short'
                };

                return new Date(dateString).toLocaleString('en-US', options);
            };

           const rotation = Math.sin(comment.id * 1.25) - .5; // Adjust multiplier for rotation intensity

           return  <div key={comment.id} className={styles.note} style={{ transform: `rotate(${rotation}deg)` }}>
                <h1><em>{comment.username}</em> posted</h1>
                <p>{comment.content}</p>

                <ul className={styles.metadata}>
                    <li>Posted at {formatDate(comment.timestamp)}</li>
                    <li>&gt;&gt;{comment.id.toString().padStart(6, '0')}</li>
                </ul>
            </div>
        })}
    </div>
}