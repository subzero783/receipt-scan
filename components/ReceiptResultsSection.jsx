'use client';

import { useState } from 'react';
import ImageModal from './ImageModal';

const ReceiptCard = ({ receipt, index, editedData, onInputChange, onSaveReceipt, onDeleteReceipt, isSaving }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentData = {
    ...receipt,
    ...editedData[index]
  };

  return (
    <div className="result">
      <div className="receipt-image-container">
        <div
          className="receipt-background-image"
          style={{ backgroundImage: `url(${receipt.imageUrl})`, cursor: 'pointer' }}
          onClick={() => setIsModalOpen(true)}
        >
        </div>
        {isModalOpen && (
          <ImageModal
            src={receipt.imageUrl}
            onClose={() => setIsModalOpen(false)}
          />
        )}
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
          <p className="subtitle">Confirm the vendor or business where you made the purchase.</p>
          <div className="input-group">
            <input
              name="merchant-name"
              type="text"
              value={currentData.merchant_name || 'Unknown Merchant'}
              onChange={(e) => onInputChange(index, 'merchant_name', e.target.value)}
              className="merchant-name"
              required
            />
          </div>
        </div>
        <div className="edit-text-container">
          <h4 className="title">Transaction Date</h4>
          <p className="subtitle">Adjust the date if needed to match your actual purchase.</p>
          <div className="input-group">
            <input
              name="transaction-date"
              type="date"
              value={currentData.date ? new Date(currentData.date).toISOString().split('T')[0] : ''}
              onChange={(e) => onInputChange(index, 'date', e.target.value)}
              className="transaction-date"
              required
            />
          </div>
        </div>
        <div className="edit-text-container">
          <h4 className="title">Amount</h4>
          <p className="subtitle">Set the total.</p>
          <div className="input-group">
            <input
              name="amount"
              type="number"
              value={currentData.total_amount !== undefined ? currentData.total_amount : ''}
              onChange={(e) => onInputChange(index, 'total_amount', e.target.value)}
              className="amount"
              required
            />
          </div>
        </div>
        <div className="edit-text-container">
          <h4 className="title">Category</h4>
          <p className="subtitle">Set the category for this receipt.</p>
          <div className="input-group">
            <input
              name="category"
              type="text"
              // value={currentData.category || 'Uncategorized'}
              value={currentData.category}
              onChange={(e) => onInputChange(index, 'category', e.target.value)}
              className="category"
              required
            />
          </div>
        </div>
        <div className="receipt-button-group">
          <button
            type="button"
            onClick={() => onSaveReceipt(index)}
            disabled={isSaving}
            className="save-receipt-btn btn btn-primary no-border"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => onDeleteReceipt(index)}
            disabled={isSaving}
            className="delete-receipt-btn btn btn-primary no-border"
          >
            {isSaving ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptCard;
