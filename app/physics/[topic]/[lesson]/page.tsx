import { notFound } from "next/navigation";
import LessonRenderer from "@/components/LessonRenderer";
import { getAllLessons, getLesson } from "@/lib/lessons";

interface PageProps {
  params: Promise<{ topic: string; lesson: string }>;
}

export function generateStaticParams() {
  return getAllLessons().map((l) => ({ topic: l.topicSlug, lesson: l.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { topic, lesson } = await params;
  const data = getLesson(topic, lesson);
  return { title: data ? `${data.title} · Физика` : "Урок" };
}

export default async function LessonPage({ params }: PageProps) {
  const { topic, lesson } = await params;
  const data = getLesson(topic, lesson);
  if (!data) notFound();

  return <LessonRenderer lesson={data} />;
}
