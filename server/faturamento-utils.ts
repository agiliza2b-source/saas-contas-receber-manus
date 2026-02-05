/**
 * Utilitários para cálculos de faturamento
 */

export interface ParcelaCalculada {
  numero: number;
  dataVencimento: Date;
  valor: number;
  juros: number;
  total: number;
}

/**
 * Calcular parcelas com juros simples
 */
export function calcularParcelasJurosSimples(
  valorTotal: number,
  quantidadeParcelas: number,
  jurosAoMes: number,
  dataVencimento: Date,
  desconto: number = 0
): ParcelaCalculada[] {
  const valorComDesconto = valorTotal - desconto;
  const valorPorParcela = valorComDesconto / quantidadeParcelas;
  const parcelas: ParcelaCalculada[] = [];

  for (let i = 1; i <= quantidadeParcelas; i++) {
    const dataVenc = new Date(dataVencimento);
    dataVenc.setMonth(dataVenc.getMonth() + (i - 1));

    const juros = (valorPorParcela * jurosAoMes * (i - 1)) / 100;
    const total = valorPorParcela + juros;

    parcelas.push({
      numero: i,
      dataVencimento: dataVenc,
      valor: valorPorParcela,
      juros,
      total,
    });
  }

  return parcelas;
}

/**
 * Calcular parcelas com juros compostos
 */
export function calcularParcelasJurosCompostos(
  valorTotal: number,
  quantidadeParcelas: number,
  jurosAoMes: number,
  dataVencimento: Date,
  desconto: number = 0
): ParcelaCalculada[] {
  const valorComDesconto = valorTotal - desconto;
  const valorPorParcela = valorComDesconto / quantidadeParcelas;
  const parcelas: ParcelaCalculada[] = [];

  for (let i = 1; i <= quantidadeParcelas; i++) {
    const dataVenc = new Date(dataVencimento);
    dataVenc.setMonth(dataVenc.getMonth() + (i - 1));

    // Juros compostos: J = P * ((1 + i)^n - 1)
    const taxaMensal = jurosAoMes / 100;
    const juros = valorPorParcela * (Math.pow(1 + taxaMensal, i) - 1);
    const total = valorPorParcela + juros;

    parcelas.push({
      numero: i,
      dataVencimento: dataVenc,
      valor: valorPorParcela,
      juros,
      total,
    });
  }

  return parcelas;
}

/**
 * Calcular juros por atraso (multa por dia)
 */
export function calcularJurosPorAtraso(
  valorOriginal: number,
  dataVencimento: Date,
  dataAtual: Date,
  percentualDiario: number
): {
  diasAtraso: number;
  juros: number;
  valorTotal: number;
} {
  const diasAtraso = Math.floor((dataAtual.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24));

  if (diasAtraso <= 0) {
    return {
      diasAtraso: 0,
      juros: 0,
      valorTotal: valorOriginal,
    };
  }

  const juros = (valorOriginal * percentualDiario * diasAtraso) / 100;

  return {
    diasAtraso,
    juros,
    valorTotal: valorOriginal + juros,
  };
}

/**
 * Calcular multa por atraso (percentual fixo)
 */
export function calcularMultaPorAtraso(
  valorOriginal: number,
  dataVencimento: Date,
  dataAtual: Date,
  percentualMulta: number
): {
  diasAtraso: number;
  multa: number;
  valorTotal: number;
} {
  const diasAtraso = Math.floor((dataAtual.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24));

  if (diasAtraso <= 0) {
    return {
      diasAtraso: 0,
      multa: 0,
      valorTotal: valorOriginal,
    };
  }

  const multa = (valorOriginal * percentualMulta) / 100;

  return {
    diasAtraso,
    multa,
    valorTotal: valorOriginal + multa,
  };
}

/**
 * Calcular desconto por pagamento antecipado
 */
export function calcularDescontoAntecipado(
  valorTotal: number,
  dataVencimento: Date,
  dataPagamento: Date,
  percentualDescontoAoMes: number
): {
  diasAntecipacao: number;
  desconto: number;
  valorFinal: number;
} {
  const diasAntecipacao = Math.floor((dataVencimento.getTime() - dataPagamento.getTime()) / (1000 * 60 * 60 * 24));

  if (diasAntecipacao <= 0) {
    return {
      diasAntecipacao: 0,
      desconto: 0,
      valorFinal: valorTotal,
    };
  }

  const mesesAntecipacao = diasAntecipacao / 30;
  const desconto = (valorTotal * percentualDescontoAoMes * mesesAntecipacao) / 100;
  const valorFinal = valorTotal - desconto;

  return {
    diasAntecipacao,
    desconto,
    valorFinal: Math.max(0, valorFinal),
  };
}

/**
 * Calcular valor total de um faturamento com todas as taxas
 */
export function calcularValorTotalFaturamento(
  valorBase: number,
  desconto: number = 0,
  juros: number = 0,
  multa: number = 0,
  outrosCustos: number = 0
): number {
  return valorBase - desconto + juros + multa + outrosCustos;
}

/**
 * Validar se uma parcela está vencida
 */
export function verificarParcelaVencida(dataVencimento: Date, dataAtual: Date = new Date()): boolean {
  return dataAtual > dataVencimento;
}

/**
 * Calcular dias para vencimento
 */
export function calcularDiasParaVencimento(dataVencimento: Date, dataAtual: Date = new Date()): number {
  return Math.ceil((dataVencimento.getTime() - dataAtual.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Formatar valor em moeda BRL
 */
export function formatarMoedaBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/**
 * Converter string de moeda para número
 */
export function converterMoedaParaNumero(valor: string): number {
  // Remove símbolos de moeda e espaços
  let limpo = valor.replace(/[R$\s]/g, "");
  
  // Se contém ponto e vírgula, assume formato brasileiro (1.234,56)
  if (limpo.includes(".") && limpo.includes(",")) {
    limpo = limpo.replace(/\./g, "").replace(",", ".");
  } else if (limpo.includes(",")) {
    // Se contém apenas vírgula, assume formato brasileiro
    limpo = limpo.replace(",", ".");
  }
  
  return parseFloat(limpo);
}

/**
 * Calcular taxa de juros efetiva
 */
export function calcularTaxaEfetiva(taxaNominal: number, periodos: number): number {
  return (Math.pow(1 + taxaNominal / 100, periodos) - 1) * 100;
}

/**
 * Calcular valor da parcela com sistema Price (prestações iguais)
 */
export function calcularSistemaPrice(
  valorTotal: number,
  quantidadeParcelas: number,
  taxaMensal: number
): {
  valorParcela: number;
  totalJuros: number;
  valorTotalComJuros: number;
} {
  const taxa = taxaMensal / 100;
  const numerador = taxa * Math.pow(1 + taxa, quantidadeParcelas);
  const denominador = Math.pow(1 + taxa, quantidadeParcelas) - 1;
  const valorParcela = valorTotal * (numerador / denominador);
  const totalJuros = valorParcela * quantidadeParcelas - valorTotal;

  return {
    valorParcela,
    totalJuros,
    valorTotalComJuros: valorParcela * quantidadeParcelas,
  };
}
