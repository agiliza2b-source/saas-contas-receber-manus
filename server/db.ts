import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, clientes, servicos, InsertCliente, Cliente, Servico, InsertServico } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Clientes
export async function criarCliente(cliente: InsertCliente): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create client: database not available");
    return null;
  }

  try {
    const result = await db.insert(clientes).values(cliente).returning();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create client:", error);
    throw error;
  }
}

export async function obterClientePorCpfCnpj(cpfCnpj: string): Promise<Cliente | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get client: database not available");
    return undefined;
  }

  const result = await db.select().from(clientes).where(eq(clientes.cpfCnpj, cpfCnpj)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function obterClientePorId(id: number): Promise<Cliente | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get client: database not available");
    return undefined;
  }

  const result = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listarClientes(): Promise<Cliente[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list clients: database not available");
    return [];
  }

  return await db.select().from(clientes).where(eq(clientes.ativo, 1));
}

export async function atualizarCliente(id: number, cliente: Partial<InsertCliente>): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update client: database not available");
    return null;
  }

  try {
    const result = await db.update(clientes).set(cliente).where(eq(clientes.id, id)).returning();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update client:", error);
    throw error;
  }
}

// Servicos
export async function criarServico(servico: InsertServico): Promise<Servico | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create service: database not available");
    return null;
  }

  try {
    const result = await db.insert(servicos).values(servico).returning();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create service:", error);
    throw error;
  }
}

export async function listarServicos(): Promise<Servico[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list services: database not available");
    return [];
  }

  return await db.select().from(servicos).where(eq(servicos.ativo, 1));
}
