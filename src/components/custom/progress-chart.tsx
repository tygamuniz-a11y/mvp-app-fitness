'use client';

import { DailyStats } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface ProgressChartProps {
  weeklyData: DailyStats[];
}

export function ProgressChart({ weeklyData }: ProgressChartProps) {
  const chartData = weeklyData.map(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    
    return {
      day: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
      calorias: day.totalCalories,
      proteínas: day.totalProtein,
      carboidratos: day.totalCarbs,
      gorduras: day.totalFat,
    };
  });

  const totalCalories = weeklyData.reduce((sum, day) => sum + day.totalCalories, 0);
  const averageCalories = Math.round(totalCalories / 7);
  const totalMeals = weeklyData.reduce((sum, day) => sum + day.meals.length, 0);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            Progresso Semanal
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Últimos 7 dias</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Média Diária</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {averageCalories}
            </p>
            <p className="text-xs text-gray-500">calorias</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Semanal</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalCalories.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">calorias</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg p-4 col-span-2 sm:col-span-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Refeições</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalMeals}
            </p>
            <p className="text-xs text-gray-500">registradas</p>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="day" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="calorias" 
              fill="#10b981" 
              radius={[8, 8, 0, 0]}
              name="Calorias"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Distribuição de Macronutrientes (Semanal)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                {weeklyData.reduce((sum, day) => sum + day.totalProtein, 0)}g
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Proteínas</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {weeklyData.reduce((sum, day) => sum + day.totalCarbs, 0)}g
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Carboidratos</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {weeklyData.reduce((sum, day) => sum + day.totalFat, 0)}g
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Gorduras</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
