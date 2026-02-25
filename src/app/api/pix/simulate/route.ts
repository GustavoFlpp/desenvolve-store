import { NextRequest, NextResponse } from "next/server";

const ABACATE_PAY_URL = "https://api.abacatepay.com/v1";
const ABACATE_PAY_TOKEN = "abc_dev_XFDA4zxfcyJ0uDSkU4AJdWJR";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, metadata } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do QR Code PIX é obrigatório" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${ABACATE_PAY_URL}/pixQrCode/simulate-payment?id=${encodeURIComponent(id)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ABACATE_PAY_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ metadata: metadata || {} }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao simular pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno ao simular pagamento" },
      { status: 500 }
    );
  }
}
