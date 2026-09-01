// Shared demo / fallback data — used by all public pages when DB is not connected
import { ACTIVITIES } from './content/activities';

export const DEMO_CLUBS = [
  // TEC
  { id: 1,  name: 'ZeroOne Code Club',            domain: 'TEC', description: 'Competitive programming, hackathons and coding excellence.',                memberCount: 320, memberLimit: 400 },
  { id: 2,  name: 'Cyber Security Club',           domain: 'TEC', description: 'Ethical hacking, CTF challenges and digital security awareness.',            memberCount: 210, memberLimit: 250 },
  { id: 3,  name: 'WebApps Club',                  domain: 'TEC', description: 'Web development, UI/UX design and full-stack projects.',                     memberCount: 280, memberLimit: 350 },
  { id: 4,  name: 'Electric Vehicle Club',                 domain: 'TEC', description: 'EV technology, battery systems and sustainable engineering.',                  memberCount: 150, memberLimit: 200 },
  { id: 23, name: 'Automation Club',                       domain: 'TEC', description: 'Robotics, IoT and industrial automation systems.',                               memberCount: 140, memberLimit: 200 },
  // LCH
  { id: 5,  name: 'Short Film Makers Club',        domain: 'LCH', description: 'Script writing, direction and short film production.',                        memberCount: 160, memberLimit: 200 },
  { id: 6,  name: 'Dance Club',                    domain: 'LCH', description: 'Classical, folk and contemporary dance forms and competitions.',              memberCount: 420, memberLimit: 500 },
  { id: 7,  name: 'Music Club',                    domain: 'LCH', description: 'Classical and contemporary music performances and workshops.',                memberCount: 350, memberLimit: 400 },
  { id: 8,  name: 'Handicrafts Club',              domain: 'LCH', description: 'Traditional and modern craft-making, origami and DIY projects.',              memberCount: 140, memberLimit: 180 },
  { id: 9,  name: 'Adventure Club',                domain: 'LCH', description: 'Trekking, outdoor activities and adventure sports.',                          memberCount: 245, memberLimit: 300 },
  { id: 10, name: 'Vastraa (Fashion) Club',        domain: 'LCH', description: 'Fashion design, styling and cultural fashion shows.',                         memberCount: 195, memberLimit: 250 },
  { id: 11, name: 'Arts & Painting Club',          domain: 'LCH', description: 'Visual arts, painting, sketching and art exhibitions.',                      memberCount: 220, memberLimit: 300 },
  { id: 12, name: 'Literature Club',               domain: 'LCH', description: 'Creative writing, poetry, literary discussions and campus publications.',      memberCount: 165, memberLimit: 200 },
  { id: 13, name: 'KL eSports Club',               domain: 'LCH', description: 'Competitive gaming, esports tournaments and gaming communities.',             memberCount: 380, memberLimit: 500 },
  { id: 14, name: 'Photography Club',              domain: 'LCH', description: 'Campus photography, editing techniques and photo exhibitions.',               memberCount: 290, memberLimit: 350 },
  { id: 15, name: 'Dramatics Club',                domain: 'LCH', description: 'Stage performances, street plays and acting workshops.',                      memberCount: 180, memberLimit: 220 },
  // ESO
  { id: 16, name: 'SVR Club',                      domain: 'ESO', description: 'Social service, village outreach and community development.',                  memberCount: 320, memberLimit: 400 },
  { id: 17, name: 'Yuva Tourism Club',             domain: 'ESO', description: 'Heritage tourism, cultural visits and sustainable travel.',                    memberCount: 180, memberLimit: 220 },
  { id: 18, name: 'Spiritual Sciences Club',       domain: 'ESO', description: 'Spiritual growth, mindfulness and value-based education.',                     memberCount: 150, memberLimit: 200 },
  { id: 19, name: 'KL Youth Policy Lab',           domain: 'ESO', description: 'Youth governance, policy debates and civic leadership.',                       memberCount: 125, memberLimit: 150 },
  // IIE
  { id: 20, name: 'ACIC & TIF',                    domain: 'IIE', description: 'Atal Community Innovation Centre & Technology Incubation — startup incubation and entrepreneurship.', memberCount: 210, memberLimit: 300 },
  // HWB
  { id: 21, name: 'Yoga Club',                     domain: 'HWB', description: 'Daily yoga practice, meditation and mental wellness sessions.',                memberCount: 310, memberLimit: 400 },
  { id: 22, name: 'SafeLife Club',                 domain: 'HWB', description: 'First aid, health awareness and emergency response training.',                 memberCount: 200, memberLimit: 250 },
  { id: 24, name: 'Marathon Club',                 domain: 'HWB', description: 'Running, endurance and physical fitness.',                                     memberCount: 180, memberLimit: 250 },
];

export const DEMO_ACTIVITIES = ACTIVITIES;

export const DEMO_ANNOUNCEMENTS = [
  {
    id: 1,
    type: 'urgent' as const,
    title: 'Club Registration Deadline — 25 August 2026',
    content: 'All students must complete their club registrations on the Student Portal before 25 August 2026. Late registrations will not be accepted. Visit sac.kluniversity.in to register now.',
    created_at: '2026-08-10T09:00:00',
    expires_at: '2026-08-25T23:59:00',
  },
  {
    id: 2,
    type: 'event' as const,
    title: 'National Hackathon 2026 — Registration Open',
    content: 'ZeroOne Code Club is hosting the National Hackathon 2026 on 15 September. Form teams of 2-4 and register on the portal. Last date to register: 10 September 2026.',
    created_at: '2026-08-08T10:30:00',
    expires_at: '2026-09-10T23:59:00',
  },
  {
    id: 3,
    type: 'general' as const,
    title: 'SDC Credit Policy Update — Semester 1 2026',
    content: 'Students must earn a minimum of 30 SDC credits per semester to be eligible for club leadership roles. Credits earned through activities, workshops and events all count. Check your portal dashboard for your current balance.',
    created_at: '2026-08-05T11:00:00',
    expires_at: null,
  },
  {
    id: 4,
    type: 'event' as const,
    title: 'Classical Dance Festival — Auditions Open',
    content: 'Dance Club is conducting auditions for the Classical Dance Festival on 28 September. All dance forms welcome. Auditions will be held on 5 & 6 September at the KL Auditorium. Register on the portal.',
    created_at: '2026-08-01T14:00:00',
    expires_at: '2026-09-06T18:00:00',
  },
  {
    id: 5,
    type: 'general' as const,
    title: 'Welcome to KL SAC — Academic Year 2026-27',
    content: 'The Student Activity Center welcomes all students to the new academic year. Explore our 25+ clubs across 5 domains, enroll in activities, and make your university years count. Together we grow!',
    created_at: '2026-07-25T09:00:00',
    expires_at: null,
  },
];

export const DOMAIN_META: Record<string, { label: string; color: string; bg: string }> = {
  TEC: { label: 'Technology',                          color: '#8B0000', bg: 'bg-red-100 text-red-900' },
  LCH: { label: 'Liberal Arts, Cultural & Hobby',      color: '#B91C1C', bg: 'bg-red-100 text-red-900' },
  HWB: { label: 'Health & Wellbeing',                  color: '#7C0000', bg: 'bg-red-100 text-red-900' },
  ESO: { label: 'Extension & Social Outreach',         color: '#991B1B', bg: 'bg-red-100 text-red-900' },
  IIE: { label: 'Innovation, Incubation & Entrepreneurship', color: '#C53030', bg: 'bg-red-100 text-red-900' },
};
