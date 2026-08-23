import CourseBrowser from "@/components/CourseBrowser";

export const metadata = {
  title: "Уроци · SingularityLab",
};

export default async function PhysicsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; subject?: string }>;
}) {
  const { level, subject } = await searchParams;
  const initialLevel =
    level === "university" ? "Университетско" : level === "12" ? "12. клас" : "11. клас";

  return (
    <CourseBrowser
      initialLevel={initialLevel}
      initialSubject={subject === "math" ? "Математика" : "Физика"}
    />
  );
}
