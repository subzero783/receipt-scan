'use client';

const DashboardFilterSection = ({
  filters,
  handleFilterChange,
  applyFilters,
  clearFilters,
  selectedReceiptIds,
  handleDeleteSelected,
  isDeleting
}) => {
  return (
    <div className="dashboard-filter-section">
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
        <div className="filter-actions">
          <button className="btn-secondary" onClick={applyFilters}>
            Apply
          </button>
          <button className="btn-text" onClick={clearFilters}>
            Clear
          </button>
        </div>
        {selectedReceiptIds.length > 0 && (
          <button
            className="btn-danger"
            style={{
              marginLeft: 'auto',
              backgroundColor: '#e63946',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => handleDeleteSelected(selectedReceiptIds)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : `Delete Selected (${selectedReceiptIds.length})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardFilterSection;
