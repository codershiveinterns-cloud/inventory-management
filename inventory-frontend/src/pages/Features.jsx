import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'Live Inventory Visibility',
    body:
      'See stock levels, product movement, and warehouse readiness from one modern workspace built for operational clarity.',
    points: ['Central SKU tracking', 'Variant-level visibility', 'Faster stock decisions']
  },
  {
    title: 'Smart Alerts and Monitoring',
    body:
      'Stay ahead of low-stock issues with proactive signals that help teams replenish faster and avoid missed revenue.',
    points: ['Threshold-based alerts', 'Action-ready summaries', 'Operational confidence']
  },
  {
    title: 'Shopify Sync Workflows',
    body:
      'Keep your storefront and operations aligned with connected updates that reduce manual work and data drift.',
    points: ['Store sync support', 'Simplified product updates', 'Cleaner workflows']
  },
  {
    title: 'Analytics That Support Action',
    body:
      'Move beyond raw inventory counts with reporting views that help teams plan, optimize, and scale with better context.',
    points: ['Trend visibility', 'Category-level insight', 'Performance-ready dashboards']
  }
];

export default function FeaturesPage() {
  return (
    <MarketingPageLayout
      eyebrow="Product Features"
      title="Inventory capabilities designed for modern eCommerce operations"
      description="InventoryFlow brings tracking, sync, alerts, and analytics into one clean SaaS experience that helps teams work faster."
      sections={sections}
    />
  );
}
