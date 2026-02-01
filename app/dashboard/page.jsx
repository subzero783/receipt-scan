'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';
import DashboardEditModal from '@/components/DashboardEditModal';
import DashboardFilterSection from '@/components/DashboardFilterSection';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import '@/assets/styles/dashboard.css'; // We will create this next
import { getReceipts } from './receiptsApi';
import { createFilterHandlers, createSelectionHandlers, createModalHandlers } from './dashboardHandlers';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

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
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal State
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Selection State
  const [selectedReceiptIds, setSelectedReceiptIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // User Status State
  const [userStatus, setUserStatus] = useState({ isPro: false, totalReceipts: 0 });

  // 1. Fetch Receipts
  useEffect(() => {
    if (status === 'authenticated') {
      fetchReceipts(page, filters, itemsPerPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page, itemsPerPage]); // Re-fetch when page or itemsPerPage changes

  const fetchReceipts = async (pageNum, currentFilters = filters, limit = itemsPerPage) => {
    setLoading(true);
    try {
      const data = await getReceipts(pageNum, currentFilters, limit);
      setReceipts(data.receipts);
      setTotalPages(data.totalPages);

      // Update User Status
      if (data.isPro !== undefined) {
        setUserStatus({
          isPro: data.isPro,
          totalReceipts: data.totalReceipts || 0
        });
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize handlers
  const { handleFilterChange, applyFilters, clearFilters } = createFilterHandlers(filters, setFilters, setPage, fetchReceipts);
  const { handleSelectAll, handleSelectRow, handleDeleteSelected, handleExportSelected } = createSelectionHandlers(
    receipts,
    selectedReceiptIds,
    setSelectedReceiptIds,
    setIsDeleting,
    page,
    filters,
    fetchReceipts,
    setIsExporting
  );
  const { openModal, handleInputChange, handleSave: handleSaveModal } = createModalHandlers(setSelectedReceipt, setReceipts, setIsSaving);

  const handleSave = (e) => handleSaveModal(e, selectedReceipt);

  if (status === 'loading') return <Spinner />;

  // Check if limit reached
  const canAddReceipt = userStatus.isPro || userStatus.totalReceipts < 10;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Expense Dashboard</h1>
          <div className="action-buttons">
            {canAddReceipt && (
              <button
                className="btn-secondary"
                onClick={() => setSelectedReceipt({
                  merchantName: '',
                  totalAmount: '',
                  transactionDate: new Date().toISOString().split('T')[0],
                  category: 'Other',
                  imageUrl: null
                })}
                style={{ marginRight: '10px' }}
              >
                + Manual Add
              </button>
            )}
            <button className="btn-primary" onClick={() => window.location.href = '/upload'}>+ Upload New</button>
          </div>
        </div>

        {/* --- FILTER SECTION --- */}
        <DashboardFilterSection
          filters={filters}
          handleFilterChange={handleFilterChange}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
          selectedReceiptIds={selectedReceiptIds}
          handleDeleteSelected={handleDeleteSelected}
          isDeleting={isDeleting}
          handleExportSelected={handleExportSelected}
          isExporting={isExporting}
        />

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
              <div className="items-per-page">
                <label>Rows per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setPage(1); // Reset to first page when limit changes
                  }}
                  style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px' }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="pagination-controls">
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
            </div>
          </>
        )}

        {/* EDIT MODAL */}
        <DashboardEditModal
          selectedReceipt={selectedReceipt}
          setSelectedReceipt={setSelectedReceipt}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default DashboardPage;