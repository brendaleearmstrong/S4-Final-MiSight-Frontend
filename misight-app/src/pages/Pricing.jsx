import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Check } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Basic',
      price: '299',
      description: 'For community stakeholders and small operations',
      features: [
        'Environmental data access',
        'Basic safety reporting',
        'Community updates',
        'Monthly reports',
        '8x5 Support'
      ]
    },
    {
      name: 'Professional',
      price: '799',
      description: 'For medium-sized mining operations',
      features: [
        'All Basic features',
        'Real-time monitoring',
        'Advanced analytics',
        'Custom dashboards',
        'Priority support',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '1499',
      description: 'For large mining operations',
      features: [
        'All Professional features',
        'Unlimited users',
        'Custom integrations',
        'Dedicated support',
        'On-site training',
        'Data retention policy'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose the plan that best fits your mining operation needs
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                  plan.popular ? 'bg-gray-900 text-white' : 'bg-white'
                }`}
              >
                <h3 className={`text-lg font-semibold leading-8 ${
                  plan.popular ? 'text-white' : 'text-gray-900'
                }`}>
                  {plan.name}
                </h3>
                
                <p className="mt-4 text-sm leading-6 text-gray-400">
                  {plan.description}
                </p>
                
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-semibold">/month</span>
                </p>
                
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check className={`h-6 w-6 ${
                        plan.popular ? 'text-amber-500' : 'text-amber-600'
                      }`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`mt-8 w-full rounded-md px-3.5 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    plan.popular
                      ? 'bg-amber-500 text-white hover:bg-amber-400 focus-visible:outline-amber-500'
                      : 'bg-amber-600 text-white hover:bg-amber-500 focus-visible:outline-amber-600'
                  }`}
                >
                  Get started today
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}