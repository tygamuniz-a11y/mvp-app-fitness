import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token do Mercado Pago não configurado' },
        { status: 500 }
      );
    }

    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);

    const body = await request.json();
    const { email, cardData, amount } = body;

    if (!email || !cardData || !amount) {
      return NextResponse.json(
        { success: false, error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    const paymentData = {
      transaction_amount: amount,
      token: cardData.token,
      description: 'FitFood Premium - Assinatura Mensal',
      installments: 1,
      payment_method_id: cardData.payment_method_id,
      payer: {
        email: email,
        identification: {
          type: cardData.identificationType || 'CPF',
          number: cardData.identificationNumber,
        },
      },
    };

    const result = await payment.create({ body: paymentData });

    if (result.status === 'approved') {
      return NextResponse.json({
        success: true,
        payment_id: result.id,
        status: result.status,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `Pagamento ${result.status}`,
        status: result.status,
        status_detail: result.status_detail,
      });
    }
  } catch (error: any) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erro ao processar pagamento',
      },
      { status: 500 }
    );
  }
}
