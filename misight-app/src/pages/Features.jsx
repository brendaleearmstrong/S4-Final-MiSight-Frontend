import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#151922]">
      <nav className="fixed w-full bg-[#151922] z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-amber-500" />
              <span className="ml-2 text-2xl font-bold text-white">MiSight</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-amber-500 transition-colors">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-amber-500 transition-colors">About</Link>
              <Link to="/features" className="text-gray-300 hover:text-amber-500 transition-colors">Features</Link>
              <Link to="/solutions" className="text-gray-300 hover:text-amber-500 transition-colors">Solutions</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-amber-500 transition-colors">Pricing</Link>
              <Link to="/contact" className="text-gray-300 hover:text-amber-500 transition-colors">Contact</Link>
              <Link 
                to="/login"
                className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Powerful Features for Mining Operations
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Comprehensive tools to manage safety, environmental impact, and stakeholder communication
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#1A1F2B] p-8 rounded-xl hover:bg-[#1E2330] transition-all cursor-pointer group"
              >
                <div className="p-3 rounded-lg bg-amber-500/10 inline-block">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}