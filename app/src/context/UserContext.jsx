// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Users from '../Services/Users';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(() => {
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.exp && payload.exp * 1000 > Date.now()) {
            return {
              Id: payload.id,
              UserName: payload.username,
              Email: payload.email,
              UserCode: payload.userCode,
              Rol: payload.rol,
              InstitutionId: payload.institutionId
            };
          }
        }
      } catch (error) {
        console.error('Error al cargar sesión:', error);
      }
    }
    return {
      Id: null,
      UserName: "Guest",
      Rol: null,
    };
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Users.GetAllUsers();
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

  const decodeToken = (token) => {
    try {
      if (!token || typeof token !== 'string') {
        console.error('Token inválido:', token);
        return null;
      }
      
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Token mal formado');
        return null;
      }
      
      const base64Url = tokenParts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      
      // Verificar expiración
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.warn('Token expirado');
        return null;
      }
      
      return payload;
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  };

  const saveUser = (token) => {
    try {
      if (!token || typeof token !== 'string') {
        console.error('saveUser recibió un valor inválido:', token);
        return null;
      }

      const payload = decodeToken(token);
      
      if (payload) {
        localStorage.setItem('token', token);
        
        const userData = {
          Id: payload.id,
          UserName: payload.username,
          Email: payload.email,
          UserCode: payload.userCode,
          Rol: payload.rol,
          InstitutionId: payload.institutionId
        };
        
        setSelectedUser(userData);
        setIsAuthenticated(true);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      return null;
    }
  };

  const clearUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedUser');
    setSelectedUser({
      Id: null,
      UserName: "Guest",
      Rol: null,
    });
    setIsAuthenticated(false);
  };

  const authorize = (requiredRoles) => {
    if (!selectedUser || !selectedUser.Rol || !selectedUser.Rol.Id) {
      return false;
    }
    
    const rolesArray = Array.isArray(requiredRoles) 
      ? requiredRoles 
      : [requiredRoles];
    

    const userRoleId = parseInt(selectedUser.Rol.Id, 10);
    
    return rolesArray.some(role => parseInt(role, 10) === userRoleId);
  };

  return (
    <UserContext.Provider value={{ 
      selectedUser, 
      setSelectedUser, 
      users, 
      loading, 
      error,
      isAuthenticated,
      saveUser,
      clearUser,
      decodeToken,
      authorize
    }}>
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
