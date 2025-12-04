import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./Json/es.json";
import en from "./Json/en.json";

// Obtener el idioma guardado o usar el predeterminado
const savedLanguage = localStorage.getItem("language") || "es";

const resources = {
  es: es,
  en: en
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "es",
    interpolation: {
      escapeValue: false
    }
  });

// Guardar el idioma cuando cambia
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;