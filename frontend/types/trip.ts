export interface Trip {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  travel_style?: string | null;
  recommendation_transport?: string | null;
  ai_recommendation?: string | null;
}