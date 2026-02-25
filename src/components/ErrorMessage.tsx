interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

export function ErrorMessage({ 
  message = "Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.", 
  retry 
}: ErrorMessageProps) {
  return (
    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-rose-400 mb-2">Erro ao carregar</h3>
          <p className="text-rose-300/80 text-sm mb-4">{message}</p>
          {retry && (
            <button
              onClick={retry}
              className="bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-500 transition text-sm font-medium"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
