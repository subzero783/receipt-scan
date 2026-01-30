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
            <div className="image-container">
              <Image
                src={selectedReceipt.imageUrl}
                alt="Receipt"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <a href={selectedReceipt.imageUrl} target="_blank" className="text-link">
              View Full Size
            </a>
          </div>

          {/* RIGHT: Edit Form */}
          <div className="modal-form-col">
            <h3>Edit Details</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Merchant Name</label>
                <input
                  type="text"
                  name="merchantName"
                  value={selectedReceipt.merchantName}
                  onChange={handleInputChange}
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
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="transactionDate"
                  value={selectedReceipt.transactionDate}
                  onChange={handleInputChange}
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
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEditModal;