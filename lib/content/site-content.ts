import type { DomainCode } from './domains';

// ─── News ──────────────────────────────────────────────────────────────────

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  date: string;
  author: string;
  featured: boolean;
  tags: string[];
  photo?: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: 'yuva-tourism-kondaveedu-trek-2026',
    title: 'Yuva Tourism Adventure Club Organises Outreach Trek to Kondaveedu Fort',
    excerpt:
      'The Yuva Tourism Adventure Club led students on a trekking expedition to the historic Kondaveedu Fort — an experiential journey built around adventure, teamwork, and discovery.',
    body: 'The Yuva Tourism Adventure Club, under KL SAC, successfully organised an outreach trekking expedition to the historic Kondaveedu Fort — one of the most significant medieval fortresses in Andhra Pradesh.\n\nThe initiative was designed to push students beyond the boundaries of the classroom and into an environment that demanded endurance, collaboration, and curiosity. Participants navigated the terrain of the fort together, discovering its layered history while experiencing the physical and mental challenge of the trek.\n\nThe expedition was more than an adventure — it was a structured exercise in teamwork. Students supported one another through difficult stretches, made collective decisions on the trail, and built bonds that extended well beyond the activity itself.\n\nFor many participants, it was their first experience of trekking and historical exploration combined. The initiative created a memorable and meaningful experience — one that reinforced the value of stepping out of comfort zones and engaging with the world directly.\n\nThe Yuva Tourism Adventure Club continues to plan similar experiences that blend adventure, cultural learning, and personal development for students across KL University.',
    category: 'Event',
    date: '2026-08-10',
    author: 'KL SAC Communications',
    featured: true,
    tags: ['Yuva Tourism', 'Trekking', 'Kondaveedu Fort', 'Adventure', 'HWB'],
    photo: '/news/yuva-tourism-kondaveedu-trek.jpg',
  },
  {
    slug: 'arts-club-first-activity-2026',
    title: 'Arts Club Conducts Its First Activity, Marking the Beginning of a Creative Journey',
    excerpt:
      'The Arts Club under KL SAC held its first activity, giving students a platform to express creativity, showcase artistic abilities, and connect with fellow artists on campus.',
    body: 'The Arts Club, operating under the Liberal Arts, Cultural & Hobby (LCH) domain of KL SAC, successfully conducted its first activity — a milestone that marks the beginning of a dedicated creative community within KL University.\n\nThe activity brought together students from across disciplines who share a passion for art in its many forms. Participants were given the space and the encouragement to express themselves freely — through drawing, painting, and other visual art forms — creating an atmosphere of creativity and mutual appreciation.\n\nFor many students, the activity served as an introduction to the broader SAC creative ecosystem. It offered an early glimpse of what consistent participation in the Arts Club can lead to: skill development, peer learning, public showcases, and a community of like-minded individuals.\n\nThe Arts Club intends to build on this foundation with regular sessions, theme-based workshops, collaborative projects, and participation in inter-college competitions. The club is open to students at all levels — from beginners exploring art for the first time to those with established skills looking to deepen their practice.\n\nThis first activity signals the start of a creative journey that the Arts Club and KL SAC are committed to sustaining throughout the academic year.',
    category: 'Event',
    date: '2026-08-05',
    author: 'KL SAC Communications',
    featured: false,
    tags: ['Arts Club', 'LCH', 'Creativity', 'First Activity'],
    photo: '/news/arts-club-first-activity.jpg',
  },
  {
    slug: 'webapps-club-first-activity-2026',
    title: 'Web Apps Club Conducts Its First Activity, Launching a Journey in Technology and Innovation',
    excerpt:
      'The Web Apps Club held its inaugural activity under KL SAC, offering students a hands-on introduction to web technologies, collaborative learning, and the practical side of software development.',
    body: 'The Web Apps Club, part of the Technology (TEC) domain under KL SAC, successfully conducted its first activity — launching what promises to be an impactful journey in web development and technology innovation for students at KL University.\n\nThe activity brought together students with an interest in web technologies, from those just beginning to explore development to those already building projects on their own. The session created space for idea exchange, technical discussion, and the kind of collaborative learning that accelerates real skill growth.\n\nParticipants engaged with core concepts of web development, explored the range of technologies available in the modern stack, and began to connect with peers who share the same technical drive. The environment was hands-on and collaborative — built around doing, not just listening.\n\nThe Web Apps Club plans to continue with regular sessions focused on practical development — building and deploying real projects, participating in hackathons, engaging with industry tools, and contributing to open-source initiatives. The club is structured to support students at every stage of their technical journey.\n\nThis inaugural activity marks the beginning of a community at KL University where students can grow as developers, collaborate on meaningful work, and continuously push the boundaries of what they can build.',
    category: 'Event',
    date: '2026-08-03',
    author: 'KL SAC Communications',
    featured: false,
    tags: ['Web Apps Club', 'TEC', 'Technology', 'Web Development', 'First Activity'],
    photo: '/news/webapps-club-first-activity.jpg',
  },
];

