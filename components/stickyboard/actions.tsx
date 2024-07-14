"use server";

import styles from "./index.module.css"
import { addComment, getComments } from "@/libs/database";
import { getCookie } from "cookies-next";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { unstable_cache as cache } from "next/cache";

// Cache the result of getViewsCount function
export const getCachedComments = (documentId: number) => {
    const tag = `comments-${documentId}`;
    return cache(
        async () => {
            const views = await getComments(documentId);
            return views;
        },
        [tag],
        { tags: [tag] }
    );
}

export const submitComment = async (prevState: any, formData: FormData) => {
    // Extract values from formData
    const documentId = formData.get('documentId');
    //const userId = getCookie("userid");
    const username = formData.get("username");
    const content = formData.get("content");
    const path = formData.get("path");

    const nextcookies = cookies();
    const userId = nextcookies.get("userid")?.value;

    // Validation checks
    if (!userId) {
        throw new Error("User is not authenticated.");
    }
    if (!documentId || isNaN(Number(documentId))) {
        throw new Error("Invalid document ID.");
    }
    if (!username || typeof username !== 'string' || username.trim() === "") {
        throw new Error("Username is required.");
    }
    if (!content || typeof content !== 'string' || content.trim() === "") {
        throw new Error("Content cannot be empty.");
    }
    if (!path || typeof path !== 'string' || path.trim() === "") {
        throw new Error("Path is required for revalidation.");
    }

    // Add the comment to the database
    await addComment(Number(userId), username.trim(), Number(documentId), content.trim())
        .then(() => {
            revalidateTag(`comments-${documentId}`);
            revalidateTag(`comments-component-${documentId}`);
            revalidatePath(path.trim());
            console.log("New comment added");
        })
        .catch((error) => {
            throw new Error(`Failed to add comment: ${error.message}`);
        });
};
