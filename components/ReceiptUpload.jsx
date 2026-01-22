'use client'; // This must be a Client Component

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFileInvoiceDollar, FaTimes, FaSpinner } from 'react-icons/fa';

const ReceiptUpload = ({top_text}) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedData, setScannedData] = useState([]); // Store AI results here

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
          // <div className="results-section" style={{ marginTop: '30px' }}>
          //     <h3>Recent Scans</h3>
          //     <div className="scanned-list" style={{ display: 'grid', gap: '15px' }}>
          //         {scannedData.map((data, idx) => (
          //             <div key={idx} style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
          //                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          //                     <strong style={{ color: '#1e293b' }}>{data.merchant_name || 'Unknown Merchant'}</strong>
          //                     <strong style={{ color: '#10b981' }}>
          //                         {data.total_amount ? `$${data.total_amount.toFixed(2)}` : 'N/A'}
          //                     </strong>
          //                 </div>
          //                 <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '15px' }}>
          //                     <span>📅 {data.date || 'No Date'}</span>
          //                     <span>🏷️ {data.category || 'Uncategorized'}</span>
          //                 </div>
          //             </div>
          //         ))}
          //     </div>
          // </div>
          <div className="upload-results-section">
            <p className="small-title">Recent Scans</p>
            <h3 className="title"></h3>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUpload;