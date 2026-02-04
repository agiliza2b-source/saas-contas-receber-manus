import { useState, useCallback } from "react";

export type MaskType = "cpf" | "cnpj" | "cep" | "telefone" | "moeda" | "percentual" | "data" | "hora";

interface MaskConfig {
  type: MaskType;
  maxLength?: number;
}

export function useMask(config: MaskConfig) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const applyMask = useCallback(
    (inputValue: string): string => {
      const cleaned = inputValue.replace(/\D/g, "");

      switch (config.type) {
        case "cpf":
          if (cleaned.length > 11) return value;
          return cleaned
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        case "cnpj":
          if (cleaned.length > 14) return value;
          return cleaned
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");

        case "cep":
          if (cleaned.length > 8) return value;
          return cleaned.replace(/(\d{5})(\d{1,3})$/, "$1-$2");

        case "telefone":
          if (cleaned.length > 11) return value;
          if (cleaned.length <= 10) {
            return cleaned
              .replace(/(\d{2})(\d)/, "($1) $2")
              .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
          }
          return cleaned
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

        case "moeda":
          const numericValue = (inputValue.match(/\d/g) || []).join("");
          const integerPart = numericValue.slice(0, -2) || "0";
          const decimalPart = numericValue.slice(-2).padStart(2, "0");
          const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          return `${formatted},${decimalPart}`;

        case "percentual":
          if (cleaned.length > 3) return value;
          return cleaned;

        case "data":
          if (cleaned.length > 8) return value;
          return cleaned
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{2})(\d{4})$/, "$1/$2");

        case "hora":
          if (cleaned.length > 4) return value;
          return cleaned.replace(/(\d{2})(\d{1,2})$/, "$1:$2");

        default:
          return inputValue;
      }
    },
    [config.type, value]
  );

  const validate = useCallback(
    (inputValue: string): boolean => {
      const cleaned = inputValue.replace(/\D/g, "");

      switch (config.type) {
        case "cpf":
          if (cleaned.length !== 11) {
            setError("CPF deve ter 11 dígitos");
            return false;
          }
          if (/^(\d)\1{10}$/.test(cleaned)) {
            setError("CPF inválido");
            return false;
          }
          setError(null);
          return true;

        case "cnpj":
          if (cleaned.length !== 14) {
            setError("CNPJ deve ter 14 dígitos");
            return false;
          }
          if (/^(\d)\1{13}$/.test(cleaned)) {
            setError("CNPJ inválido");
            return false;
          }
          setError(null);
          return true;

        case "cep":
          if (cleaned.length !== 8) {
            setError("CEP deve ter 8 dígitos");
            return false;
          }
          setError(null);
          return true;

        case "telefone":
          if (cleaned.length < 10 || cleaned.length > 11) {
            setError("Telefone deve ter 10 ou 11 dígitos");
            return false;
          }
          setError(null);
          return true;

        case "moeda":
          setError(null);
          return true;

        case "percentual":
          if (parseInt(cleaned) > 100) {
            setError("Percentual não pode ser maior que 100%");
            return false;
          }
          setError(null);
          return true;

        case "data":
          if (cleaned.length !== 8) {
            setError("Data deve ter 8 dígitos");
            return false;
          }
          const day = parseInt(cleaned.substring(0, 2));
          const month = parseInt(cleaned.substring(2, 4));
          const year = parseInt(cleaned.substring(4, 8));

          if (month < 1 || month > 12) {
            setError("Mês inválido");
            return false;
          }
          if (day < 1 || day > 31) {
            setError("Dia inválido");
            return false;
          }
          setError(null);
          return true;

        case "hora":
          if (cleaned.length !== 4) {
            setError("Hora deve ter 4 dígitos");
            return false;
          }
          const hour = parseInt(cleaned.substring(0, 2));
          const minute = parseInt(cleaned.substring(2, 4));

          if (hour < 0 || hour > 23) {
            setError("Hora inválida");
            return false;
          }
          if (minute < 0 || minute > 59) {
            setError("Minuto inválido");
            return false;
          }
          setError(null);
          return true;

        default:
          return true;
      }
    },
    [config.type]
  );

  const handleChange = useCallback(
    (inputValue: string) => {
      const masked = applyMask(inputValue);
      setValue(masked);
      validate(masked);
    },
    [applyMask, validate]
  );

  return {
    value,
    setValue,
    handleChange,
    error,
    setError,
    validate: () => validate(value),
    isValid: error === null && value.length > 0,
  };
}
