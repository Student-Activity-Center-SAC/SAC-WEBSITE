import type { DomainCode } from './domains';

export interface Club {
  slug: string;
  name: string;
  domainCode: DomainCode;
  domainSlug: string;
  tagline: string;
  about: string[];
  purpose: string;
  competencies: string[];
  activities: string[];
}

export const CLUBS: Club[] = [
  // ─── TEC ─────────────────────────────────────────────────────────────────
  {
    slug: 'zeroone-code-club',
    name: 'ZeroOne Code Club',
    domainCode: 'TEC',
    domainSlug: 'technology',
    tagline: 'Where logic meets ambition.',
    about: [
      'ZeroOne Code Club is KL SAC\'s competitive programming powerhouse. Since its founding, the club has built a community of problem-solvers who think algorithmically — students who treat every coding challenge as an invitation to innovate and every competition as preparation for a world that demands technical excellence.',
      'Members compete in national and international programming contests, participate in hackathons, and build innovative software solutions. The club runs structured Code Camp bootcamps, weekly mock contests, and peer mentoring sessions that create an environment where beginners grow into competitors and competitors grow into leaders.',
    ],
    purpose:
      'To build a generation of engineers who think algorithmically, solve problems with precision and creativity, and represent KL University with distinction in national and international programming competitions.',
    competencies: [
      'Competitive Programming',
      'Data Structures & Algorithms',
      'Hackathon Strategy & Teamwork',
      'Software Development',
      'Problem Decomposition',
    ],
    activities: [
      'Weekly coding challenges and mock contests',
      'National hackathon preparation and participation',
      'Code Camp bootcamps for freshers',
      'Peer mentoring and study circles',
      'Industry-level project sprints',
    ],
  },
  {
    slug: 'cyber-security-club',
    name: 'Cyber Security Club',
    domainCode: 'TEC',
    domainSlug: 'technology',
    tagline: 'Defend. Detect. Secure.',
    about: [
      'The Cyber Security Club at KL SAC is where students explore the frontiers of digital security. In a world of increasingly sophisticated cyber threats, we believe that the best defenders are students who understand how attacks work — ethically, analytically, and precisely.',
      'Through CTF (Capture the Flag) competitions, ethical hacking workshops, network security drills, and security awareness campaigns, members develop skills that are critical in an increasingly connected world. The club creates a safe environment for learning offensive and defensive security techniques with a strong ethical foundation.',
    ],
    purpose:
      'To equip students with the ethical mindset and technical skills needed to protect digital ecosystems, and to produce graduates who can lead organisations through the complex challenges of modern cybersecurity.',
    competencies: [
      'Ethical Hacking & Penetration Testing',
      'Network Security & Analysis',
      'CTF Competitions',
      'Vulnerability Assessment',
      'Digital Forensics',
    ],
    activities: [
      'CTF challenge training and competition',
      'Ethical hacking workshops with industry experts',
      'Network traffic analysis labs',
      'Security awareness campaigns on campus',
      'Bug bounty preparation sessions',
    ],
  },
  {
    slug: 'webapps-club',
    name: 'WebApps Club',
    domainCode: 'TEC',
    domainSlug: 'technology',
    tagline: 'Design. Build. Deploy.',
    about: [
      'The WebApps Club bridges design thinking and engineering to create web applications that work beautifully. From UI/UX research and wireframing to full-stack development and deployment, members learn to build real products that solve real problems for real users.',
      'The club runs structured learning tracks covering modern frontend frameworks, backend engineering, database design, and product thinking. Members build portfolio projects, participate in web hackathons, and collaborate on open-source contributions that demonstrate their skills to the world.',
    ],
    purpose:
      'To develop student engineers who can create intuitive, accessible, and scalable web experiences — combining the craft of design with the rigour of engineering to produce products that matter.',
    competencies: [
      'Frontend Development (React, Next.js)',
      'Backend Engineering (Node.js, Python)',
      'UI/UX Design & Research',
      'Database Design & Management',
      'Product Thinking & Agile Methods',
    ],
    activities: [
      'Structured web development learning tracks',
      'Design critique and UI/UX workshops',
      'Open-source contribution projects',
      'Web hackathon participation',
      'Live product builds and portfolio reviews',
    ],
  },
  {
    slug: 'ev-automation-club',
    name: 'Electric Vehicle & Automation Club',
    domainCode: 'TEC',
    domainSlug: 'technology',
    tagline: 'Engineering the future of mobility and automation.',
    about: [
      'The Electric Vehicle & Automation Club brings together two frontier engineering disciplines: sustainable electric mobility and intelligent automation. Members work on EV component design, battery technology, and motor systems — while also exploring robotics, IoT, and industrial automation that make modern industry smarter and more efficient.',
      'The club collaborates with industry partners to provide hands-on experience in EV control systems, embedded platforms, robotic arms, and sensor networks. Members compete in national EV and robotics competitions, and engage with industry mentors who bring real-world challenges into the club environment.',
    ],
    purpose:
      'To prepare students for leadership in electric mobility and automation — equipping them with the engineering skills to design sustainable transport systems and build intelligent automated solutions.',
    competencies: [
      'EV System Engineering & Battery Technology',
      'Motor Control & Regenerative Systems',
      'Robotics Design & Programming',
      'IoT Development & Sensor Networks',
      'Embedded Systems (Arduino, Raspberry Pi)',
    ],
    activities: [
      'EV component design and prototyping challenges',
      'Robotics build challenges and competitions',
      'IoT prototype development sprints',
      'Industry visits to EV manufacturing and automation facilities',
      'Inter-university robotics and EV competitions',
    ],
  },

  // ─── LCH ─────────────────────────────────────────────────────────────────
  {
    slug: 'swara-music-club',
    name: 'Swara Music Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'Music that moves the campus.',
    about: [
      'Swara Music Club is the musical heartbeat of KL University. From classical Indian music performances to contemporary concerts, Swara provides a platform for every musical talent — vocalists, instrumentalists, and composers — to develop, perform, and inspire.',
      'The club organises regular jam sessions, workshops led by professional musicians, and performances at campus festivals and cultural events. Members learn music theory, ensemble playing, stage performance, and the discipline that comes with mastering an instrument or voice.',
    ],
    purpose:
      'To nurture musical talent across all genres and traditions, preserve classical musical heritage, and create vibrant spaces for creative musical expression that enrich campus life.',
    competencies: [
      'Vocal & Instrumental Performance',
      'Music Theory & Composition',
      'Stage Performance & Presence',
      'Ensemble & Collaborative Playing',
      'Recording & Production Basics',
    ],
    activities: [
      'Weekly jam sessions and rehearsals',
      'Workshops by professional musicians',
      'Campus concert series',
      'Classical music preservation programmes',
      'Inter-college music competitions',
    ],
  },
  {
    slug: 'dance-club',
    name: 'Dance Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'Every move tells a story.',
    about: [
      'The Dance Club at KL SAC celebrates the full spectrum of dance — from classical Indian forms like Bharatanatyam and Kuchipudi to contemporary styles, folk traditions, and fusion choreography. The club provides a space where students of all dance backgrounds can train, create, and perform.',
      'Members train under experienced choreographers, compete in national dance competitions, and perform at KL University\'s major cultural events. The club is committed to both the preservation of India\'s rich classical dance heritage and the exploration of contemporary movement as a creative language.',
    ],
    purpose:
      'To develop student dancers who carry cultural heritage forward with pride, while embracing the full vocabulary of movement as a vehicle for creative expression and personal development.',
    competencies: [
      'Classical Dance Forms (Bharatanatyam, Kuchipudi)',
      'Contemporary & Folk Dance',
      'Stage Performance & Expression',
      'Choreography & Direction',
      'Cultural Preservation & Storytelling',
    ],
    activities: [
      'Daily training and rehearsal sessions',
      'Classical dance workshops with guest artists',
      'Annual dance festival and competitions',
      'Inter-collegiate competition preparation',
      'Cultural performance at university events',
    ],
  },
  {
    slug: 'theatre-arts-club',
    name: 'Theatre Arts (Dramatics) Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'The stage is yours.',
    about: [
      'Theatre Arts brings stories to life through performance. The club explores the full craft of theatre — script writing, direction, acting, set design, and stage production — creating performances that entertain, provoke, and inspire both performers and audiences.',
      'From intimate black-box performances to large campus productions and street plays that take the arts to unexpected places, the Dramatics Club creates a space where students find their voice, challenge their comfort zones, and develop the confidence and communication skills that serve them far beyond the stage.',
    ],
    purpose:
      'To develop confident, expressive communicators and performers who use theatre as a medium for storytelling, social commentary, and the exploration of the human condition.',
    competencies: [
      'Acting Technique & Character Development',
      'Scriptwriting & Story Development',
      'Direction & Stage Management',
      'Set Design & Production',
      'Voice & Diction Training',
    ],
    activities: [
      'Acting workshops and improvisation sessions',
      'Full-scale campus drama productions',
      'Street play performances for social awareness',
      'Script writing competitions',
      'Inter-university theatre festivals',
    ],
  },
  {
    slug: 'short-film-makers-club',
    name: 'Short Film Makers Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'Frame your story.',
    about: [
      'The Short Film Makers Club is where aspiring filmmakers develop their craft through making. From concept development and script writing to cinematography, directing, editing, and sound design, members learn every stage of the filmmaking process by working on real films.',
      'The club creates a collaborative environment where writers work with directors, cinematographers collaborate with editors, and every student develops an appreciation for film as a medium that combines technical precision with artistic vision. Member films are screened at campus festivals and entered into student film competitions nationally.',
    ],
    purpose:
      'To develop visual storytellers who can communicate ideas powerfully through film — combining technical filmmaking skills with narrative intelligence and artistic sensibility.',
    competencies: [
      'Cinematography & Camera Operation',
      'Screenplay & Script Development',
      'Directing & Shot Composition',
      'Video Editing & Post-Production',
      'Sound Design & Music',
    ],
    activities: [
      '48-hour film challenge events',
      'Cinematography and camera workshops',
      'Screenplay writing workshops',
      'Film screening and critique sessions',
      'National student film festival submissions',
    ],
  },
  {
    slug: 'photography-club',
    name: 'Photography Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'One frame. A thousand words.',
    about: [
      'The Photography Club at KL SAC develops visual artists who see stories in everyday moments — who understand that a photograph is not just a record, but an interpretation. Through workshops, field shoots, and exhibitions, members develop both technical mastery and a distinctive visual voice.',
      'The club covers the full spectrum of photography: portraiture, street photography, nature, architecture, event coverage, and documentary work. Members learn post-processing, photo editing, and the principles of visual storytelling that make an image memorable long after it\'s seen.',
    ],
    purpose:
      'To develop student photographers with strong technical foundations, artistic vision, and the ability to capture and communicate meaningful human experiences through the photographic image.',
    competencies: [
      'Camera Technique & Exposure Control',
      'Composition & Visual Storytelling',
      'Photo Editing & Post-Processing',
      'Portrait & Street Photography',
      'Exhibition Design & Curation',
    ],
    activities: [
      'Campus photo walks and field shoots',
      'Technical workshops on camera and lighting',
      'Annual photo exhibition on campus',
      'Photography competitions and challenges',
      'Collaborative documentary projects',
    ],
  },
  {
    slug: 'arts-painting-club',
    name: 'Arts & Painting Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'Where imagination becomes form.',
    about: [
      'The Arts & Painting Club is where creative vision becomes tangible expression. From canvas painting in multiple traditions — oil, acrylic, watercolour — to digital art, sketching, and mixed media, members explore a wide range of visual art forms and develop a distinctive artistic identity.',
      'The club holds regular studio sessions, workshops led by practising artists, and participates in campus and city art exhibitions. Members are encouraged to explore their own artistic voice while building the technical foundation — proportion, colour theory, composition — that gives that voice precision and power.',
    ],
    purpose:
      'To provide a creative sanctuary where visual artists develop their craft, experiment with diverse media, and share their work with a community that believes visual art is essential to a complete education.',
    competencies: [
      'Painting Techniques (Oil, Acrylic, Watercolour)',
      'Drawing & Sketching',
      'Digital Art & Illustration',
      'Colour Theory & Composition',
      'Art History & Criticism',
    ],
    activities: [
      'Open studio sessions and guided workshops',
      'Campus and external art exhibitions',
      'Art challenges and themed painting sessions',
      'Guest artist workshops and demonstrations',
      'Collaborative mural and installation projects',
    ],
  },
  {
    slug: 'handicrafts-club',
    name: 'Handicrafts Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'Create with your hands. Create with purpose.',
    about: [
      'The Handicrafts Club celebrates the art of making — the satisfaction of creating something tangible, useful, and beautiful with your own hands. Through traditional and contemporary craft techniques, members connect creativity with craftsmanship across a wide range of media.',
      'From origami and paper craft to textile work, pottery, jewellery design, and DIY product creation, the club explores handmade craft as both an artistic practice and a sustainable, mindful alternative to mass production. The club also engages with craft as cultural preservation — learning traditional Indian handicraft forms that carry centuries of knowledge.',
    ],
    purpose:
      'To develop appreciation for artisanal craft traditions while fostering creative making, design thinking, and the meditative focus that comes from working with your hands.',
    competencies: [
      'Traditional Craft Techniques',
      'Textile Arts & Fabric Craft',
      'Paper Craft & Origami',
      'DIY Design & Product Making',
      'Cultural Craft Knowledge',
    ],
    activities: [
      'Craft workshops in traditional Indian techniques',
      'Campus craft fairs and exhibitions',
      'Holiday gift and product creation projects',
      'Sustainable craft using recycled materials',
      'Collaborative installation projects',
    ],
  },
  {
    slug: 'vastraa-fashion-club',
    name: 'Vastraa (Fashion) Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'Style as self-expression.',
    about: [
      'Vastraa Fashion Club explores fashion as a cultural and creative medium — not just a collection of clothes, but a language through which individuals and communities communicate identity, heritage, and aspiration. The club brings together students who are passionate about design, styling, and the cultural dimensions of dress.',
      'From design conceptualisation and pattern making to fashion shows and sustainable styling challenges, members engage with fashion as both craft and statement. The club celebrates India\'s extraordinary textile traditions while also engaging with contemporary fashion in all its global, experimental energy.',
    ],
    purpose:
      'To develop student designers and stylists with a strong design sensibility, deep appreciation for fashion\'s cultural dimensions, and a commitment to the sustainability and ethics of contemporary fashion.',
    competencies: [
      'Fashion Design & Illustration',
      'Styling & Visual Merchandising',
      'Textile Knowledge & Material',
      'Sustainable Fashion Practices',
      'Fashion History & Cultural Context',
    ],
    activities: [
      'Annual campus fashion show (Vastraa)',
      'Design workshops and pattern-making sessions',
      'Sustainable fashion challenges',
      'Collaboration with traditional textile artisans',
      'Fashion photography and lookbook creation',
    ],
  },
  {
    slug: 'adventure-club',
    name: 'Adventure Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'Beyond the campus walls.',
    about: [
      'The Adventure Club takes students beyond the classroom and into the outdoors — to mountains, forests, rivers, and the open spaces where the real lessons of leadership and resilience are learned. Through trekking, camping, kayaking, and adventure sports, members develop physical endurance, mental toughness, and a deep appreciation for the natural world.',
      'The club organises regular outings ranging from day treks to multi-day expeditions, and provides training in outdoor survival skills, navigation, and team leadership. Members learn that the most important challenges are not the ones in textbooks — and that the confidence you gain on a mountain summit stays with you for life.',
    ],
    purpose:
      'To build physically active, mentally resilient students who find confidence and leadership capability through adventure — and who carry a love for the natural world throughout their lives.',
    competencies: [
      'Trekking & Expedition Planning',
      'Outdoor Survival Skills',
      'Team Leadership & Communication',
      'Environmental Awareness',
      'Physical Endurance Training',
    ],
    activities: [
      'Weekend treks to local and regional destinations',
      'Multi-day camping expeditions',
      'Outdoor leadership and survival workshops',
      'Environmental awareness and conservation projects',
      'Adventure sports exposure programmes',
    ],
  },
  {
    slug: 'kl-esports-club',
    name: 'KL eSports Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'Compete. Connect. Conquer.',
    about: [
      'KL eSports Club is the premier competitive gaming community at KL University — a space where passion for gaming meets the discipline, strategy, and teamwork of professional sport. The club takes gaming seriously: as a career pathway, as a competitive arena, and as a vibrant community that brings students together.',
      'Members train in structured team formats, analyse competitive gameplay, participate in national university eSports tournaments, and build a thriving gaming culture on campus. The club also explores the career dimensions of eSports — game design, event management, content creation, and the growing business of competitive gaming.',
    ],
    purpose:
      'To develop disciplined, strategically-minded players and build a professional eSports culture at KL University — creating pathways for students in competitive gaming, game design, event management, and digital entertainment.',
    competencies: [
      'Competitive Gaming & Strategy',
      'Team Coordination & Communication',
      'Tournament Management & Organisation',
      'Content Creation & Streaming',
      'eSports Business & Career',
    ],
    activities: [
      'Regular training and scrimmage sessions',
      'Campus eSports tournaments',
      'National university eSports league participation',
      'Content creation and streaming workshops',
      'Game design and development exposure sessions',
    ],
  },
  {
    slug: 'literature-club',
    name: 'Literature Club',
    domainCode: 'LCH',
    domainSlug: 'liberal-arts',
    tagline: 'Words that move the world.',
    about: [
      'The Literature Club is the campus home for students who love the written and spoken word — poetry, fiction, creative non-fiction, scriptwriting, and literary criticism. The club believes that reading deeply and writing well are among the most powerful capacities a university education can develop.',
      'Through writing workshops, author talks, literary discussions, creative writing competitions, and campus publications, members develop a distinctive literary voice and a deep engagement with ideas expressed through language. The club celebrates both classical and contemporary literature — regional, national, and global.',
    ],
    purpose:
      'To cultivate a love of literature and the craft of writing — developing students who read widely, write powerfully, and use the written word to explore, question, and communicate the full range of human experience.',
    competencies: [
      'Creative Writing & Poetry',
      'Literary Analysis & Criticism',
      'Scriptwriting & Storytelling',
      'Public Reading & Performance',
      'Editing & Publication',
    ],
    activities: [
      'Creative writing workshops and open mic nights',
      'Literary debate and book club sessions',
      'Campus literary magazine publication',
      'National poetry and short story competitions',
      'Author talks and reading festival events',
    ],
  },

  // ─── HWB ─────────────────────────────────────────────────────────────────
  {
    slug: 'safelife-club',
    name: 'SafeLife Club',
    domainCode: 'HWB',
    domainSlug: 'health-wellbeing',
    tagline: 'Because every life matters.',
    about: [
      'SafeLife Club equips students with the knowledge and practical skills to respond effectively in health emergencies. In a world where immediate response can mean the difference between life and death, SafeLife members become the first line of care on campus and in their communities.',
      'Through certified first aid training, CPR certification, health awareness campaigns, and emergency response drills, the club develops students who are prepared — not just willing — to help. SafeLife also runs regular health awareness programmes addressing nutrition, mental health, disease prevention, and campus safety.',
    ],
    purpose:
      'To create a campus community where every student is equipped with life-saving skills, health knowledge, and the confidence to act decisively when others need help most.',
    competencies: [
      'Basic & Advanced First Aid',
      'CPR & AED Operation',
      'Emergency Response Planning',
      'Health Awareness Education',
      'Community Safety Programmes',
    ],
    activities: [
      'First aid and CPR certification programmes',
      'Campus health awareness campaigns',
      'Emergency response drills and simulations',
      'Blood donation drives',
      'Mental health and wellness workshops',
    ],
  },
  {
    slug: 'yoga-club',
    name: 'Yoga Club',
    domainCode: 'HWB',
    domainSlug: 'health-wellbeing',
    tagline: 'Breathe. Balance. Thrive.',
    about: [
      'The Yoga Club promotes physical and mental wellbeing through the ancient and evolving practice of yoga. On a campus where academic pressure is constant, the club creates a regular sanctuary of balance — morning sessions that ground students in their bodies, and meditation practices that sharpen their minds.',
      'The club runs structured yoga sessions from beginner to advanced levels, workshops on pranayama and meditation, and educational programmes on the philosophy and science of yoga. Members learn that yoga is not just a physical practice — it is a discipline that develops focus, resilience, and equanimity across every dimension of life.',
    ],
    purpose:
      'To make holistic wellness an integral part of student life by creating a regular, accessible yoga and mindfulness practice that supports students through the demands of university and beyond.',
    competencies: [
      'Yoga Asana Practice (All Levels)',
      'Pranayama & Breathwork',
      'Meditation & Mindfulness',
      'Yoga Philosophy & Science',
      'Wellness Lifestyle Design',
    ],
    activities: [
      'Daily morning yoga sessions (all levels)',
      'Pranayama and breathing technique workshops',
      'Guided meditation and stress reduction sessions',
      'International Yoga Day programmes',
      'Yoga retreat and wellness camp',
    ],
  },

  // ─── ESO ─────────────────────────────────────────────────────────────────
  {
    slug: 'yuva-tourism-club',
    name: 'Yuva Tourism Club',
    domainCode: 'ESO',
    domainSlug: 'social-outreach',
    tagline: 'Explore. Experience. Engage.',
    about: [
      'Yuva Tourism Club connects students with the extraordinary cultural richness and natural heritage of India. The club believes that travel is education — that the student who has stood in an ancient temple, walked through a medieval fort, or spoken with artisans in a traditional craft village carries a knowledge that no textbook can provide.',
      'Through organised heritage walks, cultural visits, responsible tourism expeditions, and sustainability-focused travel initiatives, members become ambassadors of the India they discover — curious, respectful, and committed to the preservation of the heritage they encounter.',
    ],
    purpose:
      'To develop culturally aware, socially responsible students who value India\'s extraordinary heritage and understand the transformative power of travel undertaken with curiosity, respect, and purpose.',
    competencies: [
      'Cultural Heritage Awareness',
      'Responsible & Sustainable Tourism',
      'Travel Planning & Logistics',
      'Community Engagement',
      'Cultural Documentation & Storytelling',
    ],
    activities: [
      'Heritage walks in Vijayawada and Andhra Pradesh',
      'Cultural visits to historical monuments and sites',
      'Sustainable tourism awareness programmes',
      'Documentation projects on local heritage',
      'Regional travel expeditions with cultural focus',
    ],
  },
  {
    slug: 'svr-club',
    name: 'SVR Club',
    domainCode: 'ESO',
    domainSlug: 'social-outreach',
    tagline: 'Serve. Impact. Inspire.',
    about: [
      'SVR Club is the social service heart of KL SAC. The club embodies the conviction that a university\'s purpose — and a student\'s education — extends beyond the campus gates. SVR members engage in village outreach, education initiatives, health camps, livelihood support programmes, and awareness campaigns that create tangible impact in communities beyond the university.',
      'The club works with local government bodies, NGOs, and community organisations to identify needs and design interventions that are meaningful, sustainable, and respectful of the communities they serve. SVR is not about charity — it is about solidarity, co-creation, and the belief that student energy can be one of the most powerful forces for community transformation.',
    ],
    purpose:
      'To develop socially conscious student leaders who move from awareness to action — creating tangible, sustainable impact in communities beyond the campus through service that is grounded in respect and co-creation.',
    competencies: [
      'Community Development',
      'Social Project Management',
      'Rural Outreach & Engagement',
      'Education & Awareness Programmes',
      'Stakeholder Coordination & Partnership',
    ],
    activities: [
      'Village outreach visits and community programmes',
      'Education support for underprivileged children',
      'Health camps in underserved communities',
      'Environmental and sanitation awareness drives',
      'Livelihood skill training for local communities',
    ],
  },
  {
    slug: 'spiritual-sciences-club',
    name: 'Spiritual Sciences Club',
    domainCode: 'ESO',
    domainSlug: 'social-outreach',
    tagline: 'Grow within. Lead beyond.',
    about: [
      'The Spiritual Sciences Club explores the intersection of human values, mindfulness, and personal development. In an age of distraction, comparison, and anxiety, the club creates a space for students to develop clarity of purpose, ethical grounding, and the inner strength that sustains leadership over a lifetime.',
      'Through workshops on value-based living, sessions on Indian philosophical traditions, mindfulness practices, and character development programmes, the club nurtures the inner dimension of student growth that academic achievement alone cannot provide. The club holds that authentic leadership begins with self-knowledge.',
    ],
    purpose:
      'To develop value-centred students who approach their academic and professional journeys with ethical clarity, inner strength, and a sense of purpose that transcends career ambition.',
    competencies: [
      'Value-Based Education',
      'Mindfulness & Self-Awareness',
      'Ethical Leadership',
      'Indian Philosophical Traditions',
      'Personal Development & Purpose',
    ],
    activities: [
      'Weekly sessions on values and personal development',
      'Workshops on Indian philosophy and wisdom traditions',
      'Character development programmes',
      'Mindfulness and contemplative practice sessions',
      'Leadership and ethics discussion forums',
    ],
  },
  {
    slug: 'kl-youth-policy-club',
    name: 'KL Youth Policy Club',
    domainCode: 'ESO',
    domainSlug: 'social-outreach',
    tagline: 'Student voices shaping tomorrow.',
    about: [
      'The KL Youth Policy Club is where future leaders engage with governance, public policy, and civic responsibility. The club believes that students who understand how societies are governed — their policies, processes, and the values they embody — are better equipped to lead, advocate, and serve in every domain of professional and civic life.',
      'Through mock parliaments, policy debate competitions, Model UN simulations, policy paper writing, and engagement with local governance institutions, members develop a deep understanding of how policy is made, why it matters, and how young people can contribute to shaping it.',
    ],
    purpose:
      'To develop informed, engaged citizens who understand governance, policy, and their responsibility to contribute to public discourse — preparing students for leadership in government, civil society, and the professions.',
    competencies: [
      'Policy Analysis & Research',
      'Public Debate & Argumentation',
      'Civic Leadership & Engagement',
      'Model UN & Parliamentary Procedure',
      'Governance & Constitutional Studies',
    ],
    activities: [
      'Mock parliament and legislative debates',
      'Model UN conference participation',
      'Policy paper writing and research projects',
      'Engagement with local governance institutions',
      'National youth leadership conference participation',
    ],
  },

  // ─── IIE ─────────────────────────────────────────────────────────────────
  {
    slug: 'acic-tif',
    name: 'ACIC & TIF',
    domainCode: 'IIE',
    domainSlug: 'innovation',
    tagline: 'Where student ideas become ventures.',
    about: [
      'ACIC (Atal Community Innovation Centre) & TIF at KL SAC form the dual incubation engine of KL University\'s student entrepreneurship ecosystem. Funded under the Government of India\'s Atal Innovation Mission, ACIC focuses on community and social innovation, while TIF provides the technology incubation infrastructure to transform engineering ideas into market-ready ventures.',
      'Together, they give student entrepreneurs access to prototyping labs, pitch preparation support, mentoring from successful founders, connections to investors, and guidance on government funding schemes. The centres run structured incubation cohorts, entrepreneurship bootcamps, and challenges that create a sustained pipeline of student ventures.',
    ],
    purpose:
      'To create a generation of student entrepreneurs — equipped with the tools, mentorship, and infrastructure to build ventures that create real value commercially, technologically, and socially.',
    competencies: [
      'Startup Strategy & Business Planning',
      'Product Development & Prototyping',
      'Fundraising & Investor Relations',
      'Technology Entrepreneurship & MVP Building',
      'Intellectual Property & Government Scheme Guidance',
    ],
    activities: [
      'Structured incubation cohorts for student startups',
      'Entrepreneurship workshops and innovation bootcamps',
      'Pitch preparation and investor presentation training',
      'Mentoring sessions with industry entrepreneurs',
      'Demo Day and investor showcase events',
    ],
  },
];

export function getClubBySlug(slug: string): Club | undefined {
  return CLUBS.find((c) => c.slug === slug);
}

export function getClubsByDomain(domainCode: DomainCode): Club[] {
  return CLUBS.filter((c) => c.domainCode === domainCode);
}

export const CLUB_SLUGS = CLUBS.map((c) => c.slug);
