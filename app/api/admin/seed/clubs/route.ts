import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/query-builder';

const REAL_CLUBS = [
  // ── TEC ──────────────────────────────────────────────────────────────
  {
    slug: 'zeroone-code-club',
    name: 'ZeroOne Code Club',
    domain_code: 'TEC',
    domain_slug: 'technology',
    tagline: 'Code. Build. Solve. Innovate.',
    about: [
      'ZeroOne Code Club is a technology-focused student community dedicated to developing programming, computational thinking, problem-solving, and software development skills.',
      'The club provides students with opportunities to learn through coding practice, technical challenges, collaborative projects, and competitive programming.',
    ],
    purpose: 'To build strong programming foundations and develop students into confident problem-solvers capable of applying computational thinking to real-world challenges.',
    competencies: ['Programming & Computational Thinking','Problem Solving','Data Structures & Algorithms','Software Development','Debugging & Testing','Competitive Programming','Version Control & Collaboration','Technical Project Development','Logical Reasoning','Coding Best Practices'],
    sort_order: 1,
  },
  {
    slug: 'cyber-security-club',
    name: 'Cyber Security Club',
    domain_code: 'TEC',
    domain_slug: 'technology',
    tagline: 'Secure. Defend. Innovate.',
    about: [
      'The Cyber Security Club is a student community focused on developing practical knowledge and awareness in cybersecurity.',
      'The club provides students with opportunities to explore security concepts, ethical practices, cyber defence, vulnerability assessment, and emerging challenges in the digital security landscape.',
    ],
    purpose: 'To develop cybersecurity awareness and practical defensive capabilities while encouraging ethical, responsible, and security-conscious use of technology.',
    competencies: ['Cybersecurity Fundamentals','Network Security','Information Security','Ethical Hacking','Vulnerability Assessment','Threat Analysis','Incident Response','Digital Forensics','Security Awareness','Cyber Risk Management','Security Tools & Practices'],
    sort_order: 2,
  },
  {
    slug: 'webapps-club',
    name: 'WebApps Club',
    domain_code: 'TEC',
    domain_slug: 'technology',
    tagline: 'Design. Develop. Deploy.',
    about: [
      'WebApps Club is a technology community focused on developing modern web applications and digital experiences.',
      'The club enables students to explore frontend and backend development, databases, APIs, deployment, and collaborative software development through practical projects and hands-on learning.',
    ],
    purpose: 'To develop students\' capabilities in designing, building, deploying, and maintaining modern web applications while encouraging practical project-based learning.',
    competencies: ['Web Development','Frontend Development','Backend Development','UI/UX Fundamentals','Database Management','API Development','Full-Stack Development','Version Control','Cloud Deployment','Web Security','Software Testing','Collaborative Development'],
    sort_order: 3,
  },
  {
    slug: 'electric-vehicle-club',
    name: 'Electric Vehicle Club',
    domain_code: 'TEC',
    domain_slug: 'technology',
    tagline: 'Electrify. Engineer. Evolve.',
    about: [
      'The Electric Vehicle Club is a student-led technical community focused on electric mobility, vehicle technologies, and sustainable transportation.',
      'The club provides opportunities for students to explore electric vehicle systems, battery technologies, vehicle electronics, design, and emerging mobility solutions through practical learning and projects.',
    ],
    purpose: 'To develop technical understanding and practical capabilities in electric mobility while encouraging innovation in sustainable transportation technologies.',
    competencies: ['Electric Vehicle Fundamentals','Battery Technology','Electric Motors & Powertrain Systems','Vehicle Electronics','Embedded Systems','EV Charging Systems','Automotive Design','Energy Management','Sustainable Mobility','Vehicle Diagnostics','Technical Project Development'],
    sort_order: 4,
  },
  {
    slug: 'automation-club',
    name: 'Automation Club',
    domain_code: 'TEC',
    domain_slug: 'technology',
    tagline: 'Sense. Automate. Transform.',
    about: [
      'Automation Club is a technology community focused on automation, intelligent systems, robotics, and connected technologies.',
      'The club provides students with opportunities to explore sensors, controllers, robotics, IoT, automation systems, and practical applications through hands-on projects and experimentation.',
    ],
    purpose: 'To develop students\' capabilities in designing and implementing automated and intelligent systems that address real-world problems.',
    competencies: ['Automation Fundamentals','Robotics','Internet of Things (IoT)','Sensors & Actuators','Microcontrollers','Embedded Systems','Control Systems','Industrial Automation','Programming for Automation','System Integration','Problem Solving','Prototype Development'],
    sort_order: 5,
  },

  // ── LCH ──────────────────────────────────────────────────────────────
  {
    slug: 'swara-music-club',
    name: 'Swara Music Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Find Your Voice. Create Your Sound.',
    about: [
      'Swara Music Club is a creative community for students passionate about music, providing opportunities to explore vocal and instrumental music, develop performance skills, and collaborate with fellow musicians.',
      'The club encourages students to learn, practise, perform, and express themselves through music.',
    ],
    purpose: 'To nurture musical talent and provide students with a platform to learn, perform, collaborate, and develop confidence through music.',
    competencies: ['Vocal Performance','Instrumental Performance','Music Theory','Rhythm & Timing','Stage Performance','Music Composition','Songwriting','Ensemble Collaboration','Performance Confidence','Creative Expression'],
    sort_order: 1,
  },
  {
    slug: 'dance-club',
    name: 'Dance Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Move. Express. Perform.',
    about: [
      'Dance Club provides students with a platform to explore diverse dance forms, develop performance abilities, and express creativity through movement.',
      'The club encourages learning, practise, choreography, collaboration, and stage performance across contemporary and traditional styles.',
    ],
    purpose: 'To develop students\' artistic expression, physical coordination, confidence, and performance skills through dance.',
    competencies: ['Dance Technique','Choreography','Rhythm & Coordination','Stage Performance','Body Movement & Expression','Performance Discipline','Team Collaboration','Creative Expression','Physical Fitness','Performance Confidence'],
    sort_order: 2,
  },
  {
    slug: 'theatre-arts-club',
    name: 'Theatre Arts (Dramatics) Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Imagine. Perform. Inspire.',
    about: [
      'The Theatre Arts (Dramatics) Club provides students with a platform to explore acting, theatre production, storytelling, and stagecraft.',
      'Through performances and practical theatre experiences, students develop the ability to communicate ideas, portray characters, and engage audiences.',
    ],
    purpose: 'To develop creativity, communication, confidence, and storytelling abilities through theatre and dramatic arts.',
    competencies: ['Acting','Character Development','Storytelling','Script Interpretation','Stagecraft','Voice Modulation','Body Language','Improvisation','Public Performance','Team Collaboration','Creative Direction'],
    sort_order: 3,
  },
  {
    slug: 'short-film-makers-club',
    name: 'Short Film Makers Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Imagine. Create. Tell Stories.',
    about: [
      'The Short Film Makers Club is a creative community for students interested in filmmaking and visual storytelling.',
      'The club provides opportunities to explore screenwriting, cinematography, direction, editing, production, and collaborative filmmaking.',
    ],
    purpose: 'To develop students\' filmmaking and storytelling capabilities while providing a platform to create meaningful visual narratives.',
    competencies: ['Screenwriting','Film Direction','Cinematography','Storytelling','Video Editing','Production Planning','Visual Composition','Sound Design','Acting & Performance','Creative Collaboration','Film Production'],
    sort_order: 4,
  },
  {
    slug: 'photography-club',
    name: 'Photography Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'See. Capture. Tell.',
    about: [
      'Photography Club provides students with a platform to explore photography as a medium of creative expression, documentation, and visual storytelling.',
      'The club encourages students to develop technical photography skills while learning to observe and communicate stories through images.',
    ],
    purpose: 'To develop students\' photographic skills, visual awareness, creativity, and ability to communicate ideas through compelling imagery.',
    competencies: ['Photography Fundamentals','Composition','Lighting','Visual Storytelling','Camera Handling','Photo Editing','Creative Direction','Visual Observation','Documentary Photography','Event Photography','Digital Image Management'],
    sort_order: 5,
  },
  {
    slug: 'arts-painting-club',
    name: 'Arts / Painting Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Imagine. Create. Express.',
    about: [
      'The Arts / Painting Club provides students with a creative space to explore drawing, painting, illustration, and other visual art forms.',
      'The club encourages experimentation, artistic expression, and the development of technical skills through guided learning and creative practise.',
    ],
    purpose: 'To nurture artistic talent and provide students with opportunities to develop visual creativity, artistic techniques, and confidence in self-expression.',
    competencies: ['Drawing','Painting Techniques','Sketching','Colour Theory','Illustration','Visual Composition','Creative Thinking','Artistic Expression','Observation Skills','Art Presentation'],
    sort_order: 6,
  },
  {
    slug: 'handicrafts-club',
    name: 'Handicrafts Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Create by Hand. Inspire by Craft.',
    about: [
      'The Handicrafts Club provides students with opportunities to explore traditional and contemporary craft techniques through hands-on creative work.',
      'The club encourages students to transform ideas and materials into meaningful artistic and functional creations.',
    ],
    purpose: 'To develop creativity, craftsmanship, patience, and practical design skills through hands-on exploration of handicrafts and traditional art forms.',
    competencies: ['Craft Techniques','Material Handling','Hand Skills','Creative Design','Product Making','Traditional Craft Knowledge','Visual Aesthetics','Attention to Detail','Patience & Precision','Sustainable Craft Practises'],
    sort_order: 7,
  },
  {
    slug: 'vastraa-fashion-club',
    name: 'Vastraa (Fashion) Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Create. Style. Express.',
    about: [
      'Vastraa (Fashion) Club is a creative platform for students interested in fashion, styling, design, and cultural expression.',
      'The club encourages students to explore fashion as a form of creativity and identity while developing skills in styling, presentation, and fashion communication.',
    ],
    purpose: 'To nurture creativity and develop students\' understanding of fashion, styling, design, cultural identity, and professional presentation.',
    competencies: ['Fashion Design','Styling','Fashion Communication','Colour & Fabric Understanding','Trend Analysis','Creative Direction','Stage Presentation','Personal Styling','Fashion Photography','Team Collaboration'],
    sort_order: 8,
  },
  {
    slug: 'adventure-club',
    name: 'Adventure Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Explore. Challenge. Discover.',
    about: [
      'The Adventure Club provides students with opportunities to explore outdoor experiences, adventure activities, travel, and experiential learning.',
      'The club encourages students to step beyond familiar environments while developing resilience, teamwork, awareness, and responsible exploration.',
    ],
    purpose: 'To promote experiential learning, outdoor engagement, resilience, teamwork, and responsible adventure among students.',
    competencies: ['Outdoor Skills','Teamwork','Leadership','Risk Awareness','Problem Solving','Adaptability','Navigation & Orientation','Physical Endurance','Decision-Making','Responsible Travel','Resilience'],
    sort_order: 9,
  },
  {
    slug: 'kl-esports-club',
    name: 'KL eSports Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Compete. Strategize. Excel.',
    about: [
      'KL eSports Club provides a structured platform for students interested in competitive gaming and the growing field of eSports.',
      'The club focuses on strategic thinking, teamwork, discipline, communication, competitive practise, and participation in organised tournaments.',
    ],
    purpose: 'To develop competitive gaming talent while promoting teamwork, strategic thinking, discipline, responsible gaming, and professional eSports practises.',
    competencies: ['Strategic Thinking','Team Coordination','Competitive Gaming','Communication','Decision-Making','Game Analysis','Leadership','Performance Management','Sportsmanship','Tournament Management','Responsible Gaming'],
    sort_order: 10,
  },
  {
    slug: 'vachas-club',
    name: 'Vachas Club',
    domain_code: 'LCH',
    domain_slug: 'liberal-arts',
    tagline: 'Think. Speak. Influence.',
    about: [
      'Vachas Club provides students with a platform to develop their abilities in writing, public speaking, debate, elocution, and effective communication.',
      'The club encourages students to articulate ideas, engage with diverse perspectives, and communicate with clarity and confidence.',
    ],
    purpose: 'To strengthen communication, critical thinking, public speaking, and expressive abilities while encouraging students to engage with ideas and perspectives.',
    competencies: ['Public Speaking','Creative Writing','Essay Writing','Debate','Elocution','Critical Thinking','Argumentation','Communication','Research & Expression','Confidence & Presentation','Active Listening'],
    sort_order: 11,
  },

  // ── ESO ──────────────────────────────────────────────────────────────
  {
    slug: 'yuva-tourism-club',
    name: 'Yuva Tourism Club',
    domain_code: 'ESO',
    domain_slug: 'social-outreach',
    tagline: 'Explore. Experience. Preserve.',
    about: [
      'Yuva Tourism Club provides students with opportunities to explore India\'s cultural, historical, geographical, and natural heritage through responsible tourism and experiential learning.',
      'The club encourages students to discover destinations, understand local communities, document heritage, and promote sustainable and responsible travel practises.',
    ],
    purpose: 'To develop responsible and informed travellers while promoting cultural appreciation, heritage awareness, sustainable tourism, and experiential learning among students.',
    competencies: ['Responsible Tourism','Heritage Awareness','Travel Planning','Cultural Understanding','Destination Research','Heritage Documentation','Photography & Visual Documentation','Sustainable Tourism Practises','Communication','Teamwork','Leadership','Community Engagement'],
    sort_order: 1,
  },
  {
    slug: 'svr-club',
    name: 'SVR Club',
    domain_code: 'ESO',
    domain_slug: 'social-outreach',
    tagline: 'Serve. Connect. Create Impact.',
    about: [
      'SVR Club provides students with a platform to engage with communities and participate in initiatives that address social needs.',
      'The club encourages students to understand community challenges, contribute through meaningful activities, and develop a sense of social responsibility.',
    ],
    purpose: 'To encourage students to actively contribute to society through community engagement, service-oriented initiatives, and meaningful social impact activities.',
    competencies: ['Social Responsibility','Community Engagement','Volunteer Management','Communication','Teamwork','Leadership','Problem Solving','Empathy','Community Needs Assessment','Project Coordination','Social Impact Awareness'],
    sort_order: 2,
  },
  {
    slug: 'spiritual-sciences-club',
    name: 'Spiritual Sciences Club',
    domain_code: 'ESO',
    domain_slug: 'social-outreach',
    tagline: 'Explore. Reflect. Understand.',
    about: [
      'The Spiritual Sciences Club provides students with a platform to explore spirituality, self-awareness, philosophical thought, and the relationship between inner wellbeing and personal development.',
      'The club encourages reflective learning, dialogue, and exploration of diverse perspectives in a respectful environment.',
    ],
    purpose: 'To encourage self-awareness, reflective thinking, philosophical inquiry, and holistic personal development through the exploration of spiritual and philosophical perspectives.',
    competencies: ['Self-Awareness','Reflective Thinking','Mindfulness','Philosophical Inquiry','Ethical Reasoning','Emotional Awareness','Critical Thinking','Respect for Diverse Perspectives','Communication','Personal Development'],
    sort_order: 3,
  },
  {
    slug: 'kl-youth-policy-club',
    name: 'KL Youth Policy Club',
    domain_code: 'ESO',
    domain_slug: 'social-outreach',
    tagline: 'Understand. Engage. Shape the Future.',
    about: [
      'KL Youth Policy Club provides students with a platform to understand public policy, governance, social issues, and matters affecting young people and society.',
      'The club encourages informed discussion, research, debate, and constructive civic engagement.',
    ],
    purpose: 'To develop informed, responsible, and socially conscious young citizens capable of understanding policy issues, engaging in constructive dialogue, and contributing meaningful perspectives to society.',
    competencies: ['Public Policy Awareness','Civic Engagement','Policy Research','Critical Thinking','Debate & Discussion','Public Speaking','Research & Analysis','Leadership','Social Awareness','Policy Communication','Problem Solving','Responsible Citizenship'],
    sort_order: 4,
  },

  // ── HWB ──────────────────────────────────────────────────────────────
  {
    slug: 'safelife-club',
    name: 'SafeLife Club',
    domain_code: 'HWB',
    domain_slug: 'health-wellbeing',
    tagline: 'Learn Safety. Build Readiness. Save Lives.',
    about: [
      'SafeLife Club is a student-led platform dedicated to developing awareness, preparedness, and practical skills for personal, campus, and community safety.',
      'The club provides students with opportunities to learn essential safety practises, respond effectively to emergencies, and promote a culture of responsibility, preparedness, and collective wellbeing.',
    ],
    purpose: 'To empower students with practical safety knowledge, emergency preparedness, and responsible decision-making skills while contributing to a safer and more resilient campus and community.',
    competencies: ['Safety Awareness','Emergency Preparedness','First Aid & Basic Life Support','Crisis Response','Risk Identification & Assessment','Disaster Preparedness','Emergency Communication','Situational Awareness','Personal Safety','Community Safety','Leadership & Team Coordination','Responsible Decision-Making'],
    sort_order: 1,
  },
  {
    slug: 'yoga-club',
    name: 'Yoga Club',
    domain_code: 'HWB',
    domain_slug: 'health-wellbeing',
    tagline: 'Breathe. Balance. Be Well.',
    about: [
      'Yoga Club provides students with a dedicated platform to practise yoga, mindfulness, breathing techniques, and holistic wellbeing practises.',
      'The club encourages students to develop physical awareness, mental focus, emotional balance, and healthy lifestyle habits through regular practise.',
    ],
    purpose: 'To promote physical and mental wellbeing among students through yoga, mindfulness, conscious breathing, and sustainable healthy lifestyle practises.',
    competencies: ['Yoga Practise','Flexibility & Mobility','Breathing Techniques','Mindfulness','Concentration','Body Awareness','Stress Management','Mental Wellbeing','Physical Fitness','Emotional Balance','Self-Discipline','Healthy Lifestyle Practises'],
    sort_order: 2,
  },
  {
    slug: 'marathon-club',
    name: 'Marathon Club',
    domain_code: 'HWB',
    domain_slug: 'health-wellbeing',
    tagline: 'Run. Endure. Achieve.',
    about: [
      'Marathon Club promotes running, endurance activities, physical fitness, and an active lifestyle among students.',
      'The club provides opportunities for students to participate in structured training, running events, fitness challenges, and endurance-based activities while developing discipline and resilience.',
    ],
    purpose: 'To encourage students to adopt an active lifestyle and develop physical endurance, discipline, resilience, and fitness through running and endurance activities.',
    competencies: ['Running Technique','Endurance & Stamina','Physical Fitness','Training & Conditioning','Goal Setting','Discipline','Resilience','Performance Monitoring','Teamwork','Time Management','Healthy Lifestyle Awareness','Event Participation'],
    sort_order: 3,
  },

  // ── IIE ──────────────────────────────────────────────────────────────
  {
    slug: 'acic',
    name: 'ACIC',
    domain_code: 'IIE',
    domain_slug: 'innovation',
    tagline: 'Ideate. Innovate. Impact.',
    about: [
      'ACIC provides students with a platform to transform ideas into innovative solutions through experimentation, collaboration, mentorship, and entrepreneurial thinking.',
      'The club ecosystem encourages students to identify real-world problems, develop solutions, validate ideas, and explore pathways from innovation to venture creation.',
    ],
    purpose: 'To foster innovation and entrepreneurial thinking among students by providing opportunities to develop ideas, build solutions, receive mentorship, and explore pathways toward startups and impactful ventures.',
    competencies: ['Innovation & Design Thinking','Problem Identification','Ideation','Prototype Development','Product Development','Entrepreneurial Thinking','Market Research','Business Model Development','Pitching & Presentation','Team Building','Innovation Project Management','Problem Solving'],
    sort_order: 1,
  },
  {
    slug: 'tbi',
    name: 'TBI',
    domain_code: 'IIE',
    domain_slug: 'innovation',
    tagline: 'Build. Incubate. Scale.',
    about: [
      'TBI provides students and aspiring entrepreneurs with an ecosystem to develop and advance innovative ideas into viable ventures.',
      'Through incubation support, mentorship, industry connections, and entrepreneurial development, students can explore the journey from early-stage ideas to sustainable businesses.',
    ],
    purpose: 'To support aspiring entrepreneurs in transforming innovative ideas into viable ventures by providing access to mentorship, incubation, networks, resources, and entrepreneurial opportunities.',
    competencies: ['Entrepreneurship','Business Model Development','Startup Strategy','Market Validation','Product Development','Financial Fundamentals','Business Planning','Pitch Deck Development','Investor Pitching','Leadership','Team Management','Networking','Venture Development','Commercialisation'],
    sort_order: 2,
  },
];

export async function POST(req: NextRequest) {
  if (req.headers.get('x-setup-key') !== process.env.ADMIN_SETUP_KEY)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const rows = REAL_CLUBS.map(c => ({
    ...c,
    logo_url:        null,
    cover_url:       null,
    gallery:         [],
    activities_list: [],
  }));

  const { error } = await db.from('clubs').upsert(rows, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { count } = await db.from('clubs').select('*', { count: 'exact', head: true });
  await db.from('sac_stats').upsert(
    { key: 'clubs', value: count ?? 0 },
    { onConflict: 'key' },
  );

  revalidatePath('/clubs');
  revalidatePath('/');
  return NextResponse.json({ success: true, count: rows.length });
}
