import PracticumBrowser from "@/components/PracticumBrowser";

export const metadata = {
  title: "Практикум · STEM Платформа",
  description: "Ръководства за учебни експерименти, демонстрации и измервания.",
};

export default function PracticumPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 pt-10">
      <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-minus">Нова секция</p>
      <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">Практикум</h1>
      <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
        Наблюдавайте, предскажете и измерете. Тук симулацията отстъпва място на реалната постановка, данните и проверката на физичния модел.
      </p>
      <div className="mt-8">
        <PracticumBrowser />
      </div>
    </main>
  );
}
