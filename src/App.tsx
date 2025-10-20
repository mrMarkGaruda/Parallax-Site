import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
  type FormEvent,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  FiArrowRight,
  FiBell,
  FiCalendar,
  FiCamera,
  FiCheckCircle,
  FiCloud,
  FiCompass,
  FiDroplet,
  FiHelpCircle,
  FiList,
  FiMapPin,
  FiMessageCircle,
  FiMonitor,
  FiPlay,
  FiSmartphone,
  FiStar,
  FiSun,
  FiThermometer,
  FiUsers,
  FiWind,
} from 'react-icons/fi';

// Asset Imports
import heroForeground from './assets/spacejoy-IH7wPsjwomc-unsplash.jpg';
import heroBackdrop from './assets/annie-spratt-ncQ2sguVlgo-unsplash.jpg';
import layerVignette from './assets/margarita-terekhova-j3pZ-RVk7ZI-unsplash.jpg';
import layerMoisture from './assets/huy-phan-dM317CbttyY-unsplash.jpg';
import layerTexture from './assets/linh-le-Ebwp2-6BG8E-unsplash.jpg';
import layerDeskPlants from './assets/prudence-earl-NwBx723XaHw-unsplash.jpg';
import stepCaptureImage from './assets/annie-spratt-pecZhNfA700-unsplash.jpg';
import stepQuestionsImage from './assets/brandon-cormier-5IeNo4-rkQs-unsplash.jpg';
import stepScheduleImage from './assets/ceyda-ciftci-dDVU6D_6T80-unsplash.jpg';
import featureGridImage from './assets/malte-michels-s4wGZw3UuLk-unsplash.jpg';
import contactBackdrop from './assets/annie-spratt-ncQ2sguVlgo-unsplash.jpg';

// Component Imports
import { Footer } from './components/Footer';
import { Header } from './components/Header';

// CSS Import
import './App.css';

// Utility Function
const cn = (...classes: Array<string | null | false | undefined>) =>
  classes.filter(Boolean).join(' ');

// Parallax Hook Options
type ParallaxOptions = {
  axis?: 'x' | 'y';
  maxOffset?: number;
  disableBelow?: number;
  disabled?: boolean;
};

// Hook to check for reduced motion preference
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Parallax Hook
const useParallax = <T extends HTMLElement>(
  speed = 0.2,
  options: ParallaxOptions = {},
): MutableRefObject<T | null> => {
  const { axis = 'y', maxOffset, disableBelow, disabled } = options;
  const elementRef = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const applyTransform = () => {
      const node = elementRef.current;
      if (!node) {
        return;
      }

      if (prefersReducedMotion || disabled) {
        node.style.transform = '';
        return;
      }

      if (disableBelow && window.innerWidth < disableBelow) {
        node.style.transform = '';
        return;
      }

      const scrollOffset = window.scrollY || window.pageYOffset;
      let translation = scrollOffset * speed * -1;

      if (typeof maxOffset === 'number') {
        translation = Math.max(Math.min(translation, maxOffset), -maxOffset);
      }

      node.style.transform =
        axis === 'x'
          ? `translate3d(${translation}px, 0, 0)`
          : `translate3d(0, ${translation}px, 0)`;
    };

    applyTransform();

    let animationFrame: number | null = null;
    const handleScroll = () => {
      if (animationFrame !== null) {
        return;
      }
      animationFrame = window.requestAnimationFrame(() => {
        applyTransform();
        animationFrame = null;
      });
    };

    const handleResize = () => applyTransform();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [axis, disableBelow, disabled, maxOffset, prefersReducedMotion, speed]);

  return elementRef as MutableRefObject<T | null>;
};

// In-View Hook
type UseInViewOptions = IntersectionObserverInit & { once?: boolean };

const useInView = <T extends HTMLElement>(options: UseInViewOptions = {}) => {
  const { once = true, ...observerOptions } = options;
  const elementRef = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const element = elementRef.current;
    if (!element) {
      return;
    }
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setInView(false);
        }
      });
    }, observerOptions);

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, observerOptions.root, observerOptions.rootMargin, observerOptions.threshold]);

  return { ref: elementRef, inView };
};

