/**
 * Atributos de produto (tamanho, cor, armazenamento, etc.)
 * mapeados por ID da Fake Store API.
 */

export interface ProductAttribute {
  label: string;
  options: string[];
  type: "size" | "color" | "storage" | "screen" | "ring" | "bracelet" | "gauge";
}

/**
 * Atributos genéricos por categoria (fallback).
 */
const categoryAttributes: Record<string, ProductAttribute[]> = {
  "men's clothing": [
    { label: "Tamanho", options: ["P", "M", "G", "GG", "XGG"], type: "size" },
  ],
  "women's clothing": [
    { label: "Tamanho", options: ["PP", "P", "M", "G", "GG"], type: "size" },
  ],
  jewelery: [],
  electronics: [],
};

/**
 * Atributos específicos por produto (overrides).
 */
const productAttributes: Record<number, ProductAttribute[]> = {
  // Mochila Fjallraven
  1: [
    { label: "Cor", options: ["Verde Oliva", "Preto", "Azul Marinho", "Bordô"], type: "color" },
  ],
  // Camiseta Masculina Slim Fit
  2: [
    { label: "Tamanho", options: ["P", "M", "G", "GG", "XGG"], type: "size" },
    { label: "Cor", options: ["Azul", "Cinza", "Preto", "Branco", "Verde"], type: "color" },
  ],
  // Jaqueta Masculina Algodão
  3: [
    { label: "Tamanho", options: ["P", "M", "G", "GG", "XGG"], type: "size" },
    { label: "Cor", options: ["Cáqui", "Preto", "Marrom", "Verde Militar"], type: "color" },
  ],
  // Calça Masculina Slim
  4: [
    { label: "Tamanho", options: ["38", "40", "42", "44", "46", "48"], type: "size" },
    { label: "Cor", options: ["Preto", "Azul Escuro", "Cinza", "Cáqui"], type: "color" },
  ],
  // Pulseira John Hardy
  5: [
    { label: "Tamanho da Pulseira", options: ["15cm", "17cm", "19cm", "21cm"], type: "bracelet" },
  ],
  // Anel Micropavê
  6: [
    { label: "Tamanho do Anel", options: ["12", "14", "16", "18", "20", "22"], type: "ring" },
  ],
  // Anel Solitário Princess
  7: [
    { label: "Tamanho do Anel", options: ["12", "14", "16", "18", "20", "22"], type: "ring" },
  ],
  // Brinco Pierced Owl
  8: [
    { label: "Gauge", options: ["14G", "16G", "18G"], type: "gauge" },
    { label: "Cor", options: ["Ouro Rosé", "Prata", "Dourado", "Preto"], type: "color" },
  ],
  // WD 2TB HD Externo
  9: [
    { label: "Capacidade", options: ["1TB", "2TB", "4TB", "5TB"], type: "storage" },
  ],
  // SanDisk SSD 1TB
  10: [
    { label: "Capacidade", options: ["240GB", "480GB", "1TB", "2TB"], type: "storage" },
  ],
  // Silicon Power SSD 256GB
  11: [
    { label: "Capacidade", options: ["128GB", "256GB", "512GB", "1TB"], type: "storage" },
  ],
  // WD 4TB Gaming Drive
  12: [
    { label: "Capacidade", options: ["2TB", "4TB"], type: "storage" },
  ],
  // Monitor Acer 21.5"
  13: [
    { label: "Tela", options: ["21.5\"", "23.8\"", "27\""], type: "screen" },
  ],
  // Monitor Samsung 49"
  14: [
    { label: "Tela", options: ["27\"", "32\"", "49\""], type: "screen" },
  ],
  // Jaqueta Snowboard BIYLACLESEN
  15: [
    { label: "Tamanho", options: ["PP", "P", "M", "G", "GG"], type: "size" },
    { label: "Cor", options: ["Preto", "Azul Marinho", "Vermelho", "Verde"], type: "color" },
  ],
  // Jaqueta Couro Sintético
  16: [
    { label: "Tamanho", options: ["PP", "P", "M", "G", "GG"], type: "size" },
    { label: "Cor", options: ["Preto", "Marrom", "Bordô"], type: "color" },
  ],
  // Jaqueta Corta-Vento
  17: [
    { label: "Tamanho", options: ["PP", "P", "M", "G", "GG"], type: "size" },
    { label: "Cor", options: ["Azul", "Rosa", "Preto", "Verde Claro"], type: "color" },
  ],
  // Blusa Gola Canoa MBJ
  18: [
    { label: "Tamanho", options: ["PP", "P", "M", "G", "GG"], type: "size" },
    { label: "Cor", options: ["Preto", "Branco", "Borgonha", "Azul Royal", "Coral"], type: "color" },
  ],
  // Camiseta Esportiva Opna
  19: [
    { label: "Tamanho", options: ["PP", "P", "M", "G", "GG", "XGG"], type: "size" },
    { label: "Cor", options: ["Rosa", "Preto", "Cinza", "Azul", "Vermelho"], type: "color" },
  ],
  // Camiseta Algodão DANVOUY
  20: [
    { label: "Tamanho", options: ["PP", "P", "M", "G", "GG"], type: "size" },
    { label: "Cor", options: ["Preto", "Branco", "Cinza", "Rosa"], type: "color" },
  ],
};

/**
 * Retorna os atributos selecionáveis de um produto.
 * Prioriza atributos específicos, depois fallback por categoria.
 */
export function getProductAttributes(
  id: number,
  category: string
): ProductAttribute[] {
  if (productAttributes[id]) {
    return productAttributes[id];
  }
  return categoryAttributes[category.toLowerCase()] ?? [];
}
