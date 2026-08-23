import Image from "next/image";

export default function HomeFooter() {
  return (
    <footer id="za-proekta" className="scroll-mt-6 border-t-2 border-ink bg-surface">
      <div className="mx-auto flex max-w-[1040px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-7 text-[13.5px] text-muted">
        <div className="flex items-center gap-2">
          <Image src="/brand/mark-ink.svg" width={22} height={22} alt="" aria-hidden="true" />
          <span>
            <strong className="font-medium text-ink">SingularityLab</strong> · физика и математика
          </span>
        </div>
        <div id="podkrepi" className="scroll-mt-6">
          Проектът е безплатен. <span className="font-semibold text-minus">Ko-fi · скоро</span>
        </div>
      </div>
    </footer>
  );
}
