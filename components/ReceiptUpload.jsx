'use client'; // This must be a Client Component

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFileInvoiceDollar, FaTimes, FaSpinner } from 'react-icons/fa';

const ReceiptUpload = ({data}) => {
  const {top_text, recent_scans} = data;
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedData, setScannedData] = useState([]); // Store AI results here
  const [editedData, setEditedData] = useState({}); // Track edits per receipt
  const [isSaving, setIsSaving] = useState(false);

  console.log('scannedData', scannedData);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    // Add new files to the state (limiting to 5 for now)
    setFiles((prev) => [
      ...prev,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 5,
  });

  // Remove file from list
  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  // Upload Function
  const handleUpload = async () => {

    // Test OpenAI and Cloudinary connection
    if (files.length === 0) return;
    
    setIsUploading(true);
    const newScannedResults = [];

    try {
      // Loop through files and upload one by one (or use Promise.all for parallel)
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
        console.log("AI Data:", result.data);
        
        // Add successful scan to results
        if (result.data) {
            newScannedResults.push({
                fileName: file.name,
                ...result.data
            });
        }
      }

      // Update state with new results
      setScannedData((prev) => [...prev, ...newScannedResults]);
      
      // Optional: Alert summary
      if (newScannedResults.length > 0) {
          const lastItem = newScannedResults[newScannedResults.length - 1];
          alert(`Scan Complete! Found ${newScannedResults.length} items.\nLast Item: ${lastItem.merchant_name} - $${lastItem.total_amount}`);
      }

      console.log("newScannedResults", newScannedResults);

      setFiles([]); // Clear queue after processing

    } catch (error) {
      console.error(error);
      alert('Something went wrong uploading.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadChanges = async () => {
    setIsSaving(true);
    try {
      // Save all receipts with edits
      const receiptsToSave = scannedData.map((receipt, index) => ({
        ...receipt,
        ...editedData[index]
      }));

      const response = await fetch('/api/scan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
    if (!window.confirm('Are you sure you want to delete all receipts? This action cannot be undone.')) {
      return;
    }

    setIsSaving(true);
    try {
      const receiptIds = scannedData.map(receipt => receipt.id);

      const response = await fetch('/api/scan', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: receiptIds }),
      });

      if (response.ok) {
        alert('All receipts deleted successfully!');
        setScannedData([]);
        setEditedData({});
      } else {
        alert('Failed to delete receipts.');
      }
    } catch (error) {
      console.error('Error deleting receipts:', error);
      alert('Error deleting receipts.');
    } finally {
      setIsSaving(false);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receipts: [receiptToSave] }),
      });

      if (response.ok) {
        alert('Receipt saved successfully!');
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
      console.error('Error saving receipt:', error);
      alert('Error saving receipt.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReceipt = async (index) => {
    if (!window.confirm('Are you sure you want to delete this receipt? This action cannot be undone.')) {
      return;
    }

    setIsSaving(true);
    try {
      const receiptId = scannedData[index].id;

      const response = await fetch('/api/scan', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [receiptId] }),
      });

      if (response.ok) {
        alert('Receipt deleted successfully!');
        const updatedScannedData = scannedData.filter((_, i) => i !== index);
        setScannedData(updatedScannedData);
        
        const updatedEditedData = { ...editedData };
        delete updatedEditedData[index];
        setEditedData(updatedEditedData);
      } else {
        alert('Failed to delete receipt.');
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
      alert('Error deleting receipt.');
    } finally {
      setIsSaving(false);
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

  return (
    <div className="receipt-upload" id="upload">
      <div className="text-container container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <p className="small-title">{top_text.small_title}</p>
              <h2 className="title">{top_text.title}</h2>
              <p className="subtitle">{top_text.subtitle}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="upload-container">
        {/* --- Drag & Drop Area --- */}
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="icon-wrapper">
            <FaCloudUploadAlt size={50} color="#4F46E5" />
          </div>
          {isDragActive ? (
            <p>Drop the receipts here ...</p>
          ) : (
            <p>
              Drag & drop receipts here, or <span className="browse-btn">browse</span>
            </p>
          )}
          <span className="file-types">Supports JPG, PNG, PDF (Max 5MB)</span>
        </div>

        {/* --- Preview Section --- */}
        {files.length > 0 && (
          <div className="preview-section">
            <h3>Ready to Upload ({files.length})</h3>
            <ul className="file-list">
              {files.map((file) => (
                <li key={file.name} className="file-item">
                  <div className="file-info">
                    <FaFileInvoiceDollar className="file-icon" />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="remove-btn"
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="upload-btn"
            >
              {isUploading ? (
                <>
                  <FaSpinner className="fa-spin" style={{marginRight: '8px'}}/> Scanning...
                </>
              ) : (
                'Process Receipts'
              )}
            </button>
          </div>
        )}

        {/* --- Results Section (New) --- */}
        {scannedData.length > 0 && (
          
          <div className="upload-results-section container">
            <div className="row">
              <div className="col">
                <p className="small-title">{recent_scans.small_title}</p>
                <h3 className="title">{recent_scans.title}</h3>
                <p className="subtitle">{recent_scans.subtitle}</p>
                <form 
                  className="results-list-form" 
                  onSubmit={handleUploadChanges} 
                  autoComplete="on"
                >
                  {
                    scannedData.map((receipt, index)=>{
                      const currentData = {
                        ...receipt,
                        ...editedData[index]
                      };

                      return(
                        <div className="result" key={index}>
                          <div className="receipt-image-container">
                            {/* <Image 
                              className="receipt-image"
                              src={receipt.imageUrl} 
                              // src="https://res.cloudinary.com/dswzkrkcx/image/upload/v1769122612/receipt-scan-app/m43poemezuobjco7lomq.png"
                              alt={receipt.fileName} 
                              width={0}
                              height={0}
                              style={{ objectFit: "cover" }}
                              priority
                            /> */}
                            <div 
                              className="receipt-background-image" 
                              style={{ "backgroundImage": `url(${receipt.imageUrl})` }}
                            >
                              
                            </div>
                          </div>
                          {/* 
                          // category: "Supplies"
                          // date: "2019-11-20T00:00:00.000Z"
                          // fileName: "receipt.png"
                          // id: "6972ab3912cdb61f568aa3e6"
                          // imageUrl: "https://res.cloudinary.com/dswzkrkcx/image/upload/v1769122612/receipt-scan-app/m43poemezuobjco7lomq.png"
                          // merchant_name:"Costco Wholesale"
                          // total_amount: 39.59
                          */}
                            <div className="edit-details-container">
                              <div className="edit-text-container">
                                <h4 className="title">Merchant name</h4>
                                <div className="input-group">
                                  <input
                                    name="merchant-name"
                                    type="text"
                                    value={currentData.merchant_name || 'Unknown Merchant'}
                                    onChange={(e) => handleInputChange(index, 'merchant_name', e.target.value)}
                                    className="merchant-name"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="edit-text-container">
                                <h4 className="title">Transaction Date</h4>
                                <div className="input-group">
                                  <input
                                    name="transaction-date"
                                    type="date"
                                    value={currentData.date ? new Date(currentData.date).toISOString().split('T')[0] : ''}
                                    onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                                    className="transaction-date"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="edit-text-container">
                                <h4 className="title">Amount</h4>
                                <div className="input-group">
                                  <input
                                    name="amount"
                                    type="text"
                                    value={currentData.total_amount ? `$${currentData.total_amount.toFixed(2)}` : 'N/A'}
                                    onChange={(e) => {
                                      const value = e.target.value.replace('$', '');
                                      handleInputChange(index, 'total_amount', isNaN(parseFloat(value)) ? 0 : parseFloat(value));
                                    }}
                                    className="amount"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="edit-text-container">
                                <h4 className="title">Category</h4>
                                <div className="input-group">
                                  <input
                                    name="category"
                                    type="text"
                                    value={currentData.category || 'Uncategorized'}
                                    onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                                    className="category"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="receipt-button-group">
                              <button 
                                type="button"
                                onClick={() => handleSaveReceipt(index)}
                                disabled={isSaving}
                                className="save-receipt-btn"
                              >
                                {isSaving ? 'Saving...' : 'Save'}
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleDeleteReceipt(index)}
                                disabled={isSaving}
                                className="delete-receipt-btn"
                              >
                                {isSaving ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                            
                        </div>
                      )
                    })
                  }
                  <div className="form-buttons">
                    <button 
                      type="submit"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save All'}
                    </button>
                    <button 
                      type="button"
                      onClick={handleDeleteAllReceipts}
                      disabled={isSaving}
                      className="delete-receipts"
                    >
                      {isSaving ? 'Deleting...' : 'Delete All'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )} 
      </div>
    </div>
  );
};

export default ReceiptUpload;