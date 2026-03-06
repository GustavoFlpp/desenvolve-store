export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log("[API] POST /api/auth/login - user:", username);

    // Validação básica
    if (!username || !password) {
      console.error("[API] Username ou password inválido");
      return Response.json(
        { error: "Username e password são obrigatórios" },
        { status: 400 }
      );
    }

    // Fazer login local simulado (aceita qualquer username/password)
    // Já que o Fake Store API não persiste dados
    const token = "fake-token-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    console.log("[API] Login bem-sucedido (simulado), gerando token:", token);

    return Response.json({
      token,
      username,
    });
  } catch (error) {
    console.error("[API] Error in login:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
