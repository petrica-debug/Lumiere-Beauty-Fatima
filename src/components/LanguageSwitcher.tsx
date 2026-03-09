import { useTranslation } from "@/i18n/LanguageContext";
import { langMeta, type Lang } from "@/i18n/translations";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { lang, setLang } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 font-body text-sm text-muted-foreground hover:text-accent transition-colors">
          <Globe className="w-4 h-4" />
          <span className="uppercase">{lang}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(langMeta) as Lang[]).map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLang(code)}
            className={lang === code ? "bg-accent/10 font-medium" : ""}
          >
            {langMeta[code].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
