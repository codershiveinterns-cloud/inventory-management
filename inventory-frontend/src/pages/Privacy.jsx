import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'Information We Collect',
    body:
      'InventoryFlow collects account, usage, and operational data that helps teams access the platform and manage inventory effectively.',
    points: ['Account details', 'Usage analytics', 'Operational metadata']
  },
  {
    title: 'How We Use Data',
    body:
      'We use collected information to deliver the service, improve product performance, and support customer operations responsibly.',
    points: ['Platform functionality', 'Performance improvement', 'Support workflows']
  },
  {
    title: 'Data Protection',
    body:
      'We aim to handle information with care through secure access patterns, controlled systems, and a practical security posture.',
    points: ['Access controls', 'Secure authentication', 'Operational safeguards']
  },
  {
    title: 'Your Choices',
    body:
      'Customers can review account information, manage platform usage, and reach out when they need support related to their data.',
    points: ['Account management', 'Support requests', 'Transparency in handling']
  }
];

export default function PrivacyPage() {
  return (
    <MarketingPageLayout
      eyebrow="Privacy Policy"
      title="How InventoryFlow handles customer and platform data"
      description="We believe privacy should be understandable, practical, and aligned with the needs of businesses using modern SaaS tools."
      sections={sections}
    />
  );
}
