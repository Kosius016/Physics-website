import CourseBrowser from "@/components/CourseBrowser";

export const metadata = {
  title: "Уроци · STEM Платформа",
};

export default async function PhysicsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; subject?: string }>;
}) {
  const { level, subject } = await searchParams;
  return (
    <CourseBrowser
      initialLevel={level === "university" ? "Университетско" : "11. клас"}
      initialSubject={subject === "math" ? "Математика" : "Физика"}
    />
  );
}
