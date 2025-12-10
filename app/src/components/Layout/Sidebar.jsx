import React, { useState, useEffect } from 'react';
import logo from '../../assets/LogoTrans.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserCog, faList, faTicketAlt, faUser, faTicket, faCog, faBars, faTimes, faBell } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import NotificationService from "../../Services/NotificationServices";
import { useUser } from "../../context/UserContext";
import { useTranslation } from 'react-i18next';

const TailwinButton = "flex items-center gap-3 text-white hover:bg-blue-900 px-4 py-3 rounded-full transition transform hover:translate-x-1";

export const Sidebar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
 
  const { selectedUser, isAuthenticated, authorize } = useUser();

  useEffect(() => {
    if (!selectedUser?.Id) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await NotificationService.GetCountNotificationsByIDUser(selectedUser.Id);
        setUnreadCount(res.data.data[0].Total);
      } catch (err) {
        console.error("Error notis:", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 2000);
    return () => clearInterval(interval);
  }, [selectedUser?.Id]);

  const navItems = [
 
    {
      section: "create",
      items: [
        {
          to: "/tickets/create",
          icon: faPlus,
          label: t('sidebar.createTicket'),
          show: isAuthenticated, 
        },
        {
          to: "/technicians",
          icon: faUserCog,
          label: t('sidebar.technicians'),
          show: authorize([1, 3]), 
        },
        {
          to: "/categories",
          icon: faList,
          label: t('sidebar.categories'),
          show: authorize([1, 3]), 
        },
      ]
    },
  
    {
      section: "work",
      items: [
        {
          to: "/my-tickets",
          icon: faTicketAlt,
          label: t('sidebar.myTickets'),
          show: authorize([1, 3]),
        },
        {
          to: "/notifications",
          icon: faBell,
          label: t('sidebar.notifications'),
          show: isAuthenticated, 
          badge: unreadCount,
        },
        {
          to: "/profile",
          icon: faUser,
          label: t('sidebar.profile'),
          show: isAuthenticated,
        },
      ]
    },

    {
      section: "tickets",
      items: [
        {
          to: "/tickets",
          icon: faTicket,
          label: t('sidebar.allTickets'),
          show: authorize([1, 2]), //solo técnicos y admins
        },
        {
          to: "/AutotriagePage",
          icon: faTicket,
          label: t('sidebar.autotriage'),
          show: authorize([3]), //solo admins
        },
      ]
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-[#0a1e4a] text-white p-3 rounded-lg"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />
      )}

      <aside 
        className={`
          fixed lg:static z-40
          w-65 bg-[#0a1e4a] text-white flex flex-col h-screen
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Sidebar"
      >
    
        <div className="p-2 border-b-4 border-[#DFA200]">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={logo} alt="Academy Helpdesk" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-semibold">Academy Helpdesk</span>
          </Link>
        </div>


        <nav className="flex-1 p-6 overflow-auto">
          {navItems.map((section, sectionIndex) => (
            <React.Fragment key={section.section}>
              <section className="space-y-2">
                {section.items
                  .filter((item) => item.show) 
                  .map((item) => (
                    <Link key={item.to} to={item.to} className={`${TailwinButton} relative`}>
                      <FontAwesomeIcon icon={item.icon} />
                      
                    
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                      
                      <span>{item.label}</span>
                    </Link>
                  ))}
              </section>
              
              
              {sectionIndex < navItems.length - 1 && (
                <div className="my-6 border-b border-[#DFA200]"></div>
              )}
            </React.Fragment>
          ))}
        </nav>

    
        <div className="p-6 border-t border-blue-800">
          <Link to="/settings" className="flex items-center gap-3 text-yellow-400 hover:bg-blue-900 px-4 py-3 rounded-full transition transform hover:translate-x-1">
            <FontAwesomeIcon icon={faCog} />
            <span>{t('sidebar.settings')}</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
