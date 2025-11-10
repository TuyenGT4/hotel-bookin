import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "vi", // Thay đổi từ 'en' sang 'vi' để mặc định là tiếng Việt
    debug: true, // Bật true khi dev, tắt khi production
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Điều chỉnh nếu không đổi tên file
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
