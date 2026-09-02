import type { Person, SiteData } from "./schemas";

/**
 * DAEMUN III — default conference content.
 *
 * Two jobs:
 *  1. `packages/db` seeds an empty database from this object (ids are kept).
 *  2. `apps/web` falls back to it if the API is unreachable, so the public
 *     site never goes blank.
 *
 * Once the database is seeded, edit content in the admin panel — not here.
 */

const p = (
  id: string,
  name: string,
  role: string,
  section: Person["section"],
  extra: Partial<Person> = {},
): Person => ({
  id,
  name,
  role,
  photo: null,
  greeting: null,
  section,
  departmentId: null,
  committeeId: null,
  sortOrder: 0,
  ...extra,
});

const director = p("director", "Mr. Ted", "Director", "director");

const executives: Person[] = [
  p("kim-junwon", "Kim Junwon", "Secretary-General", "executive", {
    photo: "/profiles/kim-junwon.jpg",
    sortOrder: 0,
  }),
  p("mun-jeongyeon", "Mun Jeongyeon", "Deputy Secretary-General", "executive", {
    photo: "/profiles/mun-jeongyeon.jpg",
    sortOrder: 1,
  }),
];

const departments: SiteData["secretariat"]["departments"] = [
  {
    id: "technology",
    name: "Technology",
    blurb: "Website, systems and conference tooling",
    sortOrder: 0,
    members: [
      p("park-jihun", "Park Jihun", "Head of Technology", "department", {
        photo: "/profiles/park-jihun.jpg",
        departmentId: "technology",
        sortOrder: 0,
      }),
      p("lee-junwoo", "Lee Junwoo", "Deputy of Technology", "department", {
        photo: "/profiles/lee-junwoo.jpg",
        departmentId: "technology",
        sortOrder: 1,
      }),
    ],
  },
  {
    id: "media",
    name: "Media",
    blurb: "Film, photography and publications",
    sortOrder: 1,
    members: [
      p("yun-heejin", "Yun Heejin", "Head of Media", "department", {
        photo: "/profiles/yun-heejin.jpg",
        departmentId: "media",
        sortOrder: 0,
      }),
      p("jo-minji", "Jo Minji", "Deputy of Media", "department", {
        photo: "/profiles/jo-minji.jpg",
        departmentId: "media",
        sortOrder: 1,
      }),
    ],
  },
  {
    id: "administration",
    name: "Administration",
    blurb: "Registration, logistics and delegate support",
    sortOrder: 2,
    members: [
      p("lee-suhyeon", "Lee Suhyeon", "Head of Administration", "department", {
        photo: "/profiles/lee-suhyeon.jpg",
        departmentId: "administration",
        sortOrder: 0,
      }),
      p("choi-boyun", "Choi Boyun", "Deputy of Administration", "department", {
        photo: "/profiles/choi-boyun.jpg",
        departmentId: "administration",
        sortOrder: 1,
      }),
    ],
  },
];

const chairs: Record<string, Person[]> = {
  ecosoc: [
    p("park-hayejin", "Park Hayejin", "Head Chair", "chair", {
      photo: "/profiles/park-hayejin.jpg",
      committeeId: "ecosoc",
      sortOrder: 0,
    }),
    p("heo-yeji", "Heo Yeji", "Deputy Chair", "chair", {
      photo: "/profiles/heo-yeji.jpg",
      committeeId: "ecosoc",
      sortOrder: 1,
    }),
    p("an-jaewoo", "An Jaewoo", "Deputy Chair", "chair", {
      photo: "/profiles/an-jaewoo.jpg",
      committeeId: "ecosoc",
      sortOrder: 2,
    }),
    p("kim-minchan-a", "Kim Minchan", "Deputy Chair", "chair", {
      photo: "/profiles/kim-minchan-a.jpg",
      committeeId: "ecosoc",
      sortOrder: 3,
    }),
  ],
  unoosa: [
    p("hyun-jaehee", "Hyun Jaehee", "Head Chair", "chair", {
      photo: "/profiles/hyun-jaehee.jpg",
      committeeId: "unoosa",
      sortOrder: 0,
    }),
    p("park-sinhu", "Park Sinhu", "Deputy Chair", "chair", {
      photo: "/profiles/park-sinhu.jpg",
      committeeId: "unoosa",
      sortOrder: 1,
    }),
    p("lee-seungwoo", "Lee Seungwoo", "Deputy Chair", "chair", {
      photo: "/profiles/lee-seungwoo.jpg",
      committeeId: "unoosa",
      sortOrder: 2,
    }),
    p("kim-minchan-b", "Kim Minchan", "Deputy Chair", "chair", {
      photo: "/profiles/kim-minchan-b.jpg",
      committeeId: "unoosa",
      sortOrder: 3,
    }),
  ],
};

const tbaTopics = (committeeId: string) =>
  [0, 1, 2, 3].map((i) => ({
    id: `${committeeId}-topic-${i + 1}`,
    committeeId,
    title: "TBA",
    summary: "",
    report: null,
    sortOrder: i,
  }));

