import { getReceipts, deleteReceipts, updateReceipt, createReceipt } from './receiptsApi';

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

  const handleExportSelected = async (exportType = 'zip') => {
    if (selectedReceiptIds.length === 0) return;
    if (setIsExporting) setIsExporting(true);
    try {
      const response = await fetch('/api/export-receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedReceiptIds, type: exportType })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportType === 'csv' ? 'receipts.csv' : 'receipts.zip';
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

  const handleEmailSelected = async (message = '', toEmail = '', includeZip = false, includeCsv = false) => {
    if (selectedReceiptIds.length === 0) return;
    if (setIsExporting) setIsExporting(true); // Reusing state for loading
    try {
      const response = await fetch('/api/email-receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedReceiptIds, message, toEmail, includeZip, includeCsv })
      });

      if (!response.ok) throw new Error('Email failed');

      alert('Email sent successfully!');
      setSelectedReceiptIds([]); // Optional: clear selection after action
    } catch (error) {
      console.error('Email Error:', error);
      alert('Failed to send email');
    } finally {
      if (setIsExporting) setIsExporting(false);
    }
  };

  return { handleSelectAll, handleSelectRow, handleDeleteSelected, handleExportSelected, handleEmailSelected };
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

  const handleSave = async (e, selectedReceipt, imageFile = null) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = selectedReceipt.imageUrl;

      // Handle Image Upload if file provided
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        });

        if (!uploadRes.ok) throw new Error('Failed to upload image');

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;
      }

      if (selectedReceipt._id) {
        // UPDATE EXISTING
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
      } else {
        // CREATE NEW (Manual Entry)
        const newReceipt = await createReceipt({
          merchantName: selectedReceipt.merchantName,
          totalAmount: selectedReceipt.totalAmount,
          transactionDate: selectedReceipt.transactionDate,
          category: selectedReceipt.category,
          imageUrl: finalImageUrl || null
        });

        if (newReceipt && newReceipt._id) {
          setReceipts((prev) => [newReceipt, ...prev]);
          setSelectedReceipt(null);
        }
      }
    } catch (error) {
      console.error('Save Error:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return { openModal, handleInputChange, handleSave };
};
