import { Award, Heart, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const AboutSection = () => {
  const { t } = useTranslation();

  const highlights = [
    { icon: Sparkles, labelKey: "about.experience" },
    { icon: Heart, labelKey: "about.clients" },
    { icon: Award, labelKey: "about.certified" },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-4">
              {t("about.subtitle")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8 leading-tight">
              {t("about.title1")}
              <br />
              <span className="italic">{t("about.title2")}</span>
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              {t("about.p1")}
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-10">
              {t("about.p2")}
            </p>

            <div className="flex flex-wrap gap-8">
              {highlights.map(({ icon: Icon, labelKey }) => (
                <div key={labelKey} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-body text-sm text-foreground tracking-wide">{t(labelKey)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[3/4] bg-muted overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-accent/20 via-gold-light/20 to-rose/20 flex items-center justify-center">
                <div className="text-center px-8">
                  <p className="font-display text-6xl md:text-8xl font-light text-foreground/20">ZG</p>
                  <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mt-4">Est. 2024</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-gold/30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
