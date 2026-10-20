import { PageContainer, PageHeader, Section } from '../../components/layout/page-container'
import { Typography } from '../../components/ui/typography'
import layout from './about-page.module.css'
import styles from './privacy-policy-page.module.css'

const contact = <a href="mailto:contact@racetracemtb.com">contact@racetracemtb.com</a>

const sections = [
  {
    title: 'Who is responsible?',
    paragraphs: [
      <>The data controller is Mikołaj Grigoriew, based in Poland. For privacy matters, contact {contact}.</>,
    ],
  },
  {
    title: 'What information do we process?',
    paragraphs: [
      <><strong>Visitors:</strong> Technical information required to operate and protect the website, such as IP addresses, request times, URLs and browser headers. Searches and selected filters may appear in requests or browser history. You can browse RaceTrace without creating an account.</>,
      <><strong>Athletes:</strong> Published sporting information, including names, nationalities, categories, ages or dates of birth where available, teams, UCI identifiers, race entries, results, positions, points, times and splits. This includes competitors in junior categories. RaceTrace also calculates ratings, comparisons, forecasts and Fantasy statistics.</>,
      <>A round-specific <code>entryStatus</code> describes confirmed entry, confirmed non-entry or insufficient evidence. It does not indicate an athlete&apos;s health or fitness to compete. Athlete information may be accessible through public pages and read-only API endpoints.</>,
    ],
  },
  {
    title: 'Sources, purposes and legal grounds',
    paragraphs: [
      <>We obtain competition information from sources such as UCI MTB World Series results, ChronoRace, Tissot Timing, published race documents and Pinkbike Fantasy catalogue data. We use it to maintain historical results, publish independent analyses and generate sporting predictions. RaceTrace ratings and forecasts are <strong>not official UCI assessments</strong>.</>,
      <>The proposed legal basis for ordinary sporting information and proportionate platform-security processing is legitimate interests (GDPR Article 6(1)(f)), subject to a documented assessment of necessity and athletes&apos; rights. We handle privacy requests and correspondence under the legal grounds applicable to those activities. Public availability does not mean an athlete has consented to all uses of their information.</>,
    ],
  },
  {
    title: 'Service providers and international transfers',
    paragraphs: [
      <>We use Cloudflare for website delivery and security, Railway for API hosting and Supabase for data storage. Some pages request flags from FlagCDN or live timing from ChronoRace or Tissot Timing. These services may receive technical connection data, including IP addresses.</>,
      <>Some providers may process information outside the European Economic Area. Relevant safeguards and transfer arrangements are determined by the applicable provider agreements and configuration; details can be requested using the contact above.</>,
    ],
  },
  {
    title: 'Cookies and browser storage',
    paragraphs: [
      <>The reviewed application does not include advertising or third-party visitor-tracking software. It uses <code>localStorage</code> for competition-category definitions and <code>sessionStorage</code> for scroll restoration. Local category data stays until cleared or replaced; scroll data normally lasts for the browser session. Cloudflare may use security cookies depending on its configuration. You can clear site data through your browser.</>,
    ],
  },
  {
    title: 'Retention',
    paragraphs: [
      <>We maintain historical competition records while they remain necessary for RaceTrace&apos;s sporting archive, subject to applicable rights and data-minimisation requirements. Technical logs, messages, caches and backups are kept according to their operational or legal purposes.</>,
      <>Specific retention periods for logs, correspondence and backups are awaiting confirmation.</>,
    ],
  },
  {
    title: 'Your rights',
    paragraphs: [
      <>Subject to the relevant legal conditions, you can request access, correction, deletion or restriction of your personal information, or object to processing based on legitimate interests. Other GDPR rights apply where relevant.</>,
      <>Contact {contact} and identify the information concerned. We normally respond within one month, subject to lawful extensions. You may complain to your data-protection authority, including Poland&apos;s <a href="https://uodo.gov.pl/">UODO</a>.</>,
    ],
  },
  {
    title: 'Updates',
    paragraphs: [
      <>We will update this notice when our processing practices change and show the latest publication date once the policy has been approved.</>,
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <PageContainer className={`${layout.page} ${styles.page}`}>
      <PageHeader
        title="Privacy Policy"
        eyebrow="Privacy // Data // Transparency"
        description="Information about how RaceTrace handles personal data and respects your privacy."
      />
      <aside role="note" className={styles.notice}>
        <Typography><strong>Draft — not yet an effective privacy notice.</strong> Retention periods and production practices must be confirmed before publication.</Typography>
        <Typography>RaceTrace (<a href="https://racetracemtb.com">racetracemtb.com</a>) is an independent MTB downhill statistics and analysis platform. This notice explains how we process information about visitors and athletes.</Typography>
      </aside>
      {sections.map((section, index) => (
        <Section key={section.title} className={layout.section} aria-labelledby={`privacy-section-${index + 1}`}>
          <h2 id={`privacy-section-${index + 1}`} className={`${layout.label} ${styles.heading}`}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span aria-hidden="true">//</span>
            <span>{section.title}</span>
          </h2>
          <div className={layout.copy}>
            {section.paragraphs.map((paragraph, paragraphIndex) => <Typography key={paragraphIndex}>{paragraph}</Typography>)}
          </div>
        </Section>
      ))}
    </PageContainer>
  )
}
