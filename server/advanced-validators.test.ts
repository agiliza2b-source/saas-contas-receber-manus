import { describe, it, expect } from "vitest";
import {
  validarEmail,
  validarURL,
  validarMoeda,
  validarPercentual,
  validarData,
  validarHora,
  validarNomeCompleto,
  validarSenha,
  validarNumeroConta,
  validarAgencia,
  validarBanco,
  validarChavePix,
  normalizarMoeda,
  formatarMoedaBRL,
  validarComprimento,
  sanitizarEntrada,
} from "./advanced-validators";

describe("Validadores Avançados", () => {
  describe("validarEmail", () => {
    it("deve validar um email válido", () => {
      expect(validarEmail("usuario@exemplo.com")).toBe(true);
    });

    it("deve rejeitar um email sem @", () => {
      expect(validarEmail("usuarioexemplo.com")).toBe(false);
    });

    it("deve rejeitar um email sem domínio", () => {
      expect(validarEmail("usuario@")).toBe(false);
    });
  });

  describe("validarURL", () => {
    it("deve validar uma URL válida", () => {
      expect(validarURL("https://exemplo.com")).toBe(true);
    });

    it("deve rejeitar uma URL inválida", () => {
      expect(validarURL("não é uma url")).toBe(false);
    });
  });

  describe("validarMoeda", () => {
    it("deve validar um valor em moeda", () => {
      expect(validarMoeda("1.234,56")).toBe(true);
    });

    it("deve validar um valor em moeda sem separadores", () => {
      expect(validarMoeda("123456")).toBe(true);
    });

    it("deve rejeitar um valor com mais de 2 casas decimais", () => {
      expect(validarMoeda("123,456")).toBe(false);
    });
  });

  describe("validarPercentual", () => {
    it("deve validar um percentual válido", () => {
      expect(validarPercentual(50)).toBe(true);
    });

    it("deve rejeitar um percentual maior que 100", () => {
      expect(validarPercentual(150)).toBe(false);
    });

    it("deve rejeitar um percentual negativo", () => {
      expect(validarPercentual(-10)).toBe(false);
    });
  });

  describe("validarData", () => {
    it("deve validar uma data válida", () => {
      expect(validarData("15/03/2024")).toBe(true);
    });

    it("deve rejeitar um mês inválido", () => {
      expect(validarData("15/13/2024")).toBe(false);
    });

    it("deve rejeitar um dia inválido", () => {
      expect(validarData("32/03/2024")).toBe(false);
    });
  });

  describe("validarHora", () => {
    it("deve validar uma hora válida", () => {
      expect(validarHora("14:30")).toBe(true);
    });

    it("deve rejeitar uma hora inválida", () => {
      expect(validarHora("25:00")).toBe(false);
    });

    it("deve rejeitar um minuto inválido", () => {
      expect(validarHora("14:60")).toBe(false);
    });
  });

  describe("validarNomeCompleto", () => {
    it("deve validar um nome completo", () => {
      expect(validarNomeCompleto("João Silva")).toBe(true);
    });

    it("deve rejeitar um nome com uma palavra", () => {
      expect(validarNomeCompleto("João")).toBe(false);
    });

    it("deve rejeitar um nome com palavras muito curtas", () => {
      expect(validarNomeCompleto("J S")).toBe(false);
    });
  });

  describe("validarSenha", () => {
    it("deve validar uma senha forte", () => {
      const resultado = validarSenha("Senha@123");
      expect(resultado.valida).toBe(true);
      expect(resultado.erros).toHaveLength(0);
    });

    it("deve rejeitar uma senha fraca", () => {
      const resultado = validarSenha("123");
      expect(resultado.valida).toBe(false);
      expect(resultado.erros.length).toBeGreaterThan(0);
    });

    it("deve rejeitar uma senha sem maiúscula", () => {
      const resultado = validarSenha("senha@123");
      expect(resultado.valida).toBe(false);
      expect(resultado.erros).toContain("Senha deve conter pelo menos uma letra maiúscula");
    });
  });

  describe("validarNumeroConta", () => {
    it("deve validar um número de conta válido", () => {
      expect(validarNumeroConta("12345678")).toBe(true);
    });

    it("deve rejeitar um número de conta muito curto", () => {
      expect(validarNumeroConta("1234")).toBe(false);
    });
  });

  describe("validarAgencia", () => {
    it("deve validar uma agência válida", () => {
      expect(validarAgencia("1234")).toBe(true);
    });

    it("deve rejeitar uma agência inválida", () => {
      expect(validarAgencia("123")).toBe(false);
    });
  });

  describe("validarBanco", () => {
    it("deve validar um código de banco válido", () => {
      expect(validarBanco("001")).toBe(true);
    });

    it("deve rejeitar um código de banco inválido", () => {
      expect(validarBanco("12")).toBe(false);
    });
  });

  describe("validarChavePix", () => {
    it("deve validar uma chave PIX do tipo CPF", () => {
      expect(validarChavePix("11144477735", "cpf")).toBe(true);
    });

    it("deve validar uma chave PIX do tipo email", () => {
      expect(validarChavePix("usuario@exemplo.com", "email")).toBe(true);
    });

    it("deve validar uma chave PIX do tipo telefone", () => {
      expect(validarChavePix("11999998888", "telefone")).toBe(true);
    });

    it("deve rejeitar uma chave PIX inválida", () => {
      expect(validarChavePix("123", "cpf")).toBe(false);
    });
  });

  describe("normalizarMoeda", () => {
    it("deve normalizar um valor em moeda", () => {
      expect(normalizarMoeda("R$ 1.234,56")).toBe(1234.56);
    });

    it("deve normalizar um valor sem formatação", () => {
      expect(normalizarMoeda("123456")).toBe(123456);
    });
  });

  describe("formatarMoedaBRL", () => {
    it("deve formatar um valor em BRL", () => {
      const resultado = formatarMoedaBRL(1234.56);
      expect(resultado).toContain("1.234,56");
    });
  });

  describe("validarComprimento", () => {
    it("deve validar um comprimento dentro do intervalo", () => {
      expect(validarComprimento("teste", 3, 10)).toBe(true);
    });

    it("deve rejeitar um comprimento muito curto", () => {
      expect(validarComprimento("ab", 3, 10)).toBe(false);
    });

    it("deve rejeitar um comprimento muito longo", () => {
      expect(validarComprimento("abcdefghijk", 3, 10)).toBe(false);
    });
  });

  describe("sanitizarEntrada", () => {
    it("deve remover tags HTML", () => {
      expect(sanitizarEntrada("texto <script>alert('xss')</script>")).not.toContain("<script>");
    });

    it("deve remover javascript:", () => {
      expect(sanitizarEntrada("javascript:alert('xss')")).not.toContain("javascript:");
    });

    it("deve remover espaços em branco", () => {
      expect(sanitizarEntrada("  texto  ")).toBe("texto");
    });
  });
});
