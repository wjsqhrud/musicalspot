import { useRef } from "react";

export const useThrottle = ( callback: () => void, delay: number ) => {
    const lastRun = useRef(Date.now());

    return () => {
        const timeElapsed = Date.now() - lastRun.current;
        console.log("useThrottle 진입.......")
        if (timeElapsed >= delay) {
            callback();
            lastRun.current = Date.now();
        }
    };
}