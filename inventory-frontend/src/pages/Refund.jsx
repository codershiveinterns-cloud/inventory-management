import PageHeader from '../components/PageHeader';

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8">
      <PageHeader 
        badge="Legal"
        title="Refund Policy"
        description="Understanding our billing structure."
      />
      
      <div className="mt-12 space-y-8 text-slate-300 leading-relaxed max-w-3xl border border-white/10 bg-white/5 p-8 xl:p-12 rounded-3xl shadow-xl mx-auto">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Subscription-Based Access</h2>
          <p>
            InventoryFlow is a subscription-based Software-as-a-Service (SaaS) application. Secure access to the dashboard, analytics, and primary toolsets is provided strictly on a recurring billing cycle as selected during your plan registration (e.g., monthly).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">2. Non-Refundable Subscriptions</h2>
          <p>
            Because our services immediately provision and grant comprehensive access to digital infrastructure and premium Shopify data tracking upon payment, <strong>no refunds are provided after a subscription is activated</strong> or renewed. All charges are effectively final upon processing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Canceling Your Plan</h2>
          <p>
            You retain the explicit right to cancel your subscription at any time directly through your Shopify App dashboard or by contacting our engineering support team directly.
          </p>
          <p className="mt-3">
            Upon cancellation, your active subscription will instantly cease auto-renewal attempts. However, <strong>your premium access to InventoryFlow will continue uninterrupted until the permanent end of your current active billing period.</strong> We do not offer or authorize prorated refunds for canceled or mid-cycle subscription halting.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">4. Support & Billing Exceptions</h2>
          <p>
            If you distinctly believe there has been a critical system billing error regarding your connected account, please contact our support team utilizing the dashboard immediately. We will review exceptional billing disputes solely on a case-by-case basis corresponding to our server service logs.
          </p>
        </section>
      </div>
    </div>
  );
}
