import { PageContainer, PageHeader, Section } from '../../components/layout/page-container'
import { Typography } from '../../components/ui/typography'
import { aboutSections } from './content/about-content'
import styles from './about-page.module.css'
import { pageMeta } from '../../config/seo'
import { usePageMeta } from '../../hooks/use-page-meta'

export default function AboutPage() {
  usePageMeta(pageMeta.about)
  return (
    <PageContainer className={styles.page}>
      <PageHeader
        title="About Project"
        eyebrow="Built Independently // Data-driven // Unofficial project"
        description="An independent downhill analytics project built to turn race timing, rider performance and season data into a clearer view of the sport."
      />
      {aboutSections.map((section) => (
        <Section key={section.index} className={styles.section}>
          <div className={styles.label}>
            <span>{section.index}</span>
            <span>//</span>
            <span>{section.title}</span>
          </div>
          <div className={styles.copy}>
            {section.paragraphs.map((paragraph) => (
              <Typography key={paragraph}>{paragraph}</Typography>
            ))}
          </div>
        </Section>
      ))}
    </PageContainer>
  )
}
