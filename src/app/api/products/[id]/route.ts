export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(
      `https://fakestoreapi.com/products/${id}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; DeveloveStore/1.0)",
        },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Product not found" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
