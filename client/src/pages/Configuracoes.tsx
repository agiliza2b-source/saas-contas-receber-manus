import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { MaskedInput } from "@/components/MaskedInput";
import { toast } from "sonner";
import { Mail, Key, MessageSquare, Smartphone, Building2, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { LogoUpload } from "@/components/LogoUpload";

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("empresa");

  // Estados para Empresa
  const [empresa, setEmpresa] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    logo: "",
  });

  // Estados para SMTP
  const [smtp, setSmtp] = useState({
    host: "",
    port: "587",
    usuario: "",
    senha: "",
    de: "",
    ativo: false,
  });

  // Estados para PIX
  const [pix, setPix] = useState<{ chave: string; tipo: "email" | "cpf" | "cnpj" | "telefone" | "aleatoria"; ativo: boolean }>({
    chave: "",
    tipo: "email",
    ativo: false,
  });

  // Estados para WhatsApp
  const [whatsapp, setWhatsapp] = useState({
    token: "",
    numeroTelefone: "",
    ativo: false,
  });

  // Estados para SMS
  const [sms, setSms] = useState({
    apiKey: "",
    apiUrl: "",
    remetente: "",
    ativo: false,
  });

  // Mutations
  const salvarEmpresa = trpc.configuracao.salvarEmpresa.useMutation({
    onSuccess: () => toast.success("Dados da empresa salvos com sucesso!"),
    onError: () => toast.error("Erro ao salvar dados da empresa"),
  });

  const salvarSmtp = trpc.configuracao.salvarSmtp.useMutation({
    onSuccess: () => toast.success("Configuração SMTP salva com sucesso!"),
    onError: () => toast.error("Erro ao salvar configuração SMTP"),
  });

  const testarSmtp = trpc.configuracao.testarSmtp.useMutation({
    onSuccess: () => toast.success("Email de teste enviado com sucesso!"),
    onError: () => toast.error("Erro ao enviar email de teste"),
  });

  const salvarPix = trpc.configuracao.salvarPix.useMutation({
    onSuccess: () => toast.success("Configuração PIX salva com sucesso!"),
    onError: () => toast.error("Erro ao salvar configuração PIX"),
  });

  const salvarWhatsapp = trpc.configuracao.salvarWhatsapp.useMutation({
    onSuccess: () => toast.success("Configuração WhatsApp salva com sucesso!"),
    onError: () => toast.error("Erro ao salvar configuração WhatsApp"),
  });

  const salvarSms = trpc.configuracao.salvarSms.useMutation({
    onSuccess: () => toast.success("Configuração SMS salva com sucesso!"),
    onError: () => toast.error("Erro ao salvar configuração SMS"),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="empresa" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="smtp" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">SMTP</span>
          </TabsTrigger>
          <TabsTrigger value="pix" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">PIX</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">SMS</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba Empresa */}
        <TabsContent value="empresa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Informações básicas da sua empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome da Empresa</Label>
                  <Input
                    value={empresa.nome}
                    onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })}
                    placeholder="Agiliza Digital"
                  />
                </div>
                <div>
                  <Label>CNPJ</Label>
                  <MaskedInput
                    maskType="cnpj"
                    value={empresa.cnpj}
                    onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={empresa.email}
                    onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <MaskedInput
                    maskType="telefone"
                    value={empresa.telefone}
                    onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })}
                    placeholder="(11) 98765-4321"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Endereço</Label>
                  <Input
                    value={empresa.endereco}
                    onChange={(e) => setEmpresa({ ...empresa, endereco: e.target.value })}
                    placeholder="Rua das Flores, 123"
                  />
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input
                    value={empresa.cidade}
                    onChange={(e) => setEmpresa({ ...empresa, cidade: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input
                    value={empresa.estado}
                    onChange={(e) => setEmpresa({ ...empresa, estado: e.target.value })}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>CEP</Label>
                  <MaskedInput
                    maskType="cep"
                    value={empresa.cep}
                    onChange={(e) => setEmpresa({ ...empresa, cep: e.target.value })}
                    placeholder="01310-100"
                  />
                </div>
              </div>
              <div className="border-t pt-6">
                <LogoUpload
                  currentLogo={empresa.logo}
                  onLogoChange={(logo) => setEmpresa({ ...empresa, logo })}
                />
              </div>
              <Button
                onClick={() => salvarEmpresa.mutate(empresa)}
                disabled={salvarEmpresa.isPending}
                className="w-full"
              >
                {salvarEmpresa.isPending ? "Salvando..." : "Salvar Dados da Empresa"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba SMTP */}
        <TabsContent value="smtp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Email (SMTP)</CardTitle>
              <CardDescription>Configure seu servidor de email para envio de cobranças</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Dica</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Use as configurações do seu provedor de email (Gmail, Outlook, etc.)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Host SMTP</Label>
                  <Input
                    value={smtp.host}
                    onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label>Porta</Label>
                  <Input
                    type="number"
                    value={smtp.port}
                    onChange={(e) => setSmtp({ ...smtp, port: e.target.value })}
                    placeholder="587"
                  />
                </div>
                <div>
                  <Label>Usuário</Label>
                  <Input
                    value={smtp.usuario}
                    onChange={(e) => setSmtp({ ...smtp, usuario: e.target.value })}
                    placeholder="seu-email@gmail.com"
                  />
                </div>
                <div>
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    value={smtp.senha}
                    onChange={(e) => setSmtp({ ...smtp, senha: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Email de Origem</Label>
                  <Input
                    type="email"
                    value={smtp.de}
                    onChange={(e) => setSmtp({ ...smtp, de: e.target.value })}
                    placeholder="noreply@empresa.com"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={smtp.ativo}
                  onCheckedChange={(checked) => setSmtp({ ...smtp, ativo: checked })}
                />
                <Label>Ativar SMTP</Label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => testarSmtp.mutate(smtp)}
                  disabled={testarSmtp.isPending || !smtp.host}
                  className="flex-1"
                >
                  {testarSmtp.isPending ? "Testando..." : "Testar Conexão"}
                </Button>
                <Button
                  onClick={() => salvarSmtp.mutate(smtp)}
                  disabled={salvarSmtp.isPending}
                  className="flex-1"
                >
                  {salvarSmtp.isPending ? "Salvando..." : "Salvar Configuração"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba PIX */}
        <TabsContent value="pix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de PIX</CardTitle>
              <CardDescription>Configure sua chave PIX para receber cobranças</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Chave PIX</Label>
                  <Input
                    value={pix.chave}
                    onChange={(e) => setPix({ ...pix, chave: e.target.value })}
                    placeholder="chave-pix@banco.com.br"
                  />
                </div>
                <div>
                  <Label>Tipo de Chave</Label>
                  <select
                    value={pix.tipo}
                    onChange={(e) => setPix({ ...pix, tipo: e.target.value as "email" | "cpf" | "cnpj" | "telefone" | "aleatoria" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="email">Email</option>
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                    <option value="telefone">Telefone</option>
                    <option value="aleatoria">Chave Aleatória</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={pix.ativo}
                  onCheckedChange={(checked) => setPix({ ...pix, ativo: checked })}
                />
                <Label>Ativar PIX</Label>
              </div>

              <Button
                onClick={() => salvarPix.mutate(pix)}
                disabled={salvarPix.isPending}
                className="w-full"
              >
                {salvarPix.isPending ? "Salvando..." : "Salvar Configuração PIX"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba WhatsApp */}
        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de WhatsApp</CardTitle>
              <CardDescription>Configure WhatsApp Business para enviar cobranças</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Requer WhatsApp Business</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Você precisará de uma conta WhatsApp Business e um token de acesso da Meta
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Token de Acesso</Label>
                  <Input
                    type="password"
                    value={whatsapp.token}
                    onChange={(e) => setWhatsapp({ ...whatsapp, token: e.target.value })}
                    placeholder="EAA......"
                  />
                </div>
                <div>
                  <Label>Número de Telefone</Label>
                  <MaskedInput
                    maskType="telefone"
                    value={whatsapp.numeroTelefone}
                    onChange={(e) => setWhatsapp({ ...whatsapp, numeroTelefone: e.target.value })}
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={whatsapp.ativo}
                  onCheckedChange={(checked) => setWhatsapp({ ...whatsapp, ativo: checked })}
                />
                <Label>Ativar WhatsApp</Label>
              </div>

              <Button
                onClick={() => salvarWhatsapp.mutate(whatsapp)}
                disabled={salvarWhatsapp.isPending}
                className="w-full"
              >
                {salvarWhatsapp.isPending ? "Salvando..." : "Salvar Configuração WhatsApp"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba SMS */}
        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de SMS</CardTitle>
              <CardDescription>Configure SMS para enviar cobranças por mensagem de texto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={sms.apiKey}
                    onChange={(e) => setSms({ ...sms, apiKey: e.target.value })}
                    placeholder="sua-api-key"
                  />
                </div>
                <div>
                  <Label>URL da API</Label>
                  <Input
                    value={sms.apiUrl}
                    onChange={(e) => setSms({ ...sms, apiUrl: e.target.value })}
                    placeholder="https://api.sms-provider.com/send"
                  />
                </div>
                <div>
                  <Label>Remetente</Label>
                  <Input
                    value={sms.remetente}
                    onChange={(e) => setSms({ ...sms, remetente: e.target.value })}
                    placeholder="AGILIZA"
                    maxLength={11}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={sms.ativo}
                  onCheckedChange={(checked) => setSms({ ...sms, ativo: checked })}
                />
                <Label>Ativar SMS</Label>
              </div>

              <Button
                onClick={() => salvarSms.mutate(sms)}
                disabled={salvarSms.isPending}
                className="w-full"
              >
                {salvarSms.isPending ? "Salvando..." : "Salvar Configuração SMS"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
