'use client';

import { FoodItem } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MealHistoryProps {
  meals: FoodItem[];
  onDelete: (id: string) => void;
}

export function MealHistory({ meals, onDelete }: MealHistoryProps) {
  const sortedMeals = [...meals].sort((a, b) => b.timestamp - a.timestamp);

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Café da Manhã',
      lunch: 'Almoço',
      dinner: 'Jantar',
      snack: 'Lanche',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMealTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      lunch: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      dinner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      snack: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short' 
      });
    }
  };

  if (meals.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 dark:text-gray-600">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-1">Nenhuma refeição registrada</p>
          <p className="text-sm">Escaneie seu primeiro alimento para começar!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sortedMeals.map((meal) => (
        <Card key={meal.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            {meal.imageUrl && (
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                <img 
                  src={meal.imageUrl} 
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {meal.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={getMealTypeColor(meal.mealType)}>
                      {getMealTypeLabel(meal.mealType)}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(meal.timestamp)} • {formatTime(meal.timestamp)}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(meal.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                  <Flame className="w-4 h-4" />
                  <span className="font-medium">{meal.calories}</span>
                  <span className="text-xs text-gray-500">kcal</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <Beef className="w-4 h-4" />
                  <span className="font-medium">{meal.protein}g</span>
                  <span className="text-xs text-gray-500">prot</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <Wheat className="w-4 h-4" />
                  <span className="font-medium">{meal.carbs}g</span>
                  <span className="text-xs text-gray-500">carb</span>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
                  <Droplet className="w-4 h-4" />
                  <span className="font-medium">{meal.fat}g</span>
                  <span className="text-xs text-gray-500">gord</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
