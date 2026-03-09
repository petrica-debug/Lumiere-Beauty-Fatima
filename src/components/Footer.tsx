import { useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";
import { MapPin, Phone, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("subscribers").insert({ email, source: "footer" });
      if (error && error.code !== "23505") throw error;
      toast.success(t("footer.subscribe") + " ✓");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="py-16 bg-warm-dark">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <a href="#home" className="font-display text-2xl tracking-wide text-cream">
              ZEHRA GLAM
            </a>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold-light" />
                <span className="font-body text-xs text-cream/60">Rue d'Arlon 25, Ixelles</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-light" />
                <span className="font-body text-xs text-cream/60">0469 24 49 55</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-light" />
                <span className="font-body text-xs text-cream/60">hello@zehra-glam.com</span>
              </div>
            </div>
          </div>

          <div>
            <p className="font-body text-sm tracking-[0.2em] uppercase text-cream mb-4">
              {t("footer.newsletter")}
            </p>
            <p className="font-body text-xs text-cream/50 mb-4">
              {t("footer.newsletterDesc")}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 px-4 py-2.5 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/30 font-body text-xs focus:outline-none focus:border-gold-light/50 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-gold text-warm-dark font-body text-xs tracking-[0.15em] uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>

          <div>
            <p className="font-body text-sm tracking-[0.2em] uppercase text-cream mb-4">Links</p>
            <div className="space-y-3">
              {[
                { label: t("nav.services"), href: "#services" },
                { label: t("nav.about"), href: "#about" },
                { label: t("nav.testimonials"), href: "#testimonials" },
                { label: t("nav.contact"), href: "#contact" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block font-body text-xs tracking-[0.15em] uppercase text-cream/50 hover:text-gold-light transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-8 text-center">
          <p className="font-body text-xs text-cream/30">
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
