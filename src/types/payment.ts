export interface AbacatePayProduct {
  externalId: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface AbacatePayCustomer {
  name: string;
  cellphone: string;
  email: string;
  taxId: string;
}

export interface AbacatePayBillingRequest {
  frequency: "ONE_TIME" | "MONTHLY" | "YEARLY";
  methods: string[];
  products: AbacatePayProduct[];
  returnUrl: string;
  completionUrl: string;
  customerId?: string;
  customer: AbacatePayCustomer;
  allowCoupons?: boolean;
  coupons?: string[];
  externalId?: string;
  metadata?: Record<string, unknown>;
}

export interface AbacatePayProduct {
  id?: string;
  externalId: string;
  quantity: number;
}

export interface AbacatePayBillingResponse {
  data: {
    id: string;
    url: string;
    status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    devMode: boolean;
    methods: string[];
    products: AbacatePayProduct[];
    frequency: string;
    amount: number;
    nextBilling: string | null;
    customer: {
      id: string;
      metadata: AbacatePayCustomer;
    };
    allowCoupons: boolean;
    coupons: string[];
  };
  error?: unknown;
}

export interface AbacatePayPixQrCodeRequest {
  amount: number;
  expiresIn: number;
  description: string;
  customer: AbacatePayCustomer;
  metadata?: Record<string, unknown>;
}

export interface AbacatePayPixQrCodeResponse {
  data: {
    id: string;
    amount: number;
    status: "PENDING" | "COMPLETED" | "EXPIRED";
    devMode: boolean;
    brCode: string;
    brCodeBase64: string;
    platformFee: number;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
  };
  error?: unknown;
}

export interface AbacatePayCheckResponse {
  data: {
    status: "PENDING" | "COMPLETED" | "EXPIRED";
    expiresAt: string;
  };
  error?: unknown;
}
