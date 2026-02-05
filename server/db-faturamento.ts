import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { faturamentos, parcelas, itensFaturamento, InsertFaturamento, Faturamento, InsertParcela, Parcela, InsertItemFaturamento, ItemFaturamento } from "../drizzle/schema";

/**
 * Criar um novo faturamento com parcelas automáticas
 */
export async function criarFaturamentoComParcelas(
  faturamento: InsertFaturamento,
  itens: InsertItemFaturamento[]
): Promise<Faturamento | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create invoice: database not available");
    return null;
  }

  try {
    // Inserir faturamento
    const resultFat = await db.insert(faturamentos).values(faturamento).returning();
    const faturamentoId = resultFat[0]?.id;

    if (!faturamentoId) return null;

    // Inserir itens
    if (itens.length > 0) {
      await db.insert(itensFaturamento).values(
        itens.map(item => ({ ...item, faturamentoId }))
      );
    }

    // Gerar parcelas automaticamente
    const valorTotal = parseFloat(faturamento.valorTotal);
    const quantidadeParcelas = faturamento.quantidadeParcelas || 1;
    const jurosAoMes = parseFloat(faturamento.jurosAoMes || "0");
    const desconto = parseFloat(faturamento.desconto || "0");

    const valorComDesconto = valorTotal - desconto;
    const valorPorParcela = valorComDesconto / quantidadeParcelas;

    const dataVencimento = new Date(faturamento.dataVencimento);

    for (let i = 1; i <= quantidadeParcelas; i++) {
      const dataVenc = new Date(dataVencimento);
      dataVenc.setMonth(dataVenc.getMonth() + (i - 1));

      // Calcular juros compostos
      const jurosCalculado = valorPorParcela * Math.pow(1 + jurosAoMes / 100, i - 1) - valorPorParcela;

      await db.insert(parcelas).values({
        faturamentoId,
        numeroParcela: i,
        dataVencimento: dataVenc,
        valor: valorPorParcela.toFixed(2),
        juros: jurosCalculado.toFixed(2),
        status: "pendente",
      });
    }

    const fat = await obterFaturamentoPorId(faturamentoId);
    return fat || null;
  } catch (error) {
    console.error("[Database] Failed to create invoice with installments:", error);
    throw error;
  }
}

/**
 * Obter faturamento por ID com parcelas
 */
export async function obterFaturamentoPorId(id: number): Promise<Faturamento | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get invoice: database not available");
    return undefined;
  }

  const result = await db.select().from(faturamentos).where(eq(faturamentos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Listar faturamentos por cliente
 */
export async function listarFaturamentosPorCliente(clienteId: number): Promise<Faturamento[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list invoices: database not available");
    return [];
  }

  return await db.select().from(faturamentos).where(eq(faturamentos.clienteId, clienteId));
}

/**
 * Listar todas as parcelas de um faturamento
 */
export async function listarParcelasPorFaturamento(faturamentoId: number): Promise<Parcela[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list installments: database not available");
    return [];
  }

  return await db.select().from(parcelas).where(eq(parcelas.faturamentoId, faturamentoId));
}

/**
 * Listar itens de um faturamento
 */
export async function listarItensFaturamento(faturamentoId: number): Promise<ItemFaturamento[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list invoice items: database not available");
    return [];
  }

  return await db.select().from(itensFaturamento).where(eq(itensFaturamento.faturamentoId, faturamentoId));
}

/**
 * Atualizar status de uma parcela
 */
export async function atualizarParcelaStatus(
  parcelaId: number,
  status: "pendente" | "pago" | "vencido" | "cancelado",
  valorPago?: string,
  dataPagamento?: Date,
  formaPagamento?: string
): Promise<Parcela | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update installment: database not available");
    return null;
  }

  try {
    const updateData: any = { status };

    if (valorPago) updateData.valorPago = valorPago;
    if (dataPagamento) updateData.dataPagamento = dataPagamento;
    if (formaPagamento) updateData.formaPagamento = formaPagamento;

    await db.update(parcelas).set(updateData).where(eq(parcelas.id, parcelaId));

    const result = await db.select().from(parcelas).where(eq(parcelas.id, parcelaId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update installment:", error);
    throw error;
  }
}

/**
 * Calcular valor total pago de um faturamento
 */
export async function calcularTotalPago(faturamentoId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const resultado = await db.select().from(parcelas).where(eq(parcelas.faturamentoId, faturamentoId));

  return resultado.reduce((total, parcela) => {
    return total + parseFloat(parcela.valorPago || "0");
  }, 0);
}

/**
 * Obter status consolidado de um faturamento
 */
export async function obterStatusFaturamento(faturamentoId: number): Promise<"pendente" | "parcial" | "pago" | "vencido" | "cancelado"> {
  const db = await getDb();
  if (!db) return "pendente";

  const faturamento = await db.select().from(faturamentos).where(eq(faturamentos.id, faturamentoId)).limit(1);
  if (faturamento.length === 0) return "pendente";

  const parcelasList = await listarParcelasPorFaturamento(faturamentoId);
  const totalPago = await calcularTotalPago(faturamentoId);
  const valorTotal = parseFloat(faturamento[0].valorTotal);

  if (totalPago === 0) {
    const temVencida = parcelasList.some((p) => new Date(p.dataVencimento) < new Date() && p.status === "pendente");
    return temVencida ? "vencido" : "pendente";
  }

  if (totalPago >= valorTotal) {
    return "pago";
  }

  return "parcial";
}

/**
 * Gerar número de faturamento único
 */
export async function gerarNumeroFaturamento(): Promise<string> {
  const db = await getDb();
  if (!db) return "FAT-001";

  const resultado = await db.select().from(faturamentos);
  const numero = resultado.length + 1;

  return `FAT-${String(numero).padStart(6, "0")}`;
}

/**
 * Atualizar faturamento
 */
export async function atualizarFaturamento(
  id: number,
  dados: Partial<InsertFaturamento>
): Promise<Faturamento | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update invoice: database not available");
    return null;
  }

  try {
    await db.update(faturamentos).set(dados).where(eq(faturamentos.id, id));
    const fat = await obterFaturamentoPorId(id);
    return fat || null;
  } catch (error) {
    console.error("[Database] Failed to update invoice:", error);
    throw error;
  }
}

/**
 * Cancelar faturamento (cancela todas as parcelas)
 */
export async function cancelarFaturamento(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot cancel invoice: database not available");
    return false;
  }

  try {
    // Atualizar faturamento
    await db.update(faturamentos).set({ status: "cancelado" }).where(eq(faturamentos.id, id));

    // Atualizar todas as parcelas
    await db.update(parcelas).set({ status: "cancelado" }).where(eq(parcelas.faturamentoId, id));

    return true;
  } catch (error) {
    console.error("[Database] Failed to cancel invoice:", error);
    throw error;
  }
}
