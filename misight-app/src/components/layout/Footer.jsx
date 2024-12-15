import { Facebook, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
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
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-amber-500">About Us</a></li>
              <li><a href="#" className="hover:text-amber-500">Features</a></li>
              <li><a href="#" className="hover:text-amber-500">Pricing</a></li>
              <li><a href="#" className="hover:text-amber-500">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-amber-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-500">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-500">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
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
  );
}