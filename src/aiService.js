// AI Service using Hugging Face Inference API (Free tier)
// This creates an intelligent chatbot that understands Confier products

import { products } from './Products';

// Create a product knowledge base from our Products array
const createProductKnowledgeBase = () => {
  return products.map(p => ({
    id: p.id,
    name: p.name,
    subtitle: p.subtitle,
    benefits: p.benefits,
    composition: p.composition,
    usage: p.usage,
    fullDescription: `${p.name} (${p.subtitle}): ${p.benefits.join(', ')}`
  }));
};

// System prompt that guides the AI to recommend Confier products
const createSystemPrompt = (productKB) => {
  const productList = productKB.map(p => `- ${p.name}: ${p.subtitle}`).join('\n');
  
  return `You are Shrumpi, an aquaculture expert AI assistant for Confier International. You help farmers with shrimp farming problems.

IMPORTANT RULES:
1. Answer questions about general shrimp farming, water quality, disease, and nutrition.
2. When a user mentions a problem, ALWAYS recommend ONLY Confier products that solve it.
3. Be specific about which Confier product to use and why.
4. If the problem is outside your expertise, ask for more details.

CONFIER PRODUCTS AVAILABLE:
${productList}

EXAMPLE RESPONSES:
- User: "My shrimp have white feces" → Recommend: CONFIER FEED BITE™ and CONFIER GUTPRO Plus™ for gut health
- User: "Ammonia is high" → Recommend: CONFIER SOIL AFM™ and CONFIER FLOC™
- User: "How to improve growth?" → Recommend: CONFIER MaZiK® and CONFIER MIN Plus™

Be conversational, helpful, and always promote Confier solutions.`;
};

// Extract relevance score for products based on user query
const scoreProductRelevance = (userQuery, productKB) => {
  const queryLower = userQuery.toLowerCase();
  const scored = productKB.map(p => {
    let score = 0;
    
    // Check against product benefits
    p.benefits.forEach(benefit => {
      if (queryLower.includes(benefit.toLowerCase())) score += 3;
    });
    
    // Check against composition
    if (p.composition && queryLower.includes(p.composition.toLowerCase())) score += 2;
    
    // Check against subtitle
    if (queryLower.includes(p.subtitle.toLowerCase())) score += 2;
    
    // Check against specific keywords
    const keywords = [
      'ammonia', 'sludge', 'bottom', 'gut', 'white feces', 'growth', 'slow', 
      'disease', 'virus', 'bacteria', 'mineral', 'soft shell', 'oxygen', 'air',
      'hepatopancreas', 'probiotics', 'enzyme', 'sanitizer', 'feed', 'moulting',
      'cramp', 'immune', 'fcr', 'yield', 'health', 'water quality', 'ph', 'salinity'
    ];
    
    keywords.forEach(kw => {
      if (queryLower.includes(kw) && p.fullDescription.toLowerCase().includes(kw)) {
        score += 2;
      }
    });
    
    return { product: p, score };
  });
  
  // Return top 3 products that match
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.product);
};

// Main AI response function
export const getAIResponse = async (userMessage, language = 'en') => {
  try {
    const productKB = createProductKnowledgeBase();
    const systemPrompt = createSystemPrompt(productKB);
    
    // Score and get relevant products BEFORE calling API
    const relevantProducts = scoreProductRelevance(userMessage, productKB);
    
    // Hugging Face free inference - using a lightweight model
    // Using the free Hugging Face API endpoint
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY || 'hf_default_key'}` },
        method: "POST",
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.95
          }
        }),
      }
    );

    if (!response.ok) {
      // Fallback to keyword-based if API fails
      return getFallbackResponse(userMessage, relevantProducts, language);
    }

    const result = await response.json();
    const aiText = result[0]?.generated_text || '';
    
    // Extract just the assistant response
    const assistantStart = aiText.indexOf('Assistant:') + 'Assistant:'.length;
    const aiMessage = aiText.substring(assistantStart).trim();

    return {
      text: aiMessage || "Hmm, let me think about that. Could you provide more details about your shrimp farming situation?",
      products: relevantProducts,
      confidence: relevantProducts.length > 0 ? 'high' : 'medium'
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Fallback to keyword-based response
    const productKB = createProductKnowledgeBase();
    const relevantProducts = scoreProductRelevance(userMessage, productKB);
    
    return getFallbackResponse(userMessage, relevantProducts, language);
  }
};

// Fallback response when API is unavailable
const getFallbackResponse = (userMessage, products, language) => {
  const lowerMessage = userMessage.toLowerCase();
  
  let response = '';
  
  if (language === 'te') {
    if (products.length > 0) {
      response = `చాలా బాగుంది! ఈ సమస్య కోసం నేను సిఫారసు చేస్తున్న Confier వస్తువులు ఉన్నాయి:`;
    } else {
      response = `దయచేసి మీ సమస్య గురించి మరిన్ని వివరాలు చెప్పగలరా? (ఉదాహరణ: అమోనియా, బురద, ఆక్సిజన్ లేదా తెల్ల మలం)`;
    }
  } else if (language === 'hi') {
    if (products.length > 0) {
      response = `बहुत अच्छा! इस समस्या के लिए मैं ये Confier उत्पाद सुझाता हूँ:`;
    } else {
      response = `कृपया अपनी समस्या के बारे में और विस्तार से बताएं। (उदाहरण: अमोनिया, कीचड़, ऑक्सीजन या सफेद मल)`;
    }
  } else {
    if (products.length > 0) {
      response = `Great! I found the perfect Confier solutions for your farming situation:`;
    } else {
      response = `Help me understand better. Tell me about specific issues like: ammonia spikes, sludge buildup, low oxygen, disease problems, or growth concerns.`;
    }
  }
  
  return {
    text: response,
    products: products,
    confidence: products.length > 0 ? 'high' : 'low'
  };
};

export default {
  getAIResponse,
  createProductKnowledgeBase
};
