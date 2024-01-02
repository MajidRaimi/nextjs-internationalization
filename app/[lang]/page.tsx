
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib";
import { ChangeLocale } from "../components";

const page = async ({
  params
}: {
  params: { lang: Locale }
}) => {

  const { home } = await getDictionary(params.lang);

  return (
    <div>
      <p>{home.title}</p>
      <ChangeLocale />
    </div>
  )
}

export default page
