import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase-admin';

// Note: Marathon Club Excel codes (MC-A*) conflict with Music Club (LCH) codes.
// Renamed to MRC-A* (Marathon Club) to avoid overwriting Music Club activities.

const M: Record<string, string> = {
  AUG: 'August 2026', SEP: 'September 2026', OCT: 'October 2026',
  NOV: 'November 2026', DEC: 'December 2026', JAN: 'January 2027',
  FEB: 'February 2027', MAR: 'March 2027', APR: 'April 2027', ARP: 'April 2027',
};

const HWB_ACTIVITIES = [
  // ── MARATHON CLUB ────────────────────────────────────────────────────
  { code:'MRC-A01', club_slug:'marathon-club', month:M.AUG, title:'Marathon Club Orientation & Fitness Assessment', description:'This introductory activity familiarizes students with the objectives, structure, safety guidelines, and opportunities offered by the Marathon Club.', competencies:'Self-assessment, Physical fitness awareness, Goal-setting, Health monitoring, Personal responsibility, Safe exercise practices' },
  { code:'MRC-A02', club_slug:'marathon-club', month:M.AUG, title:'Beginner Running Workshop', description:'This workshop introduces beginners to the fundamentals of running, including posture, running mechanics, breathing techniques, pacing, and proper warm-up and cool-down exercises to develop safe and effective running habits.', competencies:'Running technique, Coordination, Breathing control, Physical endurance, Injury prevention, Self-confidence' },
  { code:'MRC-A03', club_slug:'marathon-club', month:M.SEP, title:'Endurance Run Training Session', description:'Participants engage in structured endurance training sessions designed to progressively improve cardiovascular endurance, stamina, pace consistency, and mental resilience required for long-distance running.', competencies:'Endurance, Stamina, Time management, Physical resilience, Self-monitoring, Consistency' },
  { code:'MRC-A04', club_slug:'marathon-club', month:M.OCT, title:'Speed & Interval Training Workshop', description:'This workshop develops participants\' speed, power, and anaerobic capacity through structured interval training methods.', competencies:'Speed development, Interval training, Anaerobic fitness, Sprint technique, Agility, Performance optimization' },
  { code:'MRC-A05', club_slug:'marathon-club', month:M.NOV, title:'Long Distance Group Run', description:'The Long Distance Group Run brings Marathon Club members together for structured outdoor running sessions, building community spirit, mutual motivation, and collective endurance.', competencies:'Endurance, Pacing, Teamwork, Physical stamina, Community spirit, Self-motivation' },
  { code:'MRC-A06', club_slug:'marathon-club', month:M.JAN, title:'Running Technique & Biomechanics Workshop', description:'This workshop focuses on improving running efficiency through proper biomechanics, posture, stride mechanics, foot strike patterns, arm movement, and body alignment.', competencies:'Running biomechanics, Movement analysis, Body coordination, Performance optimization, Injury prevention, Self-evaluation' },
  { code:'MRC-A07', club_slug:'marathon-club', month:M.JAN, title:'Strength & Conditioning for Runners', description:'This activity introduces participants to strength training, functional fitness, flexibility, mobility, and conditioning exercises specifically designed to improve running performance, muscular endurance, and injury resistance.', competencies:'Functional fitness, Muscular endurance, Flexibility, Core strength, Conditioning, Injury prevention' },
  { code:'MRC-A08', club_slug:'marathon-club', month:M.FEB, title:'Recovery & Injury Prevention Clinic', description:'This clinic provides practical knowledge on recovery strategies, injury prevention, stretching techniques, mobility exercises, sleep, and rehabilitation methods that help runners maintain consistent performance while minimizing injuries.', competencies:'Recovery management, Flexibility, Risk assessment, Injury prevention, Wellness planning, Self-care' },
  { code:'MRC-A09', club_slug:'marathon-club', month:M.MAR, title:'Campus Mini Marathon', description:'The Campus Mini Marathon provides participants with an opportunity to apply their training in a competitive yet supportive environment.', competencies:'Endurance, Goal achievement, Time management, Teamwork, Mental resilience, Competitive spirit' },
  { code:'MRC-A10', club_slug:'marathon-club', month:M.MAR, title:'Annual Marathon Championship', description:'The Annual Marathon Championship is the flagship event of the Marathon Club, providing participants with an opportunity to demonstrate their endurance, discipline, leadership, and competitive abilities.', competencies:'Advanced endurance, Leadership, Strategic planning, Stress management, Decision-making, Competitive excellence' },

  // ── SAFELIFE CLUB ────────────────────────────────────────────────────
  { code:'SL-A01', club_slug:'safelife-club', month:M.AUG, title:'SafeLife Club Orientation & Safety Awareness', description:'SafeLife Club Orientation & Safety Awareness is an introductory activity designed to familiarize students with the purpose, objectives, structure, and activities of the SafeLife Club.', competencies:'Safety awareness, Risk identification, Communication, Team participation, Social responsibility' },
  { code:'SL-A02', club_slug:'safelife-club', month:M.AUG, title:'Basic First Aid Workshop', description:'The Basic First Aid Workshop provides students with essential knowledge and practical skills required to respond effectively during common medical emergencies.', competencies:'First aid application, Emergency assessment, Patient support, Decision-making, Crisis response' },
  { code:'SL-A03', club_slug:'safelife-club', month:M.SEP, title:'CPR & AED Demonstration', description:'The CPR & AED Demonstration introduces students to critical lifesaving techniques used during cardiac emergencies.', competencies:'CPR competency, Emergency response, Team coordination, Confidence under pressure, Safety decision-making' },
  { code:'SL-A04', club_slug:'safelife-club', month:M.OCT, title:'Fire Safety & Evacuation Drill', description:'The Fire Safety & Evacuation Drill trains students to recognize fire hazards, follow emergency evacuation procedures, and respond safely during fire-related incidents.', competencies:'Emergency evacuation, Risk prevention, Situational awareness, Team coordination, Crisis management' },
  { code:'SL-A05', club_slug:'safelife-club', month:M.NOV, title:'Disaster Preparedness Workshop', description:'The Disaster Preparedness Workshop develops student awareness and readiness for natural and human-made disasters.', competencies:'Disaster preparedness, Risk assessment, Emergency planning, Leadership, Team collaboration' },
  { code:'SL-A06', club_slug:'safelife-club', month:M.JAN, title:'Road Safety Awareness Campaign', description:'The Road Safety Awareness Campaign is designed to educate students about safe transportation practices, traffic regulations, responsible road behaviour, and accident prevention.', competencies:'Safety communication, Public awareness, Risk identification, Community engagement, Responsible decision-making' },
  { code:'SL-A07', club_slug:'safelife-club', month:M.JAN, title:'Emergency Response Simulation', description:'The Emergency Response Simulation provides students with practical exposure to emergency situations through realistic scenarios.', competencies:'Crisis management, Emergency coordination, Leadership, Teamwork, Decision-making' },
  { code:'SL-A08', club_slug:'safelife-club', month:M.FEB, title:'Blood Donation & Organ Donation Awareness', description:'The Blood Donation & Organ Donation Awareness Programme promotes understanding of voluntary donation, healthcare responsibility, and community service.', competencies:'Health communication, Community outreach, Awareness campaigns, Ethical decision-making, Social responsibility' },
  { code:'SL-A09', club_slug:'safelife-club', month:M.MAR, title:'Mental Health First Aid Session', description:'The Mental Health First Aid Session introduces students to basic concepts of mental health awareness, emotional support, stress management, and psychological first aid.', competencies:'Active listening, Emotional intelligence, Peer support, Communication, Stress management' },
  { code:'SL-A10', club_slug:'safelife-club', month:M.MAR, title:'Annual Campus Safety Summit', description:'The Annual Campus Safety Summit is a flagship SafeLife Club event that brings together students, faculty members, safety professionals, and community partners to promote safety awareness, knowledge sharing, and innovation in emergency preparedness.', competencies:'Leadership, Presentation skills, Networking, Project management, Safety advocacy' },

  // ── YOGA CLUB ────────────────────────────────────────────────────────
  { code:'YC-A01', club_slug:'yoga-club', month:M.AUG, title:'Yoga Club Orientation & Wellness Awareness', description:'The Yoga Club Orientation & Wellness Awareness activity introduces students to the philosophy, objectives, and benefits of yoga as a holistic approach to physical, mental, emotional, and social well-being.', competencies:'Yoga philosophy awareness, Wellness self-care, Communication, Healthy routine development' },
  { code:'YC-A02', club_slug:'yoga-club', month:M.AUG, title:'Beginner Yoga Workshop', description:'The Beginner Yoga Workshop introduces participants to fundamental yoga postures, breathing techniques, and relaxation practices.', competencies:'Basic yoga practice, Body awareness, Flexibility development, Self-discipline, Consistency' },
  { code:'YC-A03', club_slug:'yoga-club', month:M.SEP, title:'Surya Namaskar Practice Session', description:'The Surya Namaskar Practice Session develops physical strength, flexibility, endurance, and concentration through systematic practice of the twelve-step Sun Salutation sequence.', competencies:'Physical endurance, Movement coordination, Concentration, Fitness management' },
  { code:'YC-A04', club_slug:'yoga-club', month:M.OCT, title:'Pranayama & Breathing Techniques Workshop', description:'This workshop introduces participants to yogic breathing techniques that improve respiratory efficiency, relaxation, concentration, and emotional balance.', competencies:'Breathing control, Stress regulation, Concentration, Emotional management' },
  { code:'YC-A05', club_slug:'yoga-club', month:M.NOV, title:'Meditation & Mindfulness Session', description:'The Meditation & Mindfulness Session develops awareness, concentration, emotional balance, and mental clarity through guided meditation practices.', competencies:'Mindfulness, Concentration, Emotional regulation, Stress coping' },
  { code:'YC-A06', club_slug:'yoga-club', month:M.JAN, title:'Flexibility & Mobility Yoga Workshop', description:'The Flexibility & Mobility Yoga Workshop focuses on improving joint mobility, muscle flexibility, posture, and body awareness through targeted yoga practices.', competencies:'Flexibility, Body awareness, Posture control, Safe movement, Physical wellness' },
  { code:'YC-A07', club_slug:'yoga-club', month:M.JAN, title:'Strength & Balance Yoga Session', description:'The Strength & Balance Yoga Session develops muscular strength, stability, coordination, and body control through yoga-based strength practices.', competencies:'Physical strength, Balance, Coordination, Functional fitness, Body control' },
  { code:'YC-A08', club_slug:'yoga-club', month:M.FEB, title:'Stress Management Through Yoga', description:'The Stress Management Through Yoga Programme introduces yoga-based approaches for managing academic, professional, and personal stress.', competencies:'Stress management, Emotional regulation, Relaxation techniques, Self-awareness, Resilience' },
  { code:'YC-A09', club_slug:'yoga-club', month:M.MAR, title:'Yoga for Academic Performance & Exam Wellness', description:'The Yoga for Academic Performance & Exam Wellness activity focuses on improving concentration, memory, relaxation, and emotional balance among students.', competencies:'Concentration, Stress coping, Time management, Lifestyle management, Self-regulation' },
  { code:'YC-A10', club_slug:'yoga-club', month:M.MAR, title:'International Day of Yoga Celebration & Wellness Campaign', description:'The International Day of Yoga Celebration & Wellness Campaign is a large-scale awareness activity that promotes yoga, healthy living, and community wellness.', competencies:'Event management, Leadership, Teamwork, Public communication, Community engagement' },
];

export async function POST(req: NextRequest) {
  if (req.headers.get('x-setup-key') !== 'KLSACsetup2026')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const rows = HWB_ACTIVITIES.map(a => ({
    code:          a.code,
    club_slug:     a.club_slug,
    domain:        'HWB',
    title:         a.title,
    description:   a.description,
    competencies:  a.competencies,
    month:         a.month || null,
    week:          'Week 1',
    activity_date: null,
    venue:         null,
    time_slot:     null,
    difficulty:    'Beginner',
  }));

  const { error } = await supabase.from('activities').upsert(rows, { onConflict: 'code' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath('/activities');
  revalidatePath('/');
  return NextResponse.json({ success: true, count: rows.length });
}
