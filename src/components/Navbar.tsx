import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.testimonials"), href: "#testimonials" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="font-display text-2xl font-semibold tracking-wide text-foreground">
          ZEHRA GLAM
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/skin-analysis"
            className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors duration-300"
          >
            {t("nav.skinAnalysis")}
          </Link>
          <LanguageSwitcher />
          <Link
            to="/booking"
            className="ml-2 px-6 py-2.5 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-accent transition-colors duration-300"
          >
            {t("nav.booking")}
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-t border-border px-6 py-6 space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/skin-analysis"
            onClick={() => setIsOpen(false)}
            className="block font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors"
          >
            {t("nav.skinAnalysis")}
          </Link>
          <div className="pt-2">
            <LanguageSwitcher />
          </div>
          <Link
            to="/booking"
            onClick={() => setIsOpen(false)}
            className="block text-center px-6 py-2.5 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase"
          >
            {t("nav.booking")}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
