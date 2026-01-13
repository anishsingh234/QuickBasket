import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  ArrowRight,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 sm:p-2.5 rounded-xl">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">QuickBasket</span>
            </div>
            
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Your one-stop destination for everything you need. Quality products, 
              fast delivery, and exceptional service since 2020.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              <a href="#" className="bg-gray-800 hover:bg-indigo-600 p-2 sm:p-2.5 rounded-lg transition-colors duration-200">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-pink-600 p-2 sm:p-2.5 rounded-lg transition-colors duration-200">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-sky-500 p-2 sm:p-2.5 rounded-lg transition-colors duration-200">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-red-600 p-2 sm:p-2.5 rounded-lg transition-colors duration-200">
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Shop All', href: '/search?q=all' },
                { name: 'Categories', href: '/search?q=all' },
                { name: 'Today\'s Deals', href: '/search?q=deals' },
                { name: 'New Arrivals', href: '/search?q=new' },
                { name: 'Best Sellers', href: '/search?q=best' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Customer Service</h3>
            <ul className="space-y-3">
              {[
                { name: 'My Account', href: '#' },
                { name: 'Track Order', href: '#' },
                { name: 'Wishlist', href: '#' },
                { name: 'Returns & Refunds', href: '#' },
                { name: 'Shipping Info', href: '#' },
                { name: 'FAQ', href: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-gray-800 p-2 rounded-lg flex-shrink-0">
                  <MapPin className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-gray-400">123 Commerce Street,</p>
                  <p className="text-gray-400">New York, NY 10001</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-lg flex-shrink-0">
                  <Phone className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                  <p className="text-gray-500 text-sm">Mon-Fri 9am-6pm</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded-lg flex-shrink-0">
                  <Mail className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-gray-400">support@quickbasket.com</p>
                  <p className="text-gray-500 text-sm">24/7 Online Support</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl">
              <Truck className="h-8 w-8 text-indigo-400" />
              <div>
                <p className="text-white font-medium text-sm sm:text-base">Free Shipping</p>
                <p className="text-gray-500 text-xs sm:text-sm">On orders over ₹500</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/50 rounded-xl">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-medium text-sm sm:text-base">Secure Payment</p>
                <p className="text-gray-500 text-xs sm:text-sm">256-bit encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/50 rounded-xl">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-medium text-sm sm:text-base">Easy Returns</p>
                <p className="text-gray-500 text-xs sm:text-sm">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-800/50 rounded-xl">
              <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-pink-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-medium text-sm sm:text-base">24/7 Support</p>
                <p className="text-gray-500 text-xs sm:text-sm">Dedicated help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <p>© {currentYear} QuickBasket. All rights reserved.</p>
              <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
              <p className="flex items-center gap-1">
                Made with <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-red-500" /> in India
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-gray-500 text-xs sm:text-sm">We accept:</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5">
                <span className="text-blue-600 font-bold text-xs sm:text-sm">VISA</span>
              </div>
              <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5">
                <span className="text-red-500 font-bold text-xs sm:text-sm">Master</span>
              </div>
              <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5">
                <span className="text-blue-800 font-bold text-xs sm:text-sm">PayPal</span>
              </div>
              <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5">
                <span className="text-green-600 font-bold text-xs sm:text-sm">UPI</span>
              </div>
              <div className="bg-white rounded px-2 sm:px-3 py-1 sm:py-1.5">
                <span className="text-purple-600 font-bold text-xs sm:text-sm">GPay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;