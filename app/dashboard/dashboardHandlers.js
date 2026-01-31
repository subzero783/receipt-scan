import { getReceipts, deleteReceipts, updateReceipt } from './receiptsApi';

// --- FILTER HANDLERS ---
export const createFilterHandlers = (filters, setFilters, setPage, fetchReceipts) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPage(1);
    fetchReceipts(1, filters);
  };

  const clearFilters = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      merchant: '',
      category: '',
      minTotal: '',
      maxTotal: ''
    };
    setFilters(resetFilters);
    setPage(1);
    fetchReceipts(1, resetFilters);
  };

  return { handleFilterChange, applyFilters, clearFilters };
};

// --- SELECTION HANDLERS ---
export const createSelectionHandlers = (receipts, selectedReceiptIds, setSelectedReceiptIds, setIsDeleting, page, filters, fetchReceipts, setIsExporting) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = receipts.map((r) => r._id);
      setSelectedReceiptIds(allIds);
    } else {
      setSelectedReceiptIds([]);
    }
  };

  const handleSelectRow = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedReceiptIds((prev) => [...prev, id]);
    } else {
      setSelectedReceiptIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedReceiptIds.length} receipt(s)?`)) return;

    setIsDeleting(true);
    try {
      const res = await deleteReceipts(selectedReceiptIds);

      if (res.ok) {
        setSelectedReceiptIds([]);
        fetchReceipts(page, filters);
      } else {
        alert('Failed to delete receipts');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Error deleting receipts');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportSelected = async () => {
    if (selectedReceiptIds.length === 0) return;
    if (setIsExporting) setIsExporting(true);
    try {
      const response = await fetch('/api/export-receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedReceiptIds })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'receipts.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export Error:', error);
      alert('Failed to export receipts');
    } finally {
      if (setIsExporting) setIsExporting(false);
    }
  };

  return { handleSelectAll, handleSelectRow, handleDeleteSelected, handleExportSelected };
};

// --- MODAL HANDLERS ---
export const createModalHandlers = (setSelectedReceipt, setReceipts, setIsSaving) => {
  const openModal = (receipt) => {
    const formattedDate = receipt.transactionDate
      ? new Date(receipt.transactionDate).toISOString().split('T')[0]
      : '';

    setSelectedReceipt({ ...receipt, transactionDate: formattedDate });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e, selectedReceipt) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updated = await updateReceipt({
        id: selectedReceipt._id,
        merchantName: selectedReceipt.merchantName,
        totalAmount: selectedReceipt.totalAmount,
        transactionDate: selectedReceipt.transactionDate,
        category: selectedReceipt.category
      });

      if (updated && updated._id) {
        setReceipts((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );
        setSelectedReceipt(null);
      }
    } catch (error) {
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return { openModal, handleInputChange, handleSave };
};
