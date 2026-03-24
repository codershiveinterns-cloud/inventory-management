import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'Free Plan',
    body:
      'A practical starting point for teams building inventory visibility and basic stock awareness into their workflow.',
    points: ['Core dashboard access', 'Starter product tracking', 'Basic low-stock monitoring']
  },
  {
    title: 'Pro Plan',
    body:
      'Best for growing brands that need stronger inventory coordination, Shopify sync, and more operational insight.',
    points: ['Advanced analytics', 'Shopify-ready sync flow', 'Unlimited SKU support']
  },
  {
    title: 'Business Plan',
    body:
      'Built for teams managing more users, more volume, and more operational complexity across the business.',
    points: ['Priority support', 'Team collaboration support', 'Custom workflow options']
  },
  {
    title: 'What Every Plan Includes',
    body:
      'Every InventoryFlow plan is designed around a premium product experience, strong usability, and a clean path to scale.',
    points: ['Dark modern interface', 'Responsive SaaS design', 'Secure account workflows']
  }
];

export default function PricingPage() {
  return (
    <MarketingPageLayout
      eyebrow="Pricing"
      title="Plans that grow with your inventory operations"
      description="Choose a setup that matches your current stage, then expand with more sync, more insight, and more team support as you scale."
      sections={sections}
    />
  );
}
