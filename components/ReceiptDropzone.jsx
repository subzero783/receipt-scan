'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFileInvoiceDollar, FaTimes, FaSpinner } from 'react-icons/fa';

const ReceiptDropzone = ({ files, isUploading, onDrop, onRemoveFile, onUpload, uploadError }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 5,
  });

  return (
    <>
      {/* --- Drag & Drop Area --- */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="icon-wrapper">
          <FaCloudUploadAlt size={50} color="#1e90ff" />
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

      {/* --- Error Message --- */}
      {uploadError && (
        <div className="upload-error">
          {uploadError}
        </div>
      )}

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
                  onClick={() => onRemoveFile(file.name)}
                  className="remove-btn"
                >
                  <FaTimes />
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={onUpload}
            disabled={isUploading}
            className="upload-btn"
          >
            {isUploading ? (
              <>
                <FaSpinner className="fa-spin" style={{ marginRight: '8px' }} /> Scanning...
              </>
            ) : (
              'Process Receipts'
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default ReceiptDropzone;
