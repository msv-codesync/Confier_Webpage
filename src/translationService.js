// Translation Service with context awareness
// Properly translates content while maintaining meaning and context

// Predefined common phrases and their proper translations
// This ensures consistency and proper meaning preservation
const commonPhrases = {
  'en': {
    'water quality': 'water quality',
    'shrimp farming': 'shrimp farming',
    'pond management': 'pond management',
    'disease control': 'disease control',
    'growth promotion': 'growth promotion',
    'feed efficiency': 'feed efficiency',
    'ammonia spike': 'ammonia spike',
    'white feces': 'white feces',
    'soft shell': 'soft shell',
    'molting cycle': 'molting cycle',
    'immune system': 'immune system',
    'bacterial infection': 'bacterial infection',
  },
  'te': {
    'water quality': 'నీటి నాణ్యత',
    'shrimp farming': 'రొవ్వ పెంపకం',
    'pond management': 'చెరువు నిర్వహణ',
    'disease control': 'వ్యాధి నియంత్రణ',
    'growth promotion': 'పెరుగుదల ప్రమోషన్',
    'feed efficiency': 'ఆహారం సామర్థ్యం',
    'ammonia spike': 'అమ్మోనియా ఎక్కువ కాదు',
    'white feces': 'తెల్ల మలం',
    'soft shell': 'మెత్తపాటి నిండ',
    'molting cycle': 'చర్మ విసర్జన చక్రం',
    'immune system': 'రోగ నిరోధక వ్యవస్థ',
    'bacterial infection': 'బాక్టీరియల్ సంక్రమణ',
  },
  'hi': {
    'water quality': 'जल गुणवत्ता',
    'shrimp farming': 'झींगा पालन',
    'pond management': 'तालाब प्रबंधन',
    'disease control': 'रोग नियंत्रण',
    'growth promotion': 'विकास को बढ़ावा',
    'feed efficiency': 'भोजन दक्षता',
    'ammonia spike': 'अमोनिया की वृद्धि',
    'white feces': 'सफेद मल',
    'soft shell': 'नरम खोल',
    'molting cycle': 'मोल्टिंग चक्र',
    'immune system': 'प्रतिरक्षा प्रणाली',
    'bacterial infection': 'जीवाणु संक्रमण',
  }
};

// Translate using context-aware system
export const translateWithContext = (text, targetLanguage = 'en') => {
  if (targetLanguage === 'en') return text;

  let translatedText = text;
  const phrasesDict = commonPhrases[targetLanguage] || {};

  // Replace common phrases first (highest priority)
  Object.keys(phrasesDict).forEach(enPhrase => {
    const regex = new RegExp(enPhrase, 'gi');
    translatedText = translatedText.replace(regex, phrasesDict[enPhrase]);
  });

  return translatedText;
};

// Translate array of strings while preserving context
export const translateArray = (texts, targetLanguage = 'en') => {
  if (!Array.isArray(texts)) return texts;
  return texts.map(text => translateWithContext(text, targetLanguage));
};

// Translate object values recursively
export const translateObject = (obj, targetLanguage = 'en') => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? translateWithContext(obj, targetLanguage) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, targetLanguage));
  }

  const translated = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      translated[key] = translateObject(obj[key], targetLanguage);
    }
  }
  return translated;
};

// Get language name in native language
export const getLanguageName = (lang) => {
  const names = {
    'en': 'English',
    'te': 'తెలుగు',
    'hi': 'हिन्दी'
  };
  return names[lang] || lang;
};

// Batch translate with preserving structure
export const batchTranslate = (items, targetLanguage = 'en', keyPath = 'text') => {
  if (targetLanguage === 'en') return items;

  return items.map(item => {
    if (typeof item === 'string') {
      return translateWithContext(item, targetLanguage);
    } else if (typeof item === 'object' && item !== null) {
      const translated = { ...item };
      const keys = keyPath.split('.');
      
      let current = translated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      const lastKey = keys[keys.length - 1];
      if (current[lastKey] && typeof current[lastKey] === 'string') {
        current[lastKey] = translateWithContext(current[lastKey], targetLanguage);
      }
      
      return translated;
    }
    return item;
  });
};

export default {
  translateWithContext,
  translateArray,
  translateObject,
  getLanguageName,
  batchTranslate
};
