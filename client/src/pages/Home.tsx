import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { BarChart3, CreditCard, Users, Zap, Shield, TrendingUp, FileText } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    window.location.href = "/dashboard";
    return null;
  }

  const features = [
    {
      icon: Users,
      title: "Gestão de Clientes",
      description: "Cadastre e gerencie seus clientes com facilidade, com busca automática de dados por CNPJ.",
    },
    {
      icon: FileText,
      title: "Faturamento Flexível",
      description: "Crie faturamentos à vista, parcelados ou recorrentes com cálculo automático de parcelas.",
    },
    {
      icon: CreditCard,
      title: "Múltiplos Meios de Pagamento",
      description: "Aceite PIX, Boleto, Cartão de Crédito e Links de Pagamento em um único sistema.",
    },
    {
      icon: BarChart3,
      title: "Contas a Receber",
      description: "Acompanhe seus recebimentos com filtros avançados e relatórios personalizados.",
    },
    {
      icon: Zap,
      title: "Cobrança Automática",
      description: "Envie cobranças por e-mail, WhatsApp e SMS com rastreamento de entrega.",
    },
    {
      icon: Shield,
      title: "Segurança em Primeiro Lugar",
      description: "Autenticação 2FA, criptografia de dados e conformidade com padrões de segurança.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">AG</span>
            </div>
            <span className="font-bold text-lg">Agiliza</span>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Sistema de Contas a Receber
            <span className="text-primary block mt-2">Completo e Inteligente</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gerencie cobranças, clientes e faturamentos em um único lugar. Com PIX, Boleto, Cartão e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href={getLoginUrl()}>Começar Agora</a>
            </Button>
            <Button size="lg" variant="outline">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Funcionalidades Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-6 bg-card rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-lg text-muted-foreground mb-8">Junte-se a centenas de empresas que confiam na Agiliza para gerenciar suas cobranças.</p>
          <Button size="lg" asChild>
            <a href={getLoginUrl()}>Acessar Sistema</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Agiliza Digital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
