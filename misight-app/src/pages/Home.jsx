import { Link } from 'react-router-dom'
import { Shield, Activity, BarChart3, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#151922]">
      {/* Navigation */}
      <nav className="fixed w-full bg-[#151922] z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <span className="text-amber-500 text-5xl font-bold">◆</span>
              <span className="text-5xl font-bold text-white ml-2">MiSight</span>
            </Link>
            <div className="flex items-center space-x-8">
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-7xl font-bold mb-6">
            <span className="text-amber-500">Mining</span>{' '}
            <span className="text-white">Intelligence</span>
            <br />
            <span className="text-white">Reimagined</span>
          </h1>
          <p className="text-gray-400 text-2xl mb-14 max-w-3xl mx-auto">
            Transform your mining operations with real-time environmental monitoring,
            safety tracking, and stakeholder engagement.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors"
            >
              Get Started <span className="ml-2">→</span>
            </Link>
            <button className="px-8 py-3 border border-gray-700 text-white rounded-lg hover:border-gray-600 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-5xl font-bold text-center mb-16">
        <span className="text-white">Why Choose</span><span className="text-amber-500"> MiSight</span>
        </h2>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Shield,
              title: "Safety First",
              description: "Real-time safety monitoring and incident reporting"
            },
            {
              icon: Activity,
              title: "Environmental Impact",
              description: "Track and manage environmental metrics"
            },
            {
              icon: BarChart3,
              title: "Data Analytics",
              description: "Advanced analytics and reporting capabilities"
            },
            {
              icon: Users,
              title: "Stakeholder Portal",
              description: "Transparent communication with stakeholders"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-[#1A1F2B] p-6 rounded-lg hover:bg-[#1E2330] transition-all"
            >
              <feature.icon className="text-amber-500 w-8 h-8 mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-800">
        {/* Footer content */}
      </footer>
    </div>
  );
}