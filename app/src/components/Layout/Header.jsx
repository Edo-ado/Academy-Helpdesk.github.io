

export const Header = () => {
  return (
<header>
  <nav className="relative bg-white after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gray-200">
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        {/* Mobile menu button */}
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <button 
            type="button" 
            command="--toggle" 
            commandfor="mobile-menu" 
            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-black focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500"
          >
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              aria-hidden="true" 
              className="size-6 in-aria-expanded:hidden"
            >
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Close icon */}
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              aria-hidden="true" 
              className="size-6 not-in-aria-expanded:hidden"
            >
              <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Logo and desktop navigation */}
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex shrink-0 items-center">
            <img 
              src="src/assets/onlyIconAcademy.png" 
              alt="Academy Helpdesk" 
              className="h-8 w-auto" 
            />
            <span className="ml-2 hidden text-lg font-semibold text-gray-900 sm:block">Academy Helpdesk</span>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
             <a href="/tickets" className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black">
                Tickets
              </a>  
              <a href="/technicians" className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black">
                Technicians
              </a>
              <a href="/projects" className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black">
                Projects
              </a>
              <a href="/calendar" className="rounded-md px-2   py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black">
                Calendar
              </a>
            </div>
          </div>
        </div>

        {/* Right side: Notifications and profile */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {/* Notification button - Color azul #003ce0 */}
          <button 
            type="button" 
            className="relative rounded-full p-1 text-[#003ce0] hover:text-blue-800 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
          >
            <span className="absolute -inset-1.5"></span>
            <span className="sr-only">View notifications</span>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              aria-hidden="true" 
              className="size-6"
            >
              <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Profile dropdown */}
          <el-dropdown className="relative ml-3">
            <button className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">Open user menu</span>
              <img 
               src="src/assets/cuenta.png"
                alt="User profile" 
                className="size-8 rounded-full outline -outline-offset-1 outline-gray-300" 
              />
            </button>

            <el-menu 
              anchor="bottom end" 
              popover 
              className="w-48 origin-top-right rounded-md bg-white border border-gray-200 py-1 shadow-lg transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden">
                Your profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden">
                Settings
              </a>
              <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden">
                Sign out
              </a>
            </el-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    {/* Mobile menu */}
    <el-disclosure id="mobile-menu" hidden className="block sm:hidden">
      <div className="space-y-1 px-2 pt-2 pb-3">
        <a href="/" aria-current="page" className="block rounded-md bg-gray-100 px-3 py-2 text-base font-medium text-black">
          Dashboard
        </a>
        <a href="/tickets" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black">
          Tickets
        </a>
        <a href="/projects" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black">
          Projects
        </a>
        <a href="/calendar" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black">
          Calendar
        </a>
      </div>
    </el-disclosure>
  </nav>
</header>

  );
};
