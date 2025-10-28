import React from "react";

export  function Header() {
  return (
    <header className="flex justify-between items-center bg-white shadow-sm border-b px-6 py-3 top-0 sticky z-10">
      {/* Icono de notificaciones */}
      <button className="text-blue-600 hover:text-blue-800 transition">
       
      </button>

      {/* Usuario */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-700 leading-tight">Username</p>
          <p className="text-xs text-gray-500">Technician</p>
        </div>
        <div className="bg-yellow-400 rounded-full p-2 text-white">
          💔🥀
        </div>
      </div>
    </header>
  );
}