// Reveal-on-Scroll Component
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: '0px 0px -10%',
  });
  return (
    <div
      ref={ref}
      className={cn(
        'translate-y-10 opacity-0 transition-all duration-700 ease-out',
        inView && 'translate-y-0 opacity-100',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Parallax Element Component
type ParallaxElementProps<T extends HTMLElement> = {
  as?: ElementType;
  speed?: number;
  axis?: 'x' | 'y';
  className?: string;
  children?: ReactNode;
  maxOffset?: number;
  disableBelow?: number;
  disabled?: boolean;
} & Omit<HTMLAttributes<T>, 'children'>;

const ParallaxElement = forwardRef<HTMLElement, ParallaxElementProps<HTMLElement>>(
  (
    {
      as: Component = 'div',
      speed = 0.25,
      axis = 'y',
      className,
      children,
      maxOffset,
      disableBelow,
      disabled,
      ...rest
    },
    forwardedRef,
  ) => {
    const innerRef = useParallax<HTMLElement>(speed, {
      axis,
      maxOffset,
      disableBelow,
      disabled,
    });

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          innerRef.current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as MutableRefObject<HTMLElement | null>).current = node;
          }
        }}
        className={cn('will-change-transform', className)}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

ParallaxElement.displayName = 'ParallaxElement';

// Contact Form Types and Logic
type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  plantCount: number;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;
type TouchedState = Partial<Record<keyof FormState, boolean>>;

const subjectOptions = [
  'General Inquiry',
  'Feature Request',
  'Bug Report',
  'Billing Question',
  'Partnership Opportunity',
];

const initialFormState: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  plantCount: 0,
};

const validate = (values: FormState): FieldErrors => {
  const errors: FieldErrors = {};
  if (!values.name.trim() || values.name.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 characters)';
  }
  if (
    !values.email.trim() ||
    !/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/i.test(values.email.trim())
  ) {
    errors.email = 'Please enter a valid email address';
  }
  if (!values.subject.trim()) {
    errors.subject = 'Please select a subject';
  }
  if (
    !values.message.trim() ||
    values.message.trim().length < 10 ||
    values.message.trim().length > 1000
  ) {
    errors.message = 'Message must be between 10 and 1000 characters';
  }
  return errors;
};

