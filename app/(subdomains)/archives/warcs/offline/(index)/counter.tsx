'use client'

import { useState, useEffect } from "react";
import { useWarcOfflineViewer } from "./context";

const RecordsCounter: React.FC = () => {
    const { setRecordCountDispatch } = useWarcOfflineViewer();
    const [count, setCount] = useState(0);

    useEffect(()=>{
        if(setRecordCountDispatch)
            setRecordCountDispatch(setCount)
    }, [setRecordCountDispatch]);

    return (
        <span>Total Records {count} </span>
    )
}

export default RecordsCounter