export const defaultSite: SiteData = {
  conference: {
    name: "DAEMUN III",
    org: "Daewon Model United Nations",
    theme: "From Vulnerability to Voice",
    session: "Third Session",
    dates: "TBA",
    venue: "TBA",
    email: "TBA",
    instagram: "TBA",
    instagramUrl: "#",
    address: "TBA",
    firstHeld: "November 2024",
    aboutLead:
      "DAEMUN is a student-led Model United Nations where students explore various issues in the international community and seek practical and implementable solutions.",
    aboutBody:
      "Through discussions and collaboration, DAEMUN provides participants with opportunities to develop critical thinking skills, diplomatic communication abilities, and global leadership. We aim to bring together students from diverse backgrounds and perspectives to discuss global issues in depth, creating meaningful change for a better future based on respect and cooperation.",
    themeLead:
      "“From Vulnerability to Voice” emphasizes the importance of multilateral cooperation in developing isolated vulnerabilities into voices for dialogue, solidarity, and change.",
    themeBody:
      "In this year’s conference, students will be respecting diverse perspectives, representing vulnerable communities, and exploring how even a small voice can result in meaningful transformations in the international community.",
  },

  secretariat: { director, executives, departments, chairs },

  committees: [
    {
      id: "ecosoc",
      slug: "ecosoc",
      code: "ECOSOC",
      name: "Economic and Social Council",
      image: "/committees/ecosoc.jpg",
      description:
        "The principal body for coordination, policy review, policy dialogue and recommendations on economic, social and environmental issues.",
      sourceLabel: "ecosoc.un.org/en/about-us",
      sourceUrl: "https://ecosoc.un.org/en/about-us",
      sortOrder: 0,
      topics: tbaTopics("ecosoc"),
    },
    {
      id: "unoosa",
      slug: "unoosa",
      code: "UNOOSA",
      name: "United Nations Office for Outer Space Affairs",
      image: "/committees/unoosa.jpg",
      description:
        "Promotes international cooperation in the peaceful use and exploration of space, and the use of space science and technology for sustainable development.",
      sourceLabel: "unoosa.org/oosa/en/aboutus",
      sourceUrl: "https://www.unoosa.org/oosa/en/aboutus/index.html",
      sortOrder: 1,
      topics: tbaTopics("unoosa"),
    },
  ],

  resolutions: { ecosoc: [], unoosa: [] },

  schedule: [
    {
      id: "day-1",
      day: "Day One",
      date: "TBA",
      sortOrder: 0,
      items: [
        { id: "day-1-1", dayId: "day-1", time: "TBA", event: "Registration & Opening Ceremony", sortOrder: 0 },
        { id: "day-1-2", dayId: "day-1", time: "TBA", event: "Committee Session I", sortOrder: 1 },
        { id: "day-1-3", dayId: "day-1", time: "TBA", event: "Committee Session II", sortOrder: 2 },
      ],
    },
    {
      id: "day-2",
      day: "Day Two",
      date: "TBA",
      sortOrder: 1,
      items: [
        { id: "day-2-1", dayId: "day-2", time: "TBA", event: "Committee Session III", sortOrder: 0 },
        { id: "day-2-2", dayId: "day-2", time: "TBA", event: "Resolution Debate & Voting", sortOrder: 1 },
        { id: "day-2-3", dayId: "day-2", time: "TBA", event: "Closing Ceremony & Awards", sortOrder: 2 },
      ],
    },
  ],

  documents: [
    {
      id: "clauses",
      title: "Preambulatory & Operative Clauses",
      blurb: "The full vocabulary list for writing resolutions",
      file: "/docs/daemun-iii-clauses.pdf",
      kind: "PDF",
      size: "465 KB",
      sortOrder: 0,
    },
    {
      id: "rop",
      title: "Rules of Procedure for Delegates",
      blurb: "The full ROP as used at DAEMUN III",
      file: "/docs/daemun-iii-rop.docx",
      kind: "DOC",
      size: "148 KB",
      sortOrder: 1,
    },
    {
      id: "resolution-template",
      title: "Resolution Template",
      blurb: "The blank format to write your own resolution in",
      file: "/docs/daemun-iii-resolution-template.docx",
      kind: "DOC",
      size: "150 KB",
      sortOrder: 2,
    },
    {
      id: "resolution-example",
      title: "Resolution Example",
      blurb: "A complete worked resolution to model yours on",
      file: "/docs/daemun-iii-resolution-example.docx",
      kind: "DOC",
      size: "2.8 MB",
      sortOrder: 3,
    },
    {
      id: "resolution-example-2",
      title: "Resolution Example 2",
      blurb: "A second worked example from a different committee",
      file: "/docs/daemun-iii-resolution-example-2.docx",
      kind: "DOC",
      size: "3.4 MB",
      sortOrder: 4,
    },
    {
      id: "speech-template",
      title: "Introduction Speech Template",
      blurb: "A structure for your opening speech on the speakers’ list",
      file: "/docs/daemun-iii-speech-template.docx",
      kind: "DOC",
      size: "142 KB",
      sortOrder: 5,
    },
  ],
};
