// Import i18n library and necessary plugins
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Language detection options
const DETECTION_OPTIONS = {
  order: ["localStorage", "navigator"],
  caches: ["localStorage"],
};

// Function to set user language in local storage
const setUserLanguage = (lng: string) => {
  localStorage.setItem("userLanguage", lng);
};

// Function to get user language from local storage
const getUserLanguage = () => {
  return localStorage.getItem("userLanguage") || "en";
};

// Initialize i18n with language detection, HTTP backend, and React integration
i18n
  .use(LanguageDetector)
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: getUserLanguage(),
    debug: true,
    fallbackLng: "en",
    ns: ["common"],
    detection: DETECTION_OPTIONS,
    backend: {
      loadPath: "/i18n/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Update the language in local storage whenever it changes
i18n.on("languageChanged", (lng: string) => {
  setUserLanguage(lng);
});

export default i18n;
