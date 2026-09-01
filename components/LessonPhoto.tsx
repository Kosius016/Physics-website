import Image, { type StaticImageData } from "next/image";

/**
 * Реална снимка вътре в урок.
 *
 * По същия модел като `ProblemContextPhoto` от страниците със задачи, но
 * без заглавие и eyebrow: в урока снимката стои вътре в разказа, а не
 * отваря задача. Правилото от CLAUDE.md §7 важи и тук - реална снимка
 * само когато изяснява физическия обект, с описателен `alt`, видим автор
 * и видим лиценз.
 *
 * `src` е локален оптимизиран asset, внесен като модул, за да работят
 * `placeholder="blur"` и автоматичните размери.
 */
export default function LessonPhoto({
  src,
  alt,
  caption,
  credit,
  creditHref,
  license,
  licenseHref,
}: {
  src: StaticImageData;
  alt: string;
  caption: string;
  credit: string;
  creditHref: string;
  license: string;
  licenseHref: string;
}) {
  return (
    <figure className="my-6 overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard">
      <div className="relative aspect-[16/9] overflow-hidden bg-ink">
        <Image
          src={src}
          alt={alt}
          fill
          placeholder="blur"
          sizes="(max-width: 768px) calc(100vw - 40px), 728px"
          className="object-cover saturate-[.82] contrast-[1.05] sepia-[.08]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-white/5"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[.12] mix-blend-soft-light"
          style={{
            backgroundImage: "url('/images/photo-grain.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px",
          }}
        />
      </div>

      <figcaption className="px-5 py-4">
        <p className="text-[14.5px] leading-relaxed text-ink/85">{caption}</p>
        <p className="mt-2.5 text-[11px] text-muted">
          Снимка:{" "}
          <a
            className="font-semibold underline underline-offset-2"
            href={creditHref}
            target="_blank"
            rel="noreferrer"
          >
            {credit}
          </a>
          {" · "}
          <a
            className="font-semibold underline underline-offset-2"
            href={licenseHref}
            target="_blank"
            rel="noreferrer"
          >
            {license}
          </a>
        </p>
      </figcaption>
    </figure>
  );
}
