export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[API] GET /api/users/${id}`);

    const response = await fetch(
      `https://fakestoreapi.com/users/${id}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`[API] User not found. Status: ${response.status}`);
      return Response.json(
        { error: "Usuário não encontrado" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[API] User fetched: ${data.username}`);
    return Response.json(data);
  } catch (error) {
    console.error("[API] Error fetching user:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
