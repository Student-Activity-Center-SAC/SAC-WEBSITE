export type CouncilRole =
  | 'President'
  | 'Vice President'
  | 'Secretary'
  | 'Joint Secretary'
  | 'Club Lead'
  | 'Faculty Mentor'
  | 'Faculty In-Charge';

export interface CouncilMember {
  id: string;
  name: string;
  role: CouncilRole;
  subtitle?: string;     // e.g. "Administration, Strategy & Student Engagement"
  photo?: string;        // e.g. '/council/rohith.jpg'
  year?: string;         // e.g. '4th Year'
  branch?: string;
  linkedin?: string;
  journey?: string;
  achievements?: string[];
  clubs?: string[];
  clubLead?: string;     // for Club Leads: club name they lead
  isFaculty?: boolean;
  designation?: string;
}

// ── KL SAC Student Council  |  2026–27 ──────────────────────
export const STUDENT_COUNCIL: CouncilMember[] = [

  // ── PRESIDENTS ──────────────────────────────────────────────
  {
    id: 'p1',
    name: 'Rohith Venkata Sai Pinnamaneni',
    role: 'President',
    subtitle: 'Administration, Strategy & Student Engagement',
    year: '4th Year', branch: 'Computer Science Engineering',
    linkedin: 'https://in.linkedin.com/in/rohith-venkata-sai-pinnamaneni-38807a2b2',
    journey:
      'Joined SAC in October 2023 as a member of the SafeLife Club, driven by a passion for healthcare awareness and student wellness. Through consistent involvement he rose to Co-Lead and then Club Lead by June 2024. In July 2025 he stepped into core governance as SAC Administrative Lead — the interface between clubs and the executive council. He served as Vice President from September 2025, overseeing university-wide engagement programmes and earning recognition from the Women Development Cell. In June 2026 he was appointed President of the Student Council for 2026–27, heading a 25+ member executive team. Alongside his leadership role he engineered the SAC ERP Platform from scratch using Next.js, React, Node.js, and MongoDB — a role-based system approved and deployed on the KL University server under the mentorship of SAC Director Mr. Sai Vijay Pisini.',
    achievements: [
      'President, KL SAC Student Council 2026–27 — heads a 25+ member executive core team',
      'Built the SAC ERP Platform from scratch (Next.js, React, Node.js, MongoDB) — deployed on KL University\'s main server',
      'Recognised by the university\'s Women Development Cell for contributions as Vice President',
      'Progressed from club member to Student Council President in under three years',
      'SafeLife Club Lead — steered local healthcare outreach and team operations (2024–25)',
      'Mentored by SAC Director Mr. Sai Vijay Pisini on institutional digital transformation',
    ],
    clubs: ['SafeLife Club', 'Yuva Tourism Club'],
  },
  {
    id: 'p2',
    name: 'N C Krishna Saran',
    role: 'President',
    subtitle: 'Technology, Innovation & Digital Transformation',
    year: '4th Year', branch: 'Computer Science & Information Technology',
  },
  {
    id: 'p3',
    name: 'Sayani Datta',
    role: 'President',
    subtitle: 'Internships & Career Development',
    year: '4th Year', branch: 'Computer Science Engineering',
  },

  // ── VICE PRESIDENTS ─────────────────────────────────────────
  {
    id: 'vp1',
    name: 'Nayanvita Yelurupaty',
    role: 'Vice President',
    subtitle: 'Student Welfare & Engagement',
    year: '3rd Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'vp2',
    name: 'Jyothi Krishna Kanth Suroju',
    role: 'Vice President',
    subtitle: 'Student Excellence & Administration',
    year: '4th Year', branch: 'Electronics & Communication Engineering',
  },
  {
    id: 'vp3',
    name: 'Vishnu Varddhan Reddy Mallidi',
    role: 'Vice President',
    subtitle: 'Digital Communications & Branding',
    year: '4th Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'vp4',
    name: 'Revanth Sai Vedantam',
    role: 'Vice President',
    subtitle: 'Student Activities & Engagement',
    year: '4th Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'vp5',
    name: 'Nischal Singana',
    role: 'Vice President',
    subtitle: 'Technology & Digital Operations',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'vp6',
    name: 'Syed Liba Fathima',
    role: 'Vice President',
    subtitle: 'Incubation & Entrepreneurship',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'vp7',
    name: 'Noor Shahzeer Mogal',
    role: 'Vice President',
    subtitle: 'Innovation & Research',
    year: '4th Year', branch: 'Computer Science Engineering',
  },

  // ── SECRETARIES / COUNCIL DIVISION LEADS ────────────────────
  {
    id: 'sec-hostel-1',
    name: 'Teja Varma Gottumukkala',
    role: 'Secretary',
    subtitle: 'Hostel Events & Activities Division',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-hostel-2',
    name: 'Jeevitha Thalluri',
    role: 'Joint Secretary',
    subtitle: 'Hostel Events & Activities Division',
    year: '3rd Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'sec-hwb-2',
    name: 'Sai Spoorthi Tadisetty',
    role: 'Joint Secretary',
    subtitle: 'Health & Wellbeing Council',
    year: '2nd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-eso-1',
    name: 'Nikhil Sreepathi',
    role: 'Secretary',
    subtitle: 'Extension & Social Outreach Council',
    year: '2nd Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'sec-eso-2',
    name: 'Tanu Sri Avula',
    role: 'Joint Secretary',
    subtitle: 'Extension & Social Outreach Council',
    year: '2nd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-dose',
    name: 'Anupam Kumar',
    role: 'Secretary',
    subtitle: 'Division of Student Excellence (DOSE)',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-docs',
    name: 'Shreyan Kothapalli',
    role: 'Secretary',
    subtitle: 'Documentation & Publications Division',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-media-1',
    name: 'Kodanda Ramesh Murapaka',
    role: 'Secretary',
    subtitle: 'Digital Media & Branding Division',
    year: '3rd Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'sec-media-2',
    name: 'Guru Charan Lingam',
    role: 'Joint Secretary',
    subtitle: 'Digital Media & Branding Division',
    year: '3rd Year', branch: 'Internet of Things',
  },
  {
    id: 'sec-lch-1',
    name: 'Sravya Varikuntla',
    role: 'Secretary',
    subtitle: 'Liberal Arts, Cultural & Hobby Council',
    year: '4th Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'sec-lch-2',
    name: 'Dundi Naga Sree Kakarala',
    role: 'Joint Secretary',
    subtitle: 'Liberal Arts, Cultural & Hobby Council',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-tec',
    name: 'Madhava Havishma Shreyamsi Bitragunta',
    role: 'Secretary',
    subtitle: 'Technology Council',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-web-1',
    name: 'Bala Murali Sriram Chinta',
    role: 'Secretary',
    subtitle: 'Website Division',
    year: '2nd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-web-2',
    name: 'Prudhvi Raj Sai SR Chebrolu',
    role: 'Joint Secretary',
    subtitle: 'Website Division',
    year: '2nd Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'sec-iie-1',
    name: 'Akhilesh Sai Ippili',
    role: 'Secretary',
    subtitle: 'Innovation, Incubation & Entrepreneurship Council',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-iie-2',
    name: 'Emmanuel Moses Mathi',
    role: 'Joint Secretary',
    subtitle: 'Innovation, Incubation & Entrepreneurship Council',
    year: '2nd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'sec-iie-3',
    name: 'Manasa Indlamuri',
    role: 'Joint Secretary',
    subtitle: 'Innovation, Incubation & Entrepreneurship Council',
    year: '2nd Year', branch: 'Electronics & Communication Engineering',
  },

  // ── CLUB LEADS ───────────────────────────────────────────────
  {
    id: 'cl-marathon',
    name: 'Sai Phanindra Muthyala',
    role: 'Club Lead', clubLead: 'Marathon Club',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-safelife',
    name: 'Pranathi Yakkanti',
    role: 'Club Lead', clubLead: 'SafeLife Club',
    year: '3rd Year', branch: 'Electronics & Communication Engineering',
  },
  {
    id: 'cl-yoga',
    name: 'Hyndhavi Sai Ambati',
    role: 'Club Lead', clubLead: 'Yoga Club',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-policy',
    name: 'Sumit Dawn',
    role: 'Club Lead', clubLead: 'KL Youth Policy Lab',
    year: '3rd Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'cl-spiritual',
    name: 'Venkata Surya Varun Akuri',
    role: 'Club Lead', clubLead: 'Spiritual Sciences Club',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-photography',
    name: 'Rohith Esukapati',
    role: 'Club Lead', clubLead: 'Photography Club',
    year: '2nd Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'cl-handicrafts',
    name: 'Parthvi Lakshmi Reddy Mandalapu',
    role: 'Club Lead', clubLead: 'Handicrafts Club',
    year: '3rd Year', branch: 'Electronics & Communication Engineering',
  },
  {
    id: 'cl-music',
    name: 'Hemanth Satya Bapanna Andey',
    role: 'Club Lead', clubLead: 'Swara Music Club',
    year: '4th Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-fashion',
    name: 'Shaik Mohammad Maaz',
    role: 'Club Lead', clubLead: 'Vastraa Fashion Club',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-literature',
    name: 'Venkata Sai Karthikeya Khandavilli',
    role: 'Club Lead', clubLead: 'Vachas Club',
    year: '3rd Year', branch: 'Biotechnology',
  },
  {
    id: 'cl-adventure',
    name: 'Srisanth Sasi Bhushan Boddu',
    role: 'Club Lead', clubLead: 'Adventure Club',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-dance',
    name: 'Devi Yasasree Papisetti',
    role: 'Club Lead', clubLead: 'Dance Club',
    year: '4th Year', branch: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'cl-shortfilm',
    name: 'Gowri Karthik Saripalli',
    role: 'Club Lead', clubLead: 'Short Film Makers Club',
    year: '3rd Year', branch: 'Electronics & Communication Engineering',
  },
  {
    id: 'cl-arts',
    name: 'Dundi Naga Sree Kakarala',
    role: 'Club Lead', clubLead: 'Arts / Painting Club',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-esports',
    name: 'Sri Santhosh Reddy P',
    role: 'Club Lead', clubLead: 'KL eSports Club',
    year: '4th Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-zeroone',
    name: 'Hemanth Kankipati',
    role: 'Club Lead', clubLead: 'ZeroOne Code Club',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-cybersec',
    name: 'Gnana Venkata Dinesh Reddy Challa',
    role: 'Club Lead', clubLead: 'Cyber Security Club',
    year: '4th Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-webapps',
    name: 'Madhu Kaleru',
    role: 'Club Lead', clubLead: 'WebApps Club',
    year: '3rd Year', branch: 'Computer Science Engineering',
  },
  {
    id: 'cl-ev',
    name: 'Shaik Mohammad Gayaz Basha',
    role: 'Club Lead', clubLead: 'Electric Vehicle Club',
    year: '3rd Year', branch: 'Electronics & Communication Engineering',
  },
  {
    id: 'cl-automation',
    name: 'Shaik Mohammad Gayaz Basha',
    role: 'Club Lead', clubLead: 'Automation Club',
    year: '3rd Year', branch: 'Electronics & Communication Engineering',
  },
];
