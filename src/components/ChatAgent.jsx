import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, MicOff, Loader } from 'lucide-react';
import { products } from './Products.jsx';
import { useLanguage } from '../LanguageContext.jsx';
import { translateWithContext } from '../translationService.js';
import { getAIResponse } from '../aiService.js';

export default function ChatAgent() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize with greeting in selected language
  useEffect(() => {
    const greetings = {
      'te': "నమస్కారం! 🦐 నేను శ్రుంపీని, మీ AI ఆక్వాకల్చర్ నిపుణుడిని!\n\nనేను Confier ఉత్పత్తుల గురించి మీకు సహాయం చేయగలను. మీ చెరువుకు కూడా సమस్య ఉందా?",
      'hi': "नमस्ते! 🦐 मैं श्रुंपी हूँ, आपका AI जलकृषि विशेषज्ञ!\n\nमैं Confier उत्पादों के बारे में मदद कर सकता हूँ। आपके तालाब में क्या समस्या है?",
      'en': "Hello! 🦐 I'm Shrumpi, your AI aquaculture expert!\n\nI specialize in Confier products and can help with your shrimp farming challenges. What's the issue in your pond today?"
    };
    
    setMessages([{ 
      role: 'agent', 
      text: greetings[lang] || greetings['en'], 
      products: [] 
    }]);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'te' ? "మీ బ్రౌజర్‌లో వాయిస్ సపోర్ట్ లేదు." : "Voice recognition not supported. Try Chrome.");
      return;
    }
    
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleProcessMessage(transcript);
    };
    
    recognition.start();
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    handleProcessMessage(input.trim());
  };

  const handleProcessMessage = async (userText) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userText, products: [] }]);
    setInput('');
    setIsTyping(true);

    try {
      // Get AI response using the new service
      const aiResponse = await getAIResponse(userText, lang);
      
      // Translate AI response to user's language if needed
      const translatedText = lang !== 'en' ? translateWithContext(aiResponse.text, lang) : aiResponse.text;
      
      // Get product objects
      const recommendedProducts = aiResponse.products || [];
      
      // Add agent message with products
      setMessages(prev => [...prev, { 
        role: 'agent', 
        text: translatedText, 
        products: recommendedProducts 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = lang === 'te' 
        ? "క్షమించండి, దయచేసి మళ్లీ ప్రయత్నించండి." 
        : lang === 'hi' 
        ? "माफ़ करें, कृपया फिर से कोशिश करें।" 
        : "Sorry, please try again.";
      
      setMessages(prev => [...prev, { 
        role: 'agent', 
        text: errorMsg, 
        products: [] 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="chat-trigger card-hover"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '25px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, var(--clr-teal-dark), var(--clr-ocean))',
          color: '#fff',
          border: 'none',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          boxShadow: '0 8px 30px rgba(0, 95, 115, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 95, 115, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 95, 115, 0.4)';
        }}
      >
        <span style={{ fontSize: '1.8rem' }}>🦐</span>
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-5px',
          background: 'var(--clr-orange-warm)',
          color: '#fff',
          fontSize: '0.7rem',
          fontWeight: 900,
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #fff',
          animation: 'shrumpiBlink 2s infinite ease-in-out'
        }}>
          1
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '25px',
          width: '360px',
          height: '550px',
          maxHeight: '80vh',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-hover)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--clr-border)',
          animation: 'slideUpChat 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--clr-teal-dark), var(--clr-ocean))',
            color: '#fff',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.6rem' }}>🦐</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>Shrumpi AI</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }} />
                  Online
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: '#fff', 
                cursor: 'pointer', 
                padding: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '20px', 
            background: 'var(--clr-bg-primary)', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px' 
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  background: msg.role === 'user' ? 'var(--clr-teal)' : '#fff',
                  color: msg.role === 'user' ? '#fff' : 'var(--clr-text-main)',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  border: msg.role === 'agent' ? '1px solid var(--clr-border)' : 'none',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {msg.text}
                </div>
                
                {/* Product Recommendations */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {msg.products.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => { 
                          setIsOpen(false); 
                          window.dispatchEvent(new CustomEvent('open-product', { detail: p.id })); 
                        }} 
                        className="card-hover" 
                        style={{
                          background: '#fff', 
                          border: '1px solid var(--clr-teal-light)', 
                          borderRadius: '12px', 
                          padding: '10px 12px',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          cursor: 'pointer', 
                          boxShadow: 'var(--shadow-sm)',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = 'var(--clr-teal)';
                          e.currentTarget.style.background = 'var(--clr-teal-light)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = 'var(--clr-teal-light)';
                          e.currentTarget.style.background = '#fff';
                        }}
                      >
                        <span style={{ fontSize: '1.4rem' }}>📦</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--clr-teal-dark)' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginTop: '2px' }}>
                            {p.subtitle}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--clr-orange)', fontWeight: 700 }}>
                          →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--clr-bg-surface)', padding: '12px 16px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite', color: 'var(--clr-teal)' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>Shrumpi is thinking...</span>
              </div>
            )}

            {isListening && (
              <div style={{ alignSelf: 'flex-end', background: 'var(--clr-orange)', padding: '8px 16px', borderRadius: '18px', color: '#fff', fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)', animation: 'pulseMic 1.5s infinite' }}>
                🎤 Listening...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ 
            padding: '16px 20px', 
            background: '#fff', 
            borderTop: '1px solid var(--clr-border)',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={startListening}
              disabled={isListening || isTyping}
              style={{
                background: isListening ? 'var(--clr-orange)' : 'var(--clr-bg-surface)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isListening || isTyping ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                color: isListening ? '#fff' : 'var(--clr-teal)'
              }}
              title="Hold to record voice message"
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
              placeholder={lang === 'te' ? "మీ సమస్య చెప్పండి..." : lang === 'hi' ? "अपनी समस्या बताएं..." : "Tell me your problem..."}
              style={{
                flex: 1,
                border: '1px solid var(--clr-border)',
                borderRadius: '24px',
                padding: '10px 16px',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--clr-teal)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{
                background: input.trim() ? 'var(--clr-orange-warm)' : 'var(--clr-text-muted)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                color: '#fff'
              }}
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes shrumpiBlink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes pulseMic {
              0%, 100% { box-shadow: 0 0 0 0 rgba(244, 162, 97, 0.7); }
              50% { box-shadow: 0 0 0 8px rgba(244, 162, 97, 0); }
            }
            @keyframes slideUpChat {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, MicOff } from 'lucide-react';
import { products } from './Products.jsx';
import { useLanguage } from '../LanguageContext.jsx';

const keywordsMap = [
  {
    keys: ['ammonia', 'toxic', 'అమ్మోనియా', 'అమోనియా', 'अमोनिया', 'जहर'],
    reply: {
      'te': "అమ్మోనియా స్థాయిలు ప్రాణాంతకం కావచ్చు! టాక్సిన్స్ నివారించడానికి దయచేసి వీటిని వాడండి:",
      'hi': "अमोनिया का स्तर बहुत खतरनाक हो सकता है! कृपया इनका उपयोग करें:",
      'en': "Ammonia spikes can be deadly fast! I highly recommend these to bind the toxins instantly:"
    },
    products: [6, 14]
  },
  {
    keys: ['sludge', 'bottom', 'waste', 'బురద', 'మట్టి', 'कीचड़', 'कचरा'],
    reply: {
      'te': "చెరువు అడుగున బురద లేదా వాసన ఉందా? ఈ డీగ్రేడర్ వాడితే మొత్తం శుభ్రపడుతుంది!",
      'hi': "तालाब के तल में कीचड़ या बदबू है? इस उत्पाद से सब साफ हो जाएगा!",
      'en': "Bottom sludge causing issues? A good degrader will clean it right up and fix the smell!"
    },
    products: [7, 9]
  },
  {
    keys: ['gut', 'white feces', 'poop', 'feces', 'తెల్ల మలం', 'కడుపు', 'सफेद मल', 'पेट'],
    reply: {
      'te': "తెల్ల మలం లేదా కడుపు ఇన్ఫెక్షన్ దిగుబడిని నాశనం చేస్తుంది. ఈ ప్రోబయోటిక్స్ వాడండి:",
      'hi': "सफेद मल या आंत के संक्रमण के लिए, कृपया इन प्रोबायोटिक्स का उपयोग करें:",
      'en': "Gut infections destroy yields. These probiotics suppress bad bacteria:"
    },
    products: [11, 4]
  },
  {
    keys: ['growth', 'slow', 'fcr', 'పెరుగుదల', 'బరువు', 'विकास', 'वजन'],
    reply: {
      'te': "రొయ్యలు బరువు పెరగడం లేదా? ఈ గ్రోత్ ప్రమోటర్స్ వాడి చూడండి!",
      'hi': "क्या झींगा का वजन नहीं बढ़ रहा है? हमारे ग्रोथ प्रमोटर्स का उपयोग करें:",
      'en': "Want them to pack on the weight? Here are our top growth promoters!"
    },
    products: [5, 1]
  },
  {
    keys: ['disease', 'virus', 'bacteria', 'వ్యాధి', 'వైరస్', 'बीमारी', 'वायरस'],
    reply: {
      'te': "వ్యాధులు వ్యాపించకుండా ఉండాలంటే ఈ శానిటైజర్ వాడాలి:",
      'hi': "बीमारी और वायरस के नियंत्रण के लिए, यह कीटाणुनाशक आवश्यक है:",
      'en': "For biosecurity and disease control, you need a broad-spectrum sanitizer."
    },
    products: [12]
  },
  {
    keys: ['mineral', 'soft', 'shell', 'మెత్తగా', 'ఖనిజాలు', 'खनिज', 'शेल'],
    reply: {
      'te': "రొయ్యల గుల్ల మెత్తబడితే ఖనిజాల లోపం ఉన్నట్లు. ఈ మినరల్స్ వాడండి:",
      'hi': "नरम शेल का मतलब खनिजों की कमी है। इस मिश्रण का उपयोग करें:",
      'en': "Mineral deficiency causes soft shells. Add this mix to the water:"
    },
    products: [3, 8, 15]
  },
  {
    keys: ['oxygen', 'air', 'ఆక్సిజన్', 'గాలి', 'ऑक्सीजन', 'हवा'],
    reply: {
      'te': "ఆక్సిజన్ తక్కువైందా? వెంటనే ఆక్సిజన్ పెంచడానికి ఇది వాడండి:",
      'hi': "ऑक्सीजन कम है? झींगा को बचाने के लिए इसका तुरंत उपयोग करें:",
      'en': "Low oxygen? Don't panic! Use this for instant relief:"
    },
    products: [10]
  }
];

export default function ChatAgent() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-translate initial greeting when Language context changes
  useEffect(() => {
    const defaultGreeting = lang === 'te' 
      ? "నమస్కారం! 🦐 నేను శ్రుంపీని, మీ AI ఆక్వాకల్చర్ నిపుణుడిని!\n\nగమనిక: నేను ఒక AIని కనుక లోపాలు జరగవచ్చు. నా పరిధికి మించిన పరిష్కారాల కోసం దయచేసి స్థానిక ప్రతినిధిని సంప్రదించండి.\n\nమీరు మీ స్థానిక భాషలో మాట్లాడటానికి మైక్ బటన్ నొక్కవచ్చు. మీ చెరువులో ఏం సమస్య ఉందో చెప్పండి!" 
      : lang === 'hi' 
      ? "नमस्ते! 🦐 मैं श्रुंपी हूँ, आपका एआई विशेषज्ञ!\n\nअस्वीकरण: मैं एक एआई हूँ और त्रुटियां कर सकता हूँ। मेरी सीमा से बाहर के समाधान के लिए स्थानीय प्रतिनिधियों से परामर्श लें।\n\nअपनी भाषा में बात करने के लिए माइक दबाएं। आपके तालाब में क्या समस्या है?"
      : "Ahoy there! 🦐 I'm Shrumpi, your AI aquaculture expert!\n\n⚠️ Disclaimer: I am an AI and can make errors. If a solution is out of my range, please consult your local representative.\n\nYou can tap the Mic to speak in your local language. What's the problem in your pond?";
    
    setMessages([{ role: 'agent', text: defaultGreeting, products: [] }]);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping, isListening]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'te' ? "మీ బ్రౌజర్‌లో వాయిస్ సపోర్ట్ లేదు." : "Voice recognition not supported in this browser. Try Chrome.");
      return;
    }
    
    // Stop speaking if the agent is currently talking
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    const recognition = new SpeechRecognition();
    // Default to the globally selected language in PillBar
    recognition.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleProcessMessage(transcript);
    };
    
    recognition.start();
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    handleProcessMessage(input.trim());
  };

  const handleProcessMessage = (userText) => {
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      let matchedData = null;
      
      for (const group of keywordsMap) {
        if (group.keys.some(k => lowerText.includes(k))) {
          matchedData = group;
          break;
        }
      }

      let replyText = "";
      let recommendedProducts = [];
      const replyLang = (lang === 'te' || lang === 'hi') ? lang : 'en';

      if (matchedData) {
        replyText = matchedData.reply[replyLang];
        recommendedProducts = products.filter(p => matchedData.products.includes(p.id));
      } else {
        replyText = lang === 'te' ? "దయచేసి కొంచెం వివరంగా చెప్పగలరా? (ఉదాహరణ: అమోనియా, బురద, ఆక్సిజన్ లేక తెల్ల మలం)" : 
                    lang === 'hi' ? "कृपया थोड़ा विस्तार से बताएं। (उदाहरण: अमोनिया, कीचड़ या ऑक्सीजन)" :
                    "Hmm, sounds tricky! Check if it's related to: Ammonia, Sludge, Oxygen, or White Feces.";
      }

      setMessages(prev => [...prev, { role: 'agent', text: replyText, products: recommendedProducts }]);
      
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="chat-trigger card-hover"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '25px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, var(--clr-teal-dark), var(--clr-ocean))',
          color: '#fff',
          border: 'none',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0, 95, 115, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <span style={{ fontSize: '1.8rem' }}>🦐</span>
        
        {/* Mobile-only "Info" box / Notification badge */}
        <div className="chat-badge" style={{
          position: 'absolute',
          top: '-8px',
          right: '-5px',
          background: 'var(--clr-orange-warm)',
          color: '#fff',
          fontSize: '0.7rem',
          fontWeight: 900,
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #fff',
          animation: 'shrumpiBlink 2s infinite ease-in-out'
        }}>
          1
        </div>

        {/* Desktop-only Label */}
        <span className="chat-label" style={{ marginLeft: '12px', fontWeight: 800, fontSize: '0.95rem' }}>
          Ask Shrumpi
        </span>
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '25px',
          width: '360px',
          height: '550px',
          maxHeight: '80vh',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-hover)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--clr-border)',
          animation: 'slideUpChat 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--clr-teal-dark), var(--clr-ocean))',
            color: '#fff',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.8rem', background: '#fff', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>🦐</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Shrumpi AI</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%'}} /> Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseOver={e=>e.target.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.target.style.background='transparent'}>
              <X size={20} style={{pointerEvents: 'none'}} />
            </button>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: 'var(--clr-bg-primary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  background: msg.role === 'user' ? 'var(--clr-teal)' : '#fff',
                  color: msg.role === 'user' ? '#fff' : 'var(--clr-text-main)',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                  borderBottomLeftRadius: msg.role === 'agent' ? '4px' : '18px',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  border: msg.role === 'agent' ? '1px solid var(--clr-border)' : 'none'
                }}>
                  {msg.text}
                </div>
                {/* Embedded Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {msg.products.map(p => (
                      <div key={p.id} onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent('open-product', { detail: p.id })); }} className="card-hover" style={{
                        background: '#fff', border: '1px solid var(--clr-teal-light)', borderRadius: '12px', padding: '10px',
                        display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
                      }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--clr-bg-primary)', borderRadius: '8px', border: '1px solid var(--clr-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{color: 'var(--clr-teal)'}}>📦</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--clr-teal-dark)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginTop: '2px' }}>{p.subtitle}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isListening && (
              <div style={{ alignSelf: 'flex-end', background: 'var(--clr-orange)', padding: '8px 16px', borderRadius: '18px', color: '#fff', fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)', animation: 'pulseMic 1.5s infinite' }}>
                🎤 Listening in {lang.toUpperCase()}...
              </div>
            )}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: '#fff', padding: '12px 16px', borderRadius: '18px', borderBottomLeftRadius: '4px', color: 'var(--clr-text-muted)', fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--clr-border)' }}>
                Shrumpi is typing <span className="typing-dots">...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ display: 'flex', padding: '16px', background: '#fff', borderTop: '1px solid var(--clr-border)' }}>
            <button type="button" onClick={startListening} title="Speak" style={{ background: isListening ? 'var(--clr-orange)' : 'var(--clr-teal-light)', color: isListening ? '#fff' : 'var(--clr-teal-dark)', border: 'none', width: '44px', height: '44px', borderRadius: '50%', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', transform: isListening ? 'scale(1.1)' : 'scale(1)' }}>
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'te' ? "ఇక్కడ టైప్ చేయండి..." : lang === 'hi' ? "यहाँ टाइप करें..." : "Type your problem..."}
              style={{ flex: 1, border: '1px solid var(--clr-border)', background: 'var(--clr-bg-surface)', padding: '10px 16px', borderRadius: '24px', outline: 'none', fontSize: '0.95rem' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--clr-teal)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
            />
            <button type="submit" style={{ background: input.trim() ? 'var(--clr-teal)' : 'var(--clr-border)', border: 'none', color: '#fff', width: '44px', height: '44px', borderRadius: '50%', marginLeft: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}>
              <Send size={20} style={{ marginLeft: '-2px' }} />
            </button>
          </form>
        </div>
      )}
      <style>{`
        @keyframes slideUpChat {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shrumpiBlink {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(231, 111, 81, 0); }
          50% { transform: scale(1.15); box-shadow: 0 0 12px rgba(231, 111, 81, 0.6); }
        }
        
        /* Responsive Trigger Styles */
        .chat-trigger {
          width: 60px;
          height: 60px;
          border-radius: 50% !important;
        }
        .chat-label {
          display: none !important;
        }
        
        @media (min-width: 769px) {
          .chat-trigger {
            width: auto !important;
            height: auto !important;
            border-radius: 50px !important;
            padding: 12px 24px !important;
          }
          .chat-label {
            display: inline !important;
          }
          .chat-badge {
             display: none !important;
          }
        }

        @keyframes pulseMic {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .typing-dots {
          display: inline-block;
          animation: blink 1.4s infinite forwards;
        }
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </>
  );
}
