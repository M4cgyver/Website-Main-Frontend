"use client";

import { getCookies } from "cookies-next";
import { useFormStatus } from "react-dom";

export const SubmitNoteButton = () => {
    const {pending} = useFormStatus();

    return <button type="submit" aria-disabled={pending} disabled={pending}> 
    {!pending ? "Submit" : "Submitting..."} 
     </button>;
}