export function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((n) => n.slug === slug);
}

export const NEWS_SLUGS = NEWS_ARTICLES.map((n) => n.slug);

// ─── Student Stories ────────────────────────────────────────────────────────

export interface StudentStory {
  slug: string;
  title: string;
  studentName: string;
  studentYear: string;
  clubName: string;
  domainCode: DomainCode;
  excerpt: string;
  body: string;
  tags: string[];
  photo?: string;
}

export const STUDENT_STORIES: StudentStory[] = [
  {
    slug: 'esports-national-finals-2025',
    title: 'From Campus to the National Stage: KL eSports Claims BGMI National Finals Spot',
    studentName: 'KL eSports Team',
    studentYear: 'B.Tech, Multiple Years',
    clubName: 'KL eSports Club',
    domainCode: 'LCH',
    excerpt:
      'We had one goal — to take KL University to the national stage. Winning the regional round of the University eSports Championship in BGMI and earning the chance to represent Andhra Pradesh in Kolkata made every late-night practice session worth it.',
    body:
      'The KL eSports Team advanced to the National Finals of the University eSports Championship, earning the opportunity to represent Andhra Pradesh at the national level in BGMI (Battlegrounds Mobile India).\n\nAhead of the finals in Kolkata, the team met with the Pro Vice Chancellor, alongside the Director of the Student Activity Center and the President of the KL Student Council, to share this achievement and receive their best wishes for the national championship.\n\nThe continued encouragement and support from university leadership, along with the constant guidance of the Student Activity Center, have been instrumental in enabling our students to pursue competitive excellence at the national level.\n\nFrom KL to the National Stage.',
    photo: '/success-stories/esports-national-2025.jpg',
    tags: ['KL eSports Club', 'BGMI', 'National Finals', 'eSports', 'LCH', 'Andhra Pradesh'],
  },
  {
    slug: 'pavan-karthik-motorola-solutions',
    title: 'From Student Leadership to Software Engineering: Pavan Karthik Begins Journey at Motorola Solutions',
    studentName: 'Pavan Karthik Mandadapu',
    studentYear: 'B.Tech CSE (Alumni)',
    clubName: 'Student Council',
    domainCode: 'IIE',
    excerpt:
      'Leading 15,000+ students and 42+ clubs taught me more about technology, collaboration, and accountability than any classroom ever could. Motorola Solutions was not just a placement — it was the proof that student leadership shapes real careers.',
    body:
      'Pavan Karthik Mandadapu, former President of the KL Student Activity Center, began his professional journey as a Software Engineer at Motorola Solutions.\n\nThis milestone marks more than the beginning of a professional career. It reflects years of learning, leadership, resilience, and meaningful experiences gained through academic and student leadership responsibilities at KL University.\n\nDuring his tenure as Student Council President, Pavan Karthik had the opportunity to represent more than 15,000 students, work alongside 42+ student clubs, and lead and coordinate numerous student initiatives. These experiences provided valuable exposure to leadership, strategic planning, teamwork, stakeholder coordination, and student service.\n\nHis tenure at the Student Activity Center was a transformative chapter in his personal and professional development. Working with students, faculty, councils, and student organisations enabled him to develop a strong perspective on leadership, collaboration, accountability, and service — lessons he now carries forward into the corporate environment.\n\nPavan Karthik expressed his sincere gratitude to Sai Vijay Pisini, Director of the Student Activity Center, for his constant guidance and unwavering belief throughout his leadership journey.\n\nOne Journey. Many Lessons. A New Beginning.',
    photo: '/success-stories/pavan-karthik-motorola.jpg',
    tags: ['Student Council', 'Alumni', 'Motorola Solutions', 'Software Engineering', 'IIE', 'Placement'],
  },
  {
    slug: 'sayani-datta-motorola-solutions',
    title: 'President by Day, Engineer by Ambition: Sayani Datta Joins Motorola Solutions',
    studentName: 'Sayani Datta',
    studentYear: 'B.Tech CSE, 4th Year',
    clubName: 'Student Council',
    domainCode: 'IIE',
    excerpt:
      'I lead the Student Activity Center, train as a professional badminton player, and am now a Software Engineering Intern at Motorola Solutions. None of these happened in spite of each other — they happened because of each other.',
    body:
      'Sayani Datta, current President of the KL Student Activity Center and a professional badminton player, began her professional journey as a Software Engineering Intern at Motorola Solutions.\n\nA curious and innovation-driven technology enthusiast, Sayani has demonstrated a strong interest in cloud infrastructure and software engineering while simultaneously taking on significant leadership responsibilities within the university.\n\nAs President of the KL Student Activity Center, Sayani plays an important role in student leadership, coordination, administration, and the planning and execution of student activities across the university. Her role involves working with student councils, clubs, student leaders, and various stakeholders to strengthen student engagement and create meaningful opportunities for the university community.\n\nBeyond academics and leadership, Sayani has also distinguished herself as a professional badminton player, demonstrating the discipline, competitive spirit, and consistency required to excel both on and off the field.\n\nHer selection as a Software Engineering Intern at Motorola Solutions reflects her ability to balance technology, leadership, and extracurricular excellence.\n\nFrom leading student initiatives to building the future of technology — a new chapter begins.',
    photo: '/success-stories/sayani-datta-motorola.jpg',
    tags: ['Student Council', 'Motorola Solutions', 'Software Engineering', 'Badminton', 'IIE', 'Placement'],
  },
  {
    slug: 'journey-of-a-coder',
    title: 'From Curious Fresher to National Finalist: A Coder\'s Journey',
    studentName: '[PLACEHOLDER — Student Name Required]',
    studentYear: 'B.Tech CSE, Year 3',
    clubName: 'ZeroOne Code Club',
    domainCode: 'TEC',
    excerpt:
      'When I joined KL University, I barely knew how to write a basic function. Two years, hundreds of problems, and one national hackathon later, everything had changed.',
    body: '[PLACEHOLDER — Official student story required. Please work with the student and SAC Communications to produce verified, consented content.]',
    tags: ['ZeroOne', 'Competitive Programming', 'Hackathon', 'TEC'],
  },
  {
    slug: 'dance-changed-my-university-years',
    title: 'How the Dance Club Gave Me Confidence I Never Knew I Had',
    studentName: '[PLACEHOLDER — Student Name Required]',
    studentYear: 'B.Tech ECE, Year 2',
    clubName: 'Dance Club',
    domainCode: 'LCH',
    excerpt:
      'I had never performed on a stage before university. The Dance Club didn\'t just teach me Bharatanatyam — it taught me that I was capable of something beautiful.',
    body: '[PLACEHOLDER — Official student story required. Please work with the student and SAC Communications to produce verified, consented content.]',
    tags: ['Dance Club', 'Bharatanatyam', 'Performance', 'LCH'],
  },
  {
    slug: 'marathon-more-than-running',
    title: 'The Marathon Club Taught Me That Limits Are Mostly in Your Head',
    studentName: '[PLACEHOLDER — Student Name Required]',
    studentYear: 'B.Tech Mech, Year 4',
    clubName: 'Marathon Club',
    domainCode: 'HWB',
    excerpt:
      'I joined the Marathon Club thinking I\'d get fitter. I didn\'t expect it to change how I approach every challenge in my life — academic, professional, and personal.',
    body: '[PLACEHOLDER — Official student story required. Please work with the student and SAC Communications to produce verified, consented content.]',
    tags: ['Marathon Club', 'Running', 'Wellness', 'HWB'],
  },
  {
    slug: 'svr-service-changed-perspective',
    title: 'Three Days in the Village Changed How I See My Education',
    studentName: '[PLACEHOLDER — Student Name Required]',
    studentYear: 'B.Tech IT, Year 3',
    clubName: 'SVR Club',
    domainCode: 'ESO',
    excerpt:
      'The SVR outreach programme was three days of discomfort, hard work, and genuine human connection. I came back to campus and couldn\'t look at my studies the same way again.',
    body: '[PLACEHOLDER — Official student story required. Please work with the student and SAC Communications to produce verified, consented content.]',
    tags: ['SVR Club', 'Outreach', 'Community', 'ESO'],
  },
  {
    slug: 'acic-startup-journey',
    title: 'We Started as Freshers with an Idea. ACIC Helped Us Build a Company.',
    studentName: '[PLACEHOLDER — Student Name Required]',
    studentYear: 'B.Tech CSE, Year 4',
    clubName: 'ACIC',
    domainCode: 'IIE',
    excerpt:
      'When we walked into ACIC with a half-formed idea and no business plan, we didn\'t know what we were getting into. A year later, we had a prototype, a pitch deck, and our first customers.',
    body: '[PLACEHOLDER — Official student story required. Please work with the student and SAC Communications to produce verified, consented content.]',
    tags: ['ACIC', 'Entrepreneurship', 'Startup', 'IIE'],
  },
];

