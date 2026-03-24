import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'What We Publish',
    body:
      'The InventoryFlow blog focuses on practical inventory strategy, product updates, and operating advice for modern eCommerce teams.',
    points: ['Inventory best practices', 'Platform product notes', 'Operational insights']
  },
  {
    title: 'Topics You Can Expect',
    body:
      'We cover stock management, Shopify workflows, analytics interpretation, and the systems that help teams scale with less friction.',
    points: ['Fulfillment coordination', 'Catalog management', 'Reporting strategies']
  },
  {
    title: 'Built for Practitioners',
    body:
      'Every article is written to be useful for people making day-to-day inventory decisions, not just browsing high-level trends.',
    points: ['Actionable examples', 'Clear explanations', 'Decision-ready guidance']
  },
  {
    title: 'Why It Matters',
    body:
      'Better inventory decisions come from better information, and the blog exists to help teams work smarter with both.',
    points: ['Stronger operations', 'Fewer inventory errors', 'Better planning']
  }
];

export default function BlogPage() {
  return (
    <MarketingPageLayout
      eyebrow="Blog"
      title="Insights for teams building stronger inventory operations"
      description="Read practical content on stock visibility, connected workflows, and the patterns that help inventory systems scale cleanly."
      sections={sections}
    />
  );
}
