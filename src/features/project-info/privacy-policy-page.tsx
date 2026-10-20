import { PageContainer, PageHeader, Section } from '../../components/layout/page-container'
import { Typography } from '../../components/ui/typography'
import layout from './about-page.module.css'
import styles from './privacy-policy-page.module.css'

const contact = <a href="mailto:contact@racetracemtb.com">contact@racetracemtb.com</a>

const sections = [
  {
    title: 'What information do we process?',
    paragraphs: [
      <><strong>Visitors:</strong> Technical information used to operate and protect the website, such as IP addresses, request times, URLs and browser headers. Searches and selected filters may appear in requests or browser history. You can browse RaceTrace without creating an account.</>,
      <><strong>Email correspondence:</strong> If you email {contact} (for example, to request a correction or deletion of athlete information), we process your email address and the content of your message to handle your request. RaceTrace does not have an in-app messaging system.</>,
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
      <>We use Cloudflare for website delivery and security, Railway for API hosting and Supabase for data storage. These providers may generate technical, access, security or error logs as part of their services. The exact production logging settings and retention periods still need to be verified. Some pages request flags from FlagCDN or live timing from ChronoRace or Tissot Timing. These services may receive technical connection data, including IP addresses.</>,
      <>Some providers may process information outside the European Economic Area. Relevant safeguards and transfer arrangements are determined by the applicable provider agreements and configuration; details can be requested using the contact in &quot;Who is responsible?&quot;.</>,
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
      <>We maintain historical competition records while they remain necessary for RaceTrace&apos;s sporting archive, subject to applicable rights and data-minimisation requirements.</>,
      <><strong>Email correspondence:</strong> Messages sent to {contact} are retained only as needed to respond to the request and meet applicable legal obligations. A specific retention period has not yet been established.</>,
      <><strong>Technical logs:</strong> Cloudflare, Railway and Supabase may retain request, security or error logs depending on their actual service configuration. Which logs are stored, where and for how long remains subject to verification.</>,
      <><strong>Backups:</strong> RaceTrace does not maintain separate, self-managed backups. Infrastructure providers, particularly the database provider, may hold automated backups or other retained copies depending on the service plan and settings. Provider backup settings, retention and deletion rules remain subject to verification.</>,
      <>Temporary application caches are distinct from these records and do not determine how long source data is stored.</>,
    ],
  },
  {
    title: 'Your rights',
    paragraphs: [
      <>Subject to the relevant legal conditions, you can request access, correction, deletion or restriction of your personal information, or object to processing based on legitimate interests. Other GDPR rights apply where relevant.</>,
      <>Email {contact} and identify the information concerned. We normally respond within one month, subject to lawful extensions. You may complain to your data-protection authority, including Poland&apos;s <a href="https://uodo.gov.pl/">UODO</a>.</>,
    ],
  },
  {
    title: 'Updates',
    paragraphs: [
      <>We will update this notice when our processing practices change and show the latest publication date above.</>,
    ],
  },
  {
    title: 'Who is responsible?',
    paragraphs: [
      <>The data controller is Mikołaj Grigoriew, based in Poland. For privacy questions and requests, email {contact}.</>,
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
      <div className={styles.notice}>
        <Typography>Last updated: <time dateTime="2026-10-20">20 October 2026</time></Typography>
        <Typography>RaceTrace (<a href="https://racetracemtb.com">racetracemtb.com</a>) is an independent MTB downhill statistics and analysis platform. This notice explains how we process information about visitors and athletes.</Typography>
      </div>
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
