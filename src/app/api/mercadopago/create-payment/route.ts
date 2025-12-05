import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, cardData, amount } = await request.json();
    
    const accessToken = process.env.NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Chaves do Mercado Pago não configuradas' },
        { status: 500 }
      );
    }

    // Criar preferência de pagamento no Mercado Pago
    const paymentData = {
      transaction_amount: amount,
      description: 'FitFood Premium - Assinatura Mensal',
      payment_method_id: 'visa', // Você pode detectar automaticamente
      payer: {
        email: email,
        identification: {
          type: cardData.identificationType,
          number: cardData.identificationNumber,
        },
      },
      token: cardData.cardNumber, // Em produção, use o token gerado pelo SDK
    };

    // Fazer requisição para API do Mercado Pago
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (response.ok && result.status === 'approved') {
      return NextResponse.json({
        success: true,
        paymentId: result.id,
        status: result.status,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message || 'Erro ao processar pagamento',
        details: result,
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao processar pagamento' },
      { status: 500 }
    );
  }
}
