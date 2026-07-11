/**
 * Секция от урок: §-номерирано серифно заглавие с мастилена долна линия.
 * Извадено от LessonRenderer, за да се преизползва и от самостоятелни
 * урочни страници (напр. Био-Савар) — визуално идентично.
 */
export default function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 pt-12">
      <h2 className="mb-5 border-b-2 border-ink pb-1.5 font-serif text-[26px] font-bold text-ink">
        <span className="mr-2.5 align-[0.15em] text-[0.62em] tracking-[0.1em] text-muted">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
