import { Product } from "@/types/product";
import { LoginCredentials, AuthResponse, User, UserProfile } from "@/types/auth";
import { 
  AbacatePayBillingRequest, 
  AbacatePayBillingResponse,
  AbacatePayPixQrCodeRequest,
  AbacatePayPixQrCodeResponse,
  AbacatePayCheckResponse
} from "@/types/payment";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/api/products`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar produto");
  }

  return response.json();
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/api/categories`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias");
  }

  return response.json();
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const response = await fetch(
    `${BASE_URL}/api/products?category=${encodeURIComponent(category)}`,
    {
      cache: "force-cache",
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos da categoria");
  }

  return response.json();
}

// ==================== AUTH ====================

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
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
  const response = await fetch(`${BASE_URL}/api/users`);

  if (!response.ok) {
    throw new Error("Erro ao buscar usuários");
  }

  return response.json();
}

export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/users/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return response.json();
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/users`, {
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

// ==================== ABACATE PAY - BILLING (via API Routes) ====================

export async function createBilling(
  billingData: AbacatePayBillingRequest
): Promise<AbacatePayBillingResponse> {
  const response = await fetch("/api/billing/create", {
    method: "POST",
    headers: {
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
  const response = await fetch("/api/billing/list", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erro ao listar cobranças");
  }

  const data = await response.json();
  return data.data || [];
}

// ==================== ABACATE PAY - PIX QRCODE (via API Routes) ====================

export async function createPixQrCode(
  pixData: AbacatePayPixQrCodeRequest
): Promise<AbacatePayPixQrCodeResponse> {
  const response = await fetch("/api/pix/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pixData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Erro ao criar QR Code PIX");
  }

  return response.json();
}

export async function simulatePixPayment(pixId: string, metadata: Record<string, unknown> = {}): Promise<AbacatePayPixQrCodeResponse> {
  const response = await fetch("/api/pix/simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: pixId, metadata }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "Erro ao simular pagamento PIX");
  }

  return response.json();
}

export async function checkPixStatus(): Promise<AbacatePayCheckResponse> {
  const response = await fetch("/api/pix/check", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erro ao verificar status do PIX");
  }

  return response.json();
}

