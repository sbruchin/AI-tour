
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TravelPlan, Language } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getLanguageName = (lang: Language) => {
  switch(lang) {
    case 'en': return 'English';
    case 'ko': return 'Korean';
    case 'fr': return 'French';
    default: return 'Japanese';
  }
};

// Single plan schema definition (reused inside the array)
const singlePlanSchema = {
  type: Type.OBJECT,
  properties: {
    transportationMode: { type: Type.STRING, description: "Mode of transportation for this plan." },
    origin: { type: Type.STRING, description: "Origin city." },
    destination: { type: Type.STRING, description: "Destination city/country." },
    durationInDays: { type: Type.INTEGER, description: "Total duration in days." },
    mainTransportationDetails: { type: Type.STRING, description: "Details about main transportation from origin to destination." },
    totalEstimatedCost: { type: Type.STRING, description: "Total estimated cost." },
    plan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "Day number." },
          theme: { type: Type.STRING, description: "Theme of the day." },
          dailyEstimatedCost: { type: Type.STRING, description: "Daily estimated cost." },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "Start time (e.g. 10:30)." },
                activityDuration: { type: Type.STRING, description: "Duration of stay (e.g. 1 hour)." },
                placeName: { type: Type.STRING, description: "Name of the place." },
                description: { type: Type.STRING, description: "Description of the place/activity." },
                imageQuery: { type: Type.STRING, description: "English image generation prompt for this location. MUST include specific details like season (e.g. cherry blossoms, autumn leaves, snowy winter, sunny summer), weather (e.g. clear sky, rainy, foggy), and time of day (e.g. golden hour, blue hour, night with lights) to create a realistic atmosphere." },
                estimatedCost: { type: Type.STRING, description: "Estimated cost for this activity (excluding transport)." },
                suggestedRestaurants: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "List of 5 recommended restaurants nearby if this is a meal time." 
                },
                transportDetails: { type: Type.STRING, description: "Transport details to this location (e.g. line name, train name)." },
                travelDuration: { type: Type.STRING, description: "Travel duration including transfer time." },
                transportationCost: { type: Type.STRING, description: "Cost of transport to this location." },
                transportDepartureTime: { type: Type.STRING, description: "Precise departure time based on real timetables (e.g. 09:58)." },
                transportArrivalTime: { type: Type.STRING, description: "Precise arrival time based on real timetables (e.g. 12:16)." },
                transportDepartureStation: { type: Type.STRING, description: "Departure station/stop name." },
                transportArrivalStation: { type: Type.STRING, description: "Arrival station/stop name." },
                transportDirection: { type: Type.STRING, description: "Direction of train/bus (e.g. for Shinjuku)." },
              },
              required: ["time", "activityDuration", "placeName", "description", "imageQuery"],
            },
          },
        },
        required: ["day", "theme", "activities"],
      },
    },
    accommodations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Hotel name." },
          description: { type: Type.STRING, description: "Hotel description." },
          estimatedPrice: { type: Type.STRING, description: "Price per night." },
        },
        required: ["name", "description", "estimatedPrice"],
      },
      description: "List of 5 recommended accommodations.",
    },
    packingTips: {
      type: Type.OBJECT,
      properties: {
        luggageType: { type: Type.STRING, description: "Recommended luggage type (e.g. Small Suitcase, Backpack) based on transport." },
        clothing: { type: Type.STRING, description: "Recommended clothing based on season and days (e.g. '3 days of clothes, light jacket')." },
        essentials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 essential items to bring (e.g. Power bank, Walking shoes)." },
        amenitiesProvided: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-5 standard amenities (e.g. Towels, Shampoo, Pajamas) that are likely provided by the hotel and DO NOT need to be packed." },
        preparations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-5 specific pre-trip to-do items (e.g. Withdraw cash, Charge devices, Book specific tickets)." }
      },
      required: ["luggageType", "clothing", "essentials", "amenitiesProvided", "preparations"]
    }
  },
  required: ["transportationMode", "origin", "destination", "durationInDays", "plan", "totalEstimatedCost", "accommodations", "packingTips"],
};

const travelPlanSchema = {
    type: Type.ARRAY,
    items: singlePlanSchema,
    description: "List of travel plans based on different transportation modes."
};

