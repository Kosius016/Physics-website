type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  credit: string;
  href: string;
};

export default function YouTubeEmbed({
  videoId,
  title,
  credit,
  href,
}: YouTubeEmbedProps) {
  return (
    <figure className="m-0 overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard">
      <div className="aspect-video bg-ink">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <figcaption className="border-t-[1.5px] border-ink px-3.5 py-3 text-[12.5px] leading-relaxed text-muted">
        {title}{" "}
        <a
          className="font-semibold text-minus hover:underline"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {credit}
        </a>
      </figcaption>
    </figure>
  );
}
