export type DomainCode = 'TEC' | 'LCH' | 'HWB' | 'ESO' | 'IIE';

export interface Domain {
  slug: string;
  code: DomainCode;
  name: string;
  shortName: string;
  tagline: string;
  headline: string;
  philosophy: string;
  description: string;
  color: string;
  accentBg: string;
  textColor: string;
  competencies: string[];
  clubSlugs: string[];
  clubCount: number;
}

export const DOMAINS: Domain[] = [
  {
    slug: 'technology',
    code: 'TEC',
    name: 'Central Technology Clubs',
    shortName: 'Technology',
    tagline: 'Build. Innovate. Engineer.',
    headline: 'Where Engineers Are Made.',
    philosophy:
      'The Technology Domain exists at the intersection of curiosity and creation. At KL SAC, we believe technology is not just a career path — it is a way of thinking. Our four clubs build a community where students learn to code with precision, secure digital ecosystems, craft web products, and engineer sustainable mobility and automated systems. Every workshop, every hackathon, every late-night build session is an opportunity to move from knowing to doing.',
    description:
      'Four clubs driving technological excellence through competitive programming, cybersecurity, web development, electric mobility, and industrial automation.',
    color: '#8B0000',
    accentBg: 'rgba(139,0,0,0.07)',
    textColor: '#7A0000',
    competencies: [
      'Competitive Programming',
      'Cybersecurity & Ethical Hacking',
      'Web Development & UI/UX',
      'Electric Vehicle Engineering',
      'Robotics & Automation',
      'IoT Systems Design',
    ],
    clubSlugs: [
      'zeroone-code-club',
      'cyber-security-club',
      'webapps-club',
      'ev-automation-club',
    ],
    clubCount: 4,
  },
  {
    slug: 'liberal-arts',
    code: 'LCH',
    name: 'Liberal Arts, Creative Arts & Hobby Clubs',
    shortName: 'Liberal Arts & Culture',
    tagline: 'Create. Express. Perform.',
    headline: 'Where Creativity Lives.',
    philosophy:
      'The Liberal Arts, Creative Arts & Hobby domain is SAC\'s largest — and perhaps most visible — domain. It is the space where student creativity finds its fullest expression: in music, dance, drama, film, photography, fashion, adventure, literature, and competitive gaming. These eleven clubs share a conviction that creative excellence is not a diversion from education — it is essential to it. A student who performs on stage develops confidence that no classroom can teach. A photographer who frames a moment learns to see the world with new clarity.',
    description:
      'Eleven clubs celebrating creative expression across music, dance, drama, film, photography, fashion, gaming, adventure, literature, and the performing arts.',
    color: '#B91C1C',
    accentBg: 'rgba(185,28,28,0.07)',
    textColor: '#991515',
    competencies: [
      'Musical Performance & Composition',
      'Dance & Movement Arts',
      'Theatre & Stage Production',
      'Film Production & Editing',
      'Visual Arts & Photography',
      'Fashion Design & Styling',
      'Competitive Gaming',
      'Outdoor Leadership',
      'Public Speaking & Debate',
    ],
    clubSlugs: [
      'short-film-makers-club',
      'dance-club',
      'swara-music-club',
      'handicrafts-club',
      'adventure-club',
      'vastraa-fashion-club',
      'arts-painting-club',
      'literature-club',
      'kl-esports-club',
      'photography-club',
      'theatre-arts-club',
    ],
    clubCount: 11,
  },
  {
    slug: 'social-outreach',
    code: 'ESO',
    name: 'Extension & Society Outreach Clubs',
    shortName: 'Social Outreach',
    tagline: 'Engage. Serve. Impact.',
    headline: 'Where Students Change Communities.',
    philosophy:
      'KL University\'s purpose extends beyond the academic programme — and so does SAC\'s. The Extension & Social Outreach domain exists to remind students that a university education is a privilege that comes with the responsibility to serve. Our four clubs connect students with communities, heritage, governance, and values: Yuva Tourism Club explores India\'s cultural wealth, SVR Club engages in direct community service, KL Youth Policy Club prepares students for civic leadership, and Spiritual Sciences Club nurtures the values that underpin all leadership.',
    description:
      'Four clubs connecting students with cultural heritage, community service, civic leadership, and values-based personal development.',
    color: '#991B1B',
    accentBg: 'rgba(153,27,27,0.07)',
    textColor: '#881818',
    competencies: [
      'Community Development',
      'Cultural Heritage Awareness',
      'Civic Leadership & Policy',
      'Social Service & Outreach',
      'Values-Based Education',
      'Responsible Tourism',
    ],
    clubSlugs: [
      'svr-club',
      'yuva-tourism-club',
      'spiritual-sciences-club',
      'kl-youth-policy-club',
    ],
    clubCount: 4,
  },
  {
    slug: 'health-wellbeing',
    code: 'HWB',
    name: 'Health and Wellbeing Clubs',
    shortName: 'Health & Wellbeing',
    tagline: 'Move. Thrive. Inspire.',
    headline: 'Where Students Come Alive.',
    philosophy:
      'A student who is physically active, mentally balanced, and emotionally resilient performs better in every dimension of life. The Health & Wellbeing domain at KL SAC exists because we believe wellness is not a luxury — it is a foundation. Our two clubs address the full spectrum of student wellness: SafeLife equips students with life-saving skills, and Yoga Club creates daily practices of physical and mental balance.',
    description:
      'Two clubs committed to student wellness through first aid education, yoga, and mindfulness practices.',
    color: '#7C0000',
    accentBg: 'rgba(124,0,0,0.07)',
    textColor: '#6B0000',
    competencies: [
      'First Aid & Emergency Response',
      'Yoga Practice & Mindfulness',
      'Physical Fitness & Endurance',
      'Mental Wellness Education',
      'Health Awareness Campaigns',
      'Community Safety Training',
    ],
    clubSlugs: ['yoga-club', 'safelife-club'],
    clubCount: 2,
  },
  {
    slug: 'innovation',
    code: 'IIE',
    name: 'Innovation, Incubation & Entrepreneurship Clubs',
    shortName: 'Innovation & Entrepreneurship',
    tagline: 'Ideate. Build. Venture.',
    headline: 'Where Entrepreneurs Are Born.',
    philosophy:
      'Ideas are only the beginning. The Innovation, Incubation & Entrepreneurship domain at KL SAC exists to support students who want to take their ideas beyond the classroom — and into the world. ACIC and TBI provide the structured ecosystem that student entrepreneurs need: mentorship from industry professionals, access to incubation infrastructure, guidance on funding and market strategy, and a community of fellow builders. This domain embodies KL SAC\'s highest aspiration: that the students who pass through these clubs don\'t just graduate — they create.',
    description:
      'Two incubation centres supporting student entrepreneurs through mentorship, prototyping, industry connections, and structured venture-building programmes.',
    color: '#C53030',
    accentBg: 'rgba(197,48,48,0.07)',
    textColor: '#B02A2A',
    competencies: [
      'Startup Strategy & Planning',
      'Product Development & Prototyping',
      'Business Modelling & Finance',
      'Pitch Development & Communication',
      'Market Research & Validation',
      'Technology Entrepreneurship',
    ],
    clubSlugs: ['acic-tif'],
    clubCount: 1,
  },
];

export function getDomainBySlug(slug: string): Domain | undefined {
  return DOMAINS.find((d) => d.slug === slug);
}

export function getDomainByCode(code: string): Domain | undefined {
  return DOMAINS.find((d) => d.code === code);
}

export const DOMAIN_SLUGS = DOMAINS.map((d) => d.slug);