const createPrompt = (
    origin: string, 
    destination: string, 
    nights: number, 
    transportation: string, 
    budget: string, 
    wishlistPlaces: string, 
    departureTime: string, 
    interests: string,
    language: Language,
    isPackLight: boolean,
    startDate?: string
) => {
  const langName = getLanguageName(language);
  const packLightInstruction = isPackLight
    ? "User prefers to travel LIGHT. Suggest minimal luggage (e.g. backpack). Assume hotels provide standard amenities (towels, pajamas, toiletries, hairdryer) and exclude them from the packing list to save space."
    : "Consider standard hotel amenities (towels, toiletries) to avoid overpacking.";
  
  const dateInstruction = startDate 
    ? `Trip Start Date: ${startDate}. Consider the season, weather, and day of the week (e.g., weekday vs weekend crowds, opening hours) for that specific date.` 
    : "Assume the trip starts tomorrow.";

  return `
    You are a professional travel planner.
    Create the best travel plan based on the following conditions.
    
    **OUTPUT IN ${langName}. ALL TEXT MUST BE IN ${langName} (except imageQuery which must be English).**
    
    **Important: If multiple transportation modes (${transportation}) are selected, create multiple plans, one for each mode.**
    
    Conditions:
    - Origin: ${origin}
    - Destination: ${destination}
    - Trip Start Date: ${startDate || 'Tomorrow'}
    - Duration: ${nights} nights, ${nights + 1} days
    - Transportation: ${transportation || 'Any'}
    - Budget: ${budget || 'Any'}
    - Departure Time: ${departureTime ? departureTime : 'Morning'}
    - Must-visit places: ${wishlistPlaces || 'None (Recommend)'}
    - Interests: ${interests || 'None'}
    - Accommodation: Suggest 5 operating hotels.

    【Crucial: Time Consistency】
    1. **No Overlaps**: Previous Activity Start + Duration + Travel Time = Next Arrival. Strictly enforce this.
    2. **Real Timetables**: Use EXACT times (e.g., 09:58 dep, 12:13 arr) based on real schedules, not rounded numbers like 10:00.
    3. **Transfer Time**: Allow realistic time for transfers (e.g., 15 mins).

    【Transport Accuracy】
    - Specific Names: Use "Nozomi 22" instead of just "Shinkansen".
    - Direction: Include "Bound for X".
    - Route Logic: No impossible direct routes.

    【Content】
    - ${dateInstruction}
    - Prioritize user's wishlist and interests.
    - Image prompts must be vivid, descriptive English including season/weather matching the date.
    - Suggest 5 specific real restaurants for meals.
    - **Packing Tips**: ${packLightInstruction} Provide practical advice on luggage and clothing quantity based on duration and expected weather for this season. Explicitly list standard amenities (towels, toothbrush, pajamas, etc.) provided by hotels in 'amenitiesProvided'. 
    - **Preparations**: List specific actions the user should take BEFORE leaving home (e.g. buying tickets, checking weather, downloading maps).
    
    Output in JSON format.
  `;
};

export const generateTravelPlan = async (
    origin: string, 
    destination: string, 
    nights: number, 
    transportation: string,
    budget: string, 
    wishlistPlaces: string, 
    departureTime: string, 
    interests: string,
    language: Language = 'ja',
    isPackLight: boolean = false,
    startDate?: string
): Promise<TravelPlan[]> => {
  try {
    const prompt = createPrompt(origin, destination, nights, transportation, budget, wishlistPlaces, departureTime, interests, language, isPackLight, startDate);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: travelPlanSchema,
      },
    });

    const jsonString = response.text;
    const plans: TravelPlan[] = JSON.parse(jsonString || "[]");
    return plans;

  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw new Error("Failed to generate travel plan.");
  }
};

