import { describe, it, expect } from "vitest";
import {
  validarCPF,
  validarCNPJ,
  validarCPFouCNPJ,
  formatarCPF,
  formatarCNPJ,
  formatarCEP,
  formatarTelefone,
} from "./validators";

describe("Validadores", () => {
  describe("validarCPF", () => {
    it("deve validar um CPF válido", () => {
      expect(validarCPF("11144477735")).toBe(true);
    });

    it("deve rejeitar um CPF com todos os dígitos iguais", () => {
      expect(validarCPF("11111111111")).toBe(false);
    });

    it("deve rejeitar um CPF com comprimento inválido", () => {
      expect(validarCPF("123456789")).toBe(false);
    });

    it("deve validar CPF com formatação", () => {
      expect(validarCPF("111.444.777-35")).toBe(true);
    });
  });

  describe("validarCNPJ", () => {
    it("deve validar um CNPJ válido", () => {
      expect(validarCNPJ("11222333000181")).toBe(true);
    });

    it("deve rejeitar um CNPJ com todos os dígitos iguais", () => {
      expect(validarCNPJ("11111111111111")).toBe(false);
    });

    it("deve rejeitar um CNPJ com comprimento inválido", () => {
      expect(validarCNPJ("123456789")).toBe(false);
    });

    it("deve validar CNPJ com formatação", () => {
      expect(validarCNPJ("11.222.333/0001-81")).toBe(true);
    });
  });

  describe("validarCPFouCNPJ", () => {
    it("deve identificar um CPF válido", () => {
      const resultado = validarCPFouCNPJ("11144477735");
      expect(resultado.valido).toBe(true);
      expect(resultado.tipo).toBe("cpf");
    });

    it("deve identificar um CNPJ válido", () => {
      const resultado = validarCPFouCNPJ("11222333000181");
      expect(resultado.valido).toBe(true);
      expect(resultado.tipo).toBe("cnpj");
    });

    it("deve rejeitar um documento inválido", () => {
      const resultado = validarCPFouCNPJ("00000000000");
      expect(resultado.valido).toBe(false);
      expect(resultado.tipo).toBeNull();
    });
  });

  describe("formatarCPF", () => {
    it("deve formatar um CPF corretamente", () => {
      expect(formatarCPF("11144477735")).toBe("111.444.777-35");
    });

    it("deve remover formatação antes de reformatar", () => {
      expect(formatarCPF("111.444.777-35")).toBe("111.444.777-35");
    });
  });

  describe("formatarCNPJ", () => {
    it("deve formatar um CNPJ corretamente", () => {
      expect(formatarCNPJ("11222333000181")).toBe("11.222.333/0001-81");
    });

    it("deve remover formatação antes de reformatar", () => {
      expect(formatarCNPJ("11.222.333/0001-81")).toBe("11.222.333/0001-81");
    });
  });

  describe("formatarCEP", () => {
    it("deve formatar um CEP corretamente", () => {
      expect(formatarCEP("01310100")).toBe("01310-100");
    });

    it("deve remover formatação antes de reformatar", () => {
      expect(formatarCEP("01310-100")).toBe("01310-100");
    });
  });

  describe("formatarTelefone", () => {
    it("deve formatar um telefone com 11 dígitos", () => {
      expect(formatarTelefone("11999998888")).toBe("(11) 99999-8888");
    });

    it("deve formatar um telefone com 10 dígitos", () => {
      expect(formatarTelefone("1133334444")).toBe("(11) 3333-4444");
    });

    it("deve remover formatação antes de reformatar", () => {
      expect(formatarTelefone("(11) 99999-8888")).toBe("(11) 99999-8888");
    });
  });
});
