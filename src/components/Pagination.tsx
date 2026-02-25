interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  total: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  total,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 space-y-4">
      {/* Botões de paginação */}
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm"
        >
          ← Anterior
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            const showPage =
              pageNumber <= 3 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

            if (!showPage && i > 0 && i < totalPages - 1) {
              if (
                (i === 3 && currentPage > 4) ||
                (i === totalPages - 2 && currentPage < totalPages - 3)
              ) {
                return (
                  <span key={i} className="px-2 py-2 text-slate-600">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-2 rounded-xl transition font-medium text-sm ${
                  currentPage === pageNumber
                    ? "bg-violet-600 text-white"
                    : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm"
        >
          Próximo →
        </button>
      </div>

      {/* Info de paginação */}
      <div className="text-center text-sm text-slate-500">
        <p>
          Mostrando <strong>{startIndex + 1}</strong>-
          <strong>{Math.min(endIndex, total)}</strong> de <strong>{total}</strong> produtos •
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </p>
      </div>
    </div>
  );
}
