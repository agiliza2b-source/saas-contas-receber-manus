import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  criarFaturamentoComParcelas,
  listarFaturamentosPorCliente,
  obterFaturamentoPorId,
  listarParcelasPorFaturamento,
  listarItensFaturamento,
  atualizarParcelaStatus,
  calcularTotalPago,
  obterStatusFaturamento,
  gerarNumeroFaturamento,
  atualizarFaturamento,
  cancelarFaturamento,
} from "../db-faturamento";
import {
  calcularParcelasJurosSimples,
  calcularParcelasJurosCompostos,
  calcularJurosPorAtraso,
  calcularMultaPorAtraso,
  calcularDescontoAntecipado,
  verificarParcelaVencida,
  calcularDiasParaVencimento,
  calcularSistemaPrice,
} from "../faturamento-utils";

const itemFaturamentoSchema = z.object({
  descricao: z.string(),
  quantidade: z.string(),
  valorUnitario: z.string(),
});

const faturamentoSchema = z.object({
  clienteId: z.number(),
  descricao: z.string().optional(),
  dataVencimento: z.date(),
  valorTotal: z.string(),
  tipoParcela: z.enum(["unica", "parcelado", "recorrente"]).default("unica"),
  quantidadeParcelas: z.number().default(1),
  jurosAoMes: z.string().optional(),
  desconto: z.string().optional(),
  observacoes: z.string().optional(),
  itens: z.array(itemFaturamentoSchema),
});

export const faturamentoRouter = router({
  listarPorCliente: protectedProcedure
    .input(z.object({ clienteId: z.number() }))
    .query(async ({ input }) => {
      return await listarFaturamentosPorCliente(input.clienteId);
    }),

  obterDetalhes: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const faturamento = await obterFaturamentoPorId(input.id);
      if (!faturamento) return null;

      const parcelas = await listarParcelasPorFaturamento(input.id);
      const itens = await listarItensFaturamento(input.id);
      const totalPago = await calcularTotalPago(input.id);
      const status = await obterStatusFaturamento(input.id);

      return {
        faturamento,
        parcelas,
        itens,
        totalPago,
        status,
      };
    }),

  criar: protectedProcedure
    .input(faturamentoSchema)
    .mutation(async ({ input }) => {
      const numero = await gerarNumeroFaturamento();

      const faturamento = await criarFaturamentoComParcelas(
        {
          clienteId: input.clienteId,
          numero,
          descricao: input.descricao,
          dataEmissao: new Date(),
          dataVencimento: input.dataVencimento,
          valorTotal: input.valorTotal,
          tipoParcela: input.tipoParcela,
          quantidadeParcelas: input.quantidadeParcelas,
          jurosAoMes: input.jurosAoMes,
          desconto: input.desconto,
          observacoes: input.observacoes,
          ativo: 1,
        },
        input.itens.map((item) => ({
          faturamentoId: 0,
          descricao: item.descricao,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          valorTotal: (parseFloat(item.quantidade) * parseFloat(item.valorUnitario)).toFixed(2),
          ativo: 1,
        }))
      );

      return faturamento;
    }),

  atualizarStatusParcela: protectedProcedure
    .input(
      z.object({
        parcelaId: z.number(),
        status: z.enum(["pendente", "pago", "vencido", "cancelado"]),
        valorPago: z.string().optional(),
        dataPagamento: z.date().optional(),
        formaPagamento: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await atualizarParcelaStatus(
        input.parcelaId,
        input.status,
        input.valorPago,
        input.dataPagamento,
        input.formaPagamento
      );
    }),

  calcularJurosPorAtraso: protectedProcedure
    .input(
      z.object({
        valorOriginal: z.number(),
        dataVencimento: z.date(),
        percentualDiario: z.number(),
      })
    )
    .query(({ input }) => {
      return calcularJurosPorAtraso(input.valorOriginal, input.dataVencimento, new Date(), input.percentualDiario);
    }),

  calcularMultaPorAtraso: protectedProcedure
    .input(
      z.object({
        valorOriginal: z.number(),
        dataVencimento: z.date(),
        percentualMulta: z.number(),
      })
    )
    .query(({ input }) => {
      return calcularMultaPorAtraso(input.valorOriginal, input.dataVencimento, new Date(), input.percentualMulta);
    }),

  calcularDescontoAntecipado: protectedProcedure
    .input(
      z.object({
        valorTotal: z.number(),
        dataVencimento: z.date(),
        dataPagamento: z.date(),
        percentualDescontoAoMes: z.number(),
      })
    )
    .query(({ input }) => {
      return calcularDescontoAntecipado(
        input.valorTotal,
        input.dataVencimento,
        input.dataPagamento,
        input.percentualDescontoAoMes
      );
    }),

  calcularParcelasSimples: protectedProcedure
    .input(
      z.object({
        valorTotal: z.number(),
        quantidadeParcelas: z.number(),
        jurosAoMes: z.number(),
        dataVencimento: z.date(),
        desconto: z.number().optional(),
      })
    )
    .query(({ input }) => {
      return calcularParcelasJurosSimples(
        input.valorTotal,
        input.quantidadeParcelas,
        input.jurosAoMes,
        input.dataVencimento,
        input.desconto
      );
    }),

  calcularParcelasCompostas: protectedProcedure
    .input(
      z.object({
        valorTotal: z.number(),
        quantidadeParcelas: z.number(),
        jurosAoMes: z.number(),
        dataVencimento: z.date(),
        desconto: z.number().optional(),
      })
    )
    .query(({ input }) => {
      return calcularParcelasJurosCompostos(
        input.valorTotal,
        input.quantidadeParcelas,
        input.jurosAoMes,
        input.dataVencimento,
        input.desconto
      );
    }),

  calcularSistemaPrice: protectedProcedure
    .input(
      z.object({
        valorTotal: z.number(),
        quantidadeParcelas: z.number(),
        taxaMensal: z.number(),
      })
    )
    .query(({ input }) => {
      return calcularSistemaPrice(input.valorTotal, input.quantidadeParcelas, input.taxaMensal);
    }),

  verificarVencimento: protectedProcedure
    .input(z.object({ dataVencimento: z.date() }))
    .query(({ input }) => {
      return {
        vencido: verificarParcelaVencida(input.dataVencimento),
        diasParaVencimento: calcularDiasParaVencimento(input.dataVencimento),
      };
    }),

  cancelar: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await cancelarFaturamento(input.id);
    }),
});
