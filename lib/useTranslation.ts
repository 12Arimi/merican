import { useParams } from "next/navigation";
import en from "../locales/en.json";
import sw from "../locales/sw.json";
import fr from "../locales/fr.json";
import es from "../locales/es.json";
import de from "../locales/de.json";
import it from "../locales/it.json";

const locales: Record<string, any> = { en, sw, fr, es, de, it };

export function useTranslation() {
  const params = useParams();
  // Get lang from URL (e.g., /sw/contact -> lang is 'sw')
  const lang = (params?.lang as string) || "en";
  
  const translations = locales[lang] || locales.en;

  const t = (key: string) => {
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

  return { t, lang };
}