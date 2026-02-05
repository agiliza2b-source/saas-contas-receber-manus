import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  criarCobranca,
  listarCobrancasPorCliente,
  listarCobrancasPorParcela,
  atualizarStatusCobranca,
  registrarLogEmail,
  criarConciliacao,
  obterConciliacaoPorParcela,
  atualizarStatusConciliacao,
  registrarHistoricoPagamento,
  listarHistoricoPorParcela,
  obterEstatisticasCobranca,
  listarCobrancasPendentes,
  incrementarTentativas,
  listarLogsEmailPorCobranca,
} from "../db-cobranca";

export const cobrancaRouter = router({
  criarCobranca: protectedProcedure
    .input(
      z.object({
        parcelaId: z.number(),
        faturamentoId: z.number(),
        clienteId: z.number(),
        canal: z.enum(["email", "whatsapp", "sms", "pix"]).default("email"),
      })
    )
    .mutation(async ({ input }) => {
      return await criarCobranca({
        parcelaId: input.parcelaId,
        faturamentoId: input.faturamentoId,
        clienteId: input.clienteId,
        status: "pendente",
        canal: input.canal,
        tentativas: 0,
        ativo: 1,
      });
    }),

  listarPorCliente: protectedProcedure
    .input(z.object({ clienteId: z.number() }))
    .query(async ({ input }) => {
      return await listarCobrancasPorCliente(input.clienteId);
    }),

  listarPorParcela: protectedProcedure
    .input(z.object({ parcelaId: z.number() }))
    .query(async ({ input }) => {
      return await listarCobrancasPorParcela(input.parcelaId);
    }),

  atualizarStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pendente", "enviada", "recebida", "lida", "paga", "cancelada"]),
        dataEnvio: z.date().optional(),
        dataRecebimento: z.date().optional(),
        dataLeitura: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await atualizarStatusCobranca(
        input.id,
        input.status,
        input.dataEnvio,
        input.dataRecebimento,
        input.dataLeitura
      );
    }),

  registrarLogEmail: protectedProcedure
    .input(
      z.object({
        cobrancaId: z.number().optional(),
        faturamentoId: z.number().optional(),
        parcelaId: z.number().optional(),
        clienteId: z.number().optional(),
        emailDestino: z.string().email(),
        assunto: z.string(),
        corpo: z.string().optional(),
        status: z.enum(["enviado", "falha", "bounce", "recebido", "lido"]),
        mensagemErro: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await registrarLogEmail({
        cobrancaId: input.cobrancaId,
        faturamentoId: input.faturamentoId,
        parcelaId: input.parcelaId,
        clienteId: input.clienteId,
        emailDestino: input.emailDestino,
        assunto: input.assunto,
        corpo: input.corpo,
        status: input.status,
        mensagemErro: input.mensagemErro,
      });
    }),

  criarConciliacao: protectedProcedure
    .input(
      z.object({
        parcelaId: z.number(),
        faturamentoId: z.number(),
        clienteId: z.number(),
        valor: z.string(),
        dataRecebimento: z.date(),
        formaPagamento: z.string(),
        referencia: z.string().optional(),
        descricao: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await criarConciliacao({
        parcelaId: input.parcelaId,
        faturamentoId: input.faturamentoId,
        clienteId: input.clienteId,
        valor: input.valor,
        dataRecebimento: input.dataRecebimento,
        formaPagamento: input.formaPagamento,
        referencia: input.referencia,
        descricao: input.descricao,
        status: "pendente",
      });
    }),

  obterConciliacao: protectedProcedure
    .input(z.object({ parcelaId: z.number() }))
    .query(async ({ input }) => {
      return await obterConciliacaoPorParcela(input.parcelaId);
    }),

  atualizarStatusConciliacao: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pendente", "confirmada", "rejeitada"]),
      })
    )
    .mutation(async ({ input }) => {
      return await atualizarStatusConciliacao(input.id, input.status);
    }),

  registrarHistoricoPagamento: protectedProcedure
    .input(
      z.object({
        parcelaId: z.number(),
        faturamentoId: z.number(),
        clienteId: z.number(),
        valorPago: z.string(),
        dataPagamento: z.date(),
        formaPagamento: z.string(),
        referencia: z.string().optional(),
        jurosAplicados: z.string().optional(),
        multaAplicada: z.string().optional(),
        descontoAplicado: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await registrarHistoricoPagamento({
        parcelaId: input.parcelaId,
        faturamentoId: input.faturamentoId,
        clienteId: input.clienteId,
        valorPago: input.valorPago,
        dataPagamento: input.dataPagamento,
        formaPagamento: input.formaPagamento,
        referencia: input.referencia,
        jurosAplicados: input.jurosAplicados,
        multaAplicada: input.multaAplicada,
        descontoAplicado: input.descontoAplicado,
        observacoes: input.observacoes,
      });
    }),

  listarHistoricoPagamentos: protectedProcedure
    .input(z.object({ parcelaId: z.number() }))
    .query(async ({ input }) => {
      return await listarHistoricoPorParcela(input.parcelaId);
    }),

  obterEstatisticas: protectedProcedure
    .input(z.object({ clienteId: z.number().optional() }))
    .query(async ({ input }) => {
      return await obterEstatisticasCobranca(input.clienteId);
    }),

  listarPendentes: protectedProcedure.query(async () => {
    return await listarCobrancasPendentes();
  }),

  incrementarTentativas: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        proximaTentativa: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      return await incrementarTentativas(input.id, input.proximaTentativa);
    }),

  listarLogsEmail: protectedProcedure
    .input(z.object({ cobrancaId: z.number() }))
    .query(async ({ input }) => {
      return await listarLogsEmailPorCobranca(input.cobrancaId);
    }),
});