export const regenerateTravelPlan = async (
    currentPlan: TravelPlan, 
    likedPlaces: string[], 
    wishlistPlaces: string, 
    interests: string,
    language: Language = 'ja',
    selectedHotel?: string
): Promise<TravelPlan> => {
  try {
    const langName = getLanguageName(language);
    let hotelInstruction = "";
    if (selectedHotel) {
        hotelInstruction = `
        **PRIORITY**: 
        User selected hotel "${selectedHotel}".
        1. Fix accommodation to this hotel.
        2. Re-calculate routes so daily travel ends at/starts from this hotel.
        `;
    }

    const prompt = `
    You are a travel planner. Regenerate the plan based on feedback.
    
    **OUTPUT IN ${langName}.**

    Original Plan:
    - Origin: ${currentPlan.origin}
    - Destination: ${currentPlan.destination}
    - Duration: ${currentPlan.durationInDays} nights
    - Mode: ${currentPlan.transportationMode}

    Feedback:
    1. **Keep Liked Spots**: Keep these places and their time slots: ${JSON.stringify(likedPlaces)}
    2. **Replace Others**: Remove unliked spots and replace with NEW suggestions.
    3. **Priorities**: 
       - Wishlist: ${wishlistPlaces}
       - Interests: ${interests}
       Include these if missing.
    ${hotelInstruction}

    【Time Consistency】
    - Ensure strict chronological order.
    - Use real timetables for transport.
    - Specify activityDuration.

    【Content】
    - Regenerate packing tips if necessary. Ensure amenitiesProvided and preparations are populated.

    Output in JSON format (Single TravelPlan object).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: singlePlanSchema,
      },
    });

    const jsonString = response.text;
    const newPlan: TravelPlan = JSON.parse(jsonString || "{}");
    return newPlan;

  } catch (error) {
    console.error("Error regenerating travel plan:", error);
    throw new Error("Failed to regenerate plan.");
  }
};

// Retry helper for robust API calls
const retryOperation = async <T>(operation: () => Promise<T>, retries = 2, delay = 1000): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryOperation(operation, retries - 1, delay * 2);
  }
};

export const generateImageForPlace = async (query: string): Promise<string | undefined> => {
  // Use retry operation to handle transient failures or rate limits
  return retryOperation(async () => {
    try {
      // Enhanced query with stronger guidance for scenery and high quality
      const enhancedQuery = `A high-quality, realistic travel photography of ${query}. Scenery only, no people. Professional shot, 8k resolution, cinematic lighting, beautiful composition, highly detailed, photorealistic.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: enhancedQuery,
      });

      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts;
      const inlineData = parts?.find(part => part.inlineData)?.inlineData;

      if (inlineData && inlineData.data) {
        return `data:${inlineData.mimeType};base64,${inlineData.data}`;
      }
      
      return undefined;

    } catch (error) {
      console.error("Error generating image:", error);
      throw error; // Rethrow to trigger retry
    }
  }, 2, 1500).catch((e) => {
    console.error("All retries failed for image generation:", e);
    return undefined;
  });
};

export const sendChatMessage = async (
  history: { role: string, parts: { text: string }[] }[], 
  message: string, 
  language: Language = 'ja', 
  currentPlan?: TravelPlan,
  planStartDate?: string
): Promise<string> => {
  try {
    const langName = getLanguageName(language);
    
    // Get current real-world date/time to fix date discrepancies
    const now = new Date();
    const localeMap: Record<string, string> = { ja: 'ja-JP', en: 'en-US', ko: 'ko-KR', fr: 'fr-FR' };
    const locale = localeMap[language] || 'ja-JP';
    
    const currentDate = now.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    const currentTime = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

    let systemInstruction = `You are a helpful travel assistant. Answer in ${langName}.`;
    
    // Inject Date Context
    systemInstruction += `\n**Current Real-World Date & Time**: ${currentDate} ${currentTime}\n`;

    systemInstruction += `
    【Response Style】
    - Use **bullet points**.
    - Be concise and short.
    - Conclusion first.
    - Avoid long text.
    `;

    if (currentPlan) {
      systemInstruction += `
      
      Current Plan Context:
      - Origin: ${currentPlan.origin} -> ${currentPlan.destination}
      - Days: ${currentPlan.durationInDays}
      - Transport: ${currentPlan.transportationMode}
      `;
      
      if (planStartDate) {
          systemInstruction += `- Trip Start Date: ${planStartDate}\n`;
      }

      systemInstruction += `- Details: ${JSON.stringify(currentPlan.plan)}`;
    }

    const chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history,
    });

    const result = await chatSession.sendMessage({ message: message });
    return result.text || "Error generating response.";
  } catch (error) {
    console.error("Chat error:", error);
    throw new Error("Chat failed.");
  }
};
