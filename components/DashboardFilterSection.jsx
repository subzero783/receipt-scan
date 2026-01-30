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
        <div className="buttons-row">
          <div className="filter-actions">
            <button className="btn btn-fifth" onClick={applyFilters}>
              Apply
            </button>
            <button className="btn btn-fifth" onClick={clearFilters}>
              Clear
            </button>
          </div>
          {selectedReceiptIds.length > 0 && (
            <button
              className="btn btn-alert"
              onClick={() => handleDeleteSelected(selectedReceiptIds)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : `Delete Selected (${selectedReceiptIds.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardFilterSection;
