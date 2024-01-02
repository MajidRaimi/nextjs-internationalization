'use client';
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useSetLocale } from "../hooks";


const ChangeLocale = () => {

    const setLocale = useSetLocale();

    return (
        <>
            <button onClick={() => {setLocale('en')}}>
                Change to english
            </button>
            <button onClick={() => {setLocale('ar')}}>
                Change to arabic
            </button>
        </>
    )
}

export default ChangeLocale
