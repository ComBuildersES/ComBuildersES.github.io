import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Users, MapPin, Github, Youtube, Linkedin, MessageSquare, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '../components/ui/carousel';
import initiativesData from '../data/initiatives.json';
import faqData from '../data/faq.json';
import { fetchMembers, processMemberData } from '../services/members';

const pageSectionIds = ['home', 'initiatives', 'people', 'events', 'communities', 'faq', 'contact'];

const SectionHeading = ({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) => (
  <h2 className={`group inline-flex items-baseline gap-2 scroll-mt-24 ${className}`}>
    <span>{children}</span>
    <a
      href={`#${id}`}
      aria-label={`Enlace directo a ${String(children)}`}
      className="text-primary opacity-0 transition-opacity hover:text-primary/80 focus:opacity-100 group-hover:opacity-100"
    >
      #
    </a>
  </h2>
);

const Index = () => {
  const eventsFeedUrl = "https://combuilderses.github.io/events/feed.json";
  const eventsIcsUrl = "https://combuilderses.github.io/events/feed.ics";
  const eventsRssUrl = "https://combuilderses.github.io/events/feed.xml";
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(eventsIcsUrl)}`;
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/addcalendar?url=${encodeURIComponent(eventsIcsUrl)}&name=${encodeURIComponent("Community Builders Events")}`;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [members, setMembers] = useState<ReturnType<typeof processMemberData>[]>([]);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [memberWindowStart, setMemberWindowStart] = useState(0);
  const [isMemberGridFading, setIsMemberGridFading] = useState(false);
  const [eventsLayout, setEventsLayout] = useState<'calendar' | 'list' | 'cards'>('calendar');
  const [isIcsMenuOpen, setIsIcsMenuOpen] = useState(false);
  const icsMenuRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  // Fetch members data
  useEffect(() => {
    const loadMembers = async () => {
      const contributors = await fetchMembers();
      const processedMembers = contributors.map(processMemberData);
      setMembers(processedMembers);
    };
    loadMembers();
  }, []);

  useEffect(() => {
    const scriptId = "ote-events-widget";

    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "module";
    script.src = "https://tools.opentechevents.org/embed/ote-events.js";
    document.head.append(script);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const viewportTarget = 120;
      const currentSection = pageSectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= viewportTarget && rect.bottom > viewportTarget;
        });

      setActiveSection(currentSection?.id || 'home');
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  useEffect(() => {
    const scrollToHashSection = () => {
      const hash = window.location.hash.replace(/^#/, "");

      if (!pageSectionIds.includes(hash)) {
        return;
      }

      document.getElementById(hash)?.scrollIntoView();
    };

    scrollToHashSection();
    window.addEventListener('hashchange', scrollToHashSection);
    return () => window.removeEventListener('hashchange', scrollToHashSection);
  }, []);

  // Carousel setup and auto-play
  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on('select', () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });

    // Auto-play functionality
    const interval = setInterval(() => {
      if (isAutoPlaying && carouselApi) {
        carouselApi.scrollNext();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselApi, isAutoPlaying]);

  useEffect(() => {
    if (showAllMembers || members.length <= 8) {
      setIsMemberGridFading(false);
      return;
    }

    let fadeTimeout: number | undefined;
    const interval = window.setInterval(() => {
      setIsMemberGridFading(true);

      fadeTimeout = window.setTimeout(() => {
        setMemberWindowStart((currentStart) => (currentStart + 8) % members.length);
        setIsMemberGridFading(false);
      }, 300);
    }, 6000);

    return () => {
      window.clearInterval(interval);
      if (fadeTimeout) {
        window.clearTimeout(fadeTimeout);
      }
    };
  }, [members.length, showAllMembers]);

  useEffect(() => {
    if (!isIcsMenuOpen) {
      return;
    }

    const closeIcsMenu = (event: PointerEvent) => {
      if (!icsMenuRef.current?.contains(event.target as Node)) {
        setIsIcsMenuOpen(false);
      }
    };

    const closeIcsMenuWithKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsIcsMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeIcsMenu);
    document.addEventListener('keydown', closeIcsMenuWithKeyboard);

    return () => {
      document.removeEventListener('pointerdown', closeIcsMenu);
      document.removeEventListener('keydown', closeIcsMenuWithKeyboard);
    };
  }, [isIcsMenuOpen]);

  const handleCarouselInteraction = (index: number) => {
    setIsAutoPlaying(false);
    carouselApi?.scrollTo(index);
  };

  const heroSlides = [
    {
      image: "./images/hero-1.webp",
      title: t('hero.slide1.title'),
      description: t('hero.slide1.description'),
      alt: t('hero.slide1.alt')
    },
    {
      image: "./images/hero-2.webp",
      title: t('hero.slide2.title'),
      description: t('hero.slide2.description'),
      alt: t('hero.slide2.alt')
    },
    {
      image: "./images/hero-3.webp",
      title: t('hero.slide3.title'),
      description: t('hero.slide3.description'),
      alt: t('hero.slide3.alt')
    }
  ];

  const processedInitiatives = initiativesData.initiatives.map(initiative => ({
    ...initiative,
    title: initiative.title[language],
    description: initiative.description[language]
  }));

  const processedFaqItems = faqData.faq.map(faq => ({
    ...faq,
    question: faq.question[language],
    answer: faq.answer[language]
  }));

  const navItems = [
    { name: t('nav.home'), id: 'home' },
    { name: t('nav.initiatives'), id: 'initiatives' },
    { name: t('nav.people'), id: 'people' },
    { name: t('nav.events'), id: 'events' },
    { name: t('nav.communities'), id: 'communities' },
    { name: t('nav.faq'), id: 'faq' },
    { name: t('nav.contact'), id: 'contact' }
  ];

  const visibleMemberCount = Math.min(8, members.length);
  const rotatingMembers = Array.from({ length: visibleMemberCount }, (_, index) => {
    return members[(memberWindowStart + index) % members.length];
  });
  const displayedMembers = showAllMembers ? members : rotatingMembers;
  const logoClasses = "rounded-full ring-1 ring-border/70 shadow-sm";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img
                src="/community-builders-logo.png"
                alt="Community Builders"
                className={`h-9 w-9 ${logoClasses}`}
              />
              <span className="text-xl font-bold text-foreground">Community Builders</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              <LanguageSelector />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <LanguageSelector />
              <button
                className="p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="scroll-mt-16 pt-16 min-h-screen flex items-center animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                {t('hero.title')}
                <span className="text-primary block">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#initiatives"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('hero.exploreBtn')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSd5Idc1wG2uhHBT11veYVx6JUfrvb_ylc1WC0ZfuXykvm1rtw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {t('hero.joinBtn')}
                </a>
              </div>
            </div>
            <div className="relative">
              <Carousel className="w-full max-w-lg mx-auto" setApi={setCarouselApi}>
                <CarouselContent>
                  {heroSlides.map((slide, index) => (
                    <CarouselItem key={index}>
                      <figure className="relative overflow-hidden rounded-2xl shadow-2xl">
                        <img
                          src={slide.image}
                          alt={slide.alt}
                          className="w-full h-auto"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
                        <figcaption className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
                          <h2 className="text-base md:text-lg font-semibold mb-1">
                            {slide.title}
                          </h2>
                          <p className="text-sm leading-relaxed text-white/90">
                            {slide.description}
                          </p>
                        </figcaption>
                      </figure>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Bullet indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleCarouselInteraction(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      current === index + 1 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>

      {/* Initiatives Section */}
      <section id="initiatives" className="scroll-mt-16 py-20 bg-muted/30 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionHeading id="initiatives" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('initiatives.title')}
            </SectionHeading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('initiatives.description')}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processedInitiatives.map((initiative, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="mb-4 overflow-hidden rounded-lg">
                  <a href={initiative.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={initiative.image}
                      alt={initiative.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </a>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  <a href={initiative.link} target="_blank" rel="noopener noreferrer">{initiative.title}</a>
                </h3>
                <div 
                  className="text-muted-foreground text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: initiative.description }}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: t('initiatives.proposals') }}
            >
            </p>
          </div>
          
        </div>
      </section>

      {/* People Section */}
      <section id="people" className="scroll-mt-16 py-20 animate-on-scroll min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionHeading id="people" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('people.title')}
            </SectionHeading>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('people.description')}
            </p>
          </div>
          
          <div
            className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${
              isMemberGridFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {displayedMembers.map((member, index) => (
              <div
                key={showAllMembers ? member.id : `${member.id}-${memberWindowStart}`}
                className="bg-card rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <a
                  href={member.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden hover:scale-105 transition-transform duration-300">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                </a>
              </div>
            ))}
          </div>

          {members.length > 8 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllMembers(!showAllMembers)}
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                {showAllMembers ? t('people.showLess') : t('people.showAll')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="scroll-mt-16 py-20 bg-muted/30 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div className="max-w-3xl">
              <SectionHeading id="events" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('events.title')}
              </SectionHeading>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('events.description')}
              </p>
            </div>

            <div className="inline-flex rounded-lg border border-border bg-background p-1 self-start lg:self-auto">
              {(['calendar', 'list', 'cards'] as const).map((layout) => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => setEventsLayout(layout)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    eventsLayout === layout
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {t(`events.layout.${layout}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="events-widget-surface mb-8">
            <ote-events
              feed={eventsFeedUrl}
              limit="12"
              layout={eventsLayout}
              fields="image,when,location,attendance,description,tags,organizer"
              theme="light"
              lang={language}
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-t border-border pt-6">
            <p
              className="order-2 max-w-2xl text-center text-xs font-light text-muted-foreground/70 lg:order-none lg:text-left [&_a]:text-muted-foreground/70 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-primary [&_a:hover]:underline"
              dangerouslySetInnerHTML={{ __html: t('events.poweredBy') }}
            >
            </p>
            <div className="order-1 flex w-full flex-wrap items-center justify-center gap-3 lg:order-none lg:w-auto lg:justify-start">
              <div
                ref={icsMenuRef}
                className="events-subscribe-menu relative inline-flex h-5 items-center leading-none"
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isIcsMenuOpen}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsIcsMenuOpen((currentOpen) => !currentOpen);
                  }}
                  className="inline-flex h-5 cursor-pointer list-none items-center rounded-full leading-none transition-opacity hover:opacity-85"
                >
                  <img
                    src="./images/badge-ics.svg?v=2"
                    alt="ICS calendar"
                    className="block h-5 w-auto"
                  />
                </button>
                {isIcsMenuOpen && (
                  <div className="absolute left-0 top-full z-20 mt-5 w-[min(14rem,calc(100vw-2rem))] rounded-lg border border-border bg-background p-2 shadow-xl sm:left-1/2 sm:-translate-x-1/2">
                    <a
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('events.subscribeGoogle')}
                    </a>
                    <a
                      href={outlookCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('events.subscribeOutlook')}
                    </a>
                    <a
                      href={eventsIcsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {t('events.downloadIcs')}
                    </a>
                  </div>
                )}
              </div>
              <a
                href={eventsRssUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full transition-opacity hover:opacity-85"
              >
                <img
                  src="./images/badge-rss.svg"
                  alt="RSS feed"
                  className="h-5 w-auto"
                />
              </a>
              <a
                href={eventsFeedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full transition-opacity hover:opacity-85"
              >
                <img
                  src="https://opentechevents.org/badge/ote-feed.svg"
                  alt="OTE feed"
                  className="h-5 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section id="communities" className="scroll-mt-16 py-20 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading id="communities" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('communities.title')}
              </SectionHeading>
              <p
                className="text-lg text-muted-foreground mb-6 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('communities.description') }}
              >
              </p>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span>{t('communities.cities')}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <span>{t('communities.members')}</span>
                </div>
              </div>
            </div>
            <div className="relative">
            <a href="https://combuilderses.github.io/communities-directory/" target="_blank" rel="noopener noreferrer">
                <img
                  src="./images/communities-directory.webp"
                  alt="Tech communities map"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </a>
              <div className="absolute rounded-2xl bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-16 py-20 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionHeading id="faq" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('faq.title')}
            </SectionHeading>
            <p className="text-lg text-muted-foreground">
              {t('faq.description')}
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {processedFaqItems.map((faq, index) => (
              <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {faq.question}
                </h3>
                <div
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: t('faq.more-questions') }} 
            >
            </p>
          </div>
        </div>

        
      </section>

     

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-16 py-20 animate-on-scroll faq">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading id="contact" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('contact.title')}
          </SectionHeading>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
          

          <a 
              href="mailto:communitybuilders.es@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('contact.btn')}
            </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/community-builders-logo.png"
                  alt="Community Builders"
                  className={`h-7 w-7 ${logoClasses}`}
                />
                <span className="text-lg font-bold text-foreground">Community Builders</span>
              </div>
              <p className="text-muted-foreground text-sm">
                {t('footer.description')}
              </p>
              <a
                href="https://opentechevents.org#support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-4"
              >
                <img
                  src="https://opentechevents.org/badge/ote-supporter.svg"
                  alt="OTE: supporter"
                  className="h-6 w-auto"
                />
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.quickLinks')}</h3>
              <div className="space-y-2">
                {navItems.slice(0, 4).map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.connect')}</h3>
              <div className="flex space-x-4 mb-4">
                <a href="https://github.com/ComBuildersES" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://www.youtube.com/@ComBuilders_ES" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="https://www.linkedin.com/company/combuilders-es/?viewAsMember=true" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://x.com/ComBuilders_ES" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Bluesky">
                  <X className="h-5 w-5" />
                </a>
                <a href="https://bsky.app/profile/communitybuilders.bsky.social" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Bluesky">
                  <MessageSquare className="h-5 w-5" />
                </a>
                <a href="mailto:communitybuilders.es@gmail.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
              
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
            {t('footer.license')} | <a href="https://github.com/ComBuildersES/ComBuildersES.github.io">{t('footer.sourcecode')}</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
