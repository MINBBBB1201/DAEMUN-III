// apps/admin/src/app/dashboard/preview/page.tsx
//
// Read-only render of everything GET /api/admin/site currently returns, laid
// out in roughly the order the public site presents it. Not a pixel-perfect
// copy of apps/web (separate Next app, can't share components) — this exists
// so an admin can sanity-check content and completeness before it goes live,
// including draft/unapproved items the public API hides.
"use client";

import type {
  CommitteeWithTopics,
  Person,
  Resolution,
  ScheduleDayWithItems,
  SiteData,
  SiteDocument,
} from "@daemun/shared";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useSite } from "@/lib/crud-hooks";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

/** "TBA" renders as a quiet placeholder, matching apps/web/.../section.tsx. */
function TBA({ value }: { value: string }) {
  if (value !== "TBA" && value.trim() !== "") return <>{value}</>;
  return <span className="italic text-faint">To be announced</span>;
}

export default function PreviewPage() {
  const { data, isPending, error, isFetching, refetch } = useSite();

  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Preview"
        subtitle="A read-only render of what GET /api/admin/site returns right now, in roughly the order the public site shows it. This is a content check, not a pixel-perfect copy — it also shows drafts and unapproved items the public site hides."
        onRefresh={() => refetch()}
        refreshing={isFetching}
      />

      <div className="mt-6">
        {isPending && <p className="text-sm text-muted">Loading…</p>}
        {error && (
          <p className="text-sm text-[#b23b3b]">Failed to load: {error.message}</p>
        )}
        {data && <PreviewBody site={data} />}
      </div>
    </div>
  );
}

function PreviewBody({ site }: { site: SiteData }) {
  return (
    <div className="max-w-4xl space-y-10">
      <ConferenceSection conference={site.conference} />
      <SecretariatSection secretariat={site.secretariat} />
      <CommitteesSection committees={site.committees} />
      <ResolutionsSection committees={site.committees} resolutions={site.resolutions} />
      <ScheduleSection schedule={site.schedule} />
      <DocumentsSection documents={site.documents} />
    </div>
  );
}

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 border-b border-line pb-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-faint">{kicker}</p>
        <h2 className="font-custom text-[24px] tracking-[0.02em] text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Conference                                                         */
/* ------------------------------------------------------------------ */

