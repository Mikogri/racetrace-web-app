export const siteName = 'Race Trace MTB'
export const siteUrl = 'https://racetracemtb.com'

export type PageMeta = {
  title: string
  description: string
}

const defaultDescription =
  'Explore Downhill World Cup results, live timing, rider rankings, split times and performance analytics. Compare riders and follow MTB downhill racing.'

// Titles and descriptions for the main pages. Rider, round and live-session pages use generic
// entries and are not listed in the sitemap.
export const pageMeta = {
  home: {
    title: 'Race Trace MTB | Downhill Results, Rankings & MTB Analytics',
    description: defaultDescription,
  },
  results: {
    title: 'Downhill World Cup Results & DH Qualifying | Race Trace MTB',
    description:
      'Downhill World Cup results for every round: qualifying, semi-finals and finals with split times, sector times and rider gaps.',
  },
  ranking: {
    title: 'Downhill Rider Rankings & MTB Ratings | Race Trace MTB',
    description:
      'Downhill rider rankings and MTB rider ratings built from World Cup results: pace, consistency, points and finals across seasons and tracks.',
  },
  live: {
    title: 'Downhill Live Timing & MTB World Cup Live Results | Race Trace MTB',
    description:
      'Follow Downhill World Cup live timing: live results, split times, sector gaps and the provisional standings while riders are on track.',
  },
  compare: {
    title: 'Downhill Rider Comparison & Performance Stats | Race Trace MTB',
    description:
      'Compare two downhill riders side by side: results, sector times, ratings and performance across World Cup seasons and tracks.',
  },
  fantasy: {
    title: 'MTB Downhill Fantasy Team & Predictions | Race Trace MTB',
    description:
      'Build a MTB downhill fantasy team with projected points and downhill fantasy predictions for the next World Cup round.',
  },
  about: {
    title: 'About Race Trace MTB | Independent Downhill Analytics',
    description:
      'Race Trace MTB is an independent, unofficial analytics project for UCI mountain bike downhill racing data, results and performance statistics.',
  },
  privacyPolicy: {
    title: 'Privacy Policy | Race Trace MTB',
    description: 'How Race Trace MTB processes data, which services it uses and what rights you have.',
  },
  rider: {
    title: 'Downhill Rider Stats & Results | Race Trace MTB',
    description: 'Downhill rider statistics, results, ratings and track performance from World Cup racing.',
  },
  round: {
    title: 'Downhill Round Results & Analysis | Race Trace MTB',
    description: 'Downhill round results with qualifying, finals, split times and race analysis.',
  },
  liveSession: {
    title: 'Live Session Results | Race Trace MTB',
    description: 'Live downhill session results with split times and gaps.',
  },
  notFound: {
    title: 'Page Not Found | Race Trace MTB',
    description: defaultDescription,
  },
} satisfies Record<string, PageMeta>
