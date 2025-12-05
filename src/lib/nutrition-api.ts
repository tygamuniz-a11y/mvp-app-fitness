// API de análise nutricional usando OpenAI Vision

import { NutritionAnalysis } from './types';

export async function analyzeFoodImage(imageUrl: string): Promise<NutritionAnalysis> {
  try {
    const response = await fetch('/api/analyze-food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Falha ao analisar imagem');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erro ao analisar alimento:', error);
    throw new Error(error.message || 'Erro ao analisar alimento. Verifique sua conexão e tente novamente.');
  }
}

export async function analyzeFoodImageBase64(base64Image: string): Promise<NutritionAnalysis> {
  try {
    const response = await fetch('/api/analyze-food', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da API:', errorData);
      throw new Error(errorData.error || 'Falha ao analisar imagem');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erro ao analisar alimento:', error);
    throw new Error(error.message || 'Erro ao analisar alimento. Verifique sua conexão e tente novamente.');
  }
}
