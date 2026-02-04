import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Calendar, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { MaskedInput } from "@/components/MaskedInput";

export default function ContasReceber() {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroData, setFiltroData] = useState("mes-atual");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Queries
  const { data: faturamentos = [] } = trpc.faturamento.listarPorCliente.useQuery({ clienteId: 0 });
  const parcelas = faturamentos.flatMap((f: any) => f.parcelas || []);
  const { data: clientes = [] } = trpc.clientes.listar.useQuery();
  const { data: estatisticas } = trpc.cobranca.obterEstatisticas.useQuery({});

  // Filtrar parcelas
  const parcelasFiltradas = parcelas?.filter((parcela: any) => {
    let passou = true;

    // Filtro de status
    if (filtroStatus !== "todos") {
      passou = passou && parcela.status === filtroStatus;
    }

    // Filtro de cliente
    if (filtroCliente) {
      passou = passou && parcela.faturamentoId.toString().includes(filtroCliente);
    }

    // Filtro de data
    const dataVenc = new Date(parcela.dataVencimento);
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    if (filtroData === "vencidos") {
      passou = passou && dataVenc < hoje && parcela.status !== "pago";
    } else if (filtroData === "vencer-hoje") {
      passou = passou && dataVenc.toDateString() === hoje.toDateString();
    } else if (filtroData === "esta-semana") {
      const fimSemana = new Date(hoje);
      fimSemana.setDate(fimSemana.getDate() + 7);
      passou = passou && dataVenc >= hoje && dataVenc <= fimSemana;
    } else if (filtroData === "ultimos-30") {
      const data30 = new Date(hoje);
      data30.setDate(data30.getDate() - 30);
      passou = passou && dataVenc >= data30 && dataVenc <= hoje;
    } else if (filtroData === "mes-atual") {
      passou = passou && dataVenc >= inicioMes && dataVenc <= fimMes;
    } else if (filtroData === "customizado" && dataInicio && dataFim) {
      passou = passou && dataVenc >= new Date(dataInicio) && dataVenc <= new Date(dataFim);
    }

    return passou;
  }) || [];

  // Calcular estatísticas
  const totalReceber = parcelasFiltradas.reduce((acc: number, p: any) => acc + (typeof p.valor === 'string' ? parseFloat(p.valor) : p.valor), 0);
  const totalVencido = parcelasFiltradas
    .filter((p: any) => new Date(p.dataVencimento) < new Date() && p.status !== "pago")
    .reduce((acc: number, p: any) => acc + (typeof p.valor === 'string' ? parseFloat(p.valor) : p.valor), 0);
  const totalPago = parcelasFiltradas
    .filter((p: any) => p.status === "pago")
    .reduce((acc: number, p: any) => acc + (typeof p.valor === 'string' ? parseFloat(p.valor) : p.valor), 0);
  const totalAVencer = totalReceber - totalPago - totalVencido;

  // Dados para gráficos
  const dadosStatus = [
    { name: "A Vencer", value: totalAVencer, color: "#3b82f6" },
    { name: "Vencido", value: totalVencido, color: "#ef4444" },
    { name: "Pago", value: totalPago, color: "#10b981" },
  ];

  const dadosPorMes = [
    { mes: "Jan", valor: 0 },
    { mes: "Fev", valor: 0 },
    { mes: "Mar", valor: 0 },
    { mes: "Abr", valor: 0 },
    { mes: "Mai", valor: 0 },
    { mes: "Jun", valor: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contas a Receber</h1>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total a Receber
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalReceber.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">{parcelasFiltradas.length} parcelas</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              Vencido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">R$ {totalVencido.toFixed(2)}</div>
            <p className="text-xs text-red-600 mt-1">
              {parcelasFiltradas.filter((p: any) => new Date(p.dataVencimento) < new Date() && p.status !== "pago").length} parcelas
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
              <Clock className="w-4 h-4" />
              A Vencer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">R$ {totalAVencer.toFixed(2)}</div>
            <p className="text-xs text-blue-600 mt-1">
              {parcelasFiltradas.filter((p: any) => new Date(p.dataVencimento) >= new Date() && p.status !== "pago").length} parcelas
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">R$ {totalPago.toFixed(2)}</div>
            <p className="text-xs text-green-600 mt-1">
              {parcelasFiltradas.filter((p: any) => p.status === "pago").length} parcelas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dadosStatus} cx="50%" cy="50%" labelLine={false} label={({ name, value }: any) => `${name}: R$ ${(value as number).toFixed(0)}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {dadosStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `R$ ${(value as number).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previsão de Recebimento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value: any) => `R$ ${(value as number).toFixed(2)}`} />
                <Line type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="enviada">Enviada</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Período</Label>
              <Select value={filtroData} onValueChange={setFiltroData}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes-atual">Mês Atual</SelectItem>
                  <SelectItem value="vencidos">Vencidos</SelectItem>
                  <SelectItem value="vencer-hoje">Vencer Hoje</SelectItem>
                  <SelectItem value="esta-semana">Esta Semana</SelectItem>
                  <SelectItem value="ultimos-30">Últimos 30 Dias</SelectItem>
                  <SelectItem value="customizado">Customizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filtroData === "customizado" && (
              <>
                <div>
                  <Label>Data Início</Label>
                  <MaskedInput
                    maskType="data"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <Label>Data Fim</Label>
                  <MaskedInput
                    maskType="data"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </>
            )}

            <div>
              <Label>Cliente</Label>
              <Input
                placeholder="Buscar cliente..."
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Parcelas */}
      <Card>
        <CardHeader>
          <CardTitle>Parcelas</CardTitle>
          <CardDescription>{parcelasFiltradas.length} parcelas encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parcelasFiltradas.length > 0 ? (
                  parcelasFiltradas.map((parcela: any) => {
                    const dataVenc = new Date(parcela.dataVencimento);
                    const hoje = new Date();
                    const diasDiferenca = Math.ceil((dataVenc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <TableRow key={parcela.id}>
                        <TableCell className="font-bold">FAT-{parcela.faturamentoId}</TableCell>
                        <TableCell>{parcela.numero}</TableCell>
                        <TableCell>R$ {parseFloat(parcela.valor).toFixed(2)}</TableCell>
                        <TableCell>{dataVenc.toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              parcela.status === "pago"
                                ? "default"
                                : diasDiferenca < 0
                                  ? "destructive"
                                  : diasDiferenca <= 7
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {parcela.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-bold ${
                              diasDiferenca < 0 ? "text-red-600" : diasDiferenca <= 7 ? "text-yellow-600" : "text-green-600"
                            }`}
                          >
                            {diasDiferenca < 0 ? `${Math.abs(diasDiferenca)}d atrasado` : `${diasDiferenca}d`}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhuma parcela encontrada com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
