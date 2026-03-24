import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'Why InventoryFlow Exists',
    body:
      'InventoryFlow was created to give modern businesses a better way to manage stock, reduce friction, and operate with greater confidence.',
    points: ['Less manual work', 'Clearer operational visibility', 'Faster business decisions']
  },
  {
    title: 'Our Mission',
    body:
      'We want inventory management to feel less reactive and more strategic, helping teams run smoother across products, stores, and systems.',
    points: ['Real-time awareness', 'Better coordination', 'Simpler execution']
  },
  {
    title: 'Built for eCommerce Teams',
    body:
      'From growing Shopify brands to operations teams scaling their catalog, our platform is designed to support real-world inventory pressure.',
    points: ['Shopify alignment', 'Operational speed', 'Dashboard-first clarity']
  },
  {
    title: 'How We Think About Product',
    body:
      'We build with a premium SaaS mindset: strong UX, simple workflows, and features that help teams act faster with less noise.',
    points: ['Clean design', 'Scalable architecture', 'Practical product decisions']
  }
];

export default function AboutPage() {
  return (
    <MarketingPageLayout
      eyebrow="About InventoryFlow"
      title="A modern platform for better inventory operations"
      description="InventoryFlow helps teams simplify stock management, improve visibility, and support smarter growth with cleaner systems."
      sections={sections}
    />
  );
}
