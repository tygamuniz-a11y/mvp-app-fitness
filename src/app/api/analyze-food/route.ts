// API Route para análise de alimentos com OpenAI Vision

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Verificar se a chave da API está configurada
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave da API OpenAI não configurada. Configure OPENAI_API_KEY nas variáveis de ambiente.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const body = await request.json();
    const { imageUrl, base64Image } = body;

    if (!imageUrl && !base64Image) {
      return NextResponse.json(
        { error: 'URL da imagem ou base64 é necessário' },
        { status: 400 }
      );
    }

    const imageContent = base64Image 
      ? `data:image/jpeg;base64,${base64Image}`
      : imageUrl;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise esta imagem de alimento e retorne APENAS um objeto JSON válido (sem markdown, sem \`\`\`json) com as seguintes informações:
{
  "name": "nome do alimento em português",
  "calories": número estimado de calorias,
  "protein": gramas de proteína,
  "carbs": gramas de carboidratos,
  "fat": gramas de gordura,
  "confidence": número de 0 a 1 indicando confiança na análise,
  "description": "breve descrição do alimento e porção estimada"
}

Se não conseguir identificar o alimento, retorne confidence: 0 e valores aproximados.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageContent,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Resposta vazia da API');
    }

    // Limpar possíveis marcadores de código markdown
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }

    // Parse do JSON retornado
    const nutritionData = JSON.parse(cleanContent.trim());

    return NextResponse.json(nutritionData);
  } catch (error: any) {
    console.error('Erro ao analisar alimento:', error);
    
    // Retornar erro mais detalhado
    const errorMessage = error?.message || 'Falha ao analisar imagem do alimento';
    const errorDetails = error?.response?.data || error?.toString() || '';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        hint: 'Verifique se a chave da API OpenAI está configurada corretamente nas variáveis de ambiente.'
      },
      { status: 500 }
    );
  }
}
