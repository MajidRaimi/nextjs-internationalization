# 🌐 Internationalization in NextJs 13

## 📖 Introduction

Welcome to "Internationalization in NextJs 13" – your guide to implementing multi-language support in your Next.js 13 projects. This repository provides a straightforward approach to making your website globally accessible and user-friendly, catering to a diverse audience with varying language preferences. We focus on simplicity and practicality, ensuring that you can easily integrate internationalization into your Next.js 13 applications.

## ✨ Features

- **🚫 Independence from `next-intl`**: This approach does not rely on the [`next-intl`](https://next-intl-docs.vercel.app/) package, offering greater flexibility and control over your internationalization implementation.

- **🔧 Ease of Application**: Designed with simplicity in mind, our method is straightforward to apply, enabling quick integration of multi-language support into your projects.

- **📖 RTL and LTR Support**: Comprehensive support for Right-to-Left (RTL) and Left-to-Right (LTR) languages, ensuring a seamless user experience for a global audience.

- **🔒 Type Safety**: Ensures type-safe coding practices, providing an additional layer of reliability and maintainability to your internationalization efforts.

- **🌐 Language Switching**: Allows users to switch between languages, providing a more personalized experience and greater accessibility.

## 🔧 Implementation

### 1. Install Dependencies

```javascript
npm i @formatjs/intl-localematcher negotiator
```

make sure you install `@types/negotiator` as dev dependency if you are using typescript.

### 2. Create a `i18n.config.ts` file

make sure you are in the root directory of your project and run the following command to create a `i18n.config.ts` file.

```bash
touch i18n.config.ts
```

now copy the following code into the `i18n.config.ts` file.

```javascript
export const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'ar']
} as const


export type Locale = (typeof i18n)['locales'][number]
```

### 3. Create a `locale` folder

make sure you are in the root directory of your project and run the following command to create a `locale` folder.

```bash
mkdir locales
```

now create a `en.json` file and any other languages and inside the `locale` folder and copy the following code into it.

```
- locale/
    - en.json
    - ar.json
```

en.json
```json
{
    "home": {
        "title": "Hello World!"
    }
}
```

ar.json
```json
{
    "home": {
        "title": "السلام عليكم"
    }
}
````

### 4. Create a `lib/dictionary.ts` file

Under the root directory of your project create a `lib` folder and inside it create a `dictionary.ts` file and copy the following code into it.

```javascript
import "server-only";
import type { Locale } from "@/i18n.config";

const dictionaries = {
  en: () => import("@/locales/en.json").then((module) => module.default),
  ar: () => import("@/locales/ar.json").then((module) => module.default),
};

const getDictionary = async (locale: Locale) => {
  const dictionary = await dictionaries[locale]();
  return dictionary;
};

export default getDictionary;
```

### 5. Wrap both of `page.tsx` and `layout.tsx` under the `app/` folder with a `[lang]` folder.

We are doing this to make sure that the `lang` param is available in all the pages and components under the `app/` folder.

#### Before ❌

```bash
- app/
    - page.tsx
    - layout.tsx
    - ...
```

#### After ✅

```bash
- app/
    - [lang]/
        - page.tsx
        - layout.tsx
        - ...
```

### 6. Create a `middleware.ts` file to handle the language switching.

Under the root directory of your project create a `middleware.ts` file and copy the following code into it.

```javascript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { i18n } from "./i18n.config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const getLocale = (request: NextRequest): string | undefined => {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const locales = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}/${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### 7. Edit the `app/[lang]/layout.tsx` to make sure the language is available in all the pages and components under the `app/` folder.

#### Before ❌

```javascript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

#### After ✅

```javascript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Locale, i18n } from "@/i18n.config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { lang: Locale },
}) {
  return (
    <html lang={params.lang} dir={params.lang === "ar" ? "rtl" : "ltr"}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

## 📖 Usage

Now all we need to do is to use the `getLocale` function to get the current locale and use it to get the correct translation from the dictionary.

### This is how would you use it in a `app/[lang]/page.tsx` file.

```javascript
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib";

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const { home } = await getDictionary(params.lang);

  return (
    <div>
      <p>{home.title}</p>
    </div>
  );
};

export default Page;
```

### What if I want to change the language? 🤔

We will create a simple hook under `app/hooks/useLocale.ts` to handle the language switching.

```javascript
"use client";

import { usePathname, useRouter } from "next/navigation";

const useSetLocale = () => {
  const pathname = usePathname();
  const router = useRouter();

  const setLocale = (locale: string) => {
    if (pathname) {
      const segments = pathname.split("/");
      segments[1] = locale;
      router.push(segments.join("/"));
    }
  };

  return setLocale;
};

export default useSetLocale;
```

Now we can use the `useSetLocale` hook to change the language.

```javascript
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib";
import useSetLocale from "@/hooks/useSetLocale";

const Page = async ({ params }: { params: { lang: Locale } }) => {
  const { home } = await getDictionary(params.lang);
  const setLocale = useSetLocale();

  return (
    <div>
      <p>{home.title}</p>
      <button onClick={() => setLocale("ar")}>Change Language</button>
    </div>
  );
};
```


## 🌟 Summary
This project simplifies the process of adding multi-language support to Next.js 13 applications. It offers a user-friendly approach to internationalization, ensuring your website can reach a global audience with ease.

## 📚 Resources
- [Next.js 13](https://nextjs.org/blog/next-13)
- [Internationalization in Next.js 13](https://nextjs.org/docs/advanced-features/i18n-routing)
- [Navigator](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)

## 📝 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## Authors
- [Majid Saleh Al-Raimi](https://github.com/MajidRaimi)

Happy Coding 🚀