'use client';

import { useState, useRef, useEffect } from 'react';

const DashboardFilterSection = ({
  filters,
  handleFilterChange,
  applyFilters,
  clearFilters,
  selectedReceiptIds,
  handleDeleteSelected,
  isDeleting,
  handleExportSelected,
  handleEmailSelected,
  isExporting
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dashboard-filter-section">
      <div className="filter-row">
        <div className="filter-group">
          <div className="merchant-group">
            <input
              type="text"
              name="merchant"
              placeholder="Merchant Name"
              value={filters.merchant}
              onChange={handleFilterChange}
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-categories"
            >
              <option value="">All Categories</option>
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transportation</option>
              <option value="Supplies">Office Supplies</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="date-and-amount-group">
            <div className="date-group">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                title="Start Date"
              />
              <span className="separator">-</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                title="End Date"
              />
            </div>
            <div className="amount-group">
              <input
                type="number"
                name="minTotal"
                placeholder="Min $"
                value={filters.minTotal}
                onChange={handleFilterChange}
              />
              <span className="separator">-</span>
              <input
                type="number"
                name="maxTotal"
                placeholder="Max $"
                value={filters.maxTotal}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
        <div className="buttons-row">
          <div className="filter-actions">
            <button className="btn btn-primary" onClick={applyFilters}>
              Apply
            </button>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear
            </button>
          </div>
          <div className="other-buttons">
            {selectedReceiptIds.length > 0 && (
              <>
                <div style={{ position: 'relative' }} ref={dropdownRef} className="actions-dropdown-container">
                  <button
                    className="btn btn-third"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={isExporting}
                  >
                    {isExporting ? 'Processing...' : 'Actions ▼'}
                  </button>
                  {showExportMenu && (
                    <div
                      className="actions-dropdown-inner-container"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        zIndex: 10,
                        minWidth: '160px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                      }}
                    >
                      <button
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 12px',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          handleEmailSelected();
                          setShowExportMenu(false);
                        }}
                      >
                        Email Selected
                      </button>
                      <button
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 12px',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderTop: '1px solid #eee'
                        }}
                        onClick={() => {
                          handleExportSelected('zip');
                          setShowExportMenu(false);
                        }}
                      >
                        Export Images (ZIP)
                      </button>
                      <button
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 12px',
                          border: 'none',
                          background: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderTop: '1px solid #eee'
                        }}
                        onClick={() => {
                          handleExportSelected('csv');
                          setShowExportMenu(false);
                        }}
                      >
                        Export Data (CSV)
                      </button>
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-alert"
                  onClick={() => handleDeleteSelected(selectedReceiptIds)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : `Delete Selected (${selectedReceiptIds.length})`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilterSection;
