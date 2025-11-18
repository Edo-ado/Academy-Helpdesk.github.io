import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesList from "../../Services/CategoriesList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

export function Categories() {  
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CategoriesList.GetAllCategoriesListActive();
        console.log("Response from API:", response.data);

        const mappedData = Array.isArray(response.data.data)
          ? response.data.data.map((c) => ({
              id: c.Id,
              name: c.Name,
              description: c.Descripcion,
            }))
          : [];

        console.log("Mapped data:", mappedData);
        setCategories(mappedData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error al cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">Cargando categorías... :D/</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">No hay categorías disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#101dcf] tracking-wide drop-shadow-lg mt-6 mb-8 border-b-4 border-[#DFA200] pb-4">
          Categorías
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-[#e8f6ff] border-2 border-blue-600 rounded-xl p-6 shadow-md
                         transition-transform duration-300 ease-out
                         hover:-translate-y-2 hover:rotate-1 hover:shadow-xl cursor-pointer"
              onClick={() => navigate(`/category/${category.id}`)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faFolder} className="text-white text-xl" />
                </div>
                <p className="font-semibold text-gray-900 text-xl">{category.name}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">ID:</p>
                  <p className="text-black font-bold text-lg">{category.id}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 text-sm">Descripción:</p>
                  <p className="text-gray-800">{category.description || "Sin descripción"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}