import React, { useEffect, useState } from "react";
import Users from "../../Services/Users"; 

export function Header() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    Id: null,
    UserName: "Guest",
    Rol: "Null",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Users.GetAllUsers();
        console.log("Response from API:", response.data);

        const usersData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : [];

        const mappedData = usersData.map((c) => ({
          Id: c.Id,
          UserName: c.UserName,
          Rol: c.Rol,
        }));

        console.log("Mapped data:", mappedData);
        setUsers(mappedData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser({
      Id: user.Id,
      UserName: user.UserName,
      Rol: user.Rol,
    });
    setOpen(false);
    console.log("Usuario seleccionado:", user.Id);
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-sm border-b px-6 py-3 top-0 sticky z-10">
      <button className="text-blue-600 hover:text-blue-800 transition">🔔</button>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
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
            className={`ml-1 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {open && (
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
    </header>
  );
}
