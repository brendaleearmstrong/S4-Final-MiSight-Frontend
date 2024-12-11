import { Shield, Activity, BarChart3, Users, Eye, Cloud } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "Safety Management",
      description: "Comprehensive safety incident tracking, reporting, and analysis tools to maintain compliance and protect workers."
    },
    {
      icon: Activity,
      title: "Environmental Monitoring",
      description: "Real-time environmental data collection and analysis to ensure compliance with regulations and minimize impact."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Advanced data visualization and reporting tools to make informed decisions and optimize operations."
    },
    {
      icon: Users,
      title: "Stakeholder Portal",
      description: "Transparent communication platform for sharing relevant data and updates with community stakeholders."
    },
    {
      icon: Eye,
      title: "Real-time Monitoring",
      description: "24/7 monitoring of critical environmental and safety metrics with instant alerts and notifications."
    },
    {
      icon: Cloud,
      title: "Cloud Integration",
      description: "Secure cloud-based platform for accessing your data anywhere, anytime, with automatic backups."
    }
  ];

  return (
    <div className="min-h-screen bg-[#151922]">
      {/* Navigation - same as Home */}
      <nav className="fixed w-full bg-[#151922]/90 backdrop-blur-sm z-50">
        {/* ... Navigation content same as Home ... */}
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
                className="bg-surface p-8 rounded-xl hover:bg-[#1E2330] transition-all cursor-pointer group"
              >
                <div className="p-3 rounded-lg bg-amber-500/10 inline-block">
                  <feature.icon className="w-12 h-12 text-amber-500 group-hover:scale-110 transition-transform" />
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

      {/* Footer - same as Home */}
      <footer className="bg-[#151922] text-gray-400 py-20 border-t border-gray-800">
        {/* ... Footer content same as Home ... */}
      </footer>
    </div>
  )
}