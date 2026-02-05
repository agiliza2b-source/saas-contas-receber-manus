import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  criarCliente,
  obterClientePorCpfCnpj,
  obterClientePorId,
  listarClientes,
  atualizarCliente,
} from "../db";
import {
  validarCPFouCNPJ,
  formatarCPF,
  formatarCNPJ,
  formatarCEP,
  formatarTelefone,
  buscarDadosCEP,
  buscarDadosCNPJ,
} from "../validators";

const clienteSchema = z.object({
  nomeCompleto: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cep: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  formasFaturamento: z.string().optional(),
});

export const clientesRouter = router({
  listar: protectedProcedure.query(async () => {
    return await listarClientes();
  }),

  obterPorId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await obterClientePorId(input.id);
    }),

  criar: protectedProcedure
    .input(clienteSchema)
    .mutation(async ({ input }) => {
      // Validar CPF/CNPJ
      const validacao = validarCPFouCNPJ(input.cpfCnpj);
      if (!validacao.valido) {
        throw new Error("CPF/CNPJ inválido");
      }

      // Verificar se cliente já existe
      const clienteExistente = await obterClientePorCpfCnpj(input.cpfCnpj);
      if (clienteExistente) {
        throw new Error("Cliente com este CPF/CNPJ já existe");
      }

      // Formatar dados
      const cpfCnpjFormatado =
        validacao.tipo === "cpf"
          ? formatarCPF(input.cpfCnpj)
          : formatarCNPJ(input.cpfCnpj);

      const novoCliente = await criarCliente({
        nomeCompleto: input.nomeCompleto,
        email: input.email,
        cpfCnpj: cpfCnpjFormatado,
        telefone: input.telefone ? formatarTelefone(input.telefone) : null,
        endereco: input.endereco || null,
        cep: input.cep ? formatarCEP(input.cep) : null,
        cidade: input.cidade || null,
        estado: input.estado || null,
        formasFaturamento: input.formasFaturamento || null,
        ativo: 1,
      });

      return novoCliente;
    }),

  atualizar: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        dados: clienteSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const cliente = await obterClientePorId(input.id);
      if (!cliente) {
        throw new Error("Cliente não encontrado");
      }

      const clienteAtualizado = await atualizarCliente(input.id, {
        nomeCompleto: input.dados.nomeCompleto,
        email: input.dados.email,
        telefone: input.dados.telefone
          ? formatarTelefone(input.dados.telefone)
          : undefined,
        endereco: input.dados.endereco,
        cep: input.dados.cep ? formatarCEP(input.dados.cep) : undefined,
        cidade: input.dados.cidade,
        estado: input.dados.estado,
        formasFaturamento: input.dados.formasFaturamento,
      });

      return clienteAtualizado;
    }),

  buscarCEP: protectedProcedure
    .input(z.object({ cep: z.string() }))
    .query(async ({ input }) => {
      return await buscarDadosCEP(input.cep);
    }),

  buscarCNPJ: protectedProcedure
    .input(z.object({ cnpj: z.string() }))
    .query(async ({ input }) => {
      return await buscarDadosCNPJ(input.cnpj);
    }),

  validarCPFCNPJ: protectedProcedure
    .input(z.object({ documento: z.string() }))
    .query(({ input }) => {
      return validarCPFouCNPJ(input.documento);
    }),
});
