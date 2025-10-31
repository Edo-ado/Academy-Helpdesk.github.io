// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Users from '../Services/Users';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState({
    Id: null,
    UserName: "Guest",
    Rol: "Null",
  });
  const [users, setUsers] = useState([]);
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

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser, users, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
}