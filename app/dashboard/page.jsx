'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import '@/assets/styles/dashboard.css'; // We will create this next

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch Receipts
  useEffect(() => {
    if (status === 'authenticated') {
      fetchReceipts(page);
    }
  }, [status, page]);

  const fetchReceipts = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/receipts?page=${pageNum}&limit=8`);
      const data = await res.json();
      setReceipts(data.receipts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Edit Click
  const openModal = (receipt) => {
    // Format date for HTML input (YYYY-MM-DD)
    const formattedDate = receipt.transactionDate
      ? new Date(receipt.transactionDate).toISOString().split('T')[0]
      : '';

    setSelectedReceipt({ ...receipt, transactionDate: formattedDate });
  };

  // 3. Handle Form Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedReceipt((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Save Changes
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/receipts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedReceipt._id,
          merchantName: selectedReceipt.merchantName,
          totalAmount: selectedReceipt.totalAmount,
          transactionDate: selectedReceipt.transactionDate,
          category: selectedReceipt.category
        }),
      });

      if (res.ok) {
        // Update local list
        const updated = await res.json();
        setReceipts((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );
        setSelectedReceipt(null); // Close modal
      }
    } catch (error) {
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading') return <Spinner />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Expense Dashboard</h1>
          <button className="btn-primary" onClick={() => window.location.href = '/upload'}>+ Upload New</button>
        </div>

        {loading ? (
          <Spinner />
        ) : receipts.length === 0 ? (
          <div className="empty-state">No receipts found. Upload one to get started!</div>
        ) : (
          <>
            {/* RECEIPT TABLE */}
            <div className="table-wrapper">
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Merchant</th>
                    <th>Category</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt) => (
                    <tr key={receipt._id} onClick={() => openModal(receipt)} className="clickable-row">
                      <td>{new Date(receipt.transactionDate).toLocaleDateString()}</td>
                      <td className="font-bold">{receipt.merchantName}</td>
                      <td><span className="category-badge">{receipt.category}</span></td>
                      <td>${receipt.totalAmount.toFixed(2)}</td>
                      <td>
                        <button className="icon-btn"><FaEdit /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <FaChevronLeft /> Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </>
        )}

        {/* EDIT MODAL */}
        {selectedReceipt && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setSelectedReceipt(null)}><FaTimes /></button>

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
                  <a href={selectedReceipt.imageUrl} target="_blank" className="text-link">View Full Size</a>
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
                      {/* Add Delete Button Logic Here if needed */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;