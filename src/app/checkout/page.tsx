'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Check, 
  Shield, 
  Zap, 
  TrendingUp,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpLoaded, setMpLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const publicKey = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;

  useEffect(() => {
    // Carregar SDK do Mercado Pago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      if (publicKey && window.MercadoPago) {
        window.MercadoPago = new window.MercadoPago(publicKey);
        setMpLoaded(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [publicKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatação automática
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }
    
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    }
    
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.cardNumber || !formData.expiry || !formData.cvv) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    if (!formData.email.includes('@')) {
      toast.error('Email inválido');
      return;
    }
    
    if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Número do cartão inválido');
      return;
    }

    if (!publicKey) {
      toast.error('Chave pública do Mercado Pago não configurada', {
        description: 'Configure a variável NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY no banner laranja acima',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Criar token do cartão com Mercado Pago
      const [month, year] = formData.expiry.split('/');
      
      const cardData = {
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardholderName: formData.name,
        cardExpirationMonth: month,
        cardExpirationYear: `20${year}`,
        securityCode: formData.cvv,
        identificationType: 'CPF',
        identificationNumber: '12345678900', // Você deve coletar o CPF do usuário
      };

      // Criar token do cartão
      const response = await fetch('/api/mercadopago/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          cardData,
          amount: 29.90,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Pagamento processado com sucesso!', {
          description: 'Bem-vindo ao FitFood Premium! 🎉',
        });
        
        // Redirecionar ou atualizar status do usuário
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        toast.error('Erro ao processar pagamento', {
          description: result.error || 'Tente novamente',
        });
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao processar pagamento', {
        description: 'Verifique os dados e tente novamente',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    { icon: Zap, text: 'Análise ilimitada de alimentos' },
    { icon: TrendingUp, text: 'Relatórios detalhados de progresso' },
    { icon: Shield, text: 'Suporte prioritário' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Assine o FitFood Premium
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Desbloqueie todo o potencial do seu diário alimentar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Details */}
          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white order-2 md:order-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Plano Premium</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">R$ 29,90</span>
                <span className="text-emerald-100">/mês</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <span className="text-emerald-50">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm text-emerald-100 mb-2">
                <Shield className="w-4 h-4" />
                <span>Pagamento 100% seguro</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-100">
                <Check className="w-4 h-4" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </Card>

          {/* Payment Form */}
          <Card className="p-6 order-1 md:order-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Dados de Pagamento
              </h3>
            </div>

            {!publicKey && (
              <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-200 font-medium mb-2">
                  ⚠️ Configure a chave pública do Mercado Pago
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Necessário: NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="João Silva"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="pr-10"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Validade</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    type="text"
                    placeholder="MM/AA"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <div className="relative">
                    <Input
                      id="cvv"
                      name="cvv"
                      type="text"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="pr-10"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 text-lg"
                disabled={isProcessing || !publicKey}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Assinar por R$ 29,90/mês
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
              </p>
            </form>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Pagamento Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>Dados Criptografados</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>Garantia de 7 dias</span>
          </div>
        </div>
      </main>
    </div>
  );
}
