import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">The MiSight Story</h1>
          
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-6">
              As a former Principal Advisor of Communications for a major Newfoundland mining company, 
              I experienced firsthand the challenges of managing environmental and safety data across multiple sites. 
              The endless hours spent chasing data for reports, consolidating information from various sources, 
              and trying to maintain transparency with stakeholders inspired me to create something better.
            </p>

            <p className="text-gray-600 mb-6">
              Now, as a full-stack development student, I&apos;ve combined my industry experience with 
              modern technology to build MiSight – a comprehensive solution that addresses these 
              pain points head-on. Our platform serves as a single source of truth for mining operations, 
              streamlining data collection, analysis, and reporting.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Why MiSight?</h2>
            
            <p className="text-gray-600 mb-6">
              In the mining industry, data transparency isn&apos;t just about compliance – it&apos;s about building 
              trust with communities and stakeholders. MiSight bridges the gap between mining operations 
              and stakeholders by providing:
            </p>

            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Real-time environmental monitoring</li>
              <li>Comprehensive safety tracking</li>
              <li>Automated report generation</li>
              <li>Stakeholder communication tools</li>
              <li>Data-driven insights for better decision making</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Our Mission</h2>
            
            <p className="text-gray-600 mb-6">
              MiSight&#39;s mission is to transform how mining companies manage and share their operational data. 
              We believe that better data management leads to better decisions, safer operations, and stronger 
              relationships with stakeholders. By providing a single, comprehensive platform, we&#39;re making it 
              easier for mining companies to maintain compliance, ensure safety, and build trust with their communities.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}