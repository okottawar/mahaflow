"use client";

import { useSimulation } from "@/context/SimulationContext";
import { Language } from "@/lib/data/translations";

const languageLabels: Record<Language, string> = {
  en: "EN",
  hi: "हिंदी",
  mr: "मराठी",
};

export default function LanguageSwitcher() {
  const { language, setLanguage } = useSimulation();

  return (
    <div className="lang-switcher">
      {(Object.keys(languageLabels) as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`lang-btn ${language === lang ? "lang-btn-active" : ""}`}
        >
          {languageLabels[lang]}
        </button>
      ))}
    </div>
  );
}
