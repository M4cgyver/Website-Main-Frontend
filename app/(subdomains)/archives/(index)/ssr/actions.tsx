"use server"

import { getCachedViewCount } from "@/components/views";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";

export const getLatestArchived = async () => {
    return await (await fetch(`${process.env.ARCHIVES_INTERNAL_API}/statistics/latest`, {cache: 'no-cache'})).json();
}

export const getStatisticsCount = async () => {
    const api = await (await fetch(`${process.env.ARCHIVES_INTERNAL_API}/statistics`, {cache: 'no-cache'})).json();
    const views = getCachedViewCount({ documentId: hashDJB2(hashSHA3("/archives/")), uniqueViews: true })();

    return {...api, totalViews: views};
}

export const getFileProgress = async () => {
    return await (await fetch(`${process.env.ARCHIVES_INTERNAL_API}/statistics/progress`, {cache: 'no-cache'})).json();
}