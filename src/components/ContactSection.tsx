import { MapPin, Phone, Clock, Mail } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-gold-light mb-4">
              Get In Touch
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-8 leading-tight">
              Book Your
              <br />
              <span className="italic">Appointment</span>
            </h2>
            <p className="font-body text-primary-foreground/70 leading-relaxed mb-12 max-w-md">
              Ready to begin your beauty journey? Contact us to schedule a consultation or book your next treatment.
            </p>

            <div className="space-y-6">
              {[
                { icon: MapPin, text: "12 Rue de la Beauté, Paris 75008" },
                { icon: Phone, text: "+33 1 23 45 67 89" },
                { icon: Mail, text: "hello@lumiere-beauty.com" },
                { icon: Clock, text: "Mon–Sat: 9:00 – 20:00" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <Icon className="w-5 h-5 text-gold-light" />
                  <span className="font-body text-sm text-primary-foreground/80">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-5 py-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm focus:outline-none focus:border-gold-light/50 transition-colors"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-5 py-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm focus:outline-none focus:border-gold-light/50 transition-colors"
              />
            </div>
            <select className="w-full px-5 py-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground/60 font-body text-sm focus:outline-none focus:border-gold-light/50 transition-colors appearance-none">
              <option value="">Select Service</option>
              <option value="facial">Facial Treatment</option>
              <option value="epilation">Laser Epilation</option>
              <option value="eyelash">Eyelash Extensions</option>
              <option value="skincare">Skincare Consultation</option>
            </select>
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-5 py-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm focus:outline-none focus:border-gold-light/50 transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full py-4 bg-gold text-warm-dark font-body text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
