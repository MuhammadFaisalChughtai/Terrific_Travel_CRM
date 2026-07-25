import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemName?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemName = "items",
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show, handling large page counts gracefully
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6 mt-4 bg-card rounded-b-2xl">
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          &lt; Prev
        </button>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next &gt;
        </button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
            <span className="font-semibold text-foreground">{endItem}</span> of{" "}
            <span className="font-semibold text-foreground">{totalItems}</span> {itemName}
          </p>
        </div>
        <div>
          <nav className="flex items-center gap-1.5" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 focus:outline-none ${
                currentPage === 1
                  ? "bg-transparent border-border text-muted-foreground/30 cursor-not-allowed"
                  : "bg-transparent border-border text-foreground hover:bg-secondary/40"
              }`}
            >
              &lt; Prev
            </button>

            {getPageNumbers().map((pageNum, idx) => {
              if (pageNum === "...") {
                return (
                  <span
                    key={`dots-${idx}`}
                    className="px-1.5 text-xs font-semibold text-muted-foreground/50 select-none"
                  >
                    ...
                  </span>
                );
              }

              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum as number)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 focus:outline-none min-w-[34px] text-center ${
                    isCurrent
                      ? "bg-primary border-primary text-primary-foreground font-bold shadow-sm shadow-primary/10"
                      : "bg-transparent border-border text-foreground hover:bg-secondary/40"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 focus:outline-none ${
                currentPage === totalPages
                  ? "bg-transparent border-border text-muted-foreground/30 cursor-not-allowed"
                  : "bg-transparent border-border text-foreground hover:bg-secondary/40"
              }`}
            >
              Next &gt;
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
