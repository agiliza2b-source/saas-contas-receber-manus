import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Clientes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [buscandoCNPJ, setBuscandoCNPJ] = useState(false);
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [dadosBuscados, setDadosBuscados] = useState<any>(null);

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    cpfCnpj: "",
    telefone: "",
    endereco: "",
    cep: "",
    cidade: "",
    estado: "",
  });

  const { data: clientes, isLoading, refetch } = trpc.clientes.listar.useQuery();
  const criarClienteMutation = trpc.clientes.criar.useMutation();

  const handleBuscarCNPJ = async () => {
    if (!cpfCnpj) {
      toast.error("Digite um CNPJ");
      return;
    }

    setBuscandoCNPJ(true);
    try {
      const utils = trpc.useUtils();
      const dados = await utils.client.clientes.buscarCNPJ.query({ cnpj: cpfCnpj });
      if (dados) {
        setDadosBuscados(dados);
        setFormData((prev) => ({
          ...prev,
          nomeCompleto: dados.nomeCompleto || "",
          email: dados.email || "",
          telefone: dados.telefone || "",
          endereco: dados.endereco || "",
          cep: dados.cep || "",
          cidade: dados.cidade || "",
          estado: dados.estado || "",
        }));
        toast.success("Dados do CNPJ carregados com sucesso!");
      } else {
        toast.error("Não foi possível encontrar dados para este CNPJ");
      }
    } catch (error) {
      toast.error("Erro ao buscar CNPJ");
    } finally {
      setBuscandoCNPJ(false);
    }
  };

  const handleBuscarCEP = async () => {
    if (!formData.cep) {
      toast.error("Digite um CEP");
      return;
    }

    setBuscandoCEP(true);
    try {
      const utils = trpc.useUtils();
      const dados = await utils.client.clientes.buscarCEP.query({ cep: formData.cep });
      if (dados) {
        setFormData((prev) => ({
          ...prev,
          endereco: dados.endereco,
          cidade: dados.cidade,
          estado: dados.estado,
        }));
        toast.success("Endereço carregado com sucesso!");
      } else {
        toast.error("CEP não encontrado");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setBuscandoCEP(false);
    }
  };

  const handleCriarCliente = async () => {
    try {
      await criarClienteMutation.mutateAsync(formData);
      toast.success("Cliente criado com sucesso!");
      setFormData({
        nomeCompleto: "",
        email: "",
        cpfCnpj: "",
        telefone: "",
        endereco: "",
        cep: "",
        cidade: "",
        estado: "",
      });
      setCpfCnpj("");
      setDadosBuscados(null);
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar cliente");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground mt-2">Gerencie seus clientes e suas informações</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              <DialogDescription>Preencha os dados do cliente para criar um novo registro</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Busca de CNPJ */}
              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <div className="flex gap-2">
                  <Input
                    id="cpfCnpj"
                    placeholder="00.000.000/0000-00"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={handleBuscarCNPJ}
                    disabled={buscandoCNPJ || !cpfCnpj}
                  >
                    {buscandoCNPJ ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Dados Buscados */}
              {dadosBuscados && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium">Dados encontrados e preenchidos automaticamente</p>
                  </div>
                </div>
              )}

              {/* Formulário */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                    placeholder="Nome da empresa ou pessoa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      placeholder="00000-000"
                    />
                    <Button
                      variant="outline"
                      onClick={handleBuscarCEP}
                      disabled={buscandoCEP || !formData.cep}
                    >
                      {buscandoCEP ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCriarCliente}
                  disabled={criarClienteMutation.isPending || !formData.nomeCompleto || !formData.email || !cpfCnpj}
                >
                  {criarClienteMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Criar Cliente
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Todos os clientes cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : clientes && clientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">CPF/CNPJ</th>
                    <th className="text-left py-3 px-4 font-medium">Telefone</th>
                    <th className="text-left py-3 px-4 font-medium">Cidade</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{cliente.nomeCompleto}</td>
                      <td className="py-3 px-4">{cliente.email}</td>
                      <td className="py-3 px-4">{cliente.cpfCnpj}</td>
                      <td className="py-3 px-4">{cliente.telefone || "-"}</td>
                      <td className="py-3 px-4">{cliente.cidade || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum cliente cadastrado ainda</p>
              <p className="text-sm text-muted-foreground">Clique em "Novo Cliente" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
