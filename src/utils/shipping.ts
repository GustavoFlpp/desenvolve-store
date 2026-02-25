import { Address, ViaCepResponse, ShippingOption } from "@/types/address";

/**
 * Busca endereço pelo CEP usando a API ViaCEP
 */
export async function fetchAddressByCep(cep: string): Promise<Address | null> {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data: ViaCepResponse = await response.json();

    if (data.erro) return null;

    return {
      cep: data.cep,
      logradouro: data.logradouro || "",
      numero: "",
      complemento: data.complemento || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      estado: data.uf || "",
    };
  } catch {
    return null;
  }
}

/**
 * Formata o CEP com máscara 00000-000
 */
export function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return digits;
}

// Mapeamento de estados para regiões (para cálculo do frete)
const stateToRegion: Record<string, string> = {
  // Sudeste
  SP: "sudeste", RJ: "sudeste", MG: "sudeste", ES: "sudeste",
  // Sul
  PR: "sul", SC: "sul", RS: "sul",
  // Centro-Oeste
  DF: "centro-oeste", GO: "centro-oeste", MT: "centro-oeste", MS: "centro-oeste",
  // Nordeste
  BA: "nordeste", SE: "nordeste", AL: "nordeste", PE: "nordeste",
  PB: "nordeste", RN: "nordeste", CE: "nordeste", PI: "nordeste", MA: "nordeste",
  // Norte
  AM: "norte", PA: "norte", AC: "norte", RO: "norte",
  RR: "norte", AP: "norte", TO: "norte",
};

// Tabela de preços base por região (simulada)
const regionPricing: Record<string, { pac: number; sedex: number; expressa: number; pacDays: number; sedexDays: number; expressaDays: number }> = {
  "sudeste":       { pac: 12.90, sedex: 22.90, expressa: 34.90, pacDays: 7,  sedexDays: 3,  expressaDays: 1 },
  "sul":           { pac: 15.90, sedex: 27.90, expressa: 39.90, pacDays: 8,  sedexDays: 4,  expressaDays: 2 },
  "centro-oeste":  { pac: 18.90, sedex: 32.90, expressa: 44.90, pacDays: 9,  sedexDays: 5,  expressaDays: 2 },
  "nordeste":      { pac: 22.90, sedex: 38.90, expressa: 52.90, pacDays: 12, sedexDays: 6,  expressaDays: 3 },
  "norte":         { pac: 28.90, sedex: 45.90, expressa: 62.90, pacDays: 15, sedexDays: 8,  expressaDays: 4 },
};

/**
 * Calcula opções de frete com base no estado e no valor do carrinho
 */
export function calculateShipping(estado: string, cartTotal: number): ShippingOption[] {
  const region = stateToRegion[estado.toUpperCase()] || "sudeste";
  const pricing = regionPricing[region];

  // Fator de desconto para compras acima de certo valor
  let discount = 1;
  if (cartTotal >= 500) discount = 0;        // Frete grátis acima de R$500
  else if (cartTotal >= 300) discount = 0.5;  // 50% desconto acima de R$300
  else if (cartTotal >= 150) discount = 0.75; // 25% desconto acima de R$150

  const options: ShippingOption[] = [];

  // PAC
  const pacPrice = +(pricing.pac * discount).toFixed(2);
  options.push({
    id: "pac",
    name: "PAC",
    price: pacPrice,
    estimatedDays: pricing.pacDays,
    description: pacPrice === 0 ? "Econômico • Frete Grátis" : "Econômico",
  });

  // SEDEX
  const sedexPrice = +(pricing.sedex * discount).toFixed(2);
  options.push({
    id: "sedex",
    name: "SEDEX",
    price: sedexPrice,
    estimatedDays: pricing.sedexDays,
    description: sedexPrice === 0 ? "Rápido • Frete Grátis" : "Rápido",
  });

  // Expressa
  const expressaPrice = +(pricing.expressa * discount).toFixed(2);
  options.push({
    id: "expressa",
    name: "Expressa",
    price: expressaPrice,
    estimatedDays: pricing.expressaDays,
    description: expressaPrice === 0 ? "Super rápido • Frete Grátis" : "Super rápido",
  });

  return options;
}
