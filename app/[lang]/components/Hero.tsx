
import React from 'react'
import { ChangeLanguageButton } from '.'
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/lib';

const Hero = async ({
    params
}: { params: { lang: Locale } }) => {
    const { home } = await getDictionary(params.lang);

    return (
        <div className="bg-gray-50 min-h-screen grid grid-cols-1 items-center justify-center px-16 place-items-center lg:grid-cols-2">
            <div className="absolute w-full max-w-lg col-span-1 lg:relative">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            </div>

            <div className='p-12 rounded-lg shadow-xl flex flex-col justify-center gap-2 max-w-xl bg-slate-100 z-10 bg-opacity-20 backdrop-blur-sm '>
                <h1 className='text-lg lg:text-2xl font-mono font-semibold text-slate-600'>{home.title}</h1>
                <p className='font-sans'>{home.description}</p>
                <ChangeLanguageButton label={home.button} current={params.lang}/>
            </div>
        </div>
    )
}

export default Hero
