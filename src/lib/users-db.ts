// Simple in-memory user database
interface StoredUser {
  id: number;
  username: string;
  email: string;
  password: string;
}

let users: StoredUser[] = [];
let nextId = 1;

export function createUserInDb(
  username: string,
  email: string,
  password: string
): StoredUser {
  // Verificar se username já existe
  if (users.some((u) => u.username === username)) {
    throw new Error("Username já existe");
  }

  // Verificar se email já existe
  if (users.some((u) => u.email === email)) {
    throw new Error("Email já está em uso");
  }

  const user: StoredUser = {
    id: nextId++,
    username,
    email,
    password,
  };

  users.push(user);
  console.log("[DB] Usuário criado:", { id: user.id, username, email });
  console.log("[DB] Total de usuários no banco:", users.length);

  return user;
}

export function findUserByCredentials(
  username: string,
  password: string
): StoredUser | undefined {
  console.log("[DB] Procurando usuário:", username);
  console.log("[DB] Usuários no banco:", users.map((u) => u.username));

  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    console.log("[DB] Usuário encontrado e senha válida");
  } else {
    console.log("[DB] Usuário não encontrado ou senha inválida");
  }

  return user;
}

export function getUserByUsername(username: string): StoredUser | undefined {
  return users.find((u) => u.username === username);
}
