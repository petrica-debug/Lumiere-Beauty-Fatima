import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";
import heroImage from "@/assets/hero-beauty.jpg";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Luxury beauty treatment room"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-warm-overlay" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p
          className="font-body text-sm tracking-[0.3em] uppercase text-gold-light mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {t("hero.subtitle")}
        </p>
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-cream leading-tight mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          {t("hero.title1")}
          <br />
          <span className="italic font-light">{t("hero.title2")}</span>
        </h1>
        <p
          className="font-body text-base md:text-lg text-gold-light/80 max-w-lg mx-auto mb-10 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          {t("hero.description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <a
            href="#services"
            className="inline-block px-10 py-4 border border-gold-light/40 text-cream font-body text-sm tracking-[0.2em] uppercase hover:bg-cream/10 transition-all duration-500"
          >
            {t("hero.cta")}
          </a>
          <Link
            to="/booking"
            className="inline-block px-10 py-4 bg-gold text-warm-dark font-body text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-500"
          >
            {t("hero.bookCta")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1.5s" }}>
        <div className="w-px h-16 bg-gradient-to-b from-gold-light/60 to-transparent mx-auto" />
      </div>
    </section>
  );
};

export default HeroSection;
