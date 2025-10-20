import { FiMenu, FiX } from 'react-icons/fi';
import { useEffect, useMemo, useState } from 'react';

const navItems = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#social-proof' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // This glassmorphism effect is perfect for the new design. No changes needed.
  const headerClassName = useMemo(() => {
    const base = 'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out';
    const scrolled =
      'bg-white/95 shadow-lg shadow-brand-primary/5 backdrop-blur-xl';
    const defaultState = 'bg-transparent';
    return `${base} ${isScrolled ? scrolled : defaultState}`;
  }, [isScrolled]);

  return (
    <header className={headerClassName}>
      <div className="container-content flex h-20 items-center justify-between">
        <a href="#hero" className="flex items-center gap-3">
          {/* Updated rounding to rounded-xl and size to h-10 w-10 for a sleeker look */}
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-base font-semibold text-brand-primary">
            PP
          </span>
          <div className="leading-tight">
            <span className="font-display text-xl font-semibold text-brand-text-dark">
              PlantPal
            </span>
            <p className="text-xs uppercase tracking-widest text-brand-text-light">
              Grow with confidence
            </p>
          </div>
        </a>

        {/* Updated nav to remove underline hover for a cleaner, more minimal feel */}
        <nav className="hidden items-center gap-10 text-sm font-medium text-brand-text-dark lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors duration-200 hover:text-brand-primary"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-medium text-brand-text-light transition-colors duration-200 hover:text-brand-primary"
          >
            Login
          </a>
          <a href="#pricing" className="btn-primary text-sm">
            Sign Up
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-primary/20 text-brand-text-dark transition-colors duration-200 hover:bg-brand-primary/10 lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="text-xl">{isMenuOpen ? <FiX /> : <FiMenu />}</span>
        </button>
      </div>

      {/* Mobile menu styling is already perfect (rounded-3xl, backdrop-blur) */}
      {isMenuOpen ? (
        <div className="lg:hidden">
          <div className="container-content pb-6">
            <div className="space-y-4 rounded-3xl border border-brand-primary/10 bg-white/95 p-6 shadow-lg shadow-brand-primary/5 backdrop-blur-xl">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-base font-medium text-brand-text-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="block text-base font-medium text-brand-text-light"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
              <a
                href="#pricing"
                className="btn-primary block text-center text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};