import { notFound, permanentRedirect } from "next/navigation";
import { textbook11Lessons } from "@/lib/textbook11";

export default async function LegacyTextbookLessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  if (!textbook11Lessons.some(item => item.slug === lesson)) notFound();
  permanentRedirect(`/reshenia/11-klas/${lesson}`);
}
