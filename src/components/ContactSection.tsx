import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";

const SALONKEE_URL = "https://salonkee.be";

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-gold-light mb-4">
              {t("contact.subtitle")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-8 leading-tight">
              {t("contact.title1")}
              <br />
              <span className="italic">{t("contact.title2")}</span>
            </h2>
            <p className="font-body text-primary-foreground/70 leading-relaxed mb-12 max-w-md">
              {t("contact.description")}
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: MapPin, text: "Rue d'Arlon 25, Ixelles" },
                { icon: Phone, text: "0469 24 49 55" },
                { icon: Mail, text: "hello@zehra-glam.com" },
                { icon: Clock, text: t("contact.hours") },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <Icon className="w-5 h-5 text-gold-light" />
                  <span className="font-body text-sm text-primary-foreground/80">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="px-8 py-3 bg-gold text-warm-dark font-body text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300 text-center"
              >
                {t("contact.bookOnline")}
              </Link>
              <a
                href={SALONKEE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-gold-light/40 text-cream font-body text-sm tracking-[0.2em] uppercase hover:bg-cream/10 transition-colors duration-300 text-center"
              >
                {t("contact.bookSalonkee")}
              </a>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder={t("contact.name")}
                className="w-full px-5 py-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm focus:outline-none focus:border-gold-light/50 transition-colors"
              />
              <input
                type="email"
                placeholder={t("contact.email")}
                className="w-full px-5 py-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm focus:outline-none focus:border-gold-light/50 transition-colors"
              />
            </div>
            <select className="w-full px-5 py-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/60 font-body text-sm focus:outline-none focus:border-gold-light/50 transition-colors appearance-none">
              <option value="">{t("contact.selectService")}</option>
              <option value="facial">{t("services.facial.title")}</option>
              <option value="epilation">{t("services.epilation.title")}</option>
              <option value="eyelash">{t("services.eyelash.title")}</option>
              <option value="skincare">{t("services.skincare.title")}</option>
            </select>
            <textarea
              placeholder={t("contact.message")}
              rows={4}
              className="w-full px-5 py-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm focus:outline-none focus:border-gold-light/50 transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full py-4 bg-gold text-warm-dark font-body text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300"
            >
              {t("contact.send")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
