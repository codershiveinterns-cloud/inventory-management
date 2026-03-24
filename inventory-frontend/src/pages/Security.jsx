import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'Authentication Controls',
    body:
      'InventoryFlow uses secure authentication patterns to help protect accounts and ensure that access remains appropriately controlled.',
    points: ['Verified account workflows', 'Protected access', 'Session-aware security']
  },
  {
    title: 'Platform Safeguards',
    body:
      'We approach security with layered protections designed to reduce risk and support reliable day-to-day operations.',
    points: ['Access boundaries', 'Secure product architecture', 'Operational safeguards']
  },
  {
    title: 'Monitoring and Awareness',
    body:
      'Visibility into platform behavior helps us maintain product quality and respond more effectively when issues arise.',
    points: ['Operational monitoring', 'Issue awareness', 'Service reliability']
  },
  {
    title: 'Shared Responsibility',
    body:
      'Security works best when product controls and customer usage habits support each other across accounts, devices, and workflows.',
    points: ['Strong passwords', 'Account awareness', 'Responsible access management']
  }
];

export default function SecurityPage() {
  return (
    <MarketingPageLayout
      eyebrow="Security"
      title="A practical security posture for modern inventory operations"
      description="InventoryFlow is built with secure access, sensible safeguards, and product decisions that support trust across the platform."
      sections={sections}
    />
  );
}
