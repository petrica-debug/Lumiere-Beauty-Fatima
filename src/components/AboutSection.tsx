import { Award, Heart, Sparkles } from "lucide-react";

const highlights = [
  { icon: Sparkles, label: "10+ Years Experience" },
  { icon: Heart, label: "5,000+ Happy Clients" },
  { icon: Award, label: "Certified Specialists" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-4">
              About Lumière
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8 leading-tight">
              Where Beauty Meets
              <br />
              <span className="italic">Expertise</span>
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              At Lumière, we believe that true beauty is an art form. Our team of certified aestheticians combines years of expertise with the latest techniques to deliver transformative results in an atmosphere of pure luxury.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-10">
              From advanced laser treatments to delicate eyelash artistry, every service is performed with meticulous attention to detail and a deep understanding of individual beauty.
            </p>

            <div className="flex flex-wrap gap-8">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-body text-sm text-foreground tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[3/4] bg-muted overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-accent/20 via-gold-light/20 to-rose/20 flex items-center justify-center">
                <div className="text-center px-8">
                  <p className="font-display text-6xl md:text-8xl font-light text-foreground/20">L</p>
                  <p className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground mt-4">Est. 2015</p>
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
