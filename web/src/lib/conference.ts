/**
 * DAEMUN III — single source of truth for conference content.
 *
 * 값을 채우는 곳은 이 파일 하나입니다.
 * "TBA"로 되어 있는 값과 role이 비어 있는 사람들은 실제 정보로 교체하세요.
 */

export const conference = {
  name: "DAEMUN III",
  org: "Daewon Model United Nations",
  theme: "From Vulnerability to Voice",
  session: "Third Session",
  // TODO: 실제 값으로 교체
  dates: "TBA",
  venue: "TBA",
  email: "TBA",
  instagram: "TBA", // 인스타 핸들 (@ 없이)
  instagramUrl: "#",
  address: "TBA",
  firstHeld: "November 2024",
};

export const about = {
  lead: "DAEMUN is a student-led Model United Nations where students explore various issues in the international community and seek practical and implementable solutions.",
  body: "Through discussions and collaboration, DAEMUN provides participants with opportunities to develop critical thinking skills, diplomatic communication abilities, and global leadership. We aim to bring together students from diverse backgrounds and perspectives to discuss global issues in depth, creating meaningful change for a better future based on respect and cooperation.",
  themeLead:
    "“From Vulnerability to Voice” emphasizes the importance of multilateral cooperation in developing isolated vulnerabilities into voices for dialogue, solidarity, and change.",
  themeBody:
    "In this year’s conference, students will be respecting diverse perspectives, representing vulnerable communities, and exploring how even a small voice can result in meaningful transformations in the international community.",
};

export type Person = {
  name: string;
  role: string;
  photo?: string; // /profiles/*.jpg
  greeting?: string; // 짧은 인사말 — 비어 있으면 화면에 표시되지 않음
};

/**
 * TODO: 아래 역할 배정은 전부 임시입니다.
 * 사진과 이름만 실제이고, 누가 어떤 직책인지는 반드시 확인 후 수정하세요.
 */
export const secretariat = {
  director: {
    name: "Mr. Ted",
    role: "Director",
    greeting: "",
  } as Person,

  executives: [
    { name: "Kim Junwon", role: "Secretary-General", photo: "/profiles/kim-junwon.jpg", greeting: "" },
    { name: "Mun Jeongyeon", role: "Deputy Secretary-General", photo: "/profiles/mun-jeongyeon.jpg", greeting: "" },
  ] as Person[],

  departments: [
    {
      name: "Technology",
      blurb: "Website, systems and conference tooling",
      members: [
        { name: "Park Jihun", role: "Head of Technology", photo: "/profiles/park-jihun.jpg", greeting: "" },
        { name: "Lee Junwoo", role: "Deputy of Technology", photo: "/profiles/lee-junwoo.jpg", greeting: "" },
      ] as Person[],
    },
    {
      name: "Media",
      blurb: "Film, photography and publications",
      members: [
        { name: "Yun Heejin", role: "Head of Media", photo: "/profiles/yun-heejin.jpg", greeting: "" },
        { name: "Jo Minji", role: "Deputy of Media", photo: "/profiles/jo-minji.jpg", greeting: "" },
      ] as Person[],
    },
    {
      name: "Administration",
      blurb: "Registration, logistics and delegate support",
      members: [
        { name: "Lee Suhyeon", role: "Head of Administration", photo: "/profiles/lee-suhyeon.jpg", greeting: "" },
        { name: "Choi Boyun", role: "Deputy of Administration", photo: "/profiles/choi-boyun.jpg", greeting: "" },
      ] as Person[],
    },
  ],

  chairs: {
    ecosoc: [
      { name: "Park Hayejin", role: "Head Chair", photo: "/profiles/park-hayejin.jpg", greeting: "" },
      { name: "Heo Yeji", role: "Deputy Chair", photo: "/profiles/heo-yeji.jpg", greeting: "" },
      { name: "An Jaewoo", role: "Deputy Chair", photo: "/profiles/an-jaewoo.jpg", greeting: "" },
      { name: "Kim Minchan", role: "Deputy Chair", photo: "/profiles/kim-minchan-a.jpg", greeting: "" },
    ] as Person[],
    unoosa: [
      { name: "Hyun Jaehee", role: "Head Chair", photo: "/profiles/hyun-jaehee.jpg", greeting: "" },
      { name: "Park Sinhu", role: "Deputy Chair", photo: "/profiles/park-sinhu.jpg", greeting: "" },
      { name: "Lee Seungwoo", role: "Deputy Chair", photo: "/profiles/lee-seungwoo.jpg", greeting: "" },
      { name: "Kim Minchan", role: "Deputy Chair", photo: "/profiles/kim-minchan-b.jpg", greeting: "" },
    ] as Person[],
  },
};

