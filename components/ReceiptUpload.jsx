'use client'; // This must be a Client Component

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFileInvoiceDollar, FaTimes } from 'react-icons/fa';

const ReceiptUpload = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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

  // Mock Upload Function
  const handleUpload = async () => {
    setIsUploading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert(`${files.length} receipts uploaded! (Connect API here)`);
    setFiles([]);
    setIsUploading(false);
  };

  return (
    <div className="upload-container" id="upload">
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
            {isUploading ? 'Scanning...' : 'Process Receipts'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;