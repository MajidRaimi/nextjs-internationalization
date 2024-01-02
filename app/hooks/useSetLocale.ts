'use client';

import { usePathname, useRouter } from "next/navigation";

const useSetLocale = () => {
    const pathname = usePathname();
    const router = useRouter();

    const setLocale = (locale: string) => {
        if (pathname) {
            const segments = pathname.split('/');
            segments[1] = locale;
            router.push(segments.join('/'));
        }
    }


    return setLocale
}

export default useSetLocale
