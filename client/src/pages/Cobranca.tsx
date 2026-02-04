import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, Mail, MessageSquare, Smartphone, QrCode, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Cobranca() {
  const [filtroStatus, setFiltroStatus] = useState("pendente");
  const [filtroCanal, setFiltroCanal] = useState("todos");
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [canalEnvio, setCanalEnvio] = useState("email");
  const [showModalEnvio, setShowModalEnvio] = useState(false);
  const [showModalPix, setShowModalPix] = useState(false);
  const [pixSelecionado, setPixSelecionado] = useState<any>(null);

  // Queries
  const { data: cobrancas = [] } = trpc.cobranca.listarPendentes.useQuery();
  const { data: estatisticas } = trpc.cobranca.obterEstatisticas.useQuery({});

  // Mutations
  const enviarCobranca = trpc.cobranca.atualizarStatus.useMutation({
    onSuccess: () => {
      toast.success("Cobrança enviada com sucesso!");
      setSelecionadas([]);
      setShowModalEnvio(false);
    },
    onError: (error) => {
      toast.error(`Erro ao enviar: ${error.message}`);
    },
  });

  // Filtrar cobranças
  const cobrancasFiltradas = cobrancas.filter((c: any) => {
    let passou = true;

    if (filtroStatus !== "todos") {
      passou = passou && c.status === filtroStatus;
    }

    if (filtroCanal !== "todos") {
      passou = passou && c.canal === filtroCanal;
    }

    return passou;
  });

  function toggleSelecao(id: number) {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function selecionarTodas() {
    if (selecionadas.length === cobrancasFiltradas.length) {
      setSelecionadas([]);
    } else {
      setSelecionadas(cobrancasFiltradas.map((c: any) => c.id));
    }
  }

  function handleEnviarCobrancas() {
    if (selecionadas.length === 0) {
      toast.error("Selecione pelo menos uma cobrança");
      return;
    }

    selecionadas.forEach((id) => {
      enviarCobranca.mutate({
        id,
        status: "enviada",
        dataEnvio: new Date(),
      });
    });
  }

  function gerarPixQrCode(cobranca: any) {
    setPixSelecionado(cobranca);
    setShowModalPix(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cobrança</h1>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Cobranças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas?.totalCobrancas || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-700">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{cobrancas.filter((c: any) => c.status === "pendente").length}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">Enviadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{cobrancas.filter((c: any) => c.status === "enviada").length}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{cobrancas.filter((c: any) => c.status === "paga").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <SelectItem value="recebida">Recebida</SelectItem>
                  <SelectItem value="lida">Lida</SelectItem>
                  <SelectItem value="paga">Paga</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Canal</Label>
              <Select value={filtroCanal} onValueChange={setFiltroCanal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleEnviarCobrancas}
                disabled={selecionadas.length === 0}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Selecionadas ({selecionadas.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Cobranças */}
      <Card>
        <CardHeader>
          <CardTitle>Cobranças</CardTitle>
          <CardDescription>{cobrancasFiltradas.length} cobranças encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selecionadas.length === cobrancasFiltradas.length && cobrancasFiltradas.length > 0}
                      onCheckedChange={selecionarTodas}
                    />
                  </TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Tentativas</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cobrancasFiltradas.length > 0 ? (
                  cobrancasFiltradas.map((cobranca: any) => (
                    <TableRow key={cobranca.id}>
                      <TableCell>
                        <Checkbox
                          checked={selecionadas.includes(cobranca.id)}
                          onCheckedChange={() => toggleSelecao(cobranca.id)}
                        />
                      </TableCell>
                      <TableCell className="font-bold">FAT-{cobranca.faturamentoId}</TableCell>
                      <TableCell>{cobranca.parcelaId}</TableCell>
                      <TableCell>Cliente {cobranca.clienteId}</TableCell>
                      <TableCell>R$ 0,00</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cobranca.status === "paga"
                              ? "default"
                              : cobranca.status === "enviada"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {cobranca.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {cobranca.canal === "email" && <Mail className="w-4 h-4" />}
                          {cobranca.canal === "whatsapp" && <MessageSquare className="w-4 h-4" />}
                          {cobranca.canal === "sms" && <Smartphone className="w-4 h-4" />}
                          {cobranca.canal === "pix" && <QrCode className="w-4 h-4" />}
                        </div>
                      </TableCell>
                      <TableCell>{cobranca.tentativas || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {cobranca.canal === "pix" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => gerarPixQrCode(cobranca)}
                            >
                              <QrCode className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelecionadas([cobranca.id]);
                              setShowModalEnvio(true);
                            }}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Nenhuma cobrança encontrada com os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de PIX */}
      <Dialog open={showModalPix} onOpenChange={setShowModalPix}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code PIX</DialogTitle>
            <DialogDescription>Escaneie o código para realizar o pagamento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Chave PIX:</p>
              <Input value="chave-pix-exemplo@banco.com.br" readOnly />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Valor:</p>
              <Input value="R$ 0,00" readOnly />
            </div>
            <Button className="w-full">Copiar Chave PIX</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Envio */}
      <Dialog open={showModalEnvio} onOpenChange={setShowModalEnvio}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Cobrança</DialogTitle>
            <DialogDescription>Selecione o canal de envio</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Canal de Envio</Label>
              <Select value={canalEnvio} onValueChange={setCanalEnvio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      SMS
                    </div>
                  </SelectItem>
                  <SelectItem value="pix">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      PIX
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {selecionadas.length} cobrança(s) será(ão) enviada(s) por {canalEnvio}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    O cliente receberá a cobrança no canal selecionado
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowModalEnvio(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEnviarCobrancas}
                disabled={enviarCobranca.isPending}
                className="flex-1"
              >
                {enviarCobranca.isPending ? "Enviando..." : "Confirmar Envio"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
