import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de Servicos
 */
export const servicos = mysqlTable("servicos", {
  id: int("id").autoincrement().primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  valor: varchar("valor", { length: 20 }).notNull(),
  ativo: int("ativo").default(1),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type Servico = typeof servicos.$inferSelect;
export type InsertServico = typeof servicos.$inferInsert;

/**
 * Tabela de Clientes
 */
export const clientes = mysqlTable("clientes", {
  id: int("id").autoincrement().primaryKey(),
  nomeCompleto: varchar("nome_completo", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  cpfCnpj: varchar("cpf_cnpj", { length: 18 }).notNull().unique(),
  telefone: varchar("telefone", { length: 20 }),
  endereco: text("endereco"),
  cep: varchar("cep", { length: 10 }),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  formasFaturamento: text("formas_faturamento"),
  ativo: int("ativo").default(1),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

/**
 * Tabela de Faturamentos
 */
export const faturamentos = mysqlTable("faturamentos", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("cliente_id").notNull(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  descricao: text("descricao"),
  dataEmissao: timestamp("data_emissao").defaultNow().notNull(),
  dataVencimento: timestamp("data_vencimento").notNull(),
  valorTotal: varchar("valor_total", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["pendente", "parcial", "pago", "vencido", "cancelado"]).default("pendente"),
  tipoParcela: mysqlEnum("tipo_parcela", ["unica", "parcelado", "recorrente"]).default("unica"),
  quantidadeParcelas: int("quantidade_parcelas").default(1),
  jurosAoMes: varchar("juros_ao_mes", { length: 10 }),
  desconto: varchar("desconto", { length: 20 }),
  observacoes: text("observacoes"),
  ativo: int("ativo").default(1),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type Faturamento = typeof faturamentos.$inferSelect;
export type InsertFaturamento = typeof faturamentos.$inferInsert;

/**
 * Tabela de Parcelas
 */
export const parcelas = mysqlTable("parcelas", {
  id: int("id").autoincrement().primaryKey(),
  faturamentoId: int("faturamento_id").notNull(),
  numeroParcela: int("numero_parcela").notNull(),
  dataVencimento: timestamp("data_vencimento").notNull(),
  valor: varchar("valor", { length: 20 }).notNull(),
  juros: varchar("juros", { length: 20 }).default("0"),
  multa: varchar("multa", { length: 20 }).default("0"),
  desconto: varchar("desconto", { length: 20 }).default("0"),
  valorPago: varchar("valor_pago", { length: 20 }).default("0"),
  dataPagamento: timestamp("data_pagamento"),
  formaPagamento: varchar("forma_pagamento", { length: 50 }),
  status: mysqlEnum("status", ["pendente", "pago", "vencido", "cancelado"]).default("pendente"),
  chavePix: varchar("chave_pix", { length: 255 }),
  codigoBarras: varchar("codigo_barras", { length: 50 }),
  ativo: int("ativo").default(1),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type Parcela = typeof parcelas.$inferSelect;
export type InsertParcela = typeof parcelas.$inferInsert;

/**
 * Tabela de Itens de Faturamento
 */
export const itensFaturamento = mysqlTable("itens_faturamento", {
  id: int("id").autoincrement().primaryKey(),
  faturamentoId: int("faturamento_id").notNull(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
  quantidade: varchar("quantidade", { length: 20 }).notNull(),
  valorUnitario: varchar("valor_unitario", { length: 20 }).notNull(),
  valorTotal: varchar("valor_total", { length: 20 }).notNull(),
  ativo: int("ativo").default(1),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type ItemFaturamento = typeof itensFaturamento.$inferSelect;
export type InsertItemFaturamento = typeof itensFaturamento.$inferInsert;

/**
 * Tabela de Cobranças
 */
export const cobrancas = mysqlTable("cobrancas", {
  id: int("id").autoincrement().primaryKey(),
  parcelaId: int("parcela_id").notNull(),
  faturamentoId: int("faturamento_id").notNull(),
  clienteId: int("cliente_id").notNull(),
  status: mysqlEnum("status", ["pendente", "enviada", "recebida", "lida", "paga", "cancelada"]).default("pendente"),
  dataEnvio: timestamp("data_envio"),
  dataRecebimento: timestamp("data_recebimento"),
  dataLeitura: timestamp("data_leitura"),
  canal: mysqlEnum("canal", ["email", "whatsapp", "sms", "pix"]).default("email"),
  tentativas: int("tentativas").default(0),
  proximaTentativa: timestamp("proxima_tentativa"),
  observacoes: text("observacoes"),
  ativo: int("ativo").default(1),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type Cobranca = typeof cobrancas.$inferSelect;
export type InsertCobranca = typeof cobrancas.$inferInsert;

/**
 * Tabela de Logs de Email
 */
export const logsEmail = mysqlTable("logs_email", {
  id: int("id").autoincrement().primaryKey(),
  cobrancaId: int("cobranca_id"),
  faturamentoId: int("faturamento_id"),
  parcelaId: int("parcela_id"),
  clienteId: int("cliente_id"),
  emailDestino: varchar("email_destino", { length: 320 }).notNull(),
  assunto: varchar("assunto", { length: 255 }).notNull(),
  corpo: text("corpo"),
  status: mysqlEnum("status", ["enviado", "falha", "bounce", "recebido", "lido"]).default("enviado"),
  mensagemErro: text("mensagem_erro"),
  dataEnvio: timestamp("data_envio").defaultNow().notNull(),
  dataRecebimento: timestamp("data_recebimento"),
  dataLeitura: timestamp("data_leitura"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
});

export type LogEmail = typeof logsEmail.$inferSelect;
export type InsertLogEmail = typeof logsEmail.$inferInsert;

/**
 * Tabela de Conciliação de Pagamentos
 */
export const conciliacao = mysqlTable("conciliacao", {
  id: int("id").autoincrement().primaryKey(),
  parcelaId: int("parcela_id").notNull(),
  faturamentoId: int("faturamento_id").notNull(),
  clienteId: int("cliente_id").notNull(),
  valor: varchar("valor", { length: 20 }).notNull(),
  dataRecebimento: timestamp("data_recebimento").notNull(),
  formaPagamento: varchar("forma_pagamento", { length: 50 }).notNull(),
  referencia: varchar("referencia", { length: 255 }),
  descricao: text("descricao"),
  status: mysqlEnum("status", ["pendente", "confirmada", "rejeitada"]).default("pendente"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
});

export type Conciliacao = typeof conciliacao.$inferSelect;
export type InsertConciliacao = typeof conciliacao.$inferInsert;

/**
 * Tabela de Histórico de Pagamentos
 */
export const historicoPagamentos = mysqlTable("historico_pagamentos", {
  id: int("id").autoincrement().primaryKey(),
  parcelaId: int("parcela_id").notNull(),
  faturamentoId: int("faturamento_id").notNull(),
  clienteId: int("cliente_id").notNull(),
  valorPago: varchar("valor_pago", { length: 20 }).notNull(),
  dataPagamento: timestamp("data_pagamento").notNull(),
  formaPagamento: varchar("forma_pagamento", { length: 50 }).notNull(),
  referencia: varchar("referencia", { length: 255 }),
  jurosAplicados: varchar("juros_aplicados", { length: 20 }).default("0"),
  multaAplicada: varchar("multa_aplicada", { length: 20 }).default("0"),
  descontoAplicado: varchar("desconto_aplicado", { length: 20 }).default("0"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
});

export type HistoricoPagamento = typeof historicoPagamentos.$inferSelect;
export type InsertHistoricoPagamento = typeof historicoPagamentos.$inferInsert;
