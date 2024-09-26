"use client";

import { useFormState } from "react-dom"
import styles from "./index.module.css"
import { submitComment } from "./actions"
import { SubmitNoteButton } from "./submit";

export const SubmitNote = ({documentId, path}:{documentId:number, path:string}) => {
    const [state, formAction] = useFormState(submitComment, null);

    return (
        <div className={styles.note} style={{ transform: "rotate(0deg)" }}>
            <h1>Submit a comment!</h1>

            <form action={formAction}>
                <label>Username:</label>
                <input name="username" type="text" placeholder="Jeff" required />
                <textarea name="content" placeholder="Shit to say" required/>
                <input name="documentId" defaultValue={documentId} hidden/>
                <input name="path" defaultValue={path} hidden/>

                <SubmitNoteButton />
            </form>
        </div>
    );
}
