import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { 
  Shield, Activity, BarChart3, Users, 
  Database, Bell, FileText, Clock
} from 'lucide-react';

export default function Solutions() {
  const solutions = [
    {
      title: "Environmental Monitoring",
      description: "Real-time tracking and analysis of environmental metrics",
      features: [
        "Air quality monitoring",
        "Water quality analysis",
        "Soil contamination tracking",
        "Emission monitoring"
      ],
      icon: <Activity className="h-8 w-8" />
    },
    {
      title: "Safety Management",
      description: "Comprehensive safety incident tracking and reporting",
      features: [
        "Incident reporting",
        "Risk assessments",
        "Safety compliance",
        "Emergency response"
      ],
      icon: <Shield className="h-8 w-8" />
    },
    {
      title: "Analytics Platform",
      description: "Advanced data analytics and visualization tools",
      features: [
        "Custom dashboards",
        "Trend analysis",
        "Predictive analytics",
        "Performance metrics"
      ],
      icon: <BarChart3 className="h-8 w-8" />
    },
    {
      title: "Stakeholder Portal",
      description: "Transparent communication platform",
      features: [
        "Community updates",
        "Report sharing",
        "Feedback system",
        "Document management"
      ],
      icon: <Users className="h-8 w-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Complete Mining Management Solutions
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Integrated solutions designed specifically for modern mining operations
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      {solution.icon}
                    </div>
                    <h3 className="ml-4 text-xl font-semibold">{solution.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{solution.description}</p>
                  <ul className="space-y-3">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 text-amber-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">Key Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Database className="h-6 w-6" />,
                  title: "Centralized Data",
                  description: "All your mining data in one secure platform"
                },
                {
                  icon: <Bell className="h-6 w-6" />,
                  title: "Real-time Alerts",
                  description: "Instant notifications for critical events"
                },
                {
                  icon: <FileText className="h-6 w-6" />,
                  title: "Automated Reports",
                  description: "Generate reports with a single click"
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "24/7 Monitoring",
                  description: "Continuous monitoring and support"
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center p-6 bg-gray-900 rounded-xl text-white">
                  <div className="flex justify-center mb-4 text-amber-500">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 text-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-500"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}