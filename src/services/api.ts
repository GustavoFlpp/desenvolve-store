import { Product } from "@/types/product";
import { LoginCredentials, AuthResponse, User, UserProfile } from "@/types/auth";
import { 
  AbacatePayBillingRequest, 
  AbacatePayBillingResponse,
  AbacatePayPixQrCodeRequest,
  AbacatePayPixQrCodeResponse,
  AbacatePayCheckResponse
} from "@/types/payment";

const BASE_URL = "https://fakestoreapi.com";
const ABACATE_PAY_URL = "https://api.abacatepay.com/v1";
const ABACATE_PAY_TOKEN = "abc_dev_XFDA4zxfcyJ0uDSkU4AJdWJR";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produto");
  }

  return response.json();
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias");
  }

  return response.json();
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products/category/${category}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos da categoria");
  }

  return response.json();
}

// ==================== AUTH ====================

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer login");
  }

  return response.json();
}

// ==================== USERS ====================

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`);

  if (!response.ok) {
    throw new Error("Erro ao buscar usuários");
  }

  return response.json();
}

export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return response.json();
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar usuário");
  }

  return response.json();
}

export async function updateUser(id: number, user: Partial<User>): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar usuário");
  }

  return response.json();
}

export async function deleteUser(id: number): Promise<unknown> {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar usuário");
  }

  return response.json();
}

// ==================== ABACATE PAY - BILLING ====================

export async function createBilling(
  billingData: AbacatePayBillingRequest
): Promise<AbacatePayBillingResponse> {
  const response = await fetch(`${ABACATE_PAY_URL}/billing/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ABACATE_PAY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(billingData),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar cobrança");
  }

  return response.json();
}

export async function listBillings(): Promise<AbacatePayBillingResponse[]> {
  const response = await fetch(`${ABACATE_PAY_URL}/billing/list`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ABACATE_PAY_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao listar cobranças");
  }

  const data = await response.json();
  return data.data || [];
}

// ==================== ABACATE PAY - PIX QRCODE ====================

export async function createPixQrCode(
  pixData: AbacatePayPixQrCodeRequest
): Promise<AbacatePayPixQrCodeResponse> {
  const response = await fetch(`${ABACATE_PAY_URL}/pixQrCode/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ABACATE_PAY_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pixData),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar QR Code PIX");
  }

  return response.json();
}

export async function simulatePixPayment(metadata: Record<string, unknown> = {}): Promise<AbacatePayPixQrCodeResponse> {
  const response = await fetch(
    `${ABACATE_PAY_URL}/pixQrCode/simulate-payment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ABACATE_PAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ metadata }),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao simular pagamento PIX");
  }

  return response.json();
}

export async function checkPixStatus(): Promise<AbacatePayCheckResponse> {
  const response = await fetch(`${ABACATE_PAY_URL}/pixQrCode/check`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ABACATE_PAY_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao verificar status do PIX");
  }

  return response.json();
}

