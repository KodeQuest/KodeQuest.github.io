import { LessonScreen } from "@/components/LessonScreen";
import { ALL_LESSONS } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_LESSONS.map((l) => ({ lessonId: l.id }));
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return <LessonScreen lessonId={lessonId} />;
}
