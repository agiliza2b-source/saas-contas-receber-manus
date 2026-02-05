import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import {
  cobrancas,
  logsEmail,
  conciliacao,
  historicoPagamentos,
  InsertCobranca,
  Cobranca,
  InsertLogEmail,
  LogEmail,
  InsertConciliacao,
  Conciliacao,
  InsertHistoricoPagamento,
  HistoricoPagamento,
} from "../drizzle/schema";

/**
 * Criar uma cobrança para uma parcela
 */
export async function criarCobranca(cobranca: InsertCobranca): Promise<Cobranca | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create collection: database not available");
    return null;
  }

  try {
    const result = await db.insert(cobrancas).values(cobranca).returning();
    const cobrancaId = result[0]?.id;

    if (!cobrancaId) return null;

    const cob = await obterCobrancaPorId(cobrancaId);
    return cob || null;
  } catch (error) {
    console.error("[Database] Failed to create collection:", error);
    throw error;
  }
}

/**
 * Obter cobrança por ID
 */
export async function obterCobrancaPorId(id: number): Promise<Cobranca | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(cobrancas).where(eq(cobrancas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Listar cobranças por parcela
 */
export async function listarCobrancasPorParcela(parcelaId: number): Promise<Cobranca[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cobrancas).where(eq(cobrancas.parcelaId, parcelaId));
}

/**
 * Listar cobranças por cliente
 */
export async function listarCobrancasPorCliente(clienteId: number): Promise<Cobranca[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cobrancas).where(eq(cobrancas.clienteId, clienteId));
}

/**
 * Atualizar status de cobrança
 */
export async function atualizarStatusCobranca(
  id: number,
  status: "pendente" | "enviada" | "recebida" | "lida" | "paga" | "cancelada",
  dataEnvio?: Date,
  dataRecebimento?: Date,
  dataLeitura?: Date
): Promise<Cobranca | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const updateData: any = { status };

    if (dataEnvio) updateData.dataEnvio = dataEnvio;
    if (dataRecebimento) updateData.dataRecebimento = dataRecebimento;
    if (dataLeitura) updateData.dataLeitura = dataLeitura;

    await db.update(cobrancas).set(updateData).where(eq(cobrancas.id, id));

    const cob = await obterCobrancaPorId(id);
    return cob || null;
  } catch (error) {
    console.error("[Database] Failed to update collection status:", error);
    throw error;
  }
}

/**
 * Registrar log de email
 */
export async function registrarLogEmail(log: InsertLogEmail): Promise<LogEmail | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(logsEmail).values(log).returning();
    const logId = result[0]?.id;

    if (!logId) return null;

    const logResult = await db.select().from(logsEmail).where(eq(logsEmail.id, logId)).limit(1);
    return logResult.length > 0 ? logResult[0] : null;
  } catch (error) {
    console.error("[Database] Failed to register email log:", error);
    throw error;
  }
}

/**
 * Listar logs de email por cobrança
 */
export async function listarLogsEmailPorCobranca(cobrancaId: number): Promise<LogEmail[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(logsEmail).where(eq(logsEmail.cobrancaId, cobrancaId));
}

/**
 * Criar conciliação de pagamento
 */
export async function criarConciliacao(conc: InsertConciliacao): Promise<Conciliacao | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(conciliacao).values(conc).returning();
    const concId = result[0]?.id;

    if (!concId) return null;

    const concResult = await db.select().from(conciliacao).where(eq(conciliacao.id, concId)).limit(1);
    return concResult.length > 0 ? concResult[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create reconciliation:", error);
    throw error;
  }
}

/**
 * Obter conciliação por parcela
 */
export async function obterConciliacaoPorParcela(parcelaId: number): Promise<Conciliacao | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(conciliacao).where(eq(conciliacao.parcelaId, parcelaId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Atualizar status de conciliação
 */
export async function atualizarStatusConciliacao(
  id: number,
  status: "pendente" | "confirmada" | "rejeitada"
): Promise<Conciliacao | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(conciliacao).set({ status }).where(eq(conciliacao.id, id));

    const result = await db.select().from(conciliacao).where(eq(conciliacao.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update reconciliation status:", error);
    throw error;
  }
}

/**
 * Registrar histórico de pagamento
 */
export async function registrarHistoricoPagamento(
  historico: InsertHistoricoPagamento
): Promise<HistoricoPagamento | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(historicoPagamentos).values(historico).returning();
    const histId = result[0]?.id;

    if (!histId) return null;

    const histResult = await db
      .select()
      .from(historicoPagamentos)
      .where(eq(historicoPagamentos.id, histId))
      .limit(1);
    return histResult.length > 0 ? histResult[0] : null;
  } catch (error) {
    console.error("[Database] Failed to register payment history:", error);
    throw error;
  }
}

/**
 * Listar histórico de pagamentos por parcela
 */
export async function listarHistoricoPorParcela(parcelaId: number): Promise<HistoricoPagamento[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(historicoPagamentos).where(eq(historicoPagamentos.parcelaId, parcelaId));
}

/**
 * Obter estatísticas de cobrança
 */
export async function obterEstatisticasCobranca(clienteId?: number): Promise<{
  totalCobrancas: number;
  cobrancasEnviadas: number;
  cobrancasRecebidas: number;
  cobrancasLidas: number;
  cobrancasPagas: number;
}> {
  const db = await getDb();
  if (!db) {
    return {
      totalCobrancas: 0,
      cobrancasEnviadas: 0,
      cobrancasRecebidas: 0,
      cobrancasLidas: 0,
      cobrancasPagas: 0,
    };
  }

  try {
    const resultado = clienteId
      ? await db.select().from(cobrancas).where(eq(cobrancas.clienteId, clienteId))
      : await db.select().from(cobrancas);

    return {
      totalCobrancas: resultado.length,
      cobrancasEnviadas: resultado.filter((c) => c.status === "enviada").length,
      cobrancasRecebidas: resultado.filter((c) => c.status === "recebida").length,
      cobrancasLidas: resultado.filter((c) => c.status === "lida").length,
      cobrancasPagas: resultado.filter((c) => c.status === "paga").length,
    };
  } catch (error) {
    console.error("[Database] Failed to get collection statistics:", error);
    return {
      totalCobrancas: 0,
      cobrancasEnviadas: 0,
      cobrancasRecebidas: 0,
      cobrancasLidas: 0,
      cobrancasPagas: 0,
    };
  }
}

/**
 * Listar cobranças pendentes de envio
 */
export async function listarCobrancasPendentes(): Promise<Cobranca[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cobrancas).where(eq(cobrancas.status, "pendente"));
}

/**
 * Incrementar tentativas de cobrança
 */
export async function incrementarTentativas(id: number, proximaTentativa: Date): Promise<Cobranca | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const cobranca = await obterCobrancaPorId(id);
    if (!cobranca) return null;

    const novasTentativas = (cobranca.tentativas || 0) + 1;

    await db
      .update(cobrancas)
      .set({
        tentativas: novasTentativas,
        proximaTentativa,
      })
      .where(eq(cobrancas.id, id));

    const result = await obterCobrancaPorId(id);
    return result || null;
  } catch (error) {
    console.error("[Database] Failed to increment collection attempts:", error);
    throw error;
  }
}
