export async function GET() {
  try {
    const response = await fetch("https://fakestoreapi.com/products/categories", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DeveloveStore/1.0)",
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch categories" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
