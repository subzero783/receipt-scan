'use client';

import ReceiptDropzone from './ReceiptDropzone';
import ReceiptCard from './ReceiptResultsSection';
import { useReceiptUpload } from '@/hooks/useReceiptUpload'; // Adjust path if needed
import TopText from './TopText';

const ReceiptUpload = ({ data }) => {
  const { top_text, recent_scans } = data;

  // Use the custom hook
  const {
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
  } = useReceiptUpload();

  return (
    <div className="receipt-upload" id="upload">
      <div className="text-container">
        <div className="row">
          <div className="col">
            <TopText text={top_text} />
          </div>
        </div>
      </div>
      <div className="upload-container">
        <ReceiptDropzone
          files={files}
          isUploading={isUploading}
          onDrop={onDrop}
          onRemoveFile={removeFile}
          onUpload={handleUpload}
        />

        {/* --- Results Section --- */}
        {scannedData.length > 0 && (
          <div className="upload-results-section container">
            <div className="row">
              <div className="col">
                <div className="text-container">
                  <p className="small-title">{recent_scans.small_title}</p>
                  <h3 className="title">{recent_scans.title}</h3>
                  <p className="subtitle">{recent_scans.subtitle}</p>
                </div>
                <form
                  className="results-list-form"
                  onSubmit={handleUploadChanges}
                  autoComplete="on"
                >
                  <div className="form-buttons">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn btn-primary no-border"
                    >
                      {isSaving ? 'Saving...' : 'Save All'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAllReceipts}
                      disabled={isDeleting}
                      className="delete-receipts btn btn-primary no-border"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete All'}
                    </button>
                  </div>
                  {scannedData.map((receipt, index) => (
                    <ReceiptCard
                      key={index}
                      receipt={receipt}
                      index={index}
                      editedData={editedData}
                      onInputChange={handleInputChange}
                      onSaveReceipt={handleSaveReceipt}
                      onDeleteReceipt={handleDeleteReceipt}
                      isSaving={isSaving}
                      isDeleting={isDeleting}
                    />
                  ))}
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