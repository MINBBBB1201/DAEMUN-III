import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

const str = z.string().trim();
const optStr = str.nullable().optional();
const sortOrder = z.number().int().min(0).optional();

/* ------------------------------------------------------------------ */
/*  Conference (singleton)                                             */
/* ------------------------------------------------------------------ */

export const conferenceSchema = z.object({
  name: str.min(1),
  org: str.min(1),
  theme: str,
  session: str,
  dates: str,
  venue: str,
  email: str,
  instagram: str,
  instagramUrl: str,
  address: str,
  firstHeld: str,
  aboutLead: str,
  aboutBody: str,
  themeLead: str,
  themeBody: str,
});
export type Conference = z.infer<typeof conferenceSchema>;
export const conferenceUpdateSchema = conferenceSchema.partial();

/* ------------------------------------------------------------------ */
/*  Secretariat                                                        */
/* ------------------------------------------------------------------ */

export const personSectionSchema = z.enum([
  "director",
  "executive",
  "department",
  "chair",
]);
export type PersonSection = z.infer<typeof personSectionSchema>;

export const personSchema = z.object({
  id: str,
  name: str.min(1),
  role: str,
  photo: str.nullable(),
  greeting: str.nullable(),
  section: personSectionSchema,
  departmentId: str.nullable(),
  committeeId: str.nullable(),
  sortOrder: z.number().int(),
});
export type Person = z.infer<typeof personSchema>;

export const personCreateSchema = z.object({
  name: str.min(1),
  role: str.default(""),
  photo: optStr,
  greeting: optStr,
  section: personSectionSchema,
  departmentId: optStr,
  committeeId: optStr,
  sortOrder,
});
export const personUpdateSchema = personCreateSchema.partial();

export const departmentSchema = z.object({
  id: str,
  name: str.min(1),
  blurb: str,
  sortOrder: z.number().int(),
});
export type Department = z.infer<typeof departmentSchema>;
export const departmentCreateSchema = z.object({
  name: str.min(1),
  blurb: str.default(""),
  sortOrder,
});
export const departmentUpdateSchema = departmentCreateSchema.partial();

/* ------------------------------------------------------------------ */
/*  Committees & topics                                                */
/* ------------------------------------------------------------------ */

export const topicSchema = z.object({
  id: str,
  committeeId: str,
  title: str,
  summary: str,
  /** PDF path — null renders "available September" */
  report: str.nullable(),
  sortOrder: z.number().int(),
});
export type Topic = z.infer<typeof topicSchema>;
export const topicCreateSchema = z.object({
  committeeId: str,
  title: str.default("TBA"),
  summary: str.default(""),
  report: optStr,
  sortOrder,
});
export const topicUpdateSchema = topicCreateSchema.partial();

export const committeeSchema = z.object({
  id: str,
  slug: str.min(1).regex(/^[a-z0-9-]+$/, "lowercase letters, digits, dashes"),
  code: str.min(1),
  name: str.min(1),
  description: str,
  image: str.nullable(),
  sourceLabel: str.nullable(),
  sourceUrl: str.nullable(),
  sortOrder: z.number().int(),
});
export type Committee = z.infer<typeof committeeSchema>;
export const committeeCreateSchema = committeeSchema
  .omit({ id: true, sortOrder: true })
  .extend({
    image: optStr,
    sourceLabel: optStr,
    sourceUrl: optStr,
    description: str.default(""),
    sortOrder,
  });
export const committeeUpdateSchema = committeeCreateSchema.partial();

export type CommitteeWithTopics = Committee & { topics: Topic[] };

/* ------------------------------------------------------------------ */
/*  Resolutions                                                        */
/* ------------------------------------------------------------------ */

export const resolutionStatusSchema = z.enum(["approved", "review", "awaiting"]);
export type ResolutionStatus = z.infer<typeof resolutionStatusSchema>;

export const resolutionSchema = z.object({
  id: str,
  committeeId: str,
  topicId: str,
  label: str,
  submitter: str,
  status: resolutionStatusSchema,
  document: str.nullable(),
  sortOrder: z.number().int(),
  updatedAt: z.string(),
});
export type Resolution = z.infer<typeof resolutionSchema>;
export const resolutionCreateSchema = z.object({
  committeeId: str,
  topicId: str,
  label: str.default(""),
  submitter: str.default(""),
  status: resolutionStatusSchema.default("awaiting"),
  document: optStr,
  sortOrder,
});
export const resolutionUpdateSchema = resolutionCreateSchema.partial();

/* ------------------------------------------------------------------ */
/*  Schedule                                                           */
/* ------------------------------------------------------------------ */

export const scheduleItemSchema = z.object({
  id: str,
  dayId: str,
  time: str,
  event: str,
  sortOrder: z.number().int(),
});
export type ScheduleItem = z.infer<typeof scheduleItemSchema>;
export const scheduleItemCreateSchema = z.object({
  dayId: str,
  time: str.default("TBA"),
  event: str.min(1),
  sortOrder,
});
export const scheduleItemUpdateSchema = scheduleItemCreateSchema.partial();

export const scheduleDaySchema = z.object({
  id: str,
  day: str,
  date: str,
  sortOrder: z.number().int(),
});
export type ScheduleDay = z.infer<typeof scheduleDaySchema>;
export const scheduleDayCreateSchema = z.object({
  day: str.min(1),
  date: str.default("TBA"),
  sortOrder,
});
export const scheduleDayUpdateSchema = scheduleDayCreateSchema.partial();

export type ScheduleDayWithItems = ScheduleDay & { items: ScheduleItem[] };

/* ------------------------------------------------------------------ */
/*  Documents                                                          */
/* ------------------------------------------------------------------ */

export const documentSchema = z.object({
  id: str,
  title: str,
  blurb: str,
  file: str,
  kind: str,
  size: str,
  sortOrder: z.number().int(),
});
export type SiteDocument = z.infer<typeof documentSchema>;
export const documentCreateSchema = z.object({
  title: str.min(1),
  blurb: str.default(""),
  file: str.min(1),
  kind: str.default("PDF"),
  size: str.default(""),
  sortOrder,
});
export const documentUpdateSchema = documentCreateSchema.partial();

/* ------------------------------------------------------------------ */
/*  Reorder                                                            */
/* ------------------------------------------------------------------ */

export const reorderSchema = z.object({ ids: z.array(str).min(1) });

/* ------------------------------------------------------------------ */
/*  Aggregate payload served to the public site                        */
/* ------------------------------------------------------------------ */

export type Secretariat = {
  director: Person | null;
  executives: Person[];
  departments: (Department & { members: Person[] })[];
  /** committee slug → chairs (head chair first) */
  chairs: Record<string, Person[]>;
};

export type SiteData = {
  conference: Conference;
  secretariat: Secretariat;
  committees: CommitteeWithTopics[];
  /** committee slug → resolutions */
  resolutions: Record<string, Resolution[]>;
  schedule: ScheduleDayWithItems[];
  documents: SiteDocument[];
};
