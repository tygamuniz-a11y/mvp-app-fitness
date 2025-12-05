// Tipos para o aplicativo fitness

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // gramas
  carbs: number; // gramas
  fat: number; // gramas
  imageUrl?: string;
  timestamp: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: FoodItem[];
}

export interface WeeklyProgress {
  days: DailyStats[];
  averageCalories: number;
  totalMeals: number;
}

export interface NutritionAnalysis {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  description?: string;
}
