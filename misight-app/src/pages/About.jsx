import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Shield, Activity, BarChart3, Users, Eye, Cloud } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-amber-500" />,
      title: "Safety Management",
      description: "Comprehensive safety incident tracking, reporting, and analysis tools to maintain compliance and protect workers."
    },
    {
      icon: <Activity className="w-12 h-12 text-amber-500" />,
      title: "Environmental Monitoring",
      description: "Real-time environmental data collection and analysis to ensure compliance with regulations and minimize impact."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-amber-500" />,
      title: "Analytics Dashboard",
      description: "Advanced data visualization and reporting tools to make informed decisions and optimize operations."
    },
    {
      icon: <Users className="w-12 h-12 text-amber-500" />,
      title: "Stakeholder Portal",
      description: "Transparent communication platform for sharing relevant data and updates with community stakeholders."
    },
    {
      icon: <Eye className="w-12 h-12 text-amber-500" />,
      title: "Real-time Monitoring",
      description: "24/7 monitoring of critical environmental and safety metrics with instant alerts and notifications."
    },
    {
      icon: <Cloud className="w-12 h-12 text-amber-500" />,
      title: "Cloud Integration",
      description: "Secure cloud-based platform for accessing your data anywhere, anytime, with automatic backups."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Powerful Features for Mining Operations
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Comprehensive tools to manage safety, environmental impact, and stakeholder communication
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-start p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-3 rounded-lg bg-amber-50">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}