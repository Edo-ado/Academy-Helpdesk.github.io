import { Link , useNavigate} from 'react-router-dom';


export const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center px-6">
      <div className="text-center">
       
        <h1 className="text-9xl font-bold text-blue-600 animate-bounce mb-8">
          404
        </h1>
        
     

       
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          ¡Ups! Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Parece que la página que estás buscando ha sido movida o no existe.
        </p>

    
        <button 
          onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver atras
        </button>
      </div>
    </div>
  );
};