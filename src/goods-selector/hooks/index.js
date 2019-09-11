import { useRef, useEffect, useState } from 'react';

/**
 * 在当次渲染期间，获取上一次渲染的值
 */
export function usePrevious(value) {
    const prevRef = useRef(value);
    useEffect(() => {
        prevRef.current = value;
    });

    return prevRef.current;
}

export function useFirstRender() {
    const ref = useRef(true);
    useEffect(() => {
        ref.current = false;
    }, []);
    return ref.current;
}

export function useLoading(asyncFn) {
    const [loading, setLoading] = useState(false);
   
    async function call(...args) {
        setLoading(true);
        const res = await asyncFn(...args);
        setLoading(false);
        return res;
    }
    return [loading, call];
}

export default {};