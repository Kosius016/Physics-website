import Image, { type StaticImageData } from "next/image";

type ProblemContextPhotoProps = {
  src: StaticImageData;
  alt: string;
  eyebrow: string;
  title: string;
  caption: string;
  credit: string;
  creditHref: string;
  license: string;
  licenseHref: string;
};

export default function ProblemContextPhoto({
  src,
  alt,
  eyebrow,
  title,
  caption,
  credit,
  creditHref,
  license,
  licenseHref,
}: ProblemContextPhotoProps) {
  return (
    <figure className="overflow-hidden rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard">
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
        <p className="text-[10.5px] font-bold uppercase tracking-[.17em] text-minus">{eyebrow}</p>
        <h3 className="mt-1 font-serif text-[21px] font-bold leading-tight text-ink">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink/80">{caption}</p>
        <p className="mt-3 text-[11px] text-muted">
          Снимка: {" "}
          <a className="font-semibold underline underline-offset-2" href={creditHref} target="_blank" rel="noreferrer">
            {credit}
          </a>
          {" · "}
          <a className="font-semibold underline underline-offset-2" href={licenseHref} target="_blank" rel="noreferrer">
            {license}
          </a>
        </p>
      </figcaption>
    </figure>
  );
}