export function getStoryBySlug(slug: string): StudentStory | undefined {
  return STUDENT_STORIES.find((s) => s.slug === slug);
}

export const STORY_SLUGS = STUDENT_STORIES.map((s) => s.slug);

// ─── Achievements ────────────────────────────────────────────────────────────

export type AchievementLevel = 'International' | 'National' | 'State' | 'University';

export interface Achievement {
  id: string;
  level: AchievementLevel;
  title: string;
  clubName: string;
  domainCode: DomainCode;
  organization: string;
  year: string;
  description: string;
  photo?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-esports-national-2025',
    level: 'National',
    title: 'BGMI National Finals Qualification — University eSports Championship 2025',
    clubName: 'KL eSports Club',
    domainCode: 'LCH',
    organization: 'University eSports Championship (presented by SRM, Infinitue & Zowie)',
    year: '2025',
    description:
      'The KL eSports Team won the regional round of the University eSports Championship 2025 in BGMI (Battlegrounds Mobile India), earning the right to represent Andhra Pradesh at the National Finals in Kolkata. Before departing, the team was felicitated by the Pro Vice Chancellor alongside the SAC Director and Student Council President.',
    photo: '/success-stories/esports-national-2025.jpg',
  },
  {
    id: 'ach-pavan-motorola-2025',
    level: 'University',
    title: 'Former SAC President Placed as Software Engineer at Motorola Solutions',
    clubName: 'Student Council',
    domainCode: 'IIE',
    organization: 'Motorola Solutions',
    year: '2025',
    description:
      'Pavan Karthik Mandadapu, former President of the KL Student Activity Center, began his professional career as a Software Engineer at Motorola Solutions. During his tenure he represented over 15,000 students across 42+ clubs. His leadership experience at SAC — spanning strategic planning, stakeholder coordination, and student governance — proved instrumental in his transition into the corporate world.',
    photo: '/success-stories/pavan-karthik-motorola.jpg',
  },
  {
    id: 'ach-sayani-motorola-2026',
    level: 'University',
    title: 'Sitting SAC President Selected as Software Engineering Intern at Motorola Solutions',
    clubName: 'Student Council',
    domainCode: 'IIE',
    organization: 'Motorola Solutions',
    year: '2026',
    description:
      'Sayani Datta, current President of the KL Student Activity Center (Internships & Career Development) and professional badminton player, was selected as a Software Engineering Intern at Motorola Solutions. Her achievement demonstrates that student leadership, technical ambition, and extracurricular discipline can work in concert to open significant professional opportunities.',
    photo: '/success-stories/sayani-datta-motorola.jpg',
  },
];

