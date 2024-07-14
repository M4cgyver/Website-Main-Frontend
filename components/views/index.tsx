"use strict";

import { addView, getViewsCount } from "@/libs/database";
import { unstable_cache as cache, revalidateTag } from "next/cache";

// Cache the result of getViewsCount function
export const getCachedViewCount = (options?: { documentId?: number, uniqueViews?: boolean }) => {
  const tag = `views-count-${options?.documentId}`;
  return cache(
    async () => {
      const views = await getViewsCount(options);
      return views;
    },
    [tag],
    { tags: [tag] }
  );
}

export const addCachedViewCount = async (userid: number, options?: { documentId?: number }) => {
  const documentId = options?.documentId;
  
  const oldCachedViewCount = await getViewsCount({ documentId, uniqueViews: true });
  await addView(userid, documentId);
  const newCachedViewCount = await getViewsCount({ documentId, uniqueViews: true });

  //console.log(oldCachedViewCount, newCachedViewCount);

  if (oldCachedViewCount !== newCachedViewCount) {
      revalidateTag(`views-count-${documentId}`);
      revalidateTag(`views-count-${undefined}`);

      return { newViewer: true };
  }

  return { newViewer: false };
};


// Component to display views for a specific document
export const ViewsForPage = async ({ documentId }: { documentId: number }) => {
  // Use getCachedViewCount function to fetch and display views count
  const viewsCount = await getCachedViewCount({ documentId, uniqueViews: true })();
  return <span>{viewsCount}</span>;
};

// Component to display views for the entire site
export const ViewsForSite = async () => {
  // Use getCachedViewCount function to fetch and display views count
  const viewsCount = await getCachedViewCount({ uniqueViews: true })();
  return <span>{viewsCount}</span>;
};


export const ViewTrackerImage = ({ documentId, path }: { documentId: number, path:string }) => <img src={`/api/views/tracker?documentid=${documentId}&path=${encodeURIComponent(path)}`} alt="" style={{ width: 1, height: 1, opacity: .1 }} />