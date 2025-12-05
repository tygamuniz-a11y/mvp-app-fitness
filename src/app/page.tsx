'use client';

import { useState, useEffect } from 'react';
import { FoodScanner } from '@/components/custom/food-scanner';
import { MealHistory } from '@/components/custom/meal-history';
import { ProgressChart } from '@/components/custom/progress-chart';
import { ConfirmFoodDialog } from '@/components/custom/confirm-food-dialog';
import { NutritionAnalysis, FoodItem, DailyStats } from '@/lib/types';
import { saveFoodItem, getFoodDiary, getWeeklyStats, deleteFoodItem } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, History, TrendingUp, Flame, Target, Crown } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function Home() {
  const [meals, setMeals] = useState<FoodItem[]>([]);
  const [weeklyData, setWeeklyData] = useState<DailyStats[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<NutritionAnalysis | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    loadData();
    // Renderiza a data apenas no cliente para evitar hydration mismatch
    setCurrentDate(new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }));
  }, []);

  const loadData = () => {
    setMeals(getFoodDiary());
    setWeeklyData(getWeeklyStats());
  };

  const handleAnalysisComplete = (analysis: NutritionAnalysis, imageUrl: string) => {
    setCurrentAnalysis(analysis);
    setCurrentImageUrl(imageUrl);
    setShowConfirmDialog(true);
  };

  const handleConfirmFood = (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: string;
  }) => {
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: data.name,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      imageUrl: currentImageUrl || undefined,
      timestamp: Date.now(),
      mealType: data.mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    };

    saveFoodItem(newFood);
    loadData();
    toast.success('Alimento adicionado ao diário!', {
      description: `${data.name} - ${data.calories} kcal`,
    });
  };

  const handleDeleteMeal = (id: string) => {
    deleteFoodItem(id);
    loadData();
    toast.success('Refeição removida do diário');
  };

  const todayStats = weeklyData[weeklyData.length - 1] || {
    date: new Date().toISOString().split('T')[0],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    meals: [],
  };

  const calorieGoal = 2000; // Meta diária padrão
  const calorieProgress = Math.min((todayStats.totalCalories / calorieGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  FitFood
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Seu diário alimentar inteligente
                </p>
              </div>
            </div>
            
            {/* Botão Premium */}
            <Link href="/checkout">
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Crown className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Assinar Premium</span>
                <span className="sm:hidden">Premium</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Daily Summary Card */}
        <Card className="mb-6 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Resumo de Hoje</h2>
              <p className="text-sm text-emerald-100">
                {currentDate || 'Carregando...'}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Flame className="w-5 h-5" />
                <span className="text-3xl font-bold">{todayStats.totalCalories}</span>
              </div>
              <p className="text-sm text-emerald-100">de {calorieGoal} kcal</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-100">Progresso da meta</span>
              <span className="font-semibold">{Math.round(calorieProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${calorieProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{todayStats.totalProtein}g</p>
              <p className="text-xs text-emerald-100">Proteínas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{todayStats.totalCarbs}g</p>
              <p className="text-xs text-emerald-100">Carboidratos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{todayStats.totalFat}g</p>
              <p className="text-xs text-emerald-100">Gorduras</p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="scanner" className="flex items-center gap-2 py-3">
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Escanear</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 py-3">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 py-3">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <FoodScanner onAnalysisComplete={handleAnalysisComplete} />
            
            {todayStats.meals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-600" />
                  Refeições de Hoje
                </h3>
                <MealHistory 
                  meals={todayStats.meals} 
                  onDelete={handleDeleteMeal}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                Todas as Refeições
              </h3>
              <MealHistory meals={meals} onDelete={handleDeleteMeal} />
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <ProgressChart weeklyData={weeklyData} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Confirm Dialog */}
      <ConfirmFoodDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        analysis={currentAnalysis}
        imageUrl={currentImageUrl}
        onConfirm={handleConfirmFood}
      />
    </div>
  );
}
