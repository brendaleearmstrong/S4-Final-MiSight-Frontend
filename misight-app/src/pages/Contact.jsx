import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import ContactForm from '@/components/forms/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-center">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-center">
              Have questions about MiSight? We're here to help.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow">
              <Mail className="h-8 w-8 text-amber-500" />
              <h3 className="mt-4 text-lg font-semibold">Email</h3>
              <p className="mt-2 text-gray-500">contact@misight.com</p>
            </div>
            
            <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow">
              <Phone className="h-8 w-8 text-amber-500" />
              <h3 className="mt-4 text-lg font-semibold">Phone</h3>
              <p className="mt-2 text-gray-500">+1 (555) 123-4567</p>
            </div>
            
            <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow">
              <MapPin className="h-8 w-8 text-amber-500" />
              <h3 className="mt-4 text-lg font-semibold">Office</h3>
              <p className="mt-2 text-gray-500">St. John's, NL, Canada</p>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-4xl bg-white rounded-2xl shadow-lg">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}