import Button from '../components/Button';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';

export default function ShopifyConnectPage() {
  return (
    <section>
      <PageHeader
        badge="Shopify Ready"
        title="Prepare storefront connection before the OAuth flow goes live"
        description="This placeholder screen gives your team a polished destination for store connection while the backend Shopify OAuth implementation is being completed."
      />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="fade-in-up">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-200">
              Store Integration
            </p>
            <h3 className="mt-4 text-3xl font-extrabold text-white">
              Connect your Shopify store when you are ready to sync products and inventory
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Use this page as the future launch point for Shopify OAuth. The button is already in place, so once the backend redirect URL exists you can swap the placeholder action with the live auth request.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="success">Connect Store</Button>
            <Button variant="secondary">View OAuth Placeholder</Button>
          </div>

          <div className="mt-8 rounded-3xl border border-dashed border-cyan-300/20 bg-slate-900/40 p-5">
            <p className="text-sm font-semibold text-cyan-200">Suggested OAuth handoff</p>
            <code className="mt-3 block overflow-x-auto rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-300">
              GET /shopify/connect -&gt; redirect merchant to Shopify authorization screen
            </code>
          </div>
        </Card>

        <Card className="fade-in-up">
          <h3 className="text-xl font-bold text-white">Connection checklist</h3>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">1. App credentials</p>
              <p className="mt-1">Store your Shopify client ID and secret in the backend environment.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">2. OAuth callback</p>
              <p className="mt-1">Point Shopify back to a backend callback route that exchanges the code for tokens.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">3. Inventory sync</p>
              <p className="mt-1">Use the existing product and inventory pages as the UI foundation for future store sync status.</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
