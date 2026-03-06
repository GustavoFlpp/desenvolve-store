import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[API] Fetching product with ID: ${id}`);

    const url = `https://fakestoreapi.com/products/${id}`;
    console.log(`[API] URL: ${url}`);

    const response = await fetch(url);
    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`[API] Failed to fetch product. Status: ${response.status}`);
      return Response.json(
        { error: "Product not found" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[API] Successfully fetched product: ${JSON.stringify(data).substring(0, 100)}`);
    return Response.json(data);
  } catch (error) {
    console.error("[API] Error fetching product:", error);
    console.error("[API] Stack trace:", error instanceof Error ? error.stack : error);

    return Response.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}