const ContactForm = () => {
  const [formValues, setFormValues] = useState<FormState>(initialFormState);
  const [touched, setTouched] = useState<TouchedState>({});
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const errors = useMemo(() => validate(formValues), [formValues]);
  const isValid = useMemo(
    () => !errors.name && !errors.email && !errors.subject && !errors.message,
    [errors.email, errors.message, errors.name, errors.subject],
  );

  const handleBlur = (field: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        field === 'plantCount' ? Number(event.target.value) : event.target.value;
      setFormValues((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      setTouched({
        name: true,
        email: true,
        subject: true,
        message: true,
        plantCount: true,
      });
      return;
    }

    console.log('Contact form submission:', formValues);
    setSubmitMessage("Thanks! We'll get back to you within 24 hours 🌱");
    setFormValues(initialFormState);
    setTouched({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          className="block text-sm font-medium text-brand-text-dark"
          htmlFor="name"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          value={formValues.name}
          onBlur={handleBlur('name')}
          onChange={handleChange('name')}
          className={cn(
            'mt-2 w-full rounded-xl border border-brand-primary/20 bg-white/80 px-4 py-3 text-sm text-brand-text-dark shadow-sm backdrop-blur-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30',
            touched.name && errors.name
              ? 'border-brand-accent focus:ring-brand-accent/30'
              : '',
          )}
          minLength={2}
          required
        />
        {touched.name && errors.name ? (
          <p className="mt-2 text-xs font-medium text-brand-accent">{errors.name}</p>
        ) : null}
      </div>

      <div>
        <label
          className="block text-sm font-medium text-brand-text-dark"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          value={formValues.email}
          onBlur={handleBlur('email')}
          onChange={handleChange('email')}
          className={cn(
            'mt-2 w-full rounded-xl border border-brand-primary/20 bg-white/80 px-4 py-3 text-sm text-brand-text-dark shadow-sm backdrop-blur-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30',
            touched.email && errors.email
              ? 'border-brand-accent focus:ring-brand-accent/30'
              : '',
          )}
          required
        />
        {touched.email && errors.email ? (
          <p className="mt-2 text-xs font-medium text-brand-accent">{errors.email}</p>
        ) : null}
      </div>

      <div>
        <label
          className="block text-sm font-medium text-brand-text-dark"
          htmlFor="subject"
        >
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formValues.subject}
          onBlur={handleBlur('subject')}
          onChange={handleChange('subject')}
          className={cn(
            'mt-2 w-full rounded-xl border border-brand-primary/20 bg-white/80 px-4 py-3 text-sm text-brand-text-dark shadow-sm backdrop-blur-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30',
            touched.subject && errors.subject
              ? 'border-brand-accent focus:ring-brand-accent/30'
              : '',
          )}
          required
        >
          <option value="" disabled>
            Select a subject
          </option>
          {subjectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {touched.subject && errors.subject ? (
          <p className="mt-2 text-xs font-medium text-brand-accent">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="block text-sm font-medium text-brand-text-dark"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell us what's on your mind..."
          value={formValues.message}
          onBlur={handleBlur('message')}
          onChange={handleChange('message')}
          className={cn(
            'mt-2 min-h-[140px] w-full rounded-xl border border-brand-primary/20 bg-white/80 px-4 py-3 text-sm text-brand-text-dark shadow-sm backdrop-blur-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30',
            touched.message && errors.message
              ? 'border-brand-accent focus:ring-brand-accent/30'
              : '',
          )}
          minLength={10}
          maxLength={1000}
          required
        />
        {touched.message && errors.message ? (
          <p className="mt-2 text-xs font-medium text-brand-accent">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            className="text-sm font-medium text-brand-text-dark"
            htmlFor="plant-count"
          >
            Plant Count (optional)
          </label>
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-text-light">
            {formValues.plantCount >= 50 ? '50+' : formValues.plantCount} plants
          </span>
        </div>
        <input
          id="plant-count"
          name="plantCount"
          type="range"
          min={0}
          max={50}
          value={formValues.plantCount}
          onBlur={handleBlur('plantCount')}
          onChange={handleChange('plantCount')}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-brand-primary/20"
        />
      </div>

      <button
        type="submit"
        className={cn(
          'btn-primary w-full justify-center',
          !isValid && 'pointer-events-none opacity-60',
        )}
        disabled={!isValid}
      >
        Send Message
      </button>

      {submitMessage ? (
        <p className="rounded-2xl bg-brand-primary/10 p-4 text-center text-sm font-medium text-brand-primary">
          {submitMessage}
        </p>
      ) : null}
    </form>
  );
};

// Parallax Layers Configuration
type LayerConfig = {
  image?: string;
  speed: number;
  className: string;
  gradient?: string;
  opacity?: number;
  blur?: string;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
  backgroundSize?: string;
  backgroundPosition?: string;
  disableBelow?: number;
  maxOffset?: number;
};

type SectionKey =
  | 'hero'
  | 'problem'
  | 'howItWorks'
  | 'features'
  | 'social'
  | 'pricing'
  | 'contact';

const sectionLayers: Record<SectionKey, LayerConfig[]> = {
  hero: [
    {
      gradient:
        'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(255,255,255,0))',
      speed: 0.05,
      className: 'hidden lg:block -left-40 -top-48 h-[32rem] w-[32rem] rounded-full blur-3xl',
      blendMode: 'screen',
      disableBelow: 1024,
      maxOffset: 80,
      opacity: 0.8,
    },
    {
      image: heroBackdrop,
      gradient: 'linear-gradient(135deg, rgba(45,80,22,0.6), rgba(45,80,22,0.15))',
      speed: 0.12,
      className:
        'hidden md:block right-[-10rem] top-[6rem] h-[26rem] w-[22rem] rounded-[3rem] border border-white/40 shadow-soft',
      disableBelow: 768,
      maxOffset: 140,
      opacity: 0.6,
    },
    {
      image: layerVignette,
      gradient:
        'linear-gradient(165deg, rgba(124,179,66,0.35), rgba(124,179,66,0.05))',
      speed: 0.22,
      className:
        'bottom-[-4rem] left-[12%] h-[20rem] w-[18rem] rounded-[3rem] shadow-soft',
      maxOffset: 120,
      opacity: 0.55,
    },
    {
      gradient:
        'radial-gradient(circle at 70% 80%, rgba(255,255,255,0.22), rgba(255,255,255,0))',
      speed: 0.28,
      className:
        'left-1/2 top-[48%] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full blur-2xl',
      blendMode: 'screen',
      maxOffset: 70,
      opacity: 0.7,
    },
  ],
  problem: [
    {
      gradient:
        'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.35), rgba(255,255,255,0))',
      speed: 0.08,
      className:
        'hidden lg:block right-[-12rem] -top-[8rem] h-[28rem] w-[28rem] rounded-full blur-3xl',
      blendMode: 'screen',
      disableBelow: 1024,
      maxOffset: 90,
      opacity: 0.7,
    },
    {
      image: layerDeskPlants,
      gradient: 'linear-gradient(150deg, rgba(45,80,22,0.5), rgba(45,80,22,0.1))',
      speed: 0.18,
      className:
        'hidden md:block left-[-10rem] bottom-[10%] h-[22rem] w-[18rem] rounded-[3rem] shadow-soft',
      disableBelow: 768,
      maxOffset: 130,
      opacity: 0.6,
    },
    {
      image: layerMoisture,
      gradient:
        'linear-gradient(200deg, rgba(124,179,66,0.35), rgba(124,179,66,0.08))',
      speed: 0.26,
      className: 'right-[18%] top-[45%] h-[16rem] w-[16rem] rounded-[3rem] shadow-soft',
      maxOffset: 110,
      opacity: 0.55,
    },
  ],
  howItWorks: [
    {
      gradient:
        'radial-gradient(circle at 15% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0))',
      speed: 0.08,
      className:
        'hidden lg:block -left-[10rem] -top-[6rem] h-[26rem] w-[26rem] rounded-full blur-3xl',
      blendMode: 'screen',
      disableBelow: 1024,
      maxOffset: 80,
      opacity: 0.65,
    },
    {
      image: layerTexture,
      gradient:
        'linear-gradient(160deg, rgba(45,80,22,0.55), rgba(45,80,22,0.12))',
      speed: 0.18,
      className:
        'hidden md:block right-[-8rem] top-[20%] h-[22rem] w-[18rem] rounded-[3rem] shadow-soft',
      disableBelow: 768,
      maxOffset: 120,
      opacity: 0.58,
    },
    {
      gradient:
        'linear-gradient(110deg, rgba(124,179,66,0.22), rgba(124,179,66,0))',
      speed: 0.28,
      className:
        'left-1/2 top-[60%] h-[16rem] w-[26rem] -translate-x-1/2 rounded-[3rem] blur-3xl',
      blendMode: 'soft-light',
      maxOffset: 100,
      opacity: 0.75,
    },
  ],
  features: [
    {
      gradient:
        'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), rgba(255,255,255,0))',
      speed: 0.06,
      className:
        'hidden lg:block -left-[12rem] -top-[10rem] h-[22rem] w-[22rem] rounded-full blur-3xl',
      blendMode: 'screen',
      disableBelow: 1024,
      maxOffset: 70,
      opacity: 0.55,
    },
    {
      image: featureGridImage,
      gradient:
        'linear-gradient(150deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
      speed: 0.16,
      className:
        'hidden md:block right-[-12rem] top-[12%] h-[24rem] w-[20rem] rounded-[3rem] border border-white/10 opacity-80',
      disableBelow: 768,
      maxOffset: 110,
      opacity: 0.65,
      blendMode: 'screen',
    },
    {
      gradient:
        'linear-gradient(140deg, rgba(124,179,66,0.25), rgba(124,179,66,0))',
      speed: 0.24,
      className:
        'left-1/2 top-[65%] h-[18rem] w-[28rem] -translate-x-1/2 rounded-[3rem] blur-2xl',
      blendMode: 'soft-light',
      maxOffset: 90,
      opacity: 0.7,
    },
  ],
  social: [
    {
      gradient:
        'radial-gradient(circle at 80% 10%, rgba(255,255,255,0.28), rgba(255,255,255,0))',
      speed: 0.07,
      className:
        'hidden lg:block right-[-14rem] -top-[12rem] h-[24rem] w-[24rem] rounded-full blur-3xl',
      blendMode: 'screen',
      disableBelow: 1024,
      maxOffset: 70,
      opacity: 0.6,
    },
    {
      image: layerDeskPlants,
      gradient:
        'linear-gradient(150deg, rgba(45,80,22,0.5), rgba(45,80,22,0.12))',
      speed: 0.16,
      className:
        'hidden md:block left-[-8rem] top-[30%] h-[20rem] w-[18rem] rounded-[3rem] shadow-soft',
      disableBelow: 768,
      maxOffset: 120,
      opacity: 0.55,
    },
    {
      gradient:
        'linear-gradient(120deg, rgba(124,179,66,0.18), rgba(124,179,66,0))',
      speed: 0.24,
      className:
        'left-1/2 top-[60%] h-[16rem] w-[24rem] -translate-x-1/2 rounded-[3rem] blur-3xl',
      blendMode: 'soft-light',
      maxOffset: 90,
      opacity: 0.72,
    },
  ],
  pricing: [
    {
      gradient:
        'radial-gradient(circle at 15% 15%, rgba(255,255,255,0.28), rgba(255,255,255,0))',
      speed: 0.07,
      className:
        'hidden lg:block -left-[12rem] -top-[8rem] h-[22rem] w-[22rem] rounded-full blur-3xl',
      blendMode: 'screen',
      disableBelow: 1024,
      maxOffset: 70,
      opacity: 0.65,
    },
    {
      image: layerMoisture,
      gradient:
        'linear-gradient(150deg, rgba(45,80,22,0.45), rgba(45,80,22,0.12))',
      speed: 0.18,
      className:
        'hidden md:block right-[-10rem] bottom-[12%] h-[22rem] w-[18rem] rounded-[3rem] shadow-soft',
      disableBelow: 768,
      maxOffset: 120,
      opacity: 0.58,
    },
    {
      gradient:
        'linear-gradient(130deg, rgba(124,179,66,0.25), rgba(124,179,66,0))',
      speed: 0.26,
      className:
        'left-1/2 top-[55%] h-[18rem] w-[28rem] -translate-x-1/2 rounded-[3rem] blur-3xl',
      blendMode: 'soft-light',
      maxOffset: 95,
      opacity: 0.68,
    },
  ],
  contact: [
    {
      gradient:
        'radial-gradient(circle at 75% 20%, rgba(255,255,255,0.3), rgba(255,255,255,0))',
      speed: 0.06,
      className:
        'hidden lg:block right-[-10rem] -top-[8rem] h-[22rem] w-[22rem] rounded-full blur-3xl',
      blendMode: 'screen',
      disableBelow: 1024,
      maxOffset: 70,
      opacity: 0.6,
    },
    {
      image: contactBackdrop,
      gradient:
        'linear-gradient(155deg, rgba(45,80,22,0.5), rgba(45,80,22,0.12))',
      speed: 0.18,
      className:
        'hidden md:block left-[-8rem] top-[20%] h-[22rem] w-[18rem] rounded-[3rem] shadow-soft',
      disableBelow: 768,
      maxOffset: 110,
      opacity: 0.58,
    },
    {
      gradient:
        'linear-gradient(130deg, rgba(124,179,66,0.2), rgba(124,179,66,0))',
      speed: 0.24,
      className:
        'left-1/2 top-[55%] h-[18rem] w-[26rem] -translate-x-1/2 rounded-[3rem] blur-3xl',
      blendMode: 'soft-light',
      maxOffset: 90,
      opacity: 0.7,
    },
  ],
};

// Parallax Layer Renderer
const renderParallaxLayers = (key: SectionKey) =>
  sectionLayers[key].map((layer, index) => {
    const backgroundParts = [
      layer.gradient,
      layer.image ? `url(${layer.image})` : null,
    ].filter(Boolean);

    return (
      <ParallaxElement
        key={`${key}-${index}`}
        speed={layer.speed}
        disableBelow={layer.disableBelow}
        maxOffset={layer.maxOffset}
        aria-hidden
        className={cn(
          'pointer-events-none absolute -z-10 overflow-hidden shadow-soft',
          layer.className,
          // Add rounded-3xl to all layers for consistency, unless it's a blur-only layer
          layer.image && 'rounded-[3rem]',
        )}
        style={{
          backgroundImage:
            backgroundParts.length > 0 ? backgroundParts.join(', ') : undefined,
          backgroundSize: layer.backgroundSize ?? 'cover',
          backgroundPosition: layer.backgroundPosition ?? 'center',
          opacity: layer.opacity ?? 0.55,
          filter: layer.blur ? `blur(${layer.blur})` : undefined,
          mixBlendMode: layer.blendMode ?? 'normal',
        }}
      />
    );
  });

// Main App Component
const App = () => {
  const problems: Array<{ icon: ReactElement; title: string; description: string }> =
    [
      {
        icon: <FiDroplet className="text-2xl text-brand-primary" />,
        title: 'Over-watered',
        description:
          'That fiddle leaf fig looked so lush at the store—until standing water turned its roots soggy and stressed.',
      },
      {
        icon: <FiWind className="text-2xl text-brand-primary" />,
        title: 'Under-watered',
        description:
          "Life got busy, the soil turned to dust, and suddenly your pothos is sending crispy distress signals you didn't catch.",
      },
      {
        icon: <FiHelpCircle className="text-2xl text-brand-primary" />,
        title: 'Confused',
        description:
          "Does 'bright indirect light' mean next to the window or a few feet away? Traditional apps never explain the nuance.",
      },
    ];

  const steps: Array<{
    title: string;
    description: string;
    icon: ReactElement;
    image: string;
    caption: string;
  }> = [
    {
      title: 'Snap a Photo',
      description:
        'Point your camera at any plant. Our vision model recognises species, pot size, and health signals in seconds.',
      icon: <FiCamera className="text-2xl text-brand-primary" />,
      image: stepCaptureImage,
      caption: 'AI builds your plant profile',
    },
    {
      title: 'Answer 3 Questions',
      description:
        'Tell us about light, room location, and your routine. PlantPal translates that into actionable insights.',
      icon: <FiList className="text-2xl text-brand-primary" />,
      image: stepQuestionsImage,
      caption: 'Context trains your care baseline',
    },
    {
      title: 'Get Your Schedule',
      description:
        'Receive adaptive reminders that flex with weather shifts, growth spurts, and even your travel plans.',
      icon: <FiCheckCircle className="text-2xl text-brand-primary" />,
      image: stepScheduleImage,
      caption: 'Dynamic watering plan',
    },
  ];

  const features: Array<{
    title: string;
    description: string;
    icon: ReactElement;
  }> = [
    {
      title: 'Smart Scheduling',
      description:
        'Weather-aware reminders keep each plant on rhythm without drowning the roots.',
      icon: <FiCloud className="text-2xl text-brand-secondary" />,
    },
    {
      title: 'Travel Mode',
      description:
        'Hand off care with sitter-friendly instructions and just-right timing adjustments.',
      icon: <FiCompass className="text-2xl text-brand-secondary" />,
    },
    {
      title: 'Growth Tracking',
      description:
        'Upload progress photos to see how far your jungle has come over weeks and months.',
      icon: <FiCalendar className="text-2xl text-brand-secondary" />,
    },
    {
      title: 'Care Tips',
      description:
        'Get personal advice about light, humidity, repotting signals, and seasonal tweaks.',
      icon: <FiMessageCircle className="text-2xl text-brand-secondary" />,
    },
    {
      title: 'Collection View',
      description:
        'Organise by room, difficulty, or vibe to stay on top of every plant without overwhelm.',
      icon: <FiBell className="text-2xl text-brand-secondary" />,
    },
    {
      title: 'Community',
      description:
        'Swap stories, get quick reassurance, and celebrate new leaves with fellow plant parents.',
      icon: <FiUsers className="text-2xl text-brand-secondary" />,
    },
  ];

  const testimonials: Array<{
    name: string;
    quote: string;
    plantCount: string;
    avatar: ReactElement;
  }> = [
    {
      name: 'Sarah M.',
      plantCount: '8 plants rescued',
      quote:
        'I went from serial plant killer to thriving jungle curator. PlantPal explains exactly what to do and why it matters.',
      avatar: <FiUsers className="text-lg text-brand-primary" />,
    },
    {
      name: 'Marcus L.',
      plantCount: '15 plants thriving',
      quote:
        'The travel mode feature is genius. I came home after three weeks abroad and every leaf looked happier than I left it.',
      avatar: <FiUsers className="text-lg text-brand-primary" />,
    },
    {
      name: 'Jen K.',
      plantCount: '5 plants and counting',
      quote:
        'Finally, an app that talks like a friend, not a textbook. The reminders feel like encouragement instead of guilt trips.',
      avatar: <FiUsers className="text-lg text-brand-primary" />,
    },
  ];

  const pricingTiers: Array<{
    name: string;
    price: string;
    cadence: string;
    description: string;
    features: string[];
    cta: string;
    highlighted: boolean;
  }> = [
    {
      name: 'Free Forever',
      price: '$0',
      cadence: '/month',
      description: 'Perfect for new plant parents learning the rhythm.',
      features: [
        'Up to 3 plants',
        'Essential watering reminders',
        'AI plant identification',
        'Growth photo journal',
      ],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Green Thumb Pro',
      price: '$4.99',
      cadence: '/month',
      description:
        'Unlimited plants, adaptive automations, and concierge support.',
      features: [
        'Unlimited plants + rooms',
        'Weather and season-aware scheduling',
        'Travel mode with sitter playbooks',
        'Priority support & exclusive care content',
      ],
      cta: 'Start 14-Day Free Trial',
      highlighted: true,
    },
  ];

  const appBadges: Array<{
    label: string;
    sublabel: string;
    icon: ReactElement;
  }> = [
    {
      label: 'Download on the',
      sublabel: 'App Store',
      icon: <FiSmartphone className="text-xl text-brand-primary" />,
    },
    {
      label: 'Get it on',
      sublabel: 'Google Play',
      icon: <FiMonitor className="text-xl text-brand-primary" />,
    },
  ];

  const quickFacts: Array<{
    icon: ReactElement;
    label: string;
    value: string;
  }> = [
    {
      icon: <FiSun className="text-lg text-brand-primary" />,
      label: 'Sunlight',
      value: 'Real-time guidance for every exposure',
    },
    {
      icon: <FiThermometer className="text-lg text-brand-primary" />,
      label: 'Climate aware',
      value: 'Adjusts to humidity swings & seasonal shifts',
    },
    {
      icon: <FiMapPin className="text-lg text-brand-primary" />,
      label: 'Localised',
      value: 'Weather data tuned to your exact neighbourhood',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fbfdfa] font-body text-brand-text-dark">
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(150,202,90,0.12),_transparent_60%)]"
        aria-hidden="true"
      />
      <Header />
      <main className="mt-20 flex flex-col">
        {/* ======================================= */}
        {/* Hero Section */}
        {/* ======================================= */}
        <section
          id="hero"
          className="relative isolate overflow-hidden pb-24 pt-24 sm:pt-32 lg:pb-32"
        >
          {renderParallaxLayers('hero')}
          <div className="container-content relative grid items-center gap-16 lg:grid-cols-2">
            <Reveal className="relative z-10">
              <div className="stat-pill">
                <FiStar className="text-base text-brand-primary" />
                <span>Adaptive plant care that evolves with your space</span>
              </div>

              <h1 className="mt-6 text-5xl font-semibold leading-tight text-brand-text-dark sm:text-6xl lg:text-7xl">
                Never Let Another Plant Die
              </h1>

              <p className="mt-6 max-w-xl text-lg text-brand-text-light sm:text-xl">
                PlantPal blends computer vision, hyper-local weather, and
                habit-friendly nudges to keep every leaf lush—no guesswork or
                guilt required.
              </p>

              <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a href="#pricing" className="btn-primary text-base">
                  Start Growing Free
                  <FiArrowRight className="text-lg" />
                </a>
                <a href="#how-it-works" className="btn-secondary text-base">
                  <FiPlay className="text-lg" /> See How It Works
                </a>
              </div>

              <div className="mt-12 flex divide-x divide-brand-primary/20">
                <div className="pr-6 sm:pr-8">
                  <p className="text-3xl font-semibold text-brand-primary sm:text-4xl">
                    47k+
                  </p>
                  <p className="mt-1 text-sm text-brand-text-light">
                    Happy plant parents
                  </p>
                </div>
                <div className="pl-6 sm:pl-8">
                  <p className="text-3xl font-semibold text-brand-primary sm:text-4xl">
                    4.9/5
                  </p>
                  <p className="mt-1 text-sm text-brand-text-light">
                    Community reviews
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal className="relative" delay={100}>
              <ParallaxElement
                className="parallax-frame relative mx-auto aspect-[3/4] w-full max-w-[400px] overflow-hidden rounded-3xl shadow-xl"
                speed={0.12}
                maxOffset={80}
              >
                <img
                  src={heroForeground}
                  alt="A bright interior filled with thriving houseplants"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </ParallaxElement>
              <ParallaxElement
                speed={0.22}
                maxOffset={120}
                className="absolute -bottom-10 left-1/2 w-[90%] -translate-x-1/2"
              >
                <div className="rounded-2xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                      <FiSun className="text-lg text-brand-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-text-dark">
                        Calathea Orbifolia
                      </p>
                      <p className="truncate text-sm text-brand-text-light">
                        Next watering: Monday
                      </p>
                    </div>
                  </div>
                </div>
              </ParallaxElement>
            </Reveal>
          </div>
        </section>

        {/* ======================================= */}
        {/* Problem Section */}
        {/* ======================================= */}
        <section
          id="problem"
          className="relative isolate overflow-hidden bg-white py-24 sm:py-32"
        >
          {renderParallaxLayers('problem')}
          <div className="container-content relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="section-eyebrow">We've All Been There</p>
              <h2 className="section-title mt-3">
                Why traditional reminders miss the mark
              </h2>
              <p className="section-subtitle">
                Plants aren’t widgets. They respond to light, humidity, potting
                mix, and how you water on a hectic Monday. Your app should, too.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {problems.map((problem, index) => (
                <Reveal
                  key={problem.title}
                  delay={index * 100}
                  className="card-surface h-full p-8 text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                    {problem.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-brand-text-dark">
                    {problem.title}
                  </h3>
                  <p className="mt-3 text-sm text-brand-text-light">
                    {problem.description}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-12 rounded-3xl bg-brand-primary/5 p-8 text-center" delay={300}>
              <p className="text-lg font-medium text-brand-text-dark">
                Generic schedules ignore what makes your plant
                <span className="text-brand-primary"> unique</span>—and that’s
                why they fail.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ======================================= */}
        {/* How It Works Section */}
        {/* ======================================= */}
        <section
          id="how-it-works"
          className="relative isolate overflow-hidden bg-white py-24 sm:py-32"
        >
          {renderParallaxLayers('howItWorks')}
          <div className="container-content relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="section-eyebrow">Plant Care Made Simple</p>
              <h2 className="section-title mt-3">
                Personalised in three friendly steps
              </h2>
              <p className="section-subtitle">
                We translate the nuances of plant science into a routine that
                feels natural, flexible, and achievable.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal
                  key={step.title}
                  delay={index * 100}
                  className="card-surface group flex h-full flex-col p-6"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                    <img
                      src={step.image}
                      alt={step.caption}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-brand-text-dark shadow-sm backdrop-blur-sm">
                      {step.caption}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-brand-text-dark">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-4 flex-1 text-sm text-brand-text-light">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16 flex justify-center" delay={300}>
              <a href="#pricing" className="btn-primary">
                Try It Free for 14 Days
                <FiArrowRight className="text-lg" />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ======================================= */}
        {/* Features Section */}
        {/* ======================================= */}
        <section
          id="features"
          className="relative isolate overflow-hidden bg-brand-primary py-24 text-white sm:py-32"
        >
          {renderParallaxLayers('features')}
          <div className="container-content relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="section-eyebrow text-white/70">
                Built for thriving jungles
              </p>
              <h2 className="section-title mt-3 !text-white">
                Everything you need to grow confidently
              </h2>
              <p className="section-subtitle text-white/80">
                Six powerful features harmonise into one calm, coherent
                experience designed around your daily life.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Reveal
                  key={feature.title}
                  delay={index * 100}
                  className="glass-card h-full p-8 text-left text-white"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/80">
                    {feature.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================= */}
        {/* Social Proof Section */}
        {/* ======================================= */}
        <section
          id="social-proof"
          className="relative isolate overflow-hidden bg-white py-24 sm:py-32"
        >
          {renderParallaxLayers('social')}
          <div className="container-content relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="section-eyebrow">Loved by plant parents everywhere</p>
              <h2 className="section-title mt-3">Real stories, greener homes</h2>
              <p className="section-subtitle">
                47,000+ people rely on PlantPal for judgement-free guidance,
                friendly accountability, and thriving foliage.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Reveal
                  key={testimonial.name}
                  delay={index * 100}
                  className="card-surface flex h-full flex-col p-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text-dark">
                        {testimonial.name}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-text-light">
                        {testimonial.plantCount}
                      </p>
                    </div>
                  </div>
                  <blockquote className="mt-6 flex-1 text-base text-brand-text-light">
                    “{testimonial.quote}”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-1 text-brand-primary">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <FiStar key={starIndex} className="text-lg" />
                    ))}
                    <span className="ml-2 text-xs uppercase tracking-[0.35em] text-brand-text-light">
                      Rated 5/5
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================= */}
        {/* Pricing Section */}
        {/* ======================================= */}
        <section
          id="pricing"
          className="relative isolate overflow-hidden bg-[#f3f6ea] py-24 sm:py-32"
        >
          {renderParallaxLayers('pricing')}
          <div className="container-content relative">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="section-eyebrow">Flexible by design</p>
              <h2 className="section-title mt-3">
                Start free, grow when you’re ready
              </h2>
              <p className="section-subtitle">
                Choose the rhythm that fits your jungle. Upgrade anytime, cancel
                whenever, and keep all of your plant data.
              </p>
            </Reveal>

            <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-2">
              {pricingTiers.map((tier, index) => (
                <Reveal key={tier.name} delay={index * 100}>
                  <div
                    className={cn(
                      'relative flex h-full flex-col rounded-3xl p-8 shadow-lg',
                      tier.highlighted
                        ? 'border-2 border-brand-primary bg-white ring-4 ring-brand-primary/10'
                        : 'border border-brand-primary/10 bg-white/80 backdrop-blur-sm',
                    )}
                  >
                    {tier.highlighted ? (
                      <span className="absolute -top-3 left-8 rounded-full bg-brand-primary px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                        Most Popular
                      </span>
                    ) : null}
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-4xl font-semibold text-brand-text-dark">
                        {tier.price}
                      </h3>
                      <span className="text-sm text-brand-text-light">
                        {tier.cadence}
                      </span>
                    </div>
                    <p className="mt-3 text-xl font-semibold text-brand-text-dark">
                      {tier.name}
                    </p>
                    <p className="mt-2 text-sm text-brand-text-light">
                      {tier.description}
                    </p>
                    <ul className="mt-8 flex-1 space-y-3 text-sm text-brand-text-dark">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span className="mt-0.5 flex-shrink-0 text-brand-primary">
                            <FiCheckCircle />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      className={cn(
                        'btn-primary mt-8 w-full justify-center',
                        tier.highlighted &&
                          'bg-brand-secondary text-brand-primary hover:bg-brand-secondary/90',
                      )}
                    >
                      {tier.cta}
                      <FiArrowRight className="text-lg" />
                    </a>
                    <p className="mt-4 text-center text-xs text-brand-text-light">
                      30-day money-back guarantee.
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================= */}
        {/* Contact Section */}
        {/* ======================================= */}
        <section
          id="contact"
          className="relative isolate overflow-hidden bg-white py-24 sm:py-32"
        >
          {renderParallaxLayers('contact')}
          <div className="container-content relative">
            <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <Reveal className="flex flex-col">
                <div>
                  <p className="section-eyebrow">Your plants are waiting</p>
                  <h2 className="section-title mt-3">
                    Grow with confidence today
                  </h2>
                  <p className="section-subtitle">
                    Join thousands of plant parents who swapped guesswork for
                    grounded guidance. Whether you’re nurturing your first
                    pothos or stewarding a 20-plant oasis, PlantPal adapts to
                    your rhythm.
                  </p>
                </div>

                <div className="mt-10 space-y-4">
                  {quickFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-center gap-4 rounded-2xl border border-brand-primary/10 bg-white/80 p-4 shadow-sm"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                        {fact.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-text-dark">
                          {fact.label}
                        </p>
                        <p className="text-sm text-brand-text-light">
                          {fact.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2">
                  {appBadges.map((badge) => (
                    <a
                      key={badge.label}
                      href="#"
                      className="flex items-center gap-3 rounded-2xl border border-brand-primary/20 bg-white/80 p-4 text-sm font-semibold text-brand-primary shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10">
                        {badge.icon}
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-text-light">
                          {badge.label}
                        </p>
                        <p className="text-base font-semibold text-brand-primary">
                          {badge.sublabel}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </Reveal>

              <Reveal
                delay={100}
                className="rounded-3xl border border-brand-primary/10 bg-white/90 p-8 shadow-xl backdrop-blur-lg"
              >
                <h3 className="text-3xl font-semibold text-brand-text-dark">
                  Say hello 👋
                </h3>
                <p className="mt-2 text-base text-brand-text-light">
                  Send a note and we’ll respond within one business day.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;