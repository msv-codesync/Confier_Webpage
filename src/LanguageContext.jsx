import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const LanguageContext = createContext();

// Base English dictionary
const enDict = {
  'nav.products': 'Our Products',
  'nav.about': 'Our Story',
  'nav.results': 'Success Stories',
  'nav.rnd': 'Innovation Lab',
  'nav.updates': 'Latest Updates',
  'nav.contact': 'Contact Us',
  'nav.lang': 'Language',
  
  'hero.badge': 'Growing Together',
  'hero.title1': 'Growing Together,',
  'hero.title2': 'Thriving Together.',
  'hero.subtitle': 'FARMERS WHO FEED THE FUTURE, THANK YOU',
  'hero.btn1': 'Discover Our Range',
  'hero.btn2': 'Watch Success Story',
  'hero.stat.growth': 'Growth Rate',
  'hero.stat.survival': 'Survival Rate',
  
  'about.tag': 'Our Story',
  'about.title': 'The Confier Genesis',
  'about.desc': 'At Confier International, we are steadfast in our commitment to the health, vitality, and sustainability of aquatic life. We deliver premium, eco-friendly shrimp feed supplements and advanced probiotics engineered to enhance growth metrics and promote highly sustainable aquaculture practices.',
  'about.pillar1.title': 'The Confier Advantage',
  'about.pillar1.text': 'Where Science Meets Sustainability. Our proprietary feed supplements are meticulously crafted by leading aquaculture experts and biochemists utilizing only the finest natural ingredients.',
  'about.pillar2.title': 'Our North Star',
  'about.pillar2.text': 'Our mission is to unequivocally redefine the future of global aquaculture through cutting-edge, eco-conscious feed supplements, empowering shrimp farmers globally.',
  'about.pillar3.title': 'Tailored Solutions',
  'about.pillar3.text': 'By remaining closely attuned to the evolving challenges and needs of shrimp farming communities on the ground, we continuously develop next-generation bespoke supplements.',
  
  'prod.tag': 'Our Range',
  'prod.title': 'Premium Feed Supplements',
  'prod.desc': 'Scientific formulations designed to enhance growth, survival, and pond health.',
  'prod.details': 'View Details',
  'prod.interact': 'Tap to Interact 3D',
  
  'rnd.tag': 'Innovation Lab',
  'rnd.title': 'Research & Development',
  'rnd.desc': 'Engineering the future of aquaculture through uncompromising scientific inquiry and biotechnological innovation. Innovations in shrimp feed supplements are the primary drivers of healthier growth.',
  'rnd.pillar1.title': 'Expertise & Knowledge',
  'rnd.pillar1.desc': 'Decades of industry expertise combined with avant-garde scientific innovation to deliver premium-quality shrimp feed supplements.',
  'rnd.pillar2.title': 'Quality & Excellence',
  'rnd.pillar2.desc': 'Rigorous quality control under strict international standards, ensuring pure, safe, and highly effective formulations for your farm.',
  'rnd.pillar3.title': 'Tailored Solutions',
  'rnd.pillar3.desc': 'Bespoke nutritional and probiotic solutions customized to address specific regional challenges and precise physiological requirements.',
  'rnd.cert.title': 'Hallmarks & Certifications',
  'rnd.cert.desc': 'Space reserved for official badges and quality certifications.',
  
  'contact.title': 'Get in Touch with Confier International',
  'contact.desc': 'Contact us about anything related to our formulations, bulk pricing, or technical support. We\'ll do our best to get back to you as soon as possible.',
  'contact.hq': 'Head Office',
  'contact.call': 'Call Us',
  'contact.email': 'Email Support',
  'contact.send': 'Send a Message',
  'contact.name': 'Your Full Name',
  'contact.email_placeholder': 'Your Email Address',
  'contact.help': 'How can we help?',
  'contact.submit': 'Submit Request',
  'contact.btn': 'SUBMIT INQUIRY',
  
  'footer.company': 'Company',
  'footer.contact': 'Contact',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms',
  'footer.admin': 'Admin Login',
  'footer.desc': 'Eco-friendly shrimp feed supplements and probiotics promoting faster growth and better survival rates for sustainable farming.',
  
  'events.tag': 'Community Feed',
  'events.title': 'News & Bulletins',
  'events.desc': 'Latest field updates and technical bulletins.'
};

async function translateTextArray(texts, targetLang) {
  try {
    const text = texts.join('\n||\n');
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t`;
    const body = new URLSearchParams({ q: text });
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    
    if (!res.ok) throw new Error("Translation API returned " + res.status);
    
    const data = await res.json();
    const translated = data[0].map(item => item[0]).join('');
    const translatedArray = translated.split(/\n\s*\|\|\s*\n/).map(s => s.trim());
    
    // Fallback if mismatch
    if (translatedArray.length !== texts.length) {
       console.warn(`Translation mismatch length. Expected ${texts.length} but got ${translatedArray.length}. Falling back.`);
       return texts;
    }
    return translatedArray;
  } catch (error) {
    console.error("Translation error:", error);
    return texts;
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [translations, setTranslations] = useState({ en: enDict });
  const translating = useRef(new Set());
  
  // Dynamic queue state to trigger effect
  const [dynamicQueue, setDynamicQueue] = useState([]);
  const seenDynamicTexts = useRef(new Set());

  // Initial Dictionary Translation
  useEffect(() => {
    if (lang === 'en' || translations[lang] || translating.current.has(lang)) return;

    translating.current.add(lang);
    let isMounted = true;

    const translateAll = async () => {
      const keys = Object.keys(enDict);
      const values = Object.values(enDict);
      
      const translatedValues = await translateTextArray(values, lang);
      
      if (isMounted) {
        const newLangDict = {};
        keys.forEach((key, i) => {
          newLangDict[key] = translatedValues[i] || values[i];
        });
        
        setTranslations(prev => ({
          ...prev,
          [lang]: newLangDict
        }));
      }
    };

    translateAll();

    return () => {
      isMounted = false;
    };
  }, [lang]);

  // Dynamic Text Translation Effect
  useEffect(() => {
    if (lang === 'en' || dynamicQueue.length === 0) return;
    
    let isMounted = true;
    const currentQueue = [...dynamicQueue];
    setDynamicQueue([]); // Clear queue immediately so we don't re-process

    const translateDynamic = async () => {
      const translatedValues = await translateTextArray(currentQueue, lang);
      
      if (isMounted) {
        setTranslations(prev => {
          const currentLangDict = prev[lang] || {};
          const newUpdates = {};
          currentQueue.forEach((key, i) => {
            newUpdates[key] = translatedValues[i] || key;
          });
          return {
            ...prev,
            [lang]: { ...currentLangDict, ...newUpdates }
          };
        });
      }
    };

    translateDynamic();

    return () => {
      isMounted = false;
    };
  }, [dynamicQueue, lang]);

  const t = (key) => {
    // If we have the translation cached, return it
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    
    // If it's a base dict key and we're on EN or it hasn't translated yet
    if (enDict[key]) {
       return enDict[key];
    }

    // Dynamic Text - Add to queue if not seen
    if (lang !== 'en' && !seenDynamicTexts.current.has(key)) {
      seenDynamicTexts.current.add(key);
      // Small timeout to batch rapid dynamic t() calls
      setTimeout(() => {
        setDynamicQueue(prev => [...new Set([...prev, key])]);
      }, 50);
    }
    
    // Return original text as fallback/placeholder
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
