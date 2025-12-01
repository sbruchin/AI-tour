
export interface Accommodation {
  name: string;
  description: string;
  estimatedPrice: string;
}

export interface Activity {
  placeName: string;
  description: string;
  time: string;
  activityDuration?: string; // その場所での滞在時間（例：1時間、90分）
  imageQuery: string; 
  estimatedCost?: string;
  transportDetails?: string; // 路線名や手段の詳細（例：のぞみ1号、市バス205系統）
  transportationCost?: string;
  travelDuration?: string;
  isLiked?: boolean; // ユーザーが「いいね」したかどうかのフラグ
  
  // Detailed transport schedule fields
  transportDepartureTime?: string;   // e.g. "09:00"
  transportArrivalTime?: string;     // e.g. "11:15"
  transportDepartureStation?: string; // e.g. "東京駅"
  transportArrivalStation?: string;   // e.g. "京都駅"
  transportDirection?: string;        // e.g. "博多行き"、"新宿方面"

  // New fields for specific suggestions and details
  suggestedRestaurants?: string[]; // ランチやディナーの場合の具体的な店名リスト
  // placeUrl removed to ensure 100% reliability via dynamic search links
}

export interface DailyPlan {
  day: number;
  theme: string;
  activities: Activity[];
  dailyEstimatedCost?: string;
}

export interface PackingTips {
  luggageType: string; // e.g., "Carry-on suitability"
  clothing: string;    // e.g., "3 days of casual wear"
  essentials: string[]; // e.g., ["Power bank", "Walking shoes"]
  amenitiesProvided?: string[]; // Items provided by hotel (do not pack)
  preparations?: string[]; // New field for pre-trip to-do list
}

export interface TravelPlan {
  transportationMode: string; // どの交通手段に基づいたプランか（例：「新幹線プラン」、「飛行機プラン」）
  origin: string;
  destination: string;
  durationInDays: number;
  mainTransportationDetails?: string;
  plan: DailyPlan[];
  totalEstimatedCost?: string;
  accommodations?: Accommodation[];
  packingTips?: PackingTips; // New field for packing suggestions
}

export type Language = 'ja' | 'en' | 'ko' | 'fr';

export interface HistoryItem {
  id: string;
  timestamp: number;
  inputs: {
    origin: string;
    destination: string;
    nights: number;
    budget: string;
    transportation: string;
    departureTime: string;
    wishlistPlaces: string;
    interests: string;
    isPackLight?: boolean; // New field for packing preference
    startDate?: string; // New field for trip start date
  };
  plans: TravelPlan[];
}
