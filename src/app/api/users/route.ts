import { createUserInDb } from "@/lib/users-db";

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
    const { username, email, password } = body;

    console.log("[API] POST /api/users - creating user:", username);

    // Validar dados
    if (!username || !email || !password) {
      console.error("[API] Username, email ou password inválido");
      return Response.json(
        { error: "Username, email e password são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar usuário no banco de dados
    const newUser = createUserInDb(username, email, password);

    console.log("[API] User created successfully:", { id: newUser.id, username });
    return Response.json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao criar usuário";
    console.error("[API] Error creating user:", errorMessage);
    
    // Retornar erro apropriado
    if (errorMessage.includes("já existe") || errorMessage.includes("em uso")) {
      return Response.json(
        { error: errorMessage },
        { status: 409 } // Conflict
      );
    }

    return Response.json(
      { error: "Erro interno do servidor", details: errorMessage },
      { status: 500 }
    );
  }
}
