"use client";

import { setCookie, getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export const NoScriptCookie = () => {
    const [noscript, setNoscript] = useState<boolean | null>(null);

    useEffect(() => {
        setCookie('noscript', 'true');

        setNoscript(getCookie('noscript') === 'true');
    }, []);

    return <span>{`noscript: ${noscript == null ? 'null' : (noscript == true ? 'true' : 'false')}`}</span>;
};
