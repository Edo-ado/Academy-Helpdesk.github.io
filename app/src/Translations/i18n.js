import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./Json/es.json";
import en from "./Json/en.json";
import ch from "./Json/CriolloHaiti";
import sm from "./Json/Simslish";
import hi from "./Json/Hindu";
import ad from "./Json/Andaluz";

// Obtener el idioma guardado o usar el predeterminado
const savedLanguage = localStorage.getItem("language") || "es";

const resources = {
  es: es,
  en: en,
  ht: ch,
  sm: sm,
  hi: hi,
  ad: ad


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