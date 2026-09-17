import { TableFeedbackState } from '../../components/feedback/states'
import { PageContainer, PageHeader, Section } from '../../components/layout/page-container'

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Privacy Policy"
        eyebrow="Privacy // Data // Transparency"
        description="Information about how RaceTrace handles personal data and respects your privacy."
      />
      <Section>
        <TableFeedbackState
          type="empty"
          label="No content available"
          description="There's no content here yet."
        />
      </Section>
    </PageContainer>
  )
}
