import type { MDXComponents } from "mdx/types";

/**
 * Global MDX typography — every .mdx document renders in the site's
 * editorial language (roman body, skiper display headings).
 */
const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="font-custom mt-2 text-[28px] uppercase text-ink sm:text-[34px]"
      style={{ lineHeight: 1.08 }}
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="font-custom mt-10 border-b border-line pb-3 text-[22px] uppercase text-ink sm:text-[26px]"
      style={{ lineHeight: 1.1 }}
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-8 text-[20px] leading-[1.2] text-ink sm:text-[22px]" {...props} />
  ),
  p: (props) => (
    <p className="mt-4 text-[15.5px] leading-[1.85] text-body" {...props} />
  ),
  a: (props) => (
    <a
      className="text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold/40"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-[15.5px] leading-[1.75] text-body" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15.5px] leading-[1.75] text-body" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-5 border-l-2 border-gold-soft bg-wash px-5 py-4 text-[14.5px] leading-[1.75] text-muted [&>p]:mt-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-9 border-line" />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  em: (props) => <em {...props} />,
  table: (props) => (
    <div className="mt-5 overflow-x-auto rounded-sm border border-line">
      <table className="w-full border-collapse text-left text-[14px]" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-wash" {...props} />,
  th: (props) => (
    <th
      className="border-b border-line px-4 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-faint"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-line px-4 py-3 align-top leading-[1.6] text-body last:border-b-0" {...props} />
  ),
  code: (props) => (
    <code className="rounded-sm bg-wash px-1.5 py-0.5 text-[13.5px] text-ink" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
