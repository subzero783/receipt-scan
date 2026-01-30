import { useState, useCallback } from 'react';

export const useReceiptUpload = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedData, setScannedData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  // --- File Management ---
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  }, []);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  // --- Handlers ---

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const newScannedResults = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/scan', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          console.error(`Failed to upload ${file.name}`);
          continue;
        }

        const result = await response.json();

        if (result.data) {
          newScannedResults.push({
            fileName: file.name,
            ...result.data
          });
        }
      }

      setScannedData((prev) => [...prev, ...newScannedResults]);

      if (newScannedResults.length > 0) {
        const lastItem = newScannedResults[newScannedResults.length - 1];
        alert(`Scan Complete! Found ${newScannedResults.length} items.`);
      }

      setFiles([]);
    } catch (error) {
      console.error(error);
      alert('Something went wrong uploading.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadChanges = async (e) => {
    if (e) e.preventDefault(); // Prevent form submission reload
    setIsSaving(true);
    try {
      const receiptsToSave = scannedData.map((receipt, index) => ({
        ...receipt,
        ...editedData[index]
      }));

      const response = await fetch('/api/scan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipts: receiptsToSave }),
      });

      if (response.ok) {
        alert('All receipts saved successfully!');
        setScannedData(receiptsToSave);
        setEditedData({});
      } else {
        alert('Failed to save receipts.');
      }
    } catch (error) {
      console.error('Error saving receipts:', error);
      alert('Error saving receipts.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAllReceipts = async () => {
    if (!window.confirm('Are you sure you want to delete all receipts?')) return;

    setIsDeleting(true);
    try {
      const receiptIds = scannedData.map(receipt => receipt.id);
      const response = await fetch('/api/scan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: receiptIds }),
      });

      if (response.ok) {
        alert('All receipts deleted!');
        setScannedData([]);
        setEditedData({});
      } else {
        alert('Failed to delete receipts.');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting receipts.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveReceipt = async (index) => {
    setIsSaving(true);
    try {
      const receiptToSave = {
        ...scannedData[index],
        ...editedData[index]
      };

      const response = await fetch('/api/scan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipts: [receiptToSave] }),
      });

      if (response.ok) {
        alert('Receipt saved!');
        const updatedScannedData = [...scannedData];
        updatedScannedData[index] = receiptToSave;
        setScannedData(updatedScannedData);
        const updatedEditedData = { ...editedData };
        delete updatedEditedData[index];
        setEditedData(updatedEditedData);
      } else {
        alert('Failed to save receipt.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving receipt.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReceipt = async (index) => {
    if (!window.confirm('Delete this receipt?')) return;

    setIsDeleting(true);
    try {
      const receiptId = scannedData[index].id;
      const response = await fetch('/api/scan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [receiptId] }),
      });

      if (response.ok) {
        alert('Receipt deleted!');
        const updatedScannedData = scannedData.filter((_, i) => i !== index);
        setScannedData(updatedScannedData);

        const updatedEditedData = { ...editedData };
        delete updatedEditedData[index];
        setEditedData(updatedEditedData);
      } else {
        alert('Failed to delete receipt.');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting receipt.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  return {
    files,
    isUploading,
    scannedData,
    editedData,
    isSaving,
    isDeleting,
    onDrop,
    removeFile,
    handleUpload,
    handleUploadChanges,
    handleDeleteAllReceipts,
    handleSaveReceipt,
    handleDeleteReceipt,
    handleInputChange
  };
};