'use client';

import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

const DashboardEditModal = ({
  selectedReceipt,
  setSelectedReceipt,
  handleInputChange,
  handleSave,
  isSaving
}) => {
  if (!selectedReceipt) return null;

  // Determine if we are in "Add Mode" (no ID) or "Edit Mode" (has ID)
  const isAddMode = !selectedReceipt._id;

  // Local state to hold the selected file before saving
  // We don't need this if we pass it up immediately, but we need it for preview.
  // Actually, we can just use selectedReceipt.imageUrl for preview.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);

      // Update the parent state with the preview URL so the UI updates
      // We also need to pass the actual file to the parent handler or keep it here.
      // Since handleSave is passed in, we can attach the file to the synthetic event or modify handleSave to accept it.
      // But handleSave expects an event.
      // Easier way: Update selectedReceipt to include the file object temporarily.
      setSelectedReceipt(prev => ({
        ...prev,
        imageUrl: previewUrl,
        imageFile: file // Store file to upload later
      }));
    }
  };

  const onImageClick = () => {
    if (isAddMode && !isSaving) {
      document.getElementById('manual-image-upload').click();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={() => setSelectedReceipt(null)}>
          <FaTimes />
        </button>

        <div className="modal-grid">
          {/* LEFT: Image Preview */}
          <div className="modal-image-col">
            <h3>Receipt Image</h3>

            {/* Hidden Input for File Upload */}
            {isAddMode && (
              <input
                type="file"
                id="manual-image-upload"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            )}

            <div
              className={`image-container ${isAddMode ? 'clickable-image-upload' : ''}`}
              onClick={onImageClick}
              style={{
                cursor: isAddMode ? 'pointer' : 'default',
                border: isAddMode ? '2px dashed #cbd5e1' : '',
                position: 'relative'
              }}
            >
              {selectedReceipt.imageUrl ? (
                <>
                  <Image
                    src={selectedReceipt.imageUrl}
                    alt="Receipt"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                  {isAddMode && (
                    <div className="image-hover-overlay">
                      <span>Change Image</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-image-placeholder" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  background: '#f8fafc',
                  color: '#64748b',
                  gap: '10px'
                }}>
                  {isAddMode ? (
                    <>
                      <span>Click to upload image</span>
                      <span style={{ fontSize: '0.8em' }}>(Optional)</span>
                    </>
                  ) : (
                    'No Image Available'
                  )}
                </div>
              )}
            </div>

            {!isAddMode && selectedReceipt.imageUrl && (
              <a href={selectedReceipt.imageUrl} target="_blank" className="text-link">
                View Full Size
              </a>
            )}
          </div>

          {/* RIGHT: Edit Form */}
          <div className="modal-form-col">
            <h3>{isAddMode ? 'Add Details' : 'Edit Details'}</h3>
            <form onSubmit={(e) => handleSave(e, selectedReceipt.imageFile)}>
              <div className="form-group">
                <label>Merchant Name</label>
                <input
                  type="text"
                  name="merchantName"
                  value={selectedReceipt.merchantName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="totalAmount"
                  value={selectedReceipt.totalAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="transactionDate"
                  value={selectedReceipt.transactionDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={selectedReceipt.category}
                  onChange={handleInputChange}
                >
                  <option value="Food">Food & Dining</option>
                  <option value="Transport">Transportation</option>
                  <option value="Supplies">Office Supplies</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style jsx>{`
        .clickable-image-upload:hover {
          background-color: #f1f5f9;
          border-color: #94a3b8 !important;
        }
        .image-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justifyContent: center;
          color: white;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .clickable-image-upload:hover .image-hover-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default DashboardEditModal;