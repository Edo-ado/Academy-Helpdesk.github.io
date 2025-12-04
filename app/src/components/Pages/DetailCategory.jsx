import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategoriesList from "../../Services/CategoriesList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import {
  faArrowLeft,
  faFolder,
  faClock,
  faStar,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

export function DetailCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!id) {
      console.error("No se recibió ID, redirigiendo...");
      navigate("/categories");
      return;
    }

    const fetchCategoryDetail = async () => {
      try {
        const response = await CategoriesList.GetCategoryDetailsByID(id);
        const catData = response.data.data[0];
        setCategory(catData);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || t("categoryDetail.error")); 
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetail();
  }, [id, navigate, t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">
          {t("categoryDetail.loading")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {t("categoryDetail.backToList")}
          </button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#dff1ff]">
        <p className="text-gray-700 text-lg">
          {t("categoryDetail.notFound")}
        </p>
      </div>
    );
  }

  // Convertir strings separados por comas en arrays
  const specialities = category.Especialidades
    ? category.Especialidades.split(", ")
    : [];

  const tags = category.Tags ? category.Tags.split(", ") : [];

  return (
    <div className="bg-[#dff1ff] min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>{t("categoryDetail.backToList")}</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-600">
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faFolder}
                className="text-white text-4xl"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {category.Categorie}
            </h1>
          </div>

          {/* SLA - Tiempos de Atención */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 border-l-4 border-blue-600">
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon
                icon={faClock}
                className="text-blue-600 text-xl"
              />
              <h2 className="text-xl font-bold text-gray-900">
                {t("categoryDetail.slaTitle")}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  {t("categoryDetail.maxResponseTime")}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {category.TiempoMaximoRespuesta}{t("categoryDetail.hours")}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  {t("categoryDetail.maxResolutionTime")}
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {category.TiempoMaximoResolucion}{t("categoryDetail.hours")}
                </p>
              </div>
            </div>
          </div>

          {/* Especialidades */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon
                icon={faStar}
                className="text-yellow-500 text-xl"
              />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("categoryDetail.specialties")}
              </h2>
            </div>

            {specialities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {specialities.map((spec, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-l-4 border-blue-600"
                  >
                    <p className="font-semibold text-gray-900">{spec}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                {t("categoryDetail.noSpecialties")}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon
                icon={faTags}
                className="text-purple-500 text-xl"
              />
              <h2 className="text-2xl font-bold text-gray-900">
                {t("categoryDetail.tags")}
              </h2>
            </div>

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-200 transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                {t("categoryDetail.noTags")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
