import { FiCamera, FiMusic, FiThumbsUp } from 'react-icons/fi';

const footerLinks = {
  Product: ['Features', 'Pricing', 'How It Works', 'Plant Library'],
  Company: ['About', 'Blog', 'Careers', 'Press Kit'],
  Support: ['Help Center', 'Contact', 'Terms', 'Privacy'],
};

const socialLinks = [
  { name: 'Instagram', icon: <FiCamera /> },
  { name: 'TikTok', icon: <FiMusic /> },
  { name: 'Facebook', icon: <FiThumbsUp /> },
];

export const Footer = () => {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="container-content py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr_1.2fr] lg:gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {/* Updated rounding to rounded-xl for consistency */}
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl">
                PP
              </span>
              <div>
                <p className="text-2xl font-semibold">PlantPal</p>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                  Grow with confidence
                </p>
              </div>
            </div>
            <p className="text-sm text-white/80">
              PlantPal helps plant parents everywhere keep their leafy friends
              vibrant with smart reminders and personalized care tips.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href="#"
                  className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition-all duration-300 hover:border-white hover:bg-white/10 hover:text-white"
                >
                  <span className="text-base">{link.icon}</span>
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
                  {section}
                </h4>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/80 transition hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
              Weekly plant care tips
            </h4>
            <p className="text-sm text-white/80">
              Join 20k+ plant parents getting friendly watering nudges and
              seasonal advice.
            </p>
            <form
              className="space-y-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="footer-email" className="sr-only">
                  Email
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="your.email@example.com"
                  // Updated rounding to rounded-xl to match main contact form
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/50 outline-none transition-all duration-300 focus:border-white focus:ring-2 focus:ring-white/50"
                  required
                />
                <button
                  type="submit"
                  className="btn-secondary shrink-0 bg-white text-brand-primary hover:bg-white/90"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-white/60">
                We send one thoughtful email a week. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-content flex flex-col items-center justify-between gap-4 py-8 text-xs text-white/60 sm:flex-row">
          <p>© 2025 PlantPal, Inc. Grow with confidence.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};