"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Address } from "@/types/address";
import { fetchAddressByCep, maskCep } from "@/utils/shipping";

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser, updateAvatar, avatar, logout, address, updateAddress, clearAddress } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [password, setPassword] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressForm, setAddressForm] = useState<Address>({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
    if (address) {
      setAddressForm(address);
    }
  }, [isAuthenticated, user, router, address]);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = () => {
    setError(null);

    if (!formData.username.trim()) {
      setError("Nome de usuário é obrigatório");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("E-mail válido é obrigatório");
      return;
    }

    updateUser({
      username: formData.username,
      email: formData.email,
    });

    setEditingInfo(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePassword = () => {
    setError(null);

    if (!password.current) {
      setError("Senha atual é obrigatória");
      return;
    }
    if (password.newPass.length < 6) {
      setError("Nova senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (password.newPass !== password.confirm) {
      setError("As senhas não conferem");
      return;
    }

    // Fake Store API doesn't truly validate passwords, just simulate success
    setEditingPassword(false);
    setPassword({ current: "", newPass: "", confirm: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = () => {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      logout();
      router.push("/");
    }
  };

  const handleCepChange = async (value: string) => {
    const masked = maskCep(value);
    setAddressForm((prev) => ({ ...prev, cep: masked }));

    const clean = masked.replace(/\D/g, "");
    if (clean.length === 8) {
      setAddressLoading(true);
      setError(null);
      const result = await fetchAddressByCep(clean);
      if (result) {
        setAddressForm((prev) => ({
          ...prev,
          cep: result.cep,
          logradouro: result.logradouro,
          bairro: result.bairro,
          cidade: result.cidade,
          estado: result.estado,
          complemento: result.complemento || prev.complemento,
        }));
      } else {
        setError("CEP não encontrado. Verifique e tente novamente.");
      }
      setAddressLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = () => {
    setError(null);

    if (!addressForm.cep || addressForm.cep.replace(/\D/g, "").length !== 8) {
      setError("CEP válido é obrigatório");
      return;
    }
    if (!addressForm.logradouro.trim()) {
      setError("Logradouro é obrigatório");
      return;
    }
    if (!addressForm.numero.trim()) {
      setError("Número é obrigatório");
      return;
    }
    if (!addressForm.bairro.trim()) {
      setError("Bairro é obrigatório");
      return;
    }
    if (!addressForm.cidade.trim()) {
      setError("Cidade é obrigatória");
      return;
    }
    if (!addressForm.estado.trim()) {
      setError("Estado é obrigatório");
      return;
    }

    updateAddress(addressForm);
    setEditingAddress(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemoveAddress = () => {
    clearAddress();
    setAddressForm({
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    });
    setEditingAddress(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      updateAvatar(base64);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] relative overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products" className="text-sm text-slate-500 hover:text-violet-400 transition mb-4 inline-block cursor-pointer">
            ← Voltar para a loja
          </Link>
          <h1 className="text-3xl font-bold text-slate-50">Meu Perfil</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie suas informações pessoais</p>
        </div>

        {/* Success toast */}
        {saved && (
          <div className="mb-6 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium animate-[fadeIn_0.3s_ease-out]">
            ✓ Alterações salvas com sucesso!
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 bg-rose-600/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Avatar + Name card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6 backdrop-blur-sm flex items-center gap-5">
          <div className="relative group">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-violet-500/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-violet-600/20 border-2 border-violet-500/30 flex items-center justify-center text-2xl font-bold text-violet-400">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Upload overlay */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{user.username}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-violet-400 hover:text-violet-300 transition mt-1"
            >
              Alterar foto
            </button>
          </div>
        </div>

        {/* Personal info section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-slate-200">Informações pessoais</h3>
            {!editingInfo && (
              <button
                onClick={() => { setEditingInfo(true); setError(null); }}
                className="text-sm text-violet-400 hover:text-violet-300 transition font-medium"
              >
                Editar
              </button>
            )}
          </div>

          {editingInfo ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Nome de usuário</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInfoChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInfoChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveInfo}
                  className="bg-violet-600 text-white px-5 py-2.5 rounded-xl hover:bg-violet-500 transition text-sm font-semibold shadow-lg shadow-violet-600/20"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setEditingInfo(false);
                    setError(null);
                    if (user) setFormData({ username: user.username, email: user.email });
                  }}
                  className="border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl hover:bg-slate-800 transition text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Nome de usuário</span>
                <span className="text-sm text-slate-200">{user.username}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block mb-1">E-mail</span>
                <span className="text-sm text-slate-200">{user.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* Password section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-slate-200">Alterar senha</h3>
            {!editingPassword && (
              <button
                onClick={() => { setEditingPassword(true); setError(null); }}
                className="text-sm text-violet-400 hover:text-violet-300 transition font-medium"
              >
                Alterar
              </button>
            )}
          </div>

          {editingPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Senha atual</label>
                <input
                  type="password"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Nova senha</label>
                <input
                  type="password"
                  name="newPass"
                  value={password.newPass}
                  onChange={handlePasswordChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Confirmar nova senha</label>
                <input
                  type="password"
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                  placeholder="Repita a nova senha"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSavePassword}
                  className="bg-violet-600 text-white px-5 py-2.5 rounded-xl hover:bg-violet-500 transition text-sm font-semibold shadow-lg shadow-violet-600/20"
                >
                  Salvar senha
                </button>
                <button
                  onClick={() => {
                    setEditingPassword(false);
                    setError(null);
                    setPassword({ current: "", newPass: "", confirm: "" });
                  }}
                  className="border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl hover:bg-slate-800 transition text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">••••••••</p>
          )}
        </div>

        {/* Address section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-slate-200">Endereço de entrega</h3>
            {!editingAddress && (
              <button
                onClick={() => { setEditingAddress(true); setError(null); }}
                className="text-sm text-violet-400 hover:text-violet-300 transition font-medium"
              >
                {address ? "Editar" : "Adicionar"}
              </button>
            )}
          </div>

          {editingAddress ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">CEP</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cep"
                    value={addressForm.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="00000-000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                  />
                  {addressLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-violet-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">Digite o CEP para preencher automaticamente</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm text-slate-400 mb-1.5">Logradouro</label>
                  <input
                    type="text"
                    name="logradouro"
                    value={addressForm.logradouro}
                    onChange={handleAddressChange}
                    placeholder="Rua, Avenida..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={addressForm.numero}
                    onChange={handleAddressChange}
                    placeholder="123"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  value={addressForm.complemento}
                  onChange={handleAddressChange}
                  placeholder="Apto, bloco, sala... (opcional)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  value={addressForm.bairro}
                  onChange={handleAddressChange}
                  placeholder="Bairro"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm text-slate-400 mb-1.5">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={addressForm.cidade}
                    onChange={handleAddressChange}
                    placeholder="Cidade"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={addressForm.estado}
                    onChange={handleAddressChange}
                    placeholder="UF"
                    maxLength={2}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition placeholder-slate-600 uppercase"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveAddress}
                  className="bg-violet-600 text-white px-5 py-2.5 rounded-xl hover:bg-violet-500 transition text-sm font-semibold shadow-lg shadow-violet-600/20"
                >
                  Salvar endereço
                </button>
                <button
                  onClick={() => {
                    setEditingAddress(false);
                    setError(null);
                    if (address) setAddressForm(address);
                  }}
                  className="border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl hover:bg-slate-800 transition text-sm font-medium"
                >
                  Cancelar
                </button>
                {address && (
                  <button
                    onClick={handleRemoveAddress}
                    className="border border-rose-500/30 text-rose-400 px-5 py-2.5 rounded-xl hover:bg-rose-500/10 transition text-sm font-medium ml-auto"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          ) : address ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-200">
                {address.logradouro}, {address.numero}
                {address.complemento ? ` - ${address.complemento}` : ""}
              </p>
              <p className="text-sm text-slate-400">
                {address.bairro} — {address.cidade}/{address.estado}
              </p>
              <p className="text-sm text-slate-500">CEP: {address.cep}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Nenhum endereço cadastrado. Adicione um endereço para calcular frete.
            </p>
          )}
        </div>

        {/* Danger zone */}
        <div className="bg-slate-900/80 border border-rose-500/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-base font-semibold text-rose-400 mb-2">Zona de perigo</h3>
          <p className="text-sm text-slate-500 mb-4">
            Ao excluir sua conta, todos os dados serão perdidos permanentemente.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="border border-rose-500/30 text-rose-400 px-5 py-2.5 rounded-xl hover:bg-rose-500/10 transition text-sm font-medium"
          >
            Excluir conta
          </button>
        </div>
      </main>
    </div>
  );
}
