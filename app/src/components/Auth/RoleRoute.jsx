// src/components/Auth/RoleRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function RoleRoute({ children, allowedRoles }) {
  const { isAuthenticated, authorize } = useUser();


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  if (allowedRoles && !authorize(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-700 mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#DFA200] hover:bg-[#c88f00] text-white px-6 py-2 rounded-md font-semibold"
          >
            Volver Atrás
          </button>
        </div>
      </div>
    );
  }

  return children;
}
