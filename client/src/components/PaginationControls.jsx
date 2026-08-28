export default function PaginationControls({
  currentPage = 1,
  totalPages = 1,
  totalEmployees = 0,
  hasNextPage = false,
  hasPreviousPage = false,
  onPageChange,
}) {
  if (!totalEmployees || !totalPages) {
    return null
  }

  return (
    <nav className="pagination" aria-label="Employee list pagination">
      <button
        type="button"
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        aria-label="Previous page"
      >
         ← Previous
      </button>
      <span className="pagination-status">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  )
}