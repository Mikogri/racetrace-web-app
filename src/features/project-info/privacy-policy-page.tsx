import { EmptyState } from '../../components/feedback/states'
import { PageContainer, PageHeader, Section } from '../../components/layout/page-container'

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Privacy Policy"
        eyebrow="Project information"
        description="The final privacy policy content has not yet been supplied by the project owner."
      />
      <Section>
        <EmptyState
          title="Policy Content Pending"
          description="This page is intentionally left without invented legal text until the approved policy is provided."
        />
      </Section>
    </PageContainer>
  )
}
