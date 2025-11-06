// src/components/Layout/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import { useUser } from "../../context/UserContext";

export function Header() {
  const { selectedUser, setSelectedUser, users, loading, error } = useUser();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openMantMenu, setOpenMantMenu] = useState(false);

  const handleSelectUser = (user) => {
    setSelectedUser({
      Id: user.Id,
      UserName: user.UserName,
      Rol: user.Rol,
    });
    setOpenUserMenu(false);
    console.log("Usuario seleccionado:", user.Id);
  };

  //filtro por idrol para ver la parte de mantenimiento

  const mantItems = [
    { href: "/mantenimiento/tecnicos", title: "Técnicos", icon: "👤" },
    { href: "/mantenimiento/tickets", title: "Tickets", icon: "🎫" },
    { href: "/mantenimiento/categorías", title: "Categorías", icon: "📂" }
   
  ];

  return (
    <header className="flex justify-between items-center bg-white shadow-sm border-b px-6 py-3 top-0 sticky z-10">
      <button className="text-blue-600 hover:text-blue-800 transition">🔔</button>

      <div className="flex items-center gap-5 relative">
        {/* Menú de Mantenimientos */}
        <div className="relative">
          <button
            onClick={() => setOpenMantMenu(!openMantMenu)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-500 font-medium"
          >
            Mantenimientos
            <span
              className={`text-xs transition-transform ${
                openMantMenu ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {openMantMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-20">
              {mantItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpenMantMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition"
                >
                  <span>{item.icon}</span> {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Menú de Usuarios */}
        <div className="relative">
          <button
            onClick={() => setOpenUserMenu(!openUserMenu)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700 leading-tight">
                {selectedUser.UserName}
              </p>
              <p className="text-xs text-gray-500">{selectedUser.Rol}</p>
            </div>

            <div className="bg-yellow-400 rounded-full p-2 text-white">💔🥀</div>

            <span
              className={`ml-1 text-xs transition-transform duration-200 ${
                openUserMenu ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {openUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg overflow-hidden z-20 animate-fadeIn">
              {loading ? (
                <p className="px-4 py-2 text-sm text-gray-400">Cargando...</p>
              ) : error ? (
                <p className="px-4 py-2 text-sm text-red-500">{error}</p>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <button
                    key={user.Id}
                    onClick={() => handleSelectUser(user)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                      selectedUser.Id === user.Id ? "bg-gray-50" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {user.UserName}
                    </p>
                    <p className="text-xs text-gray-500">{user.Rol}</p>
                  </button>
                ))
              ) : (
                <p className="px-4 py-2 text-sm text-gray-400">Sin usuarios</p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