function ConferenceSection({ conference }: { conference: SiteData["conference"] }) {
  return (
    <Section kicker="Hero" title="Conference">
      <Card className="p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-faint">
          <TBA value={conference.session} />
        </p>
        <h3 className="font-custom mt-1 text-[28px] leading-tight text-ink">
          {conference.name}
        </h3>
        <p className="mt-1 text-sm text-body">{conference.org}</p>
        <p className="font-custom mt-3 text-[20px] italic text-brand">
          {conference.theme}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
          <Field label="Dates"><TBA value={conference.dates} /></Field>
          <Field label="Venue"><TBA value={conference.venue} /></Field>
          <Field label="Email"><TBA value={conference.email} /></Field>
          <Field label="Instagram">
            {conference.instagram === "TBA" ? (
              <TBA value={conference.instagram} />
            ) : (
              `@${conference.instagram}`
            )}
          </Field>
        </dl>
        {conference.aboutLead && (
          <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-body">
            {conference.aboutLead}
          </p>
        )}
      </Card>
    </Section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-faint">{label}</dt>
      <dd className="mt-0.5 text-body">{children}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Secretariat                                                        */
/* ------------------------------------------------------------------ */

function SecretariatSection({ secretariat }: { secretariat: SiteData["secretariat"] }) {
  const { director, executives, departments } = secretariat;
  const memberCount = departments.reduce((n, d) => n + d.members.length, 0);
  return (
    <Section kicker="Roster" title="Secretariat">
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Director-General" value={director ? director.name : "Not set"} />
        <SummaryCard label="Executives" value={String(executives.length)} />
        <SummaryCard
          label="Departments"
          value={`${departments.length} · ${memberCount} members`}
        />
      </div>
      {director && <PersonLine person={director} className="mt-3" />}
      {executives.map((p) => (
        <PersonLine key={p.id} person={p} />
      ))}
    </Section>
  );
}

function PersonLine({ person, className }: { person: Person; className?: string }) {
  return (
    <div className={`flex items-center gap-2 border-b border-line/60 py-1.5 text-sm ${className ?? ""}`}>
      <span className="font-medium text-ink">{person.name}</span>
      <span className="text-faint">·</span>
      <span className="text-body">{person.role || "No role set"}</span>
      {!person.greeting && (
        <span className="ml-auto text-[11px] italic text-faint">no greeting</span>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3">
      <p className="text-[11px] text-faint">{label}</p>
      <p className="font-custom mt-0.5 text-[19px] text-ink">{value}</p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Committees & Topics                                                */
/* ------------------------------------------------------------------ */

function CommitteesSection({ committees }: { committees: CommitteeWithTopics[] }) {
  return (
    <Section kicker="Committees" title="Committees & Topics">
      {committees.length === 0 ? (
        <p className="text-sm text-faint">No committees yet.</p>
      ) : (
        <div className="space-y-3">
          {committees.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <header className="flex items-baseline gap-2 border-b border-line bg-wash/60 px-4 py-2">
                <span className="text-xs font-semibold text-body">{c.code}</span>
                <span className="text-sm text-ink">{c.name}</span>
                {!c.image && (
                  <span className="ml-auto text-[11px] italic text-faint">no background image</span>
                )}
              </header>
              <div className="p-4">
                <p className="text-sm text-body">{c.description || <span className="italic text-faint">No description</span>}</p>
                <ul className="mt-3 space-y-1 text-xs">
                  {c.topics.map((t, i) => (
                    <li key={t.id} className="flex items-center gap-2">
                      <span className="italic text-faint">{ROMAN[i] ?? i + 1}</span>
                      <span className="text-ink"><TBA value={t.title} /></span>
                      <span className="ml-auto text-faint">
                        {t.report ? "report uploaded" : "released in September"}
                      </span>
                    </li>
                  ))}
                  {c.topics.length === 0 && (
                    <li className="italic text-faint">No topics</li>
                  )}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Resolutions                                                        */
/* ------------------------------------------------------------------ */

function ResolutionsSection({
  committees,
  resolutions,
}: {
  committees: CommitteeWithTopics[];
  resolutions: Record<string, Resolution[]>;
}) {
  const all = Object.values(resolutions).flat();
  const counts = all.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const published = counts.published ?? 0;
  const hiddenFromPublic = all.length - published;

  return (
    <Section kicker="Debate" title="Resolutions">
      <div className="grid gap-3 sm:grid-cols-4">
        <SummaryCard label="Total" value={String(all.length)} />
        <SummaryCard label="Published (public)" value={String(published)} />
        <SummaryCard label="Hidden from public" value={String(hiddenFromPublic)} />
        <SummaryCard label="By committee" value={String(committees.length)} />
      </div>
      <p className="mt-3 text-xs text-faint">
        Only resolutions with status &ldquo;Published&rdquo; appear on the public site. Everything
        else is visible here only.
      </p>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Schedule                                                           */
/* ------------------------------------------------------------------ */

function ScheduleSection({ schedule }: { schedule: ScheduleDayWithItems[] }) {
  return (
    <Section kicker="Homepage" title="Schedule">
      {schedule.length === 0 ? (
        <p className="text-sm text-faint">
          No dates yet — the homepage schedule section stays hidden.
        </p>
      ) : (
        <div className="space-y-3">
          {schedule.map((day) => (
            <Card key={day.id} className="p-4">
              <p className="font-custom text-[17px] text-ink">
                {day.day} <span className="text-sm font-normal text-faint">· <TBA value={day.date} /></span>
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                {day.items.map((it) => (
                  <li key={it.id} className="flex gap-3">
                    <span className="w-14 shrink-0 text-faint"><TBA value={it.time} /></span>
                    <span className="text-body">{it.event}</span>
                  </li>
                ))}
                {day.items.length === 0 && (
                  <li className="italic text-faint">No items</li>
                )}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Documents                                                          */
/* ------------------------------------------------------------------ */

function DocumentsSection({ documents }: { documents: SiteDocument[] }) {
  return (
    <Section kicker="Guide" title="Documents">
      {documents.length === 0 ? (
        <p className="text-sm text-faint">No documents yet.</p>
      ) : (
        <Card className="divide-y divide-line">
          {documents.map((d) => (
            <div key={d.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="font-medium text-ink">{d.title}</span>
              {d.blurb && <span className="text-faint">— {d.blurb}</span>}
              <span className="ml-auto text-xs text-faint">
                {d.kind}
                {d.size && ` · ${d.size}`}
              </span>
            </div>
          ))}
        </Card>
      )}
    </Section>
  );
}
