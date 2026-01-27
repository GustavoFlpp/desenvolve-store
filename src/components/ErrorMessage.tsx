interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

export function ErrorMessage({ 
  message = "Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.", 
  retry 
}: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-800 mb-2">Erro ao carregar</h3>
          <p className="text-red-700 text-sm mb-4">{message}</p>
          {retry && (
            <button
              onClick={retry}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
