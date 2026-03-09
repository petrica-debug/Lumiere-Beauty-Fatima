import serviceFacial from "@/assets/service-facial.jpg";
import serviceEpilation from "@/assets/service-epilation.jpg";
import serviceEyelash from "@/assets/service-eyelash.jpg";
import serviceSkincare from "@/assets/service-skincare.jpg";

const services = [
  {
    title: "Facial Treatments",
    description: "Rejuvenating facials tailored to your skin's unique needs, using premium products for lasting radiance.",
    image: serviceFacial,
    alt: "Luxury facial treatment room",
  },
  {
    title: "Laser Epilation",
    description: "Advanced laser hair removal with cutting-edge technology for smooth, lasting results.",
    image: serviceEpilation,
    alt: "Modern laser epilation device",
  },
  {
    title: "Eyelash Extensions",
    description: "Custom lash designs from natural to dramatic, applied with precision for effortless beauty.",
    image: serviceEyelash,
    alt: "Eyelash extension tools",
  },
  {
    title: "Skincare Products",
    description: "Curated luxury skincare collections to continue your beauty ritual at home.",
    image: serviceSkincare,
    alt: "Premium skincare products",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <p className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-4">
            Our Expertise
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground">
            Services
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative overflow-hidden bg-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <a
                  href="#contact"
                  className="inline-block mt-6 font-body text-sm tracking-[0.15em] uppercase text-accent hover:text-foreground transition-colors duration-300 border-b border-accent/30 hover:border-foreground/30 pb-1"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
