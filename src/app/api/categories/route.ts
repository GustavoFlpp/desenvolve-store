export async function GET() {
  try {
    console.log("[API] GET /api/categories");
    const response = await fetch(
      "https://fakestoreapi.com/products/categories"
    );

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`[API] Failed to fetch categories. Status: ${response.status}`);
      return Response.json(
        { error: "Failed to fetch categories" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[API] Successfully fetched ${Array.isArray(data) ? data.length : "unknown"} categories`);
    return Response.json(data);
  } catch (error) {
    console.error("[API] Error fetching categories:", error);
    console.error("[API] Stack trace:", error instanceof Error ? error.stack : error);
    return Response.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
