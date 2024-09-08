"use server";

import { getCachedViewCount } from "@/components/views";
import { hashDJB2, hashSHA3 } from "@/libs/algorithm";

export const getLatestArchived = async () => {
    return new Promise(resolve => setTimeout(resolve, 5000))
        .then(() => fetch(`${process.env.ARCHIVES_INTERNAL_API}/statistics/latest`, { next: { revalidate: 60 * 5 } }))
        .then(res => res.json());
};

export const getStatisticsCount = async () => {
    return new Promise(resolve => setTimeout(resolve, 7500))
        .then(() => fetch(`${process.env.ARCHIVES_INTERNAL_API}/statistics`, { next: { revalidate: 60 * 5 } }))
        .then(res => res.json())
        .then(api => {
            const views = getCachedViewCount({ documentId: hashDJB2(hashSHA3("/archives/")), uniqueViews: true })();
            return { ...api, totalViews: views };
        });
};

export const getFileProgress = async () => {
    return fetch(`${process.env.ARCHIVES_INTERNAL_API}/statistics/progress`, { next: { revalidate: 60 * 5 } })
        .then(res => res.json());
};
