import React, { useState } from 'react';
import DefaultLayout from '../default/default';

const TermsOfService = () => {
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
      title: "1. Acceptance of Terms",
      content: "By registering, submitting content, or using SANAA360, you agree to comply with these Terms and all applicable laws."
    },
    {
      title: "2. User Eligibility",
      content: "Users must be at least 13 years old. Users under 18 must have parental or guardian consent."
    },
    {
      title: "3. Account Registration",
      content: (
        <>
          <p>Users must provide accurate information during registration.</p>
          <p>You are responsible for maintaining the security of your account.</p>
          <p>SANAA360 reserves the right to suspend or terminate accounts that violate these terms.</p>
        </>
      )
    },
    {
      title: "4. User-Generated Content",
      content: (
        <>
          <p>Users retain rights to the content they submit but grant SANAA360 a non-exclusive license to use, display, and promote the content.</p>
          <p>Content must not violate copyright, be offensive, or contain harmful material.</p>
          <p>SANAA360 reserves the right to remove any content deemed inappropriate.</p>
        </>
      )
    },
    {
      title: "5. Challenges & Competitions",
      content: (
        <>
          <p>Participation is free unless otherwise stated.</p>
          <p>The platform reserves the right to determine winners based on set criteria.</p>
          <p>Prizes, if applicable, will be awarded as per challenge rules.</p>
        </>
      )
    },
    {
      title: "6. Prohibited Conduct",
      content: (
        <>
          <p>Users must not:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Post offensive, defamatory, or illegal content.</li>
            <li>Impersonate others or create fake accounts.</li>
            <li>Engage in fraudulent activities.</li>
            <li>Violate intellectual property rights.</li>
          </ul>
        </>
      )
    },
    {
      title: "7. Sponsorship & Advertisements",
      content: "SANAA360 may display ads and sponsored content. Users agree to interact with such content responsibly."
    },
    {
      title: "8. Termination of Service",
      content: "SANAA360 reserves the right to suspend or terminate accounts violating these terms without notice."
    },
    {
      title: "9. Limitation of Liability",
      content: (
        <>
          <p>SANAA360 is not liable for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Any losses or damages resulting from platform use.</li>
            <li>Unauthorized access to your account.</li>
            <li>Errors, downtime, or technical issues.</li>
          </ul>
        </>
      )
    },
    {
      title: "10. Changes to Terms",
      content: "We reserve the right to modify these Terms at any time. Continued use of SANAA360 after changes implies acceptance."
    },
    {
      title: "11. Contact Information",
      content: "For inquiries, please contact us at sanaa@sanaa360.com."
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
            <h2 className="text-xl text-white text-center mt-2">Terms of Service</h2>
            <p className="text-white text-center mt-1">Effective Date: {currentDate}</p>
          </div>
          
          {/* Introduction */}
          <div className="p-6 border-b border-gray-200">
            <p className="text-gray-700">
              Welcome to SANAA360! By accessing or using our platform, you agree to be bound by these 
              Terms of Service. If you do not agree, please do not use SANAA360.
            </p>
          </div>
          
          {/* Terms Sections - Accordion Style */}
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

export default TermsOfService;