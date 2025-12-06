import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ 
    success: false,
    message: 'Mercado Pago temporarily disabled for deployment'
  });
}
