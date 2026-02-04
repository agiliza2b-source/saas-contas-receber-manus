/**
 * Validadores avançados para dados do SaaS
 */

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validarMoeda(valor: string): boolean {
  const regex = /^\d+([.,]\d{2})?$/;
  return regex.test(valor.replace(/\./g, ""));
}

export function validarPercentual(valor: number): boolean {
  return valor >= 0 && valor <= 100;
}

export function validarData(data: string): boolean {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = data.match(regex);

  if (!match) return false;

  const day = parseInt(match[1]);
  const month = parseInt(match[2]);
  const year = parseInt(match[3]);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function validarHora(hora: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(hora);
}

export function validarNomeCompleto(nome: string): boolean {
  const trimmed = nome.trim();
  const partes = trimmed.split(/\s+/);
  return partes.length >= 2 && partes.every((parte) => parte.length >= 2);
}

export function validarSenha(senha: string): {
  valida: boolean;
  erros: string[];
} {
  const erros: string[] = [];

  if (senha.length < 8) {
    erros.push("Senha deve ter pelo menos 8 caracteres");
  }

  if (!/[A-Z]/.test(senha)) {
    erros.push("Senha deve conter pelo menos uma letra maiúscula");
  }

  if (!/[a-z]/.test(senha)) {
    erros.push("Senha deve conter pelo menos uma letra minúscula");
  }

  if (!/\d/.test(senha)) {
    erros.push("Senha deve conter pelo menos um número");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
    erros.push("Senha deve conter pelo menos um caractere especial");
  }

  return {
    valida: erros.length === 0,
    erros,
  };
}

export function validarNumeroConta(numero: string): boolean {
  const cleaned = numero.replace(/\D/g, "");
  return cleaned.length >= 8 && cleaned.length <= 20;
}

export function validarAgencia(agencia: string): boolean {
  const cleaned = agencia.replace(/\D/g, "");
  return cleaned.length >= 4 && cleaned.length <= 5;
}

export function validarBanco(codigo: string): boolean {
  const cleaned = codigo.replace(/\D/g, "");
  return cleaned.length === 3;
}

export function validarChavePix(chave: string, tipo: "cpf" | "cnpj" | "email" | "telefone" | "aleatoria"): boolean {
  switch (tipo) {
    case "cpf":
      return /^\d{11}$/.test(chave.replace(/\D/g, ""));
    case "cnpj":
      return /^\d{14}$/.test(chave.replace(/\D/g, ""));
    case "email":
      return validarEmail(chave);
    case "telefone":
      const cleaned = chave.replace(/\D/g, "");
      return cleaned.length === 11;
    case "aleatoria":
      return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(chave);
    default:
      return false;
  }
}

export function validarURLBoleto(url: string): boolean {
  return validarURL(url) && (url.includes("boleto") || url.includes("payment"));
}

export function validarCodigoBarras(codigo: string): boolean {
  const cleaned = codigo.replace(/\D/g, "");
  return cleaned.length === 47;
}

export function normalizarMoeda(valor: string): number {
  const cleaned = valor.replace(/[^\d,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export function formatarMoedaBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function calcularDigitoVerificador(numero: string): string {
  const cleaned = numero.replace(/\D/g, "");
  let soma = 0;
  let multiplicador = 2;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    soma += parseInt(cleaned[i]) * multiplicador;
    multiplicador++;
    if (multiplicador > 9) multiplicador = 2;
  }

  const resto = soma % 11;
  const digito = resto === 0 || resto === 1 ? 0 : 11 - resto;

  return digito.toString();
}

export function validarComprimento(valor: string, minimo: number, maximo: number): boolean {
  return valor.length >= minimo && valor.length <= maximo;
}

export function sanitizarEntrada(entrada: string): string {
  return entrada
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}
