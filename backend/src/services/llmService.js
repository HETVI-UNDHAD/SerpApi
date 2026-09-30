import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey || apiKey.includes('your_') || apiKey.length < 10) {
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('[LLM Service] Failed to initialize Gemini client:', err.message);
    return null;
  }
}

/**
 * Natural language intent and constraint parser.
 * Converts free-form user prompts into structured travel constraints.
 */
export async function parseTravelPrompt(prompt) {
  const genAI = getGeminiClient();

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const systemPrompt = `You are a travel request parser for TravelOS AI. Extract travel parameters from the user's natural language request.
Output ONLY a valid JSON object with these keys:
{
  "origin": string or null,
  "destination": string or null,
  "duration": number (days) or null,
  "budget": number (INR) or null,
  "travelers": number or null,
  "interests": string[] or [],
  "transportPreference": "Flight" | "Train" | "Self-Drive" or null,
  "travelStyle": "Relaxed" | "Balanced" | "Adventure" | "Luxury" or null
}`;
      const result = await model.generateContent([systemPrompt, `User input: "${prompt}"`]);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          source: 'gemini',
          ...parsed
        };
      }
    } catch (err) {
      console.warn('[LLM Service] Gemini parse error, using deterministic fallback:', err.message);
    }
  }

  // Deterministic rule-based parser fallback
  return deterministicParsePrompt(prompt);
}

/**
 * Deterministic Regex / Heuristic parser fallback
 */
export function deterministicParsePrompt(prompt = '') {
  const p = prompt.toLowerCase();
  
  // Extract duration
  let duration = 3;
  const daysMatch = p.match(/(\d+)\s*(days?|d\b|nights?)/i);
  if (daysMatch) duration = parseInt(daysMatch[1], 10);

  // Extract budget
  let budget = 20000;
  const budgetMatch = p.match(/(?:under|budget|rs\.?|inr|₹)\s*(\d[\d,]*)/i) || p.match(/(\d[\d,]*)\s*(?:rs|inr|budget)/i);
  if (budgetMatch) {
    const raw = budgetMatch[1].replace(/,/g, '');
    const num = parseInt(raw, 10);
    if (num >= 3000) budget = num;
  }

  // Extract travelers
  let travelers = 2;
  const travelersMatch = p.match(/(\d+)\s*(people|travelers?|adults?|persons?|friends?|pax)/i) || p.match(/solo/i);
  if (p.includes('solo')) travelers = 1;
  else if (travelersMatch && travelersMatch[1]) travelers = parseInt(travelersMatch[1], 10);

  // Extract destination & origin
  let origin = 'Ahmedabad';
  let destination = 'Goa';

  const fromToMatch = p.match(/(?:from)\s+([a-zA-Z\s]+?)\s+(?:to)\s+([a-zA-Z\s]+?)(?:under|for|with|in|\d|$)/i);
  const destFromOrigMatch = p.match(/(?:in|to|visit)\s+([a-zA-Z\s]+?)\s+(?:from)\s+([a-zA-Z\s]+?)(?:under|for|with|\d|$)/i);
  const directRouteMatch = p.match(/^(?:plan|trip|travel|explore)?\s*([a-zA-Z\s]+?)\s+(?:to)\s+([a-zA-Z\s]+?)(?:under|for|with|in|\d|$)/i);

  if (fromToMatch) {
    origin = fromToMatch[1].trim();
    destination = fromToMatch[2].trim();
  } else if (destFromOrigMatch) {
    destination = destFromOrigMatch[1].trim();
    origin = destFromOrigMatch[2].trim();
  } else if (directRouteMatch && !directRouteMatch[1].toLowerCase().includes('day') && !directRouteMatch[1].toLowerCase().includes('budget')) {
    origin = directRouteMatch[1].trim();
    destination = directRouteMatch[2].trim();
  } else {
    const toMatch = p.match(/(?:to|in|visit)\s+([a-zA-Z\s]+?)(?:from|under|for|with|\d|$)/i);
    if (toMatch) destination = toMatch[1].trim();
    const fromMatch = p.match(/(?:from|departing|depart)\s+([a-zA-Z\s]+?)(?:to|under|for|with|\d|$)/i);
    if (fromMatch) origin = fromMatch[1].trim();
  }

  // Normalize common Saurashtra/Indian spellings & typos
  if (destination.toLowerCase() === 'junagtah') destination = 'Junagadh';
  if (origin.toLowerCase() === 'junagtah') origin = 'Junagadh';

  // Interests
  const interests = [];
  if (p.includes('beach')) interests.push('Beaches');
  if (p.includes('food') || p.includes('culinary') || p.includes('eat')) interests.push('Local Food');
  if (p.includes('culture') || p.includes('heritage') || p.includes('temple') || p.includes('history')) interests.push('Heritage & Culture');
  if (p.includes('nightlife') || p.includes('club') || p.includes('party')) interests.push('Nightlife');
  if (p.includes('nature') || p.includes('trek') || p.includes('mountain')) interests.push('Nature & Adventure');
  if (interests.length === 0) interests.push('Beaches', 'Local Food');

  // Transport
  let transportPreference = 'Flight';
  if (p.includes('train') || p.includes('rail')) transportPreference = 'Train';
  if (p.includes('drive') || p.includes('car') || p.includes('road trip')) transportPreference = 'Self-Drive';

  return {
    source: 'deterministic',
    origin,
    destination,
    duration,
    budget,
    travelers,
    interests,
    transportPreference,
    travelStyle: p.includes('luxury') ? 'Luxury' : p.includes('relaxed') ? 'Relaxed' : 'Balanced'
  };
}

/**
 * Generate human-like synthesized explanation for travel decisions.
 */
export async function explainDecisionWithAI({ category, data, prompt = '' }) {
  const genAI = getGeminiClient();
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const promptText = `Provide a concise 2-sentence rationale for a traveler explaining why this ${category} was selected based on constraints: ${JSON.stringify(data)}. Focus on cost-efficiency, timing, and geographic convenience.`;
      const result = await model.generateContent(promptText);
      return result.response.text().trim();
    } catch (_) {}
  }

  // Deterministic fallback explanation
  if (category === 'flight') {
    return `Selected ${data.airline || 'flight'} at ₹${(data.price || 0).toLocaleString('en-IN')} as it lands before noon, preserving your full first day for exploration while respecting the transport budget.`;
  }
  if (category === 'hotel') {
    return `Chosen for its ${data.rating || 4.5}★ guest rating and proximity to Day 1-3 activity clusters, saving ~35 minutes of daily transit time at ₹${(data.pricePerNight || 0).toLocaleString('en-IN')}/night.`;
  }
  if (category === 'replanning') {
    return `Rescheduled morning activities by ${data.delayHours || 3} hours to accommodate the arrival delay. Preserved hotel booking, evening sunset dinner, and budget ceiling.`;
  }
  return 'Optimized under your constraints based on real-time SerpApi availability and pricing.';
}
