export const LOCAL_PUBLICATIONS = [
  {
    slug:        'august-story-vol1',
    title:       'August Story — Vol. 1',
    type:        'Magazine',
    year:        '2026',
    description: 'The first volume of August Story, KL SAC\'s flagship student magazine.',
    pdfPath:     '/publications/august-story-vol1.pdf',
  },
  {
    slug:        'independence-day-2026',
    title:       'Independence Day Special',
    type:        'Magazine',
    year:        '2026',
    description: 'A special edition celebrating India\'s Independence Day — curated by KL SAC.',
    pdfPath:     '/publications/independence-day-2026.pdf',
  },
] as const;

export type LocalPublication = (typeof LOCAL_PUBLICATIONS)[number];
