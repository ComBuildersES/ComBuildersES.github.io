import { useEffect, useState } from 'react';
import { ArrowRight, Users, Code, MapPin, Github, Youtube, Linkedin, MessageSquare, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '../components/ui/carousel';
import initiativesData from '../data/initiatives.json';
import faqData from '../data/faq.json';
import { fetchMembers, processMemberData } from '../services/members';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [showAllMembers, setShowAllMembers] = useState(false);
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
          setActiveSection(entry.target.id || 'home');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleCarouselInteraction = (index: number) => {
    setIsAutoPlaying(false);
    carouselApi?.scrollTo(index);
  };

  const heroImages = [
    "./images/hero-1.webp",
    "./images/hero-2.webp",
    "./images/hero-3.webp"
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
    { name: t('nav.communities'), id: 'communities' },
    { name: t('nav.newsletters'), id: 'newsletters' },
    { name: t('nav.faq'), id: 'faq' },
    { name: t('nav.contact'), id: 'contact' }
  ];

  const displayedMembers = showAllMembers ? members : members.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Community Builders</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </button>
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
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center animate-on-scroll">
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
                <button
                  onClick={() => scrollToSection('initiatives')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('hero.exploreBtn')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <a 
                  href="https://github.com/orgs/ComBuildersES/discussions/categories/novedades"
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
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative">
                        <img
                          src={image}
                          alt={`Tech community collaboration ${index + 1}`}
                          className="rounded-2xl shadow-2xl w-full h-auto"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              
              {/* Bullet indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {heroImages.map((_, index) => (
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
      <section id="initiatives" className="py-20 bg-muted/30 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('initiatives.title')}</h2>
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
      <section id="people" className="py-20 animate-on-scroll min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('people.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('people.description')}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedMembers.map((member, index) => (
              <div
                key={index}
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

      {/* Communities Section */}
      <section id="communities" className="py-20 bg-muted/30 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t('communities.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t('communities.description')}
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

       {/* Newsletters Section */}
       <section id="newsletters" className="py-20 bg-muted/30 animate-on-scroll">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('newsletters.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('newsletters.description')}
          </p>
          <div className="max-w-md mx-auto flex gap-4 inline-flex items-center">
            <a 
              href="https://github.com/orgs/ComBuildersES/discussions/categories/novedades"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('newsletters.subscribeBtn')}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('faq.title')}
            </h2>
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
                <p className="text-muted-foreground">
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </p>
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
      <section id="contact" className="py-20 animate-on-scroll faq">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('contact.title')}
          </h2>
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
                <Code className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">Community Builders</span>
              </div>
              <p className="text-muted-foreground text-sm">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.quickLinks')}</h3>
              <div className="space-y-2">
                {navItems.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </button>
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
