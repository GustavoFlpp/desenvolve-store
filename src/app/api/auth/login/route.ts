export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[API] POST /api/auth/login - user:", body.username);

    const response = await fetch("https://fakestoreapi.com/auth/login", {
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
      console.error("[API] Login failed:", errorData);
      return Response.json(
        { error: "Falha ao fazer login" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[API] Login successful");
    return Response.json(data);
  } catch (error) {
    console.error("[API] Error in login:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
