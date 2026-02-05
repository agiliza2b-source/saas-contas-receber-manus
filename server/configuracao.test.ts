import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthContext(): TrpcContext {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("configuracao router", () => {
  it("salvarEmpresa deve aceitar dados válidos", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.configuracao.salvarEmpresa({
      nome: "Agiliza Digital",
      cnpj: "12345678901234",
      email: "contato@agiliza.com",
      telefone: "(11) 98765-4321",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310100",
    });

    expect(result.success).toBe(true);
  });

  it("salvarSmtp deve aceitar dados válidos", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.configuracao.salvarSmtp({
      host: "smtp.gmail.com",
      port: "587",
      usuario: "test@gmail.com",
      senha: "password123",
      de: "noreply@agiliza.com",
      ativo: true,
    });

    expect(result.success).toBe(true);
  });

  it("testarSmtp deve aceitar dados válidos", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.configuracao.testarSmtp({
      host: "smtp.gmail.com",
      port: "587",
      usuario: "test@gmail.com",
      senha: "password123",
      de: "noreply@agiliza.com",
      ativo: true,
    });

    expect(result.success).toBe(true);
  });

  it("salvarPix deve aceitar dados válidos", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.configuracao.salvarPix({
      chave: "chave@banco.com.br",
      tipo: "email",
      ativo: true,
    });

    expect(result.success).toBe(true);
  });

  it("salvarWhatsapp deve aceitar dados válidos", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.configuracao.salvarWhatsapp({
      token: "EAA123456789",
      numeroTelefone: "(11) 98765-4321",
      ativo: true,
    });

    expect(result.success).toBe(true);
  });

  it("salvarSms deve aceitar dados válidos", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.configuracao.salvarSms({
      apiKey: "api-key-123",
      apiUrl: "https://api.sms-provider.com/send",
      remetente: "AGILIZA",
      ativo: true,
    });

    expect(result.success).toBe(true);
  });

  it("salvarEmpresa deve rejeitar CNPJ inválido", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.configuracao.salvarEmpresa({
        nome: "Agiliza Digital",
        cnpj: "123",
        email: "contato@agiliza.com",
        telefone: "(11) 98765-4321",
        endereco: "Rua das Flores, 123",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01310100",
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("salvarSmtp deve rejeitar email inválido", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.configuracao.salvarSmtp({
        host: "smtp.gmail.com",
        port: "587",
        usuario: "test@gmail.com",
        senha: "password123",
        de: "email-invalido",
        ativo: true,
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("salvarPix deve rejeitar tipo de chave inválido", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.configuracao.salvarPix({
        chave: "chave@banco.com.br",
        tipo: "invalido" as any,
        ativo: true,
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("obterConfiguracao deve retornar dados", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.configuracao.obterConfiguracao("empresa");

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
