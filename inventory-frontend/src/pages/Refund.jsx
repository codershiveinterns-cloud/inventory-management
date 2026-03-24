import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'Billing Expectations',
    body:
      'Subscription charges are tied to the selected plan and billing cycle, with transparent access tied to the service level chosen.',
    points: ['Plan-based billing', 'Clear subscription scope', 'Renewal awareness']
  },
  {
    title: 'Refund Review Process',
    body:
      'Refund requests are reviewed based on billing timing, service usage, and the nature of the issue reported by the customer.',
    points: ['Case-by-case review', 'Usage context considered', 'Fair support process']
  },
  {
    title: 'When Refunds May Apply',
    body:
      'Eligible scenarios may include duplicate charges, technical billing errors, or exceptional service-related circumstances.',
    points: ['Duplicate payments', 'Billing mistakes', 'Exceptional product issues']
  },
  {
    title: 'How to Request Help',
    body:
      'Customers should contact support promptly with account and billing details so the issue can be investigated efficiently.',
    points: ['Fast outreach', 'Clear billing context', 'Support-led resolution']
  }
];

export default function RefundPage() {
  return (
    <MarketingPageLayout
      eyebrow="Refund Policy"
      title="A fair policy for billing questions and refund requests"
      description="InventoryFlow reviews refund scenarios with context, clarity, and a customer-first approach to billing support."
      sections={sections}
    />
  );
}
