import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { MaskedInput } from "@/components/MaskedInput";

interface ItemFaturamento {
  descricao: string;
  quantidade: string;
  valorUnitario: string;
}

export default function Faturamento() {
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [dataVencimento, setDataVencimento] = useState("");
  const [tipoParcela, setTipoParcela] = useState("unica");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState(1);
  const [jurosAoMes, setJurosAoMes] = useState("0");
  const [desconto, setDesconto] = useState("0");
  const [itens, setItens] = useState<ItemFaturamento[]>([]);
  const [novoItem, setNovoItem] = useState<ItemFaturamento>({ descricao: "", quantidade: "", valorUnitario: "" });

  // Queries
  const { data: clientes } = trpc.clientes.listar.useQuery();
  const { data: faturamentosCliente } = trpc.faturamento.listarPorCliente.useQuery(
    { clienteId: clienteId || 0 },
    { enabled: !!clienteId }
  );

  // Mutations
  const criarFaturamento = trpc.faturamento.criar.useMutation({
    onSuccess: () => {
      toast.success("Faturamento criado com sucesso!");
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erro ao criar faturamento: ${error.message}`);
    },
  });

  const calcularParcelasSimples = trpc.faturamento.calcularParcelasSimples.useQuery(
    {
      valorTotal: calcularValorTotal(),
      quantidadeParcelas,
      jurosAoMes: parseFloat(jurosAoMes),
      dataVencimento: new Date(dataVencimento),
      desconto: parseFloat(desconto),
    },
    { enabled: !!dataVencimento && itens.length > 0 }
  );

  function calcularValorTotal(): number {
    return itens.reduce((total, item) => {
      return total + parseFloat(item.quantidade || "0") * parseFloat(item.valorUnitario || "0");
    }, 0);
  }

  function adicionarItem() {
    if (!novoItem.descricao || !novoItem.quantidade || !novoItem.valorUnitario) {
      toast.error("Preencha todos os campos do item");
      return;
    }

    setItens([...itens, novoItem]);
    setNovoItem({ descricao: "", quantidade: "", valorUnitario: "" });
    toast.success("Item adicionado!");
  }

  function removerItem(index: number) {
    setItens(itens.filter((_, i) => i !== index));
    toast.success("Item removido!");
  }

  function resetForm() {
    setClienteId(null);
    setDataVencimento("");
    setTipoParcela("unica");
    setQuantidadeParcelas(1);
    setJurosAoMes("0");
    setDesconto("0");
    setItens([]);
    setNovoItem({ descricao: "", quantidade: "", valorUnitario: "" });
  }

  function handleCriarFaturamento() {
    if (!clienteId || !dataVencimento || itens.length === 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    criarFaturamento.mutate({
      clienteId,
      dataVencimento: new Date(dataVencimento),
      valorTotal: calcularValorTotal().toFixed(2),
      tipoParcela: tipoParcela as "unica" | "parcelado" | "recorrente",
      quantidadeParcelas,
      jurosAoMes,
      desconto,
      itens,
    });
  }

  const valorTotal = calcularValorTotal();
  const valorComDesconto = valorTotal - parseFloat(desconto || "0");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Faturamento</h1>
      </div>

      <Tabs defaultValue="novo" className="w-full">
        <TabsList>
          <TabsTrigger value="novo">Novo Faturamento</TabsTrigger>
          <TabsTrigger value="listagem">Meus Faturamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="novo">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Faturamento</CardTitle>
              <CardDescription>Preencha os dados abaixo para criar um novo faturamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seleção de Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select value={clienteId?.toString() || ""} onValueChange={(val) => setClienteId(parseInt(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes?.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nomeCompleto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
                  <MaskedInput
                    maskType="data"
                    value={dataVencimento}
                    onChange={(e) => setDataVencimento(e.target.value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>

              {/* Configurações de Parcela */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="tipoParcela">Tipo de Parcela</Label>
                  <Select value={tipoParcela} onValueChange={setTipoParcela}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unica">Única</SelectItem>
                      <SelectItem value="parcelado">Parcelado</SelectItem>
                      <SelectItem value="recorrente">Recorrente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {tipoParcela !== "unica" && (
                  <div>
                    <Label htmlFor="quantidadeParcelas">Qtd. Parcelas</Label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={quantidadeParcelas}
                      onChange={(e) => setQuantidadeParcelas(parseInt(e.target.value))}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="jurosAoMes">Juros ao Mês (%)</Label>
                  <MaskedInput
                    maskType="percentual"
                    value={jurosAoMes}
                    onChange={(e) => setJurosAoMes(e.target.value)}
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <Label htmlFor="desconto">Desconto</Label>
                  <MaskedInput
                    maskType="moeda"
                    value={desconto}
                    onChange={(e) => setDesconto(e.target.value)}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              {/* Adicionar Itens */}
              <Card className="bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-lg">Itens do Faturamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={novoItem.descricao}
                        onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
                        placeholder="Ex: Consultoria"
                      />
                    </div>
                    <div>
                      <Label>Quantidade</Label>
                      <MaskedInput
                        maskType="moeda"
                        value={novoItem.quantidade}
                        onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <Label>Valor Unitário</Label>
                      <MaskedInput
                        maskType="moeda"
                        value={novoItem.valorUnitario}
                        onChange={(e) => setNovoItem({ ...novoItem, valorUnitario: e.target.value })}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={adicionarItem} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {/* Tabela de Itens */}
                  {itens.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead>Valor Unitário</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itens.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.descricao}</TableCell>
                            <TableCell>{item.quantidade}</TableCell>
                            <TableCell>R$ {parseFloat(item.valorUnitario).toFixed(2)}</TableCell>
                            <TableCell>
                              R$ {(parseFloat(item.quantidade) * parseFloat(item.valorUnitario)).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removerItem(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Resumo */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6 space-y-2">
                  <div className="flex justify-between">
                    <span>Valor Total:</span>
                    <span className="font-bold">R$ {valorTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Desconto:</span>
                    <span>R$ {parseFloat(desconto || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Valor Final:</span>
                    <span className="font-bold text-lg">R$ {valorComDesconto.toFixed(2)}</span>
                  </div>

                  {calcularParcelasSimples.data && tipoParcela !== "unica" && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-bold mb-2">Simulação de Parcelas:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {calcularParcelasSimples.data.slice(0, 4).map((parcela) => (
                          <div key={parcela.numero} className="text-sm">
                            <p>Parcela {parcela.numero}</p>
                            <p className="font-bold">R$ {parcela.total.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  onClick={handleCriarFaturamento}
                  disabled={criarFaturamento.isPending || !clienteId || itens.length === 0}
                  className="flex-1"
                >
                  {criarFaturamento.isPending ? "Criando..." : "Criar Faturamento"}
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listagem">
          <Card>
            <CardHeader>
              <CardTitle>Meus Faturamentos</CardTitle>
              <CardDescription>Histórico de faturamentos criados</CardDescription>
            </CardHeader>
            <CardContent>
              {faturamentosCliente && faturamentosCliente.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Data Emissão</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {faturamentosCliente.map((fat) => (
                      <TableRow key={fat.id}>
                        <TableCell className="font-bold">{fat.numero}</TableCell>
                        <TableCell>{new Date(fat.dataEmissao).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{new Date(fat.dataVencimento).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>R$ {parseFloat(fat.valorTotal).toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-sm font-bold ${
                            fat.status === "pago" ? "bg-green-100 text-green-800" :
                            fat.status === "vencido" ? "bg-red-100 text-red-800" :
                            fat.status === "parcial" ? "bg-yellow-100 text-yellow-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {fat.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum faturamento criado ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
