'use client'; // This must be a Client Component

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from "next/image";
import { FaCloudUploadAlt, FaFileInvoiceDollar, FaTimes, FaSpinner } from 'react-icons/fa';

const ReceiptUpload = ({data}) => {
  const {top_text, recent_scans} = data;
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedData, setScannedData] = useState([]); // Store AI results here

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

  };

  const handleDeleteAllReceipts = () => {

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
            <div class="row">
              <div class="col">
                <p className="small-title">{recent_scans.small_title}</p>
                <h3 className="title">{recent_scans.title}</h3>
                <p className="subtitle">Each receipt appears as an editable card. Verify the merchant name, date, and amount our AI captured, then assign the right tax category for your records.</p>
                <form 
                  className="results-list-form" 
                  onSubmit={handleUploadChanges} 
                  autoComplete="on"
                >
                  {
                    scannedData.map((receipt, index)=>{
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
                                    value={receipt.merchant_name || 'Unknown Merchant'}
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
                                    value={receipt.date || 'No Date'}
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
                                    value={receipt.total_amount ? `$${receipt.total_amount.toFixed(2)}` : 'N/A'}
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
                                    value={receipt.category || 'Uncategorized'}
                                    className="category"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            
                        </div>
                      )
                    })
                  }
                  <div className="form-buttons">
                    <button type="submit">Save All</button>
                    <buttion onClick={handleDeleteAllReceipts} className="delete-receipts">
                      Delete All
                    </buttion>
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