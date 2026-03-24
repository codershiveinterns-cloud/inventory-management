import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'Getting Started',
    body:
      'The Help Center is designed to help new teams onboard quickly, understand the dashboard, and connect their workflow with confidence.',
    points: ['Account setup', 'Dashboard basics', 'Product organization']
  },
  {
    title: 'Troubleshooting',
    body:
      'When something feels unclear, we focus on giving teams direct next steps instead of sending them through unnecessary complexity.',
    points: ['Common issue guidance', 'Workflow fixes', 'Configuration support']
  },
  {
    title: 'Operational Best Practices',
    body:
      'Our support content does more than solve issues. It helps teams improve the quality and consistency of daily inventory work.',
    points: ['Stock control habits', 'Process recommendations', 'Usage guidance']
  },
  {
    title: 'Support Philosophy',
    body:
      'We believe support should feel clear, responsive, and useful, especially when teams rely on inventory tools for core business decisions.',
    points: ['Helpful content', 'Less friction', 'Faster resolution']
  }
];

export default function HelpPage() {
  return (
    <MarketingPageLayout
      eyebrow="Help Center"
      title="Support designed to keep inventory teams moving"
      description="Find guidance, setup help, and practical troubleshooting resources that make InventoryFlow easier to use at every stage."
      sections={sections}
    />
  );
}
