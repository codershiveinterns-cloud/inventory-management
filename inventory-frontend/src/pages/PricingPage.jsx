import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const CheckIcon = () => (
  <svg className="mr-3 h-6 w-6 shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const MinusIcon = () => (
  <svg className="mr-3 h-6 w-6 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

export default function PricingPage() {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    setCurrentPlan(localStorage.getItem('app_plan') || 'basic');
  }, []);

  const handleChoosePlan = (plan) => {
    localStorage.setItem('app_plan', plan);
    setCurrentPlan(plan);
    navigate('/app');
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      priceMonthly: 59,
      priceYearly: 49,
      description: 'Essential features for small businesses.',
      features: [
        'Add/Edit/Delete products',
        'Manual inventory tracking',
        'Low stock tracking',
        'Recent updates',
        'Limit: 100 products'
      ],
      missingFeatures: ['Dashboard analytics', 'Priority support'],
      buttonText: currentPlan === 'basic' ? 'Current Plan' : 'Choose Basic',
      highlighted: false
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      priceMonthly: 199,
      priceYearly: 159,
      description: 'Advanced analytics and scale for growing operations.',
      features: [
        'Everything in Basic',
        'Dashboard analytics (total products, stock insights)',
        'Unlimited products',
        'Better performance',
        'Priority support'
      ],
      missingFeatures: [],
      buttonText: currentPlan === 'growth' ? 'Current Plan' : 'Choose Growth',
      highlighted: true
    }
  ];

  return (
    <section className="pb-16 pt-32 lg:pt-36 px-4">
      <PageHeader 
        badge="Pricing"
        title="Simple, transparent pricing"
        description="Choose the right plan to manage your inventory and scale your business."
      />

      <div className="mt-10 flex justify-center">
        <div className="relative flex items-center rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setIsYearly(false)}
            className={`relative w-32 rounded-full py-2.5 text-sm font-semibold transition-colors ${
              !isYearly ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
            {!isYearly && (
               <span className="absolute inset-0 rounded-full border border-white/10 bg-white/10 mix-blend-multiply" />
            )}
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`relative w-32 rounded-full py-2.5 text-sm font-semibold transition-colors ${
              isYearly ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Yearly
            <span className="absolute -top-3 -right-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/20">
              Save 20%
            </span>
            {isYearly && (
               <span className="absolute inset-0 rounded-full border border-white/10 bg-white/10 mix-blend-multiply" />
            )}
          </button>
        </div>
      </div>
      
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">
        {plans.map(plan => {
          const currentPrice = isYearly ? plan.priceYearly : plan.priceMonthly;
          
          return (
          <div 
            key={plan.id}
            className={`relative flex flex-col rounded-3xl border ${
              plan.highlighted 
                ? 'border-cyan-500/50 bg-gradient-to-b from-cyan-900/20 to-slate-900 shadow-2xl shadow-cyan-500/10' 
                : 'border-white/10 bg-white/5'
            } p-8 xl:p-10`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-0 right-0 mx-auto w-max rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                Most Popular
              </div>
            )}
            {isYearly && plan.highlighted && (
              <div className="absolute top-4 right-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Best Value
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline text-white">
                <span className="text-5xl font-extrabold tracking-tight">€{currentPrice}</span>
                <span className="ml-1 text-xl font-semibold text-slate-400">/month</span>
              </div>
              {isYearly && (
                <p className="mt-2 text-sm text-emerald-400 font-medium">
                  Billed annually (Save €{(plan.priceMonthly - plan.priceYearly) * 12}/year)
                </p>
              )}
            </div>
            
            <ul className="mb-10 flex-1 space-y-4">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-start">
                  <CheckIcon />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
              {plan.missingFeatures.map(feature => (
                <li key={feature} className="flex items-start opacity-40">
                  <MinusIcon />
                  <span className="text-slate-500">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleChoosePlan(plan.id)}
              disabled={currentPlan === plan.id}
              className={`mt-auto w-full rounded-xl px-4 py-3.5 text-center text-sm font-bold transition-all duration-300 ${
                currentPlan === plan.id
                  ? 'cursor-not-allowed bg-white/5 text-slate-500'
                  : plan.highlighted
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg hover:scale-[1.02] hover:shadow-cyan-500/25 active:scale-95'
                  : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        )})}
      </div>
    </section>
  );
}
