import type { CSSProperties, ReactNode } from "react";
import ZoomableImage from "./ZoomableImage";

/**
 * Общи обвивки за визуалните блокове в статиите.
 *
 * `Figure` дава еднакви отстояния и надпис под фигурата; `wide` разширява блока
 * симетрично от двете страни на текстовата колона (виж CLAUDE.md §6).
 *
 * `PhotoFrame` рендва снимка, ако има файл в `public/`, и рамка-заместител,
 * ако още няма. Така страницата е завършена и без готовите изображения:
 * слагате файла, добавяте `src` и нищо друго не се променя.
 */

export const BLEED = "xl:-mx-[5.5rem] 2xl:-mx-[9.5rem]";

export function Figure({
  children,
  caption,
  wide = false,
}: {
  children: ReactNode;
  caption?: ReactNode;
  wide?: boolean;
}) {
  return (
    <figure className={`my-8 ${wide ? BLEED : ""}`}>
      {children}
      {caption && (
        <figcaption className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

export function PhotoFrame({
  alt,
  brief,
  eager = false,
  ratio = "16 / 9",
  src,
}: {
  /** Текст за екранни четци, който описва какво се вижда на снимката. */
  alt: string;
  /** Кратко задание какво трябва да показва снимката (вижда се само в заместителя). */
  brief: string;
  /** Зарежда веднага само водещата снимка; останалите се отлагат до приближаване. */
  eager?: boolean;
  /** CSS съотношение на страните, напр. "16 / 9". */
  ratio?: string;
  /** Път до файла в public/, напр. "/images/statii/malniyata/hero.jpg". */
  src?: string;
}) {
  const style: CSSProperties = { aspectRatio: ratio };

  if (src) {
    return (
      <ZoomableImage
        src={src}
        alt={alt}
        ratio={ratio}
        eager={eager}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      style={style}
      className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-dashed border-rule bg-surface px-5 py-4 text-center"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-rule" aria-hidden="true" fill="none"
        stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h3l1.5-2h9L18 7h3v12H3z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Място за снимка</p>
      <p className="max-w-md text-[13.5px] leading-snug text-muted">{brief}</p>
      <p className="text-[11.5px] text-rule">{ratio.replace(" / ", " : ")}</p>
    </div>
  );
}
