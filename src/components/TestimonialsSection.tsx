import { Star } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

const testimonials = [
  {
    name: "Sophie Martin",
    text: "The facial treatment was absolutely divine. My skin has never looked better. The attention to detail is unmatched.",
    service: "Facial Treatment",
  },
  {
    name: "Claire Dubois",
    text: "After years of shaving, the laser epilation has been life-changing. Professional, painless, and incredibly effective.",
    service: "Laser Epilation",
  },
  {
    name: "Isabelle Moreau",
    text: "My lash extensions look so natural and beautiful. I wake up feeling confident every single day. Highly recommend!",
    service: "Eyelash Extensions",
  },
];

const TestimonialsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-4">
            {t("testimonials.subtitle")}
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground">
            {t("testimonials.title")}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.name} className="p-8 md:p-10 bg-card border border-border/50 hover:border-gold/30 transition-colors duration-500">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="font-body text-muted-foreground leading-relaxed mb-8 italic">
                &ldquo;{item.text}&rdquo;
              </p>
              <div>
                <p className="font-display text-lg text-foreground">{item.name}</p>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-accent mt-1">{item.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
