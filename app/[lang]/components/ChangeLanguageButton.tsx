'use client'

import { useSetLocale } from "../../hooks";

const ChangeLanguageButton = (
    { label, current }: { label: string, current: string }
) => {

    const setLocale = useSetLocale()

    return (
        <button className=' ms-auto rounded p-1.5 px-3 bg-indigo-600 text-white duration-300 hover:bg-indigo-800'
        onClick={
            () => {
                setLocale(current === 'en' ? 'ar' : 'en')
            }
        }
        >
            {label}
        </button>
    )
}

export default ChangeLanguageButton