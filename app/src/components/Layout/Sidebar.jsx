import React, { useState, useEffect } from 'react';
import logo from '../../assets/LogoTrans.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserCog, faList, faTicketAlt, faUser, faTicket, faCog, faBars, faTimes , faBell} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import NotificationService from "../../Services/NotificationServices";

import { useUser } from "../../context/UserContext";


const TailwinButton = "flex items-center gap-3 text-white hover:bg-blue-900 px-4 py-3 rounded-full transition transform hover:translate-x-1";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  

const { selectedUser } = useUser();

 useEffect(() => {

 if (!selectedUser.Id) return;

  

const fetchData = async () => {

try {

 const res = await NotificationService.GetCountNotificationsByIDUser(selectedUser.Id);

setUnreadCount( res.data.data?.[0].Total);

 //  setunreadCount(res.data.Total)

  } finally {

setLoading(false);

 }
};
 fetchData();
 }, [selectedUser.Id]);

  

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
        {/* Logo */}
        <div className="p-2 border-b-4 border-[#DFA200]">
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

            <Link to="/tickets/create" className={TailwinButton}>
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

          <div className="my-6 border-b border-[#DFA200]"></div>

          <section aria-labelledby="work-part" className="space-y-2">
            <Link to="/my-tickets" className={TailwinButton}>
              <FontAwesomeIcon icon={faTicketAlt} />
              <span>My Tickets</span>
            </Link>

 <Link to="/notifications" className={`${TailwinButton} relative`}>

  <FontAwesomeIcon icon={faBell} />

{unreadCount > 0 && (

  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">

{unreadCount}

 </span>

)}

<span className="ml-2">Notifications</span>

 </Link>



            <Link to="/profile" className={TailwinButton}>
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </Link>
          </section>

          <div className="my-6 border-b border-[#DFA200]"></div>

          <Link to="/tickets" className={TailwinButton}>
            <FontAwesomeIcon icon={faTicket} />
            <span>All Tickets</span>
          </Link>



            <Link to="/AutotriagePage" className={TailwinButton}>
            <FontAwesomeIcon icon={faTicket} />
            <span>Asignacion de tickets</span>
          </Link>
          
        </nav>



        

    
        <div className="p-6 border-t border-blue-800">
          <Link to="/settings" className="flex items-center gap-3 text-yellow-400 hover:bg-blue-900 px-4 py-3 rounded-full transition transform hover:translate-x-1">
            <FontAwesomeIcon icon={faCog} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
};