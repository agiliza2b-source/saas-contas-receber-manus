/**
 * Validadores e utilitários para dados de clientes
 */

export function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, "");

  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

  return true;
}

export function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = cnpj.replace(/\D/g, "");

  if (cnpjLimpo.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;

  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  let digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

export function validarCPFouCNPJ(documento: string): { valido: boolean; tipo: "cpf" | "cnpj" | null } {
  const limpo = documento.replace(/\D/g, "");

  if (limpo.length === 11 && validarCPF(documento)) {
    return { valido: true, tipo: "cpf" };
  }

  if (limpo.length === 14 && validarCNPJ(documento)) {
    return { valido: true, tipo: "cnpj" };
  }

  return { valido: false, tipo: null };
}

export function formatarCPF(cpf: string): string {
  const limpo = cpf.replace(/\D/g, "");
  return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatarCNPJ(cnpj: string): string {
  const limpo = cnpj.replace(/\D/g, "");
  return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

export function formatarCEP(cep: string): string {
  const limpo = cep.replace(/\D/g, "");
  return limpo.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function formatarTelefone(telefone: string): string {
  const limpo = telefone.replace(/\D/g, "");
  if (limpo.length === 11) {
    return limpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (limpo.length === 10) {
    return limpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return telefone;
}

/**
 * Buscar dados de CEP usando ViaCEP
 */
export async function buscarDadosCEP(cep: string): Promise<{
  endereco: string;
  cidade: string;
  estado: string;
} | null> {
  try {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return null;

    const response = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    if (!response.ok) return null;

    const dados = await response.json();

    if (dados.erro) return null;

    return {
      endereco: dados.logradouro,
      cidade: dados.localidade,
      estado: dados.uf,
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}

/**
 * Buscar dados de CNPJ usando BrasilAPI
 */
export async function buscarDadosCNPJ(cnpj: string): Promise<{
  nomeCompleto: string;
  email?: string;
  telefone?: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
} | null> {
  try {
    const limpo = cnpj.replace(/\D/g, "");
    if (limpo.length !== 14) return null;

    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${limpo}`);
    if (!response.ok) return null;

    const dados = await response.json();

    return {
      nomeCompleto: dados.nome_fantasia || dados.razao_social,
      email: dados.email,
      telefone: dados.telefone,
      endereco: `${dados.logradouro}, ${dados.numero} ${dados.complemento || ""}`.trim(),
      cep: dados.cep,
      cidade: dados.municipio,
      estado: dados.uf,
    };
  } catch (error) {
    console.error("Erro ao buscar CNPJ:", error);
    return null;
  }
}
