import React, { useState } from 'react';
import DefaultLayout from '../default/default';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const toggleSection = (index) => {
    if (activeSection === index) {
      setActiveSection(null);
    } else {
      setActiveSection(index);
    }
  };

  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <>
          <p>Personal Information: Name, email, phone number (if provided).</p>
          <p>User Content: Videos, images, and text submitted for challenges.</p>
          <p>Technical Data: IP addresses, device information, and browsing data.</p>
        </>
      )
    },
    {
      title: "2. How We Use Your Information",
      content: (
        <>
          <p>We use collected data to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide and improve SANAA360 services.</li>
            <li>Facilitate participation in challenges.</li>
            <li>Personalize user experiences.</li>
            <li>Communicate important updates and promotional content.</li>
            <li>Ensure security and prevent fraud.</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Sharing of Information",
      content: (
        <>
          <p>We do not sell user data. However, we may share data with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Service providers assisting in platform operations.</li>
            <li>Legal authorities if required by law.</li>
            <li>Business partners for promotional activities (with user consent).</li>
          </ul>
        </>
      )
    },
    {
      title: "4. User-Generated Content",
      content: "Any content submitted to SANAA360 may be publicly displayed, shared, and promoted."
    },
    {
      title: "5. Data Security",
      content: "We implement security measures to protect user data but cannot guarantee absolute security."
    },
    {
      title: "6. Cookies & Tracking Technologies",
      content: "We use cookies to enhance user experience. Users can disable cookies in browser settings, though some features may be affected."
    },
    {
      title: "7. Third-Party Links",
      content: "Our platform may contain links to third-party websites. SANAA360 is not responsible for their privacy policies."
    },
    {
      title: "8. Children's Privacy",
      content: "SANAA360 does not knowingly collect data from children under 13. If such data is found, it will be removed."
    },
    {
      title: "9. User Rights",
      content: (
        <>
          <p>Users may:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Request access to their data.</li>
            <li>Request deletion of their data.</li>
            <li>Opt-out of marketing emails.</li>
          </ul>
        </>
      )
    },
    {
      title: "10. Changes to This Policy",
      content: "We may update this Privacy Policy. Continued use of SANAA360 after changes constitutes acceptance."
    },
    {
      title: "11. Contact Information",
      content: "For privacy concerns, contact us at sanaa@sanaa360.com."
    }
  ];

  return (
    <DefaultLayout>
         <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 py-6 px-6">
            <h1 className="text-3xl font-bold text-white text-center">SANAA360</h1>
            <h2 className="text-xl text-white text-center mt-2">Privacy Policy</h2>
            <p className="text-white text-center mt-1">Effective Date: {currentDate}</p>
          </div>
          
          {/* Introduction */}
          <div className="p-6 border-b border-gray-200">
            <p className="text-gray-700">
              Your privacy is important to us at SANAA360. This Privacy Policy explains how we collect, use, and protect your information.
            </p>
          </div>
          
          {/* Policy Sections - Accordion Style */}
          <div className="divide-y divide-gray-200">
            {sections.map((section, index) => (
              <div key={index}>
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                  onClick={() => toggleSection(index)}
                >
                  <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                  <span className="ml-2 flex-shrink-0">
                    <svg
                      className={`h-5 w-5 text-red-500 transform ${activeSection === index ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
                {activeSection === index && (
                  <div className="px-6 py-4 bg-gray-50">
                    <div className="text-gray-700 prose max-w-none">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 sm:px-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} SANAA360. All rights reserved.
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </div>

    </DefaultLayout>
   
  );
};

export default PrivacyPolicy;