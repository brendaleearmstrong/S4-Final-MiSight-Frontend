import { Link } from 'react-router-dom';
import { Shield, Activity, BarChart3, Users, Facebook, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#151922]">
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

      <section className="py-16">
        <h2 className="text-5xl font-bold text-center mb-16">
          <span className="text-white">Why Choose</span>
          <span className="text-amber-500"> MiSight</span>
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

      <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-amber-500" viewBox="0 0 40 40">
                <path
                  fill="currentColor"
                  d="M20 5L30 15L20 25L10 15L20 5ZM20 35L10 25L20 15L30 25L20 35Z"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">MiSight</span>
            </div>
            <p className="text-sm">
              Transforming mining operations through innovative technology and data-driven insights.
            </p>
          </div>
          <div>
            <h4 className="text-amber-500 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-amber-500">About Us</a></li>
              <li><a href="#" className="hover:text-amber-500">Features</a></li>
              <li><a href="#" className="hover:text-amber-500">Pricing</a></li>
              <li><a href="#" className="hover:text-amber-500">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-500 font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-amber-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-500">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-500">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-amber-500 font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-amber-500">
                <Facebook />
              </a>
              <a href="#" className="hover:text-amber-500">
                <Twitter />
              </a>
              <a href="#" className="hover:text-amber-500">
                <Linkedin />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-500 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} MiSight. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
  );
}