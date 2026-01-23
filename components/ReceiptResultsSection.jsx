'use client';

const ReceiptCard = ({ receipt, index, editedData, onInputChange, onSaveReceipt, onDeleteReceipt, isSaving }) => {
  const currentData = {
    ...receipt,
    ...editedData[index]
  };

  return (
    <div className="result">
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
          style={{ backgroundImage: `url(${receipt.imageUrl})` }}
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
              onChange={(e) => onInputChange(index, 'merchant_name', e.target.value)}
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
              onChange={(e) => onInputChange(index, 'date', e.target.value)}
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
                onInputChange(index, 'total_amount', isNaN(parseFloat(value)) ? 0 : parseFloat(value));
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
              onChange={(e) => onInputChange(index, 'category', e.target.value)}
              className="category"
              required
            />
          </div>
        </div>
      </div>
      <div className="receipt-button-group">
        <button 
          type="button"
          onClick={() => onSaveReceipt(index)}
          disabled={isSaving}
          className="save-receipt-btn"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button 
          type="button"
          onClick={() => onDeleteReceipt(index)}
          disabled={isSaving}
          className="delete-receipt-btn"
        >
          {isSaving ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ReceiptCard;
