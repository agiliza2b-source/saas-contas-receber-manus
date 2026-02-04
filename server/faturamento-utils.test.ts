import { describe, it, expect } from "vitest";
import {
  calcularParcelasJurosSimples,
  calcularParcelasJurosCompostos,
  calcularJurosPorAtraso,
  calcularMultaPorAtraso,
  calcularDescontoAntecipado,
  verificarParcelaVencida,
  calcularDiasParaVencimento,
  calcularSistemaPrice,
  calcularValorTotalFaturamento,
  converterMoedaParaNumero,
} from "./faturamento-utils";

describe("Utilitários de Faturamento", () => {
  describe("calcularParcelasJurosSimples", () => {
    it("deve calcular parcelas com juros simples", () => {
      const dataVencimento = new Date("2024-03-15");
      const parcelas = calcularParcelasJurosSimples(1000, 3, 5, dataVencimento);

      expect(parcelas).toHaveLength(3);
      expect(parcelas[0].numero).toBe(1);
      expect(parcelas[0].valor).toBeCloseTo(333.33, 2);
      expect(parcelas[0].juros).toBe(0);
    });

    it("deve aplicar desconto corretamente", () => {
      const dataVencimento = new Date("2024-03-15");
      const parcelas = calcularParcelasJurosSimples(1000, 2, 5, dataVencimento, 100);

      expect(parcelas[0].valor).toBeCloseTo(450, 2);
    });
  });

  describe("calcularParcelasJurosCompostos", () => {
    it("deve calcular parcelas com juros compostos", () => {
      const dataVencimento = new Date("2024-03-15");
      const parcelas = calcularParcelasJurosCompostos(1000, 3, 5, dataVencimento);

      expect(parcelas).toHaveLength(3);
      expect(parcelas[0].numero).toBe(1);
      expect(parcelas[2].juros).toBeGreaterThan(parcelas[0].juros);
    });
  });

  describe("calcularJurosPorAtraso", () => {
    it("deve calcular juros por atraso", () => {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() - 10);

      const resultado = calcularJurosPorAtraso(1000, dataVencimento, new Date(), 0.5);

      expect(resultado.diasAtraso).toBeGreaterThan(0);
      expect(resultado.juros).toBeGreaterThan(0);
    });

    it("deve retornar zero se não houver atraso", () => {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + 10);

      const resultado = calcularJurosPorAtraso(1000, dataVencimento, new Date(), 0.5);

      expect(resultado.diasAtraso).toBe(0);
      expect(resultado.juros).toBe(0);
    });
  });

  describe("calcularMultaPorAtraso", () => {
    it("deve calcular multa por atraso", () => {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() - 5);

      const resultado = calcularMultaPorAtraso(1000, dataVencimento, new Date(), 10);

      expect(resultado.diasAtraso).toBeGreaterThan(0);
      expect(resultado.multa).toBeCloseTo(100, 1);
    });
  });

  describe("calcularDescontoAntecipado", () => {
    it("deve calcular desconto por pagamento antecipado", () => {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + 30);

      const dataPagamento = new Date();

      const resultado = calcularDescontoAntecipado(1000, dataVencimento, dataPagamento, 5);

      expect(resultado.diasAntecipacao).toBeGreaterThan(0);
      expect(resultado.desconto).toBeGreaterThan(0);
      expect(resultado.valorFinal).toBeLessThan(1000);
    });

    it("deve retornar zero se não houver antecipação", () => {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() - 10);

      const dataPagamento = new Date();

      const resultado = calcularDescontoAntecipado(1000, dataVencimento, dataPagamento, 5);

      expect(resultado.diasAntecipacao).toBeLessThanOrEqual(0);
      expect(resultado.desconto).toBe(0);
    });
  });

  describe("verificarParcelaVencida", () => {
    it("deve identificar parcela vencida", () => {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() - 1);

      expect(verificarParcelaVencida(dataVencimento)).toBe(true);
    });

    it("deve identificar parcela não vencida", () => {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + 1);

      expect(verificarParcelaVencida(dataVencimento)).toBe(false);
    });
  });

  describe("calcularDiasParaVencimento", () => {
    it("deve calcular dias para vencimento", () => {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + 10);

      const dias = calcularDiasParaVencimento(dataVencimento);

      expect(dias).toBeGreaterThanOrEqual(9);
      expect(dias).toBeLessThanOrEqual(11);
    });
  });

  describe("calcularSistemaPrice", () => {
    it("deve calcular sistema Price corretamente", () => {
      const resultado = calcularSistemaPrice(10000, 12, 1);

      expect(resultado.valorParcela).toBeGreaterThan(0);
      expect(resultado.totalJuros).toBeGreaterThan(0);
      expect(resultado.valorTotalComJuros).toBeGreaterThan(10000);
    });

    it("deve gerar parcelas iguais", () => {
      const resultado = calcularSistemaPrice(10000, 12, 1);
      const valorEsperado = resultado.valorParcela;

      // Verificar se o valor total é consistente
      expect(resultado.valorTotalComJuros).toBeCloseTo(valorEsperado * 12, 1);
    });
  });

  describe("calcularValorTotalFaturamento", () => {
    it("deve calcular valor total com todas as taxas", () => {
      const total = calcularValorTotalFaturamento(1000, 100, 50, 20, 10);

      expect(total).toBe(980);
    });

    it("deve considerar apenas valor base se sem taxas", () => {
      const total = calcularValorTotalFaturamento(1000);

      expect(total).toBe(1000);
    });
  });

  describe("converterMoedaParaNumero", () => {
    it("deve converter moeda formatada para número", () => {
      expect(converterMoedaParaNumero("R$ 1.234,56")).toBeCloseTo(1234.56, 2);
    });

    it("deve converter moeda com ponto para número", () => {
      expect(converterMoedaParaNumero("1234.56")).toBeCloseTo(1234.56, 2);
    });
  });
});