export type Topic = {
  title: string; // "TBA"면 미정으로 표시
  summary: string;
  /** /docs/ 아래 PDF 경로 — null이면 "available September" 배지 */
  report: string | null;
};

export type Committee = {
  slug: string;
  code: string;
  name: string;
  description: string;
  /** 소개 섹션 배경 사진 (/committees/*.jpg) — 없으면 네이비 단색 */
  image?: string;
  sourceNote?: { label: string; url: string };
  topics: Topic[];
};

export const committees: Committee[] = [
  {
    slug: "ecosoc",
    code: "ECOSOC",
    name: "Economic and Social Council",
    image: "/committees/ecosoc.jpg",
    description:
      "The principal body for coordination, policy review, policy dialogue and recommendations on economic, social and environmental issues.",
    sourceNote: { label: "ecosoc.un.org/en/about-us", url: "https://ecosoc.un.org/en/about-us" },
    topics: [
      { title: "TBA", summary: "", report: null },
      { title: "TBA", summary: "", report: null },
      { title: "TBA", summary: "", report: null },
      { title: "TBA", summary: "", report: null },
    ],
  },
  {
    slug: "unoosa",
    code: "UNOOSA",
    name: "United Nations Office for Outer Space Affairs",
    image: "/committees/unoosa.jpg",
    description:
      "Promotes international cooperation in the peaceful use and exploration of space, and the use of space science and technology for sustainable development.",
    sourceNote: { label: "unoosa.org/oosa/en/aboutus", url: "https://www.unoosa.org/oosa/en/aboutus/index.html" },
    topics: [
      { title: "TBA", summary: "", report: null },
      { title: "TBA", summary: "", report: null },
      { title: "TBA", summary: "", report: null },
      { title: "TBA", summary: "", report: null },
    ],
  },
];

export type ResolutionStatus = "approved" | "review" | "awaiting";

export type ResolutionEntry = {
  topicIndex: number; // committees[].topics 인덱스
  label: string; // 예: "Draft resolution 1.1"
  submitter: string; // 주 제출국
  status: ResolutionStatus;
  /** 승인된 경우 PDF 경로 */
  document: string | null;
};

/** 회의 중에 실시간으로 채워지는 부분 — 지금은 비어 있음 */
export const resolutions: Record<string, ResolutionEntry[]> = {
  ecosoc: [],
  unoosa: [],
};

export type ScheduleItem = { time: string; event: string };

export const schedule: { day: string; date: string; items: ScheduleItem[] }[] = [
  {
    day: "Day One",
    date: "TBA",
    items: [
      { time: "TBA", event: "Registration & Opening Ceremony" },
      { time: "TBA", event: "Committee Session I" },
      { time: "TBA", event: "Committee Session II" },
    ],
  },
  {
    day: "Day Two",
    date: "TBA",
    items: [
      { time: "TBA", event: "Committee Session III" },
      { time: "TBA", event: "Resolution Debate & Voting" },
      { time: "TBA", event: "Closing Ceremony & Awards" },
    ],
  },
];

export const documents = [
  {
    title: "Preambulatory & Operative Clauses",
    blurb: "The full vocabulary list for writing resolutions",
    file: "/docs/daemun-iii-clauses.pdf",
    kind: "PDF",
    size: "465 KB",
  },
  {
    title: "Rules of Procedure for Delegates",
    blurb: "The full ROP as used at DAEMUN III",
    file: "/docs/daemun-iii-rop.docx",
    kind: "DOC",
    size: "148 KB",
  },
  {
    title: "Resolution Template",
    blurb: "The blank format to write your own resolution in",
    file: "/docs/daemun-iii-resolution-template.docx",
    kind: "DOC",
    size: "150 KB",
  },
  {
    title: "Resolution Example",
    blurb: "A complete worked resolution to model yours on",
    file: "/docs/daemun-iii-resolution-example.docx",
    kind: "DOC",
    size: "2.8 MB",
  },
  {
    title: "Resolution Example 2",
    blurb: "A second worked example from a different committee",
    file: "/docs/daemun-iii-resolution-example-2.docx",
    kind: "DOC",
    size: "3.4 MB",
  },
  {
    title: "Introduction Speech Template",
    blurb: "A structure for your opening speech on the speakers’ list",
    file: "/docs/daemun-iii-speech-template.docx",
    kind: "DOC",
    size: "142 KB",
  },
];
