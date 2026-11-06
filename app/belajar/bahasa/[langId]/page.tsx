import { LanguagePathScreen } from "@/components/LanguagePathScreen";
import { LANGUAGES } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.map((l) => ({ langId: l.id }));
}

export default async function LanguagePage({ params }: { params: Promise<{ langId: string }> }) {
  const { langId } = await params;
  return <LanguagePathScreen langId={langId} />;
}
