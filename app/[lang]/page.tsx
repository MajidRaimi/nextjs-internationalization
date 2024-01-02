
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib";
import { Hero } from "./components";

const page = async ({
  params
}: {
  params: { lang: Locale }
}) => {



  return (
    <>
      <Hero params={params} />
    </>
  )
}

export default page
