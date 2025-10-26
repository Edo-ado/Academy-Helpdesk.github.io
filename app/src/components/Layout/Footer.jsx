

export const Footer = () => {
  return (
<footer className="bg-white border-t border-gray-200 mt-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      {/* Company Info */}
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src="src/assets/onlyIconAcademy.png" 
            alt="Academy Helpdesk" 
            className="h-8 w-auto" 
          />
          <span className="text-xl font-bold text-gray-900">Academy Helpdesk</span>
        </div>
        <p className="text-gray-600 text-sm max-w-md">
          Streamline your support workflow with our comprehensive helpdesk solution. 
          Manage tickets, track progress, and deliver exceptional customer service.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Quick Links
        </h3>
        <ul className="space-y-3">
          <li>
            <a href="/tickets" className="text-gray-600 hover:text-[#003ce0] text-sm transition-colors">
              Tickets
            </a>
          </li>
          <li>
            <a href="/technicians" className="text-gray-600 hover:text-[#003ce0] text-sm transition-colors">
              Technicians
            </a>
          </li>
          <li>
            <a href="/calendar" className="text-gray-600 hover:text-[#003ce0] text-sm transition-colors">
              Calendar
            </a>
          </li>
          <li>
            <a href="/projects" className="text-gray-600 hover:text-[#003ce0] text-sm transition-colors">
              Project
            </a>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Support
        </h3>
        <ul className="space-y-3">
          <li>
            <a href="/help" className="text-gray-600 hover:text-[#003ce0] text-sm transition-colors">
              Help Center
            </a>
          </li>
          <li>
            <a href="/documentation" className="text-gray-600 hover:text-[#003ce0] text-sm transition-colors">
              Documentation
            </a>
          </li>
          <li>
            <a href="/contact" className="text-gray-600 hover:text-[#003ce0] text-sm transition-colors">
              Contact Us
            </a>
          </li>
          <li>
            <a href="/status" className="text-gray-600 hover:text-[#003ce0] text-sm transition-colors">
              System Status
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
      {/* Copyright */}
      <p className="text-gray-500 text-sm mb-4 sm:mb-0">
        © 2025 Academy Helpdesk. All rights reserved.
      </p>

      {/* Social Links & Legal */}
      <div className="flex items-center space-x-6">
        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-[#003ce0] transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-[#003ce0] transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-[#003ce0] transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
            </svg>
          </a>
        </div>

        {/* Legal Links */}
        <div className="hidden sm:flex space-x-4 border-l border-gray-300 pl-6">
          <a href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
            Privacy
          </a>
          <a href="/terms" className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
            Terms
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>

  );
};
