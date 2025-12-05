// Gerenciamento de localStorage para o diário alimentar

import { FoodItem, DailyStats } from './types';

const STORAGE_KEY = 'fitness_food_diary';

export function saveFoodItem(item: FoodItem): void {
  const diary = getFoodDiary();
  diary.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diary));
}

export function getFoodDiary(): FoodItem[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getDailyStats(date: string): DailyStats {
  const diary = getFoodDiary();
  const dayStart = new Date(date).setHours(0, 0, 0, 0);
  const dayEnd = new Date(date).setHours(23, 59, 59, 999);
  
  const meals = diary.filter(item => {
    return item.timestamp >= dayStart && item.timestamp <= dayEnd;
  });
  
  const stats: DailyStats = {
    date,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    meals,
  };
  
  meals.forEach(meal => {
    stats.totalCalories += meal.calories;
    stats.totalProtein += meal.protein;
    stats.totalCarbs += meal.carbs;
    stats.totalFat += meal.fat;
  });
  
  return stats;
}

export function getWeeklyStats(): DailyStats[] {
  const today = new Date();
  const stats: DailyStats[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    stats.push(getDailyStats(dateStr));
  }
  
  return stats;
}

export function deleteFoodItem(id: string): void {
  const diary = getFoodDiary();
  const filtered = diary.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearDiary(): void {
  localStorage.removeItem(STORAGE_KEY);
}
