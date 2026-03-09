const Footer = () => {
  return (
    <footer className="py-12 bg-warm-dark">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="#home" className="font-display text-2xl tracking-wide text-cream">
            LUMIÈRE
          </a>
          <div className="flex gap-8">
            {["Services", "About", "Testimonials", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-body text-xs tracking-[0.2em] uppercase text-cream/50 hover:text-gold-light transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="font-body text-xs text-cream/30">
            © 2026 Lumière Beauty. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
