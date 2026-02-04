import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CreditCard, Users, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Clientes Ativos",
      value: "0",
      description: "Clientes cadastrados",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Faturamentos",
      value: "0",
      description: "Total de faturamentos",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Contas a Receber",
      value: "R$ 0,00",
      description: "Valor total em aberto",
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Cobranças Vencidas",
      value: "0",
      description: "Títulos vencidos",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Bem-vindo, {user?.name || "Usuário"}!</h1>
        <p className="text-muted-foreground mt-2">Aqui está um resumo do seu sistema de contas a receber.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Nenhuma atividade ainda</p>
                  <p className="text-xs text-muted-foreground">Comece criando um cliente ou faturamento</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-sm font-medium text-left rounded-lg hover:bg-accent transition-colors">
                + Novo Cliente
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-left rounded-lg hover:bg-accent transition-colors">
                + Novo Faturamento
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-left rounded-lg hover:bg-accent transition-colors">
                + Enviar Cobrança
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-left rounded-lg hover:bg-accent transition-colors">
                ⚙️ Configurações
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tendências de Faturamento
          </CardTitle>
          <CardDescription>Últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Gráfico de tendências será exibido aqui</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