// ─── Publications ────────────────────────────────────────────────────────────

export type PublicationType = 'Annual Report' | 'Magazine' | 'Research' | 'Newsletter';

export interface Publication {
  id: string;
  title: string;
  type: PublicationType;
  year: string;
  description: string;
  pages: number | null;
  downloadAvailable: boolean;
  url?: string;
}

export const PUBLICATIONS: Publication[] = [
  {
    id: 'pub-aug-story',
    title: 'The August Story — Volume 1',
    type: 'Magazine',
    year: '2026',
    description:
      'A curated collection of stories, achievements, and highlights from KL SAC activities during August 2026. Covering cultural events, student milestones, and community initiatives across all five domains.',
    pages: null,
    downloadAvailable: true,
    url: '/publications/independence-day-2026.pdf',
  },
  {
    id: 'pub-independence-day',
    title: 'Independence Day 2026 — Event Report',
    type: 'Newsletter',
    year: '2026',
    description:
      'Official documentation of the Independence Day 2026 celebrations at KL University, organised by KL SAC. Includes event proceedings, participation records, and highlights from the flag-hoisting ceremony and cultural programmes.',
    pages: null,
    downloadAvailable: true,
    url: '/publications/august-story-vol1.pdf',
  },
];

// ─── Leadership ──────────────────────────────────────────────────────────────

