import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'What We Value',
    body:
      'We care about product quality, thoughtful execution, and building tools that genuinely make business operations easier.',
    points: ['Ownership', 'Clarity', 'Customer empathy']
  },
  {
    title: 'How We Work',
    body:
      'Our team moves with focus and collaboration, balancing speed with polish so every release improves the customer experience.',
    points: ['Small teams', 'Fast iteration', 'High product standards']
  },
  {
    title: 'Who We Hire',
    body:
      'We look for people who care about great systems, practical problem-solving, and building software that feels useful from day one.',
    points: ['Product thinkers', 'Strong communicators', 'Execution-minded builders']
  },
  {
    title: 'Why Join InventoryFlow',
    body:
      'If you want to help shape the future of inventory operations for modern brands, you will have room here to make visible impact.',
    points: ['Meaningful work', 'Modern stack', 'Growth-minded environment']
  }
];

export default function CareersPage() {
  return (
    <MarketingPageLayout
      eyebrow="Careers"
      title="Help build the next generation of inventory software"
      description="We are creating a cleaner, faster inventory platform for modern businesses and looking for people who want to shape that future with us."
      sections={sections}
    />
  );
}
