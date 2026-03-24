import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'Using the Service',
    body:
      'By accessing InventoryFlow, users agree to use the platform responsibly and in a way that supports secure, lawful operations.',
    points: ['Authorized usage only', 'Accurate account information', 'Compliance with applicable rules']
  },
  {
    title: 'Subscriptions and Access',
    body:
      'Plan access, feature availability, and account scope depend on the subscription level selected by the customer.',
    points: ['Plan-based access', 'Feature availability', 'Account responsibility']
  },
  {
    title: 'User Responsibilities',
    body:
      'Teams are responsible for maintaining the confidentiality of credentials and the accuracy of the inventory data they manage.',
    points: ['Protect login credentials', 'Review account activity', 'Maintain accurate records']
  },
  {
    title: 'Service Expectations',
    body:
      'We work to provide a reliable platform, but product functionality, roadmap, and availability may evolve over time.',
    points: ['Continuous improvements', 'Feature updates', 'Reasonable service limitations']
  }
];

export default function TermsPage() {
  return (
    <MarketingPageLayout
      eyebrow="Terms & Conditions"
      title="Clear terms for using the InventoryFlow platform"
      description="These terms outline how InventoryFlow is accessed, what users can expect, and how we frame responsible platform usage."
      sections={sections}
    />
  );
}
