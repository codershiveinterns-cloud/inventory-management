import MarketingPageLayout from '../components/MarketingPageLayout';

const sections = [
  {
    title: 'Essential Cookies',
    body:
      'Some cookies support core platform functionality such as session continuity, sign-in state, and general site performance.',
    points: ['Authentication support', 'Session continuity', 'Functional reliability']
  },
  {
    title: 'Performance and Analytics',
    body:
      'Usage-related cookies may help us understand product behavior and improve the quality of the overall experience.',
    points: ['Usage insights', 'Performance improvement', 'Product refinement']
  },
  {
    title: 'Preference Handling',
    body:
      'Cookies can also help preserve settings that make the experience more consistent for returning users.',
    points: ['Saved preferences', 'Reduced friction', 'Consistent experience']
  },
  {
    title: 'Control and Transparency',
    body:
      'Users can manage cookie behavior through browser settings while balancing that against the functionality they expect from the app.',
    points: ['Browser controls', 'Transparent usage', 'User choice']
  }
];

export default function CookiesPage() {
  return (
    <MarketingPageLayout
      eyebrow="Cookie Policy"
      title="How cookies support the InventoryFlow experience"
      description="Our cookie approach is centered on keeping the platform functional, measurable, and easier to use while remaining transparent."
      sections={sections}
    />
  );
}
