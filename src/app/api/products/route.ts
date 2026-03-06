export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    console.log(`[API] GET /api/products - category: ${category || "all"}`);

    let url = "https://fakestoreapi.com/products";
    if (category) {
      url = `https://fakestoreapi.com/products/category/${category}`;
    }
    console.log(`[API] Fetching from: ${url}`);

    const response = await fetch(url);
    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`[API] Failed to fetch products. Status: ${response.status}`);
      return Response.json(
        { error: "Failed to fetch products" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[API] Successfully fetched ${Array.isArray(data) ? data.length : "unknown"} products`);
    return Response.json(data);
  } catch (error) {
    console.error("[API] Error fetching products:", error);
    console.error("[API] Stack trace:", error instanceof Error ? error.stack : error);
    return Response.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
