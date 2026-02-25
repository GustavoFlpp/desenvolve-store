import { NextResponse } from "next/server";

const ABACATE_PAY_URL = "https://api.abacatepay.com/v1";
const ABACATE_PAY_TOKEN = "abc_dev_XFDA4zxfcyJ0uDSkU4AJdWJR";

export async function GET() {
  try {
    const response = await fetch(`${ABACATE_PAY_URL}/billing/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ABACATE_PAY_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao listar billings:", error);
    return NextResponse.json(
      { error: "Erro interno ao listar cobranças" },
      { status: 500 }
    );
  }
}
