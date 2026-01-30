'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import '@/assets/styles/dashboard.css'; // We will create this next
import { getReceipts } from './receiptsApi';
import { createFilterHandlers, createSelectionHandlers, createModalHandlers } from './dashboardHandlers';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    merchant: '',
    category: '',
    minTotal: '',
    maxTotal: ''
  });

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Selection State
  const [selectedReceiptIds, setSelectedReceiptIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch Receipts
  useEffect(() => {
    if (status === 'authenticated') {
      fetchReceipts(page, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]); // Intentionally exclude filters to prevent auto-fetch on type

  const fetchReceipts = async (pageNum, currentFilters = filters) => {
    setLoading(true);
    try {
      const data = await getReceipts(pageNum, currentFilters);
      setReceipts(data.receipts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize handlers
  const { handleFilterChange, applyFilters, clearFilters } = createFilterHandlers(filters, setFilters, setPage, fetchReceipts);
  const { handleSelectAll, handleSelectRow, handleDeleteSelected } = createSelectionHandlers(receipts, selectedReceiptIds, setSelectedReceiptIds, setIsDeleting, page, filters, fetchReceipts);
  const { openModal, handleInputChange, handleSave: handleSaveModal } = createModalHandlers(setSelectedReceipt, setReceipts, setIsSaving);

  const handleSave = (e) => handleSaveModal(e, selectedReceipt);

  if (status === 'loading') return <Spinner />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Expense Dashboard</h1>
          <button className="btn-primary" onClick={() => window.location.href = '/upload'}>+ Upload New</button>
        </div>

        {/* --- FILTER SECTION --- */}
        <div className="filter-section">
          <div className="filter-row">
            <input
              type="text"
              name="merchant"
              placeholder="Merchant Name"
              value={filters.merchant}
              onChange={handleFilterChange}
            />
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transportation</option>
              <option value="Supplies">Office Supplies</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
            <div className="date-group">
              <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} title="Start Date" />
              <span className="separator">-</span>
              <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} title="End Date" />
            </div>
            <div className="amount-group">
              <input type="number" name="minTotal" placeholder="Min $" value={filters.minTotal} onChange={handleFilterChange} />
              <span className="separator">-</span>
              <input type="number" name="maxTotal" placeholder="Max $" value={filters.maxTotal} onChange={handleFilterChange} />
            </div>
            <div className="filter-actions">
              <button className="btn-secondary" onClick={applyFilters}>Apply</button>
              <button className="btn-text" onClick={clearFilters}>Clear</button>
            </div>
            {selectedReceiptIds.length > 0 && (
              <button
                className="btn-danger"
                style={{ marginLeft: 'auto', backgroundColor: '#e63946', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => handleDeleteSelected(selectedReceiptIds)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : `Delete Selected (${selectedReceiptIds.length})`}
              </button>
            )}
          </div>
        </div>
        {/* ---------------------- */}

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
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={receipts.length > 0 && selectedReceiptIds.length === receipts.length}
                        onChange={handleSelectAll}
                      />
                    </th>
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
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedReceiptIds.includes(receipt._id)}
                          onChange={(e) => handleSelectRow(e, receipt._id)}
                        />
                      </td>
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