import { findUserByCredentials } from "@/lib/users-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log("[API] POST /api/auth/login - tentando logar com user:", username);

    // Validação básica
    if (!username || !password) {
      console.error("[API] Username ou password inválido");
      return Response.json(
        { error: "Username e password são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar credenciais contra o banco de dados
    const user = findUserByCredentials(username, password);

    if (!user) {
      console.error("[API] Credenciais inválidas para user:", username);
      return Response.json(
        { error: "Username ou senha inválidos" },
        { status: 401 }
      );
    }

    // Gerar token
    const token = "fake-token-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    console.log("[API] Credenciais validadas, token gerado para user:", username);

    return Response.json({
      token,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("[API] Error in login:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
