import React from 'react';
import logo from '../../assets/LogoTrans.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserCog, faList, faTicketAlt, faUser, faTicket, faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'
 
const TailwinButton = "flex items-center gap-3 text-white hover:bg-blue-900 px-4 py-3 rounded-full transition transform hover:translate-x-1" ;
 
export const Sidebar = () => {
  return (
    <aside className="w-65 bg-[#0a1e4a] text-white flex flex-col h-screen" aria-label="Sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src={logo} alt="Academy Helpdesk" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-semibold">Academy Helpdesk</span>
        </Link>
      </div>
 
      {/* Navigation */}
      <nav className="flex-1 p-6 overflow-auto">
        <section aria-labelledby="create-tickets" className="space-y-2">
          <Link to="/create-ticket" className={TailwinButton}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Create a Ticket</span>
          </Link>
 
          <Link to="/technicians" className={TailwinButton}>
            <FontAwesomeIcon icon={faUserCog} />
            <span>Technicians</span>
          </Link>
 
          <Link to="/categories" className={TailwinButton}>
            <FontAwesomeIcon icon={faList} />
            <span>Categories</span>
          </Link>

         
        </section>
 
        <div className="my-6 border-b border-blue-800"></div>
 
        <section aria-labelledby="work-part" className="space-y-2">
          <Link to="/my-tickets" className={TailwinButton}>
            <FontAwesomeIcon icon={faTicketAlt} />
            <span>My Tickets</span>
          </Link>
          <Link to="/profile" className={TailwinButton}>
            <FontAwesomeIcon icon={faUser} />
            <span>Profile</span>
          </Link>
        </section>
 
        <div className="my-6 border-b border-blue-800"></div>
 
        <Link to="/tickets" className={TailwinButton}>
          <FontAwesomeIcon icon={faTicket} />
          <span>All Tickets</span>
        </Link>
      </nav>
 
      {/* Settings */}
      <div className="p-6 border-t border-blue-800">
        <Link to="/settings" className="flex items-center gap-3 text-yellow-400 hover:bg-blue-900 px-4 py-3 rounded-full transition transform hover:translate-x-1">
          <FontAwesomeIcon icon={faCog} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};