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

      <footer className="mt-24 border-t border-gray-800 bg-[#1A1F2B]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <span className="text-amber-500 text-3xl font-bold">◆</span>
                <span className="text-3xl font-bold text-white ml-2">MiSight</span>
              </div>
              <p className="text-gray-400 mb-6">
                Transforming mining operations through innovative technology and data-driven insights.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-amber-500 transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-amber-500 transition-colors">Features</Link>
                </li>
                <li>
                  <Link to="/solutions" className="text-gray-400 hover:text-amber-500 transition-colors">Solutions</Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-400 hover:text-amber-500 transition-colors">Pricing</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-400">
                  <Mail size={16} className="mr-2" />
                  <span>contact@misight.com</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <Phone size={16} className="mr-2" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <MapPin size={16} className="mr-2" />
                  <span>St. Johns, NL, Canada</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-amber-500 transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-amber-500 transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-gray-400 hover:text-amber-500 transition-colors">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} MiSight. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}