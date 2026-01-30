export function buildQueryParams(currentFilters = {}, page = 1, limit = 8) {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...currentFilters,
  });

  // Remove empty keys
  for (const [key, value] of Array.from(queryParams.entries())) {
    if (!value) queryParams.delete(key);
  }

  return queryParams.toString();
}

export async function getReceipts(pageNum = 1, currentFilters = {}) {
  const qs = buildQueryParams(currentFilters, pageNum);
  const res = await fetch(`/api/receipts?${qs}`);
  if (!res.ok) throw new Error('Failed to fetch receipts');
  return res.json();
}

export async function deleteReceipts(ids = []) {
  return fetch('/api/receipts', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
}

export async function updateReceipt(payload = {}) {
  const res = await fetch('/api/receipts', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to update receipt');
  return res.json();
}
