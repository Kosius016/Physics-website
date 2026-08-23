import Link from "next/link";

interface SectionHeadingProps {
  id?: string;
  number: string;
  title: string;
  action?: {
    href: string;
    label: string;
  };
}

export default function SectionHeading({ id, number, title, action }: SectionHeadingProps) {
  return (
    <div className="mb-2 flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-1.5">
      <h2 id={id} className="font-serif text-[26px] font-bold leading-tight text-ink">
        <span
          aria-hidden="true"
          className="mr-2.5 align-[0.15em] text-[0.62em] tracking-[0.1em] text-muted"
        >
          {number}
        </span>
        {title}
      </h2>
      {action ? (
        <Link
          href={action.href}
          className="whitespace-nowrap text-[14.5px] font-semibold text-minus hover:underline"
        >
          {action.label} →
        </Link>
      ) : null}
    </div>
  );
}
