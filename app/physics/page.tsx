import CourseBrowser from "@/components/CourseBrowser";

export const metadata = {
  title: "Уроци · STEM Платформа",
};

export default async function PhysicsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const { level } = await searchParams;
  return <CourseBrowser initialLevel={level === "university" ? "Университетско" : "11. клас"} />;
}
