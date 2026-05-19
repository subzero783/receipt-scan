'use client';

import { FaTimes } from 'react-icons/fa';

const DashboardAddModal = ({
  newReceipt,
  setNewReceipt,
  handleSave,
  isSaving
}) => {
  if (!newReceipt) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReceipt(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const file = e.target.files[0];
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

    if (!validMimeTypes.includes(file.type)) {
      setError("Invalid file type. Only images are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File exceeds 5MB limit.");
      return;
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewReceipt(prev => ({
        ...prev,
        imageUrl: previewUrl,
        imageFile: file
      }));
    }
  };

  const onImageClick = () => {
    if (!isSaving) {
      document.getElementById('manual-add-image-upload').click();
    }
  };

  return (
    <div className="edit-receipt-modal">
      <div className="modal-content">
        <button type="button" className="close-btn" onClick={() => setNewReceipt(null)}>
          <FaTimes />
        </button>

        <div className="modal-grid">
          {/* LEFT: Image Preview */}
          <div className="modal-image-col">
            <h3>Receipt Image</h3>

            <input
              type="file"
              id="manual-add-image-upload"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <div
              className="image-container clickable-image-upload"
              onClick={onImageClick}
              style={{
                cursor: 'pointer',
                border: '2px dashed #cbd5e1',
                position: 'relative'
              }}
            >
              {newReceipt.imageUrl ? (
                <>
                  <img
                    src={newReceipt.imageUrl}
                    alt="Receipt"
                    className="receipt-image"
                  />
                  <div className="image-hover-overlay">
                    <span>Change Image</span>
                  </div>
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
                  <span>Click to upload image</span>
                  <span style={{ fontSize: '0.8em' }}>(Optional)</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Add Form */}
          <div className="modal-form-col">
            <h3>Add Details</h3>
            <form onSubmit={(e) => handleSave(e, newReceipt, newReceipt.imageFile)}>
              <div className="form-group">
                <label>Merchant Name</label>
                <input
                  type="text"
                  name="merchantName"
                  value={newReceipt.merchantName}
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
                  value={newReceipt.totalAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="transactionDate"
                  value={newReceipt.transactionDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={newReceipt.category}
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
                  {isSaving ? 'Saving...' : 'Add Receipt'}
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
          justify-content: center;
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

export default DashboardAddModal;
