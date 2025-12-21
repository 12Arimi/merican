import { useEffect, useState } from "react";

export function useTranslation() {
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true); // Add this

  useEffect(() => {
    const cachedLang = localStorage.getItem("lang") || "en";
    setLang(cachedLang);

    import(`../locales/${cachedLang}.json`)
      .then((module) => {
        setTranslations(module.default || module);
        setIsLoading(false); // Set to false once loaded
      })
      .catch((err) => {
        console.error(`Could not load locale: ${cachedLang}`, err);
        setIsLoading(false); 
      });
  }, []);

  const t = (key: string) => {
    if (isLoading) return ""; // Return empty string while loading to hide keys

    const keys = key.split(".");
    let value: any = translations;
    
    for (const k of keys) {
      if (value?.[k] !== undefined) {
        value = value[k];
      } else {
        return key; 
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return { t, lang, setLang, isLoading }; // Export isLoading
}