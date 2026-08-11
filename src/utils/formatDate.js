export function convertToDateInputFormat(dateValue) {
  if (!dateValue) return '';

  if (typeof dateValue === 'string') {
    const trimmed = dateValue.trim();

    if (trimmed.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return trimmed;
    }

    try {
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch {
      return '';
    }
  }

  return '';
}
