import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-indigo-600 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Contact */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">QuickBasket</h2>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold border-b border-indigo-400 pb-1 inline-block">Contact Us</h3>
              
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="text-sm">WhatsApp</p>
                  <p className="text-sm font-medium">+1 202-918-2132</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="text-sm">Call Us</p>
                  <p className="text-sm font-medium">+1 202-918-2132</p>
                </div>
              </div>
            </div>
            
            {/* Download App */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Download App</h4>
              <div className="flex space-x-2">
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on App Store"
                  className="h-10"
                />
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-indigo-400 pb-1 inline-block">Most Popular Categories</h3>
            <ul className="space-y-2">
              {[
                'Staples',
                'Beverages', 
                'Personal Care',
                'Home Care',
                'Baby Care',
                'Vegetables & Fruits',
                'Snacks & Foods',
                'Dairy & Bakery'
              ].map((category) => (
                <li key={category}>
                  <a 
                    href="#" 
                    className="text-sm text-indigo-100 hover:text-white transition-colors duration-200"
                  >
                    • {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-indigo-400 pb-1 inline-block">Customer Services</h3>
            <ul className="space-y-2">
              {[
                'About Us',
                'Terms & Conditions',
                'FAQ',
                'Privacy Policy',
                'E-waste Policy',
                'Cancellation & Return Policy'
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-sm text-indigo-100 hover:text-white transition-colors duration-200"
                  >
                    • {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        
      </div>
    </footer>
  );
};

export default Footer;