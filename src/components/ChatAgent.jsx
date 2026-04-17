import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, MicOff, Loader } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { getAIResponse } from '../aiService.js';
const SPEECH_LANG_BCP47 = {
  en: 'en-US',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  vi: 'vi-VN',
  id: 'id-ID',
  th: 'th-TH',
  zh: 'zh-CN',
  es: 'es-ES',
  fr: 'fr-FR',
  ar: 'ar-SA',
  pt: 'pt-BR',
  ru: 'ru-RU',
  ja: 'ja-JP',
  ko: 'ko-KR',
  de: 'de-DE',
  it: 'it-IT',
  tr: 'tr-TR'
};

export default function ChatAgent() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize with greeting in selected language
  useEffect(() => {
    setMessages([{ 
      role: 'agent', 
      text: t('chat.greeting'), 
      products: [] 
    }]);
  }, [lang, t]);

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
    recognition.lang = SPEECH_LANG_BCP47[lang] || 'en-US';
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
      const aiResponse = await getAIResponse(userText, lang);
      setMessages(prev => [...prev, { 
        role: 'agent', 
        text: aiResponse.text, 
        products: aiResponse.products || [] 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      
      setMessages(prev => [...prev, { 
        role: 'agent', 
        text: t('chat.error'), 
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
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{t('chat.title')}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }} />
                  {t('chat.online')}
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
                        <span style={{ fontSize: '0.72rem', color: 'var(--clr-orange)', fontWeight: 700 }}>
                          {t('chat.openProduct')}
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
                <span style={{ fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>{t('chat.thinking')}</span>
              </div>
            )}

            {isListening && (
              <div style={{ alignSelf: 'flex-end', background: 'var(--clr-orange)', padding: '8px 16px', borderRadius: '18px', color: '#fff', fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)', animation: 'pulseMic 1.5s infinite' }}>
                🎤 {t('chat.listening')}
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
              placeholder={t('chat.input')}
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
