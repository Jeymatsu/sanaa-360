import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Wave decoration at top */}
      <div className="h-12 bg-gray-900 overflow-hidden">
        <svg className="w-full h-16 -mt-4 text-red-600" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            fill="currentColor"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold mb-4">SANAA<span className="text-red-500">360</span></h2>
            </Link>
            <p className="text-gray-300 mb-4">Kenya's #1 digital platform for dance, comedy, and creative challenges</p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/sanaa360" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-red-500 hover:bg-gray-700 transition duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a href="https://instagram.com/sanaa360" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-red-500 hover:bg-gray-700 transition duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="https://youtube.com/sanaa360" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-red-500 hover:bg-gray-700 transition duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="https://tiktok.com/@sanaa360" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-red-500 hover:bg-gray-700 transition duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Challenge Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-red-500 pb-2">Challenge Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/challenges/dance" className="text-gray-300 hover:text-white transition duration-300">Dance Battles</Link></li>
              <li><Link to="/challenges/comedy" className="text-gray-300 hover:text-white transition duration-300">Comedy Skits</Link></li>
              <li><Link to="/challenges/creative" className="text-gray-300 hover:text-white transition duration-300">Creative Challenges</Link></li>
              <li><Link to="/challenges/sponsored" className="text-gray-300 hover:text-white transition duration-300">Brand Competitions</Link></li>
              <li><Link to="/creators/spotlight" className="text-gray-300 hover:text-white transition duration-300">Creator Spotlight</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-red-500 pb-2">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white transition duration-300">How it Works</Link></li>
              <li><Link to="/brand-partnerships" className="text-gray-300 hover:text-white transition duration-300">Brand Partnerships</Link></li>
              {/* <li><Link to="/merch" className="text-gray-300 hover:text-white transition duration-300">SANAA360 Merch</Link></li>
              <li><Link to="/success-stories" className="text-gray-300 hover:text-white transition duration-300">Success Stories</Link></li> */}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-red-500 pb-2">Join Our Community</h3>
            <p className="text-gray-300 mb-4">Subscribe to get updates on new challenges and opportunities!</p>
            <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} SANAA360. All rights reserved. Kenya's #1 Digital Challenge Platform.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4 text-sm text-gray-400">
              <li><Link to="/privacy-policy" className="hover:text-white transition duration-300">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition duration-300">Terms of Service</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition duration-300">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition duration-300">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;