export interface LeadershipProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  bio: string;
  isOfficial: boolean;
}

export const LEADERSHIP: LeadershipProfile[] = [
  {
    id: 'lead-001',
    name: '[PLACEHOLDER — Director Name Required]',
    title: 'Director, Student Activity Center',
    department: 'KL University',
    bio: '[PLACEHOLDER — Official biography required. Please provide the verified biography and photograph of the SAC Director from official KL University sources.]',
    isOfficial: false,
  },
  {
    id: 'lead-002',
    name: '[PLACEHOLDER — TEC Domain Head Required]',
    title: 'Domain Head, Technology',
    department: 'Technology Domain (TEC)',
    bio: '[PLACEHOLDER — Official biography required.]',
    isOfficial: false,
  },
  {
    id: 'lead-003',
    name: '[PLACEHOLDER — LCH Domain Head Required]',
    title: 'Domain Head, Liberal Arts & Culture',
    department: 'Liberal Arts, Cultural & Hobby Domain (LCH)',
    bio: '[PLACEHOLDER — Official biography required.]',
    isOfficial: false,
  },
  {
    id: 'lead-004',
    name: '[PLACEHOLDER — HWB Domain Head Required]',
    title: 'Domain Head, Health & Wellbeing',
    department: 'Health & Wellbeing Domain (HWB)',
    bio: '[PLACEHOLDER — Official biography required.]',
    isOfficial: false,
  },
  {
    id: 'lead-005',
    name: '[PLACEHOLDER — ESO Domain Head Required]',
    title: 'Domain Head, Social Outreach',
    department: 'Extension & Social Outreach Domain (ESO)',
    bio: '[PLACEHOLDER — Official biography required.]',
    isOfficial: false,
  },
  {
    id: 'lead-006',
    name: '[PLACEHOLDER — IIE Domain Head Required]',
    title: 'Domain Head, Innovation & Entrepreneurship',
    department: 'Innovation, Incubation & Entrepreneurship Domain (IIE)',
    bio: '[PLACEHOLDER — Official biography required.]',
    isOfficial: false,
  },
];
