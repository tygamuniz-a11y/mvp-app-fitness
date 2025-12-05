'use client';

import { useState } from 'react';
import { NutritionAnalysis } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flame, Beef, Wheat, Droplet, Sparkles } from 'lucide-react';

interface ConfirmFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: NutritionAnalysis | null;
  imageUrl: string | null;
  onConfirm: (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: string;
  }) => void;
}

export function ConfirmFoodDialog({
  open,
  onOpenChange,
  analysis,
  imageUrl,
  onConfirm,
}: ConfirmFoodDialogProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState('lunch');

  // Atualizar valores quando análise mudar
  useState(() => {
    if (analysis) {
      setName(analysis.name);
      setCalories(analysis.calories.toString());
      setProtein(analysis.protein.toString());
      setCarbs(analysis.carbs.toString());
      setFat(analysis.fat.toString());
    }
  });

  const handleConfirm = () => {
    onConfirm({
      name,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      mealType,
    });
    onOpenChange(false);
  };

  if (!analysis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Confirmar Informações Nutricionais
          </DialogTitle>
          <DialogDescription>
            Revise e ajuste as informações detectadas automaticamente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {imageUrl && (
            <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img 
                src={imageUrl} 
                alt="Alimento" 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {analysis.description && (
            <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">
                Análise da IA:
              </p>
              <p>{analysis.description}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Confiança: {Math.round(analysis.confidence * 100)}%
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Nome do Alimento</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Arroz com feijão"
              />
            </div>

            <div>
              <Label htmlFor="mealType">Tipo de Refeição</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Café da Manhã</SelectItem>
                  <SelectItem value="lunch">Almoço</SelectItem>
                  <SelectItem value="dinner">Jantar</SelectItem>
                  <SelectItem value="snack">Lanche</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="calories" className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-600" />
                  Calorias
                </Label>
                <Input
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="protein" className="flex items-center gap-1">
                  <Beef className="w-4 h-4 text-red-600" />
                  Proteínas (g)
                </Label>
                <Input
                  id="protein"
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="carbs" className="flex items-center gap-1">
                  <Wheat className="w-4 h-4 text-amber-600" />
                  Carboidratos (g)
                </Label>
                <Input
                  id="carbs"
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="fat" className="flex items-center gap-1">
                  <Droplet className="w-4 h-4 text-yellow-600" />
                  Gorduras (g)
                </Label>
                <Input
                  id="fat"
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          >
            Adicionar ao Diário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
