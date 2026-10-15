import { notFound } from "next/navigation";
import ThermodynamicsLesson from "@/components/ThermodynamicsLesson";
import { thermoEntry } from "@/lib/thermodynamicsCourse";
import { thermoLessons } from "@/lib/thermodynamicsContent";
const slugs = Object.keys(thermoLessons).filter(slug => slug !== "parvi-printsip" && slug !== "kpd");
export const dynamicParams = false;
export function generateStaticParams() { return slugs.map(slug => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: (thermoEntry(slug)?.title ?? "Термодинамика") + " · SingularityLab", description: thermoLessons[slug]?.intro };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.includes(slug)) notFound();
  return <ThermodynamicsLesson slug={slug} />;
}
