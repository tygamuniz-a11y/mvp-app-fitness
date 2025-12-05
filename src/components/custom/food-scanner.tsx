'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { analyzeFoodImageBase64 } from '@/lib/nutrition-api';
import { NutritionAnalysis } from '@/lib/types';

interface FoodScannerProps {
  onAnalysisComplete: (analysis: NutritionAnalysis, imageUrl: string) => void;
}

export function FoodScanner({ onAnalysisComplete }: FoodScannerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setError(null);

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Analisar imagem
    setIsAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      const analysis = await analyzeFoodImageBase64(base64);
      
      const imageUrl = URL.createObjectURL(file);
      onAnalysisComplete(analysis, imageUrl);
      setError(null);
    } catch (error: any) {
      console.error('Erro ao analisar:', error);
      const errorMessage = error?.message || 'Erro ao analisar alimento. Tente novamente.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
      setPreviewUrl(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Escanear Alimento
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tire uma foto ou selecione uma imagem do seu alimento
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                Erro ao analisar alimento
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {previewUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Analisando alimento...</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            Tirar Foto
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            variant="outline"
            className="w-full border-emerald-300 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-950"
            size="lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Selecionar Imagem
          </Button>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />

        <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Reconhecimento automático de alimentos
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Cálculo preciso de calorias e macronutrientes
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Registro instantâneo no diário alimentar
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
