export async function GET() {
  try {
    console.log("[API] GET /api/users");

    const response = await fetch("https://fakestoreapi.com/users", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`[API] Failed to fetch users. Status: ${response.status}`);
      return Response.json(
        { error: "Falha ao buscar usuários" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[API] Fetched ${data.length} users`);
    return Response.json(data);
  } catch (error) {
    console.error("[API] Error fetching users:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[API] POST /api/users - creating user:", body.username);

    const response = await fetch("https://fakestoreapi.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify(body),
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[API] Create user failed:", errorData);
      return Response.json(
        { error: "Falha ao criar usuário" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[API] User created successfully");
    return Response.json(data);
  } catch (error) {
    console.error("[API] Error creating user:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
