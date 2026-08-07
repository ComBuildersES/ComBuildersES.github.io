import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.initiatives': 'Initiatives',
    'nav.people': 'People',
    'nav.communities': 'Communities',
    'nav.events': 'Events',
    'nav.newsletters': 'News',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'We Energize',
    'hero.titleHighlight': 'Tech Communities',
    'hero.description': 'We are a collective of people who energize Spanish-speaking tech communities. We ask for and offer practical help, exchange lessons learned, and collaborate on initiatives that address shared community needs.',
    'hero.exploreBtn': 'Explore initiatives',
    'hero.joinBtn': 'Request to join',
    'hero.slide1.title': 'Online community meetups',
    'hero.slide1.description': 'Recurring sessions to network and collaborate on projects that address shared community needs.',
    'hero.slide1.alt': 'Online meeting of community builders collaborating remotely',
    'hero.slide2.title': 'We meet at conferences',
    'hero.slide2.description': 'We are happy to support and collaborate with conferences, for example by organizing open spaces for community leaders.',
    'hero.slide2.alt': 'Community leaders participating in an open space session at a conference',
    'hero.slide3.title': 'Informal gatherings',
    'hero.slide3.description': 'Relaxed meetups to spend time together, enjoy ourselves and get to know each other better.',
    'hero.slide3.alt': 'Informal gathering with people from tech communities',
    
    // Initiatives Section
    'initiatives.title': 'Our initiatives',
    'initiatives.description': 'We collaborate on different projects',
    'initiatives.proposals': 'Do you have an initiative that you would like to propose? <a href="https://github.com/ComBuildersES/ComBuildersES.github.io/discussions/categories/propuestas" target="_blank" rel="noopener noreferrer">Share it with us</a>',
    
    // People Section
    'people.title': 'Who we are',
    'people.description': 'These are the people who contribute to these initiatives',
    'people.showAll': 'Show ALL people',
    'people.showLess': 'Show less',
    
    // Communities Section
    'communities.title': 'Spanish Communities',
    'communities.description': 'We have created a web directory that brings together 400+ tech communities in Spain and other Spanish-speaking countries so that anyone interested can easily discover the available options. We are also working on improving event visibility through <a href="https://opentechevents.org/" target="_blank" rel="noopener noreferrer">OpenTechEvents</a>.',
    'communities.cities': '300+ In-person',
    'communities.members': '50+ Hybrid and online',
    
    // FAQ Section
    'faq.title': 'Frequently Asked Questions',
    'faq.description': 'Get answers to common questions about our community',
    'faq.more-questions': 'Do you have more questions? Check out <a href="https://github.com/ComBuildersES/.github/blob/main/FAQ.md">this FAQ</a>.',
    
    // Newsletters Section
    'newsletters.title': 'News',
    'newsletters.description': 'Check out Community Builders monthly newsletters',
    'newsletters.subscribeBtn': 'Monthly newsletters',
    
    // Contact Section
    'contact.title': 'Get in Touch',
    'contact.description': 'Do you have questions or want to get involved? We would love to hear from you!',
    'contact.btn': 'Contact us',

    // Events Page
    'events.title': 'Community Builders meetups',
    'events.description': 'Upcoming meetups, conversations and collaborations.',
    'events.layout.calendar': 'Calendar',
    'events.layout.list': 'List',
    'events.layout.cards': 'Cards',
    'events.poweredBy': 'Subscriptions and embeddable <a href="https://tools.opentechevents.org/embed" target="_blank" rel="noopener noreferrer">widget</a> available thanks to <a href="https://github.com/OpenTechEvents/opentechevents-spec" target="_blank" rel="noopener noreferrer">OpenTechEvents</a>.',
    'events.subscribeGoogle': 'Subscribe with Google Calendar',
    'events.subscribeOutlook': 'Subscribe with Outlook',
    'events.downloadIcs': 'Open/download ICS',
    
    // Footer
    'footer.description': 'We are a collective that brings together people who energize Spanish-speaking tech communities with the aim of being a reference place where collaboration and exchange of experiences are facilitated.',
    'footer.quickLinks': 'Quick Links',
    'footer.connect': 'Connect with Us',
    'footer.license': 'Licensed under Apache v2.0 and CC BY 4.0',
    'footer.sourcecode': 'Source code',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.initiatives': 'Iniciativas',
    'nav.people': 'Personas',
    'nav.communities': 'Comunidades',
    'nav.events': 'Eventos',
    'nav.newsletters': 'Novedades',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contacto',
    
    // Hero Section
    'hero.title': 'Dinamizamos',
    'hero.titleHighlight': 'Comunidades Tech',
    'hero.description': 'Somos un colectivo de personas que dinamizan comunidades tech de habla hispana. Nos pedimos y ofrecemos ayuda, compartimos aprendizajes y colaboramos en iniciativas que responden a necesidades comunes.',
    'hero.exploreBtn': 'Explorar iniciativas',
    'hero.joinBtn': 'Solicitar unirse',
    'hero.slide1.title': 'Encuentros online periódicos',
    'hero.slide1.description': 'Sesiones para hacer networking y colaborar en proyectos que atajan necesidades compartidas.',
    'hero.slide1.alt': 'Encuentro online de personas que dinamizan comunidades colaborando en remoto',
    'hero.slide2.title': 'Nos juntamos en conferencias',
    'hero.slide2.description': 'Estamos deseando apoyarlas y colaborar, por ejemplo organizando open spaces para community leaders.',
    'hero.slide2.alt': 'Community leaders participando en un open space durante una conferencia',
    'hero.slide3.title': 'Encuentros desenfadados',
    'hero.slide3.description': 'Quedadas para juntarnos, pasarlo bien y conocernos mejor entre personas de comunidades tech.',
    'hero.slide3.alt': 'Encuentro desenfadado con personas de comunidades tech',
    
    // Initiatives Section
    'initiatives.title': 'Nuestras iniciativas',
    'initiatives.description': 'Colaboramos en diferentes proyectos',
    'initiatives.proposals': 'Aunque hay <a href="https://github.com/orgs/ComBuildersES/discussions/categories/ideas-y-propuestas">más ideas</a> sobre la mesa.',
    
    // People Section
    'people.title': 'Quiénes somos',
    'people.description': 'Estas son las personas que contribuyen en estas iniciativas',
    'people.showAll': 'Mostrar TODAS las personas',
    'people.showLess': 'Mostrar menos',
    
    // Communities Section
    'communities.title': 'Comunidades en Español',
    'communities.description': 'Hemos creado un directorio web que reúne más de 400 comunidades tech, pensado para que cualquier persona pueda descubrir fácilmente las opciones disponibles. También estamos trabajando en mejorar la visibilidad de los eventos a través de <a href="https://opentechevents.org/" target="_blank" rel="noopener noreferrer">OpenTechEvents</a>.',
    'communities.cities': '300+ Presenciales',
    'communities.members': '50+ Híbridas y online',
    
    // FAQ Section
    'faq.title': 'Preguntas Frecuentes',
    'faq.description': 'Obtén respuestas a preguntas comunes sobre nuestra comunidad',
    'faq.more-questions': '¿Tienes más preguntas? Revisa el <a href="https://github.com/ComBuildersES/.github/blob/main/FAQ.md">este FAQ</a>.',
    
    // Newsletters Section
    'newsletters.title': 'Novedades',
    'newsletters.description': 'Consulta los boletines mensuales de Community Builders',
    'newsletters.subscribeBtn': 'Boletines mensuales',

    // Contact Section
    'contact.title': 'Ponte en contacto',
    'contact.description': '¿Tienes preguntas o quieres involucrarte? ¡Nos encantaría saber de ti!',
    'contact.btn': 'Contáctanos',

    // Events Page
    'events.title': 'Encuentros de Community Builders',
    'events.description': 'Próximos encuentros, conversaciones y colaboraciones.',
    'events.layout.calendar': 'Calendario',
    'events.layout.list': 'Lista',
    'events.layout.cards': 'Tarjetas',
    'events.poweredBy': 'Suscripciones y <a href="https://tools.opentechevents.org/embed" target="_blank" rel="noopener noreferrer">widget</a> embebible disponibles gracias a <a href="https://github.com/OpenTechEvents/opentechevents-spec" target="_blank" rel="noopener noreferrer">OpenTechEvents</a>.',
    'events.subscribeGoogle': 'Suscribirse con Google Calendar',
    'events.subscribeOutlook': 'Suscribirse con Outlook',
    'events.downloadIcs': 'Abrir/descargar ICS',
    
    // Footer
    'footer.description': 'Somos un colectivo que reúne a personas que dinamizan comunidades tech de habla hispana con el objetivo de ser un lugar de referencia donde se facilite la colaboración y el intercambio de experiencias.',
    'footer.quickLinks': 'Enlaces Rápidos',
    'footer.connect': 'Conéctate con Nosotros',
    'footer.license': 'Licenciado bajo Apache v2.0 y CC BY 4.0',
    'footer.sourcecode': 'Código fuente',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
