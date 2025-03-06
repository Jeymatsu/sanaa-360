import React from 'react';
import DefaultLayout from '../../pages/default/default';

const HowItWorks = () => {
    const steps = [
        {
          id: 1,
          title: "Join the Community",
          description: "Create an account on SANAA360 to participate in our dance, comedy, and creative challenges.",
          icon: (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          )
        },
        {
          id: 2,
          title: "Create Content on TikTok",
          description: "Participate in our challenges by creating content on TikTok according to the challenge theme.",
          icon: (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          )
        },
        {
          id: 3,
          title: "Submit Your TikTok Link",
          description: "Copy your TikTok link and submit it through our platform to enter the challenge.",
          icon: (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          )
        },
        {
          id: 4,
          title: "Engage & Get Votes",
          description: "Share your content with friends and followers to get likes, comments, and shares on your submission.",
          icon: (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          )
        },
        {
          id: 5,
          title: "Win Prizes & Recognition",
          description: "Top performers win cash prizes, brand sponsorships, and recognition in the SANAA360 community.",
          icon: (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          )
        }
      ];
         

  return (
    <DefaultLayout>
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-400 text-white">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              How SANAA<span className="text-yellow-300">360</span> Works
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
              Join Kenya's #1 digital platform for dance, comedy, and creative challenges.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Overview Section */}
          <section className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">SANAA360: All-in-One Challenge Platform</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600 leading-relaxed">
              SANAA360 is Kenya's premier digital platform where creators participate in dance, comedy, and creative challenges by submitting TikTok videos. Free, fun, and rewarding!
            </p>
          </section>

          {/* Steps Section */}
          <section className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-500 to-red-300"></div>
            <div className="space-y-16">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative flex flex-col md:flex-row items-center transition-all duration-500 hover:scale-105 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="md:w-1/2 px-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 mr-4 text-red-500">{step.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-red-500 text-white items-center justify-center shadow-md">
                    {step.id}
                  </div>
                  <div className="md:hidden flex w-10 h-10 rounded-full bg-red-500 text-white items-center justify-center mt-4">
                    {step.id}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Why Choose SANAA360?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Free Participation",
                  description: "No paid voting or entry fees. Everyone can join and compete for free.",
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                  ),
                },
                {
                    title: "Social Media Integration",
                    description: "Seamlessly connect with TikTok to maximize your reach.",
                    icon: (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    ),
                  },
                  {
                    title: "Brand Partnerships",
                    description: "Opportunity to participate in sponsored challenges with exciting rewards.",
                    icon: (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                      </svg>
      
                    ),
                  },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500 text-white rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Ready to Showcase Your Talent?</h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-600 leading-relaxed">
              Join thousands of creators and compete in our challenges to win prizes and gain recognition.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg">
              Join SANAA360 Today
            </button>
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HowItWorks;