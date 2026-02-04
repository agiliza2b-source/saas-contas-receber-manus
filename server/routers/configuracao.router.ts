import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

const empresaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  cep: z.string().min(8, "CEP inválido"),
});

const smtpSchema = z.object({
  host: z.string().min(1, "Host é obrigatório"),
  port: z.string().min(1, "Porta é obrigatória"),
  usuario: z.string().min(1, "Usuário é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
  de: z.string().email("Email de origem inválido"),
  ativo: z.boolean().default(false),
});

const pixSchema = z.object({
  chave: z.string().min(1, "Chave PIX é obrigatória"),
  tipo: z.enum(["email", "cpf", "cnpj", "telefone", "aleatoria"]),
  ativo: z.boolean().default(false),
});

const whatsappSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  numeroTelefone: z.string().min(10, "Número de telefone inválido"),
  ativo: z.boolean().default(false),
});

const smsSchema = z.object({
  apiKey: z.string().min(1, "API Key é obrigatória"),
  apiUrl: z.string().url("URL inválida"),
  remetente: z.string().min(1, "Remetente é obrigatório").max(11),
  ativo: z.boolean().default(false),
});

export const configuracaoRouter = router({
  salvarEmpresa: protectedProcedure
    .input(empresaSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar salvamento de dados da empresa
      console.log("Salvando empresa:", input);
      return { success: true, message: "Dados da empresa salvos com sucesso" };
    }),

  salvarSmtp: protectedProcedure
    .input(smtpSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar salvamento de configuração SMTP
      console.log("Salvando SMTP:", input);
      return { success: true, message: "Configuração SMTP salva com sucesso" };
    }),

  testarSmtp: protectedProcedure
    .input(smtpSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar teste de conexão SMTP
      console.log("Testando SMTP:", input);
      return { success: true, message: "Email de teste enviado com sucesso" };
    }),

  salvarPix: protectedProcedure
    .input(pixSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar salvamento de configuração PIX
      console.log("Salvando PIX:", input);
      return { success: true, message: "Configuração PIX salva com sucesso" };
    }),

  salvarWhatsapp: protectedProcedure
    .input(whatsappSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar salvamento de configuração WhatsApp
      console.log("Salvando WhatsApp:", input);
      return { success: true, message: "Configuração WhatsApp salva com sucesso" };
    }),

  salvarSms: protectedProcedure
    .input(smsSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Implementar salvamento de configuração SMS
      console.log("Salvando SMS:", input);
      return { success: true, message: "Configuração SMS salva com sucesso" };
    }),

  obterConfiguracao: protectedProcedure
    .input(z.enum(["empresa", "smtp", "pix", "whatsapp", "sms"]))
    .query(async ({ input, ctx }) => {
      // TODO: Implementar busca de configurações
      return { success: true, data: {} };
    }),
});
