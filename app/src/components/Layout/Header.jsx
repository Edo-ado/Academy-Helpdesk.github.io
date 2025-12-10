import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import NotificationService from "../../Services/NotificationServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../../Translations/LanguageSwitcher";
import {
  faChevronDown,
  faUserCircle,
  faUserGear,
  faTicket,
  faFolderOpen,
  faRightToBracket,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export function Header() {
  const { selectedUser, clearUser, authorize } = useUser(); // ✅ Usar clearUser y authorize
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openMantMenu, setOpenMantMenu] = useState(false);
  const [notifCount, setNotifCount] = useState(0); 
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (!selectedUser?.Id) return;

    const fetchData = async () => {
      try {
        const res = await NotificationService.GetCountNotificationsByIDUser(selectedUser.Id);
        setNotifCount(res.data.data || 0);
        console.log("Response:", res.data); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedUser?.Id]);

  const mantItems = [
    { href: "/mantenimiento/tecnicos", title: t('header.technicians'), icon: faUserGear },
    { href: "/mantenimiento/tickets", title: t('header.tickets'), icon: faTicket },
    {
      href: "/mantenimiento/categorías",
      title: t('header.categories'),
      icon: faFolderOpen,
    },
  ];

  return (
    <header className="bg-[#0a1e4a] text-white shadow-lg sticky top-0 z-50 border-b-4 border-[#DFA200]">
      <div className="max-w-7xl mx-auto flex justify-end items-center px-6 py-3">
        <div className="flex items-center gap-6 relative">
          <LanguageSwitcher />

          {selectedUser?.Id ? (
            <>
            
              {authorize([3]) && (//3 DE ROL ADMIN
                <div className="relative">
                  <button
                    onClick={() => setOpenMantMenu(!openMantMenu)}
                    className="flex items-center gap-2 text-sm font-medium hover:text-[#DFA200] transition"
                  >
                    {t('header.maintenance')}
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`text-xs transition-transform ${
                        openMantMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openMantMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-lg z-20">
                      {mantItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setOpenMantMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f5f7ff] hover:text-[#101DCF] transition"
                        >
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="text-[#DFA200] w-4 h-4"
                          />
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

          
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold leading-tight">
                    {selectedUser.UserName}
                  </p>
                  <p className="text-xs text-gray-300">
                    {selectedUser.Rol?.Name || 'Sin rol'}
                  </p>
                </div>

                <div className="bg-[#DFA200] rounded-full p-2 text-[#101DCF]">
                  <FontAwesomeIcon icon={faUserCircle} className="text-lg" />
                </div>
              </div>

       
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                {t('login.logout') || 'Cerrar Sesión'}
              </button>
            </>
          ) : (
         
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-[#DFA200] hover:bg-[#c88f00] text-[#0a1e4a] rounded-lg text-sm font-medium transition"
            >
              <FontAwesomeIcon icon={faRightToBracket} />
              {t('login.login') || 'Iniciar Sesión'}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
