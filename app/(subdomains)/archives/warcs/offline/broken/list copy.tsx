"use client";

import { useContext, useState } from "react";
import { WarcOfflineContext } from "./store";

export type WarcOfflineTreeNode = {
    record: number;
    name: string;
    open: boolean;

    children: WarcOfflineTreeNode[];
    parrent: WarcOfflineTreeNode | null;       //ptr
};

let pindex = 0;
export const WarcOfflineRecursiveList = ({ list }: { list: WarcOfflineTreeNode[] }) => {
    return <div>
        {list.map(record => {

            pindex++;
            console.log("worl", pindex, record.name, list)

            return <ul key={`worl${pindex}`}>
                <li>{record.name}
                    {
                        (record.children.length > 0) ? <WarcOfflineRecursiveList list={record.children} /> : <></>
                    }
                </li>
            </ul>
        })}
    </div>
}

export const WarcOfflineList = () => {

    const { records } = useContext(WarcOfflineContext);
    const [recordsToList, setRecordsToList] = useState<WarcOfflineTreeNode[] | null>(null);

    const updateRecordsToList = () => {
        const newRecordsToList: WarcOfflineTreeNode[] = [];

        if (records == null || records == undefined) return;

        records.current.forEach(record => {
            // Use a single regex to capture both base URL and path
            const regex = /^(https?:\/\/[^\/]+)(\/.*)?$/;
            const [_, baseUrl, path = ''] = record.uri.match(regex) || [];

            // Split the path by '/' and filter out empty segments
            const parts = [baseUrl, ...path.split('/').filter(Boolean)];

            let tree = newRecordsToList;    //ptr
            let cparrent: WarcOfflineTreeNode | null = null;
            //console.log("current tree", tree.length, JSON.stringify(tree))

            const checkThis = (part: string): void => {
                const check = part;
                const found = tree.find(item => {
                    const c = item.name == check;
                    //console.log("tc", item.name, check)

                    return c;
                });

                //console.log("check", part, record.uri, JSON.stringify(tree), JSON.stringify(parts), check, JSON.stringify(found));

                //Element name was found, continue and set the tree to child
                if (found) {
                    //console.log("found");
                    tree = found.children;                      //Update the tree to the children
                    cparrent = found;                           //Update the current parrent
                    const newPart = parts.shift();              //Shift
                    if (newPart) return checkThis(newPart);     //Check again

                }

                //Element was not found, set all nessessary children
                else {
                    //console.log("nf");

                    const treeAddendum: WarcOfflineTreeNode = {
                        record: 1,
                        name: part,
                        open: false,

                        children: [],
                        parrent: cparrent,
                    };

                    let currentChildren = treeAddendum.children;
                    let ncparrent = treeAddendum;

                    parts.forEach(part => {
                        const newTreeAddendum: WarcOfflineTreeNode = {
                            record: 1,
                            name: part,
                            open: false,

                            children: [],
                            parrent: ncparrent,
                        };

                        currentChildren.push(newTreeAddendum);
                        currentChildren = newTreeAddendum.children;
                        ncparrent = newTreeAddendum;
                    });

                    tree.push(treeAddendum);
                    //console.log("nf tree", found, JSON.stringify(tree), JSON.stringify(treeAddendum));

                    return;
                }
            }

            const newPart = parts.shift();
            if (newPart) checkThis(newPart);
        });

        setRecordsToList(newRecordsToList);
    }

    console.log(recordsToList);

    return <>
        <button onClick={(e) => updateRecordsToList()}>Update</button>

        {
            (recordsToList) ? <WarcOfflineRecursiveList list={recordsToList} />
                : <span>No records listed yet...</span>
        }
    </>
}