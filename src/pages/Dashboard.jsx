// src/pages/Dashboard.jsx
import React, { useState, useContext, useEffect } from 'react';
import { DashboardContext } from '../context/DashboardContext';
import { Link } from 'react-router-dom';
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  const {
    filteredSpecSheets,
    searchTerm,
    setSearchTerm,
    filterOptions,
    setFilterOptions,
    selectedSpecSheet,
    setSelectedSpecSheet,
    isLoading,
    getCategories
  } = useContext(DashboardContext);
  
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Calculate stats
  const totalSpecSheets = filteredSpecSheets.length;
  const approvedSpecSheets = filteredSpecSheets.filter(sheet => sheet.status === 'approved').length;
  const pendingSpecSheets = filteredSpecSheets.filter(sheet => sheet.status === 'pending').length;
  const draftSpecSheets = filteredSpecSheets.filter(sheet => sheet.status === 'draft').length;
  
  // Get paginated items
  const getPaginatedItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSpecSheets.slice(startIndex, startIndex + itemsPerPage);
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    setFilterOptions({
      ...filterOptions,
      [name]: value
    });
    
    setCurrentPage(1);
  };
  
  // Handle spec sheet selection
  const handleSpecSheetClick = (specSheet) => {
    setSelectedSpecSheet(specSheet);
    setShowModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowModal(false);
  };
  
  // Render pagination
  const renderPagination = () => {
    const totalPages = Math.ceil(filteredSpecSheets.length / itemsPerPage);
    
    if (totalPages <= 1) return null;
    
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {pages}
        <button
          className={styles.pageButton}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    );
  };
  
  // Render status indicator
  const renderStatusIndicator = (status) => {
    return (
      <div className={styles.listStatus}>
        <span className={`${styles.statusIndicator} ${styles[status]}`}></span>
        <span className={styles.statusText}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  };
  
  // Render grid view
  const renderGridView = () => {
    const paginatedItems = getPaginatedItems();
    
    if (paginatedItems.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📋</div>
          <h3 className={styles.emptyStateTitle}>No Spec Sheets Found</h3>
          <p className={styles.emptyStateText}>
            No spec sheets match your current filters. Try adjusting your search or filters, or create a new spec sheet.
          </p>
          <Link to="/spec-sheet" className={styles.emptyStateButton}>
            Create New Spec Sheet
          </Link>
        </div>
      );
    }
    
    return (
      <div className={styles.specSheetsGrid}>
        {paginatedItems.map(specSheet => (
          <div 
            key={specSheet.id} 
            className={styles.specSheetCard}
            onClick={() => handleSpecSheetClick(specSheet)}
          >
            <img 
              src={`${specSheet.thumbnail}?w=600&h=400&fit=crop&auto=format`} 
              alt={specSheet.name}
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{specSheet.name}</h3>
              <p className={styles.cardDescription}>{specSheet.description}</p>
              
              <div className={styles.cardMeta}>
                <span className={styles.cardCategory}>{specSheet.category}</span>
                <span className={styles.cardDate}>Updated {formatDate(specSheet.updatedAt)}</span>
              </div>
              
              <div className={styles.cardStatus}>
                <span className={`${styles.statusIndicator} ${styles[specSheet.status]}`}></span>
                <span className={styles.statusText}>
                  {specSheet.status.charAt(0).toUpperCase() + specSheet.status.slice(1)}
                </span>
              </div>
              
              <div className={styles.cardTags}>
                {specSheet.tags.map((tag, index) => (
                  <span key={index} className={styles.cardTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render list view
  const renderListView = () => {
    const paginatedItems = getPaginatedItems();
    
    if (paginatedItems.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📋</div>
          <h3 className={styles.emptyStateTitle}>No Spec Sheets Found</h3>
          <p className={styles.emptyStateText}>
            No spec sheets match your current filters. Try adjusting your search or filters, or create a new spec sheet.
          </p>
          <Link to="/spec-sheet" className={styles.emptyStateButton}>
            Create New Spec Sheet
          </Link>
        </div>
      );
    }
    
    return (
      <div className={styles.specSheetsList}>
        <table className={styles.listTable}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Created By</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(specSheet => (
              <tr 
                key={specSheet.id}
                onClick={() => handleSpecSheetClick(specSheet)}
              >
                <td>
                  <img 
                    src={`${specSheet.thumbnail}?w=100&h=100&fit=crop&auto=format`} 
                    alt={specSheet.name}
                    className={styles.listImage}
                  />
                </td>
                <td>
                  <h4 className={styles.listTitle}>{specSheet.name}</h4>
                  <p className={styles.listDescription}>{specSheet.description}</p>
                </td>
                <td>{specSheet.category}</td>
                <td>{specSheet.createdBy}</td>
                <td>{formatDate(specSheet.updatedAt)}</td>
                <td>{renderStatusIndicator(specSheet.status)}</td>
                <td>v{specSheet.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render spec sheet modal
  const renderSpecSheetModal = () => {
    if (!selectedSpecSheet) return null;
    
    return (
      <div className={styles.modalOverlay} onClick={closeModal}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{selectedSpecSheet.name}</h2>
            <button className={styles.modalCloseButton} onClick={closeModal}>×</button>
          </div>
          <div className={styles.modalBody}>
            <img 
              src={`${selectedSpecSheet.thumbnail}?w=800&h=400&fit=crop&auto=format`} 
              alt={selectedSpecSheet.name}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <strong>Category:</strong> {selectedSpecSheet.category}
              </div>
              <div>
                <strong>Status:</strong> {renderStatusIndicator(selectedSpecSheet.status)}
              </div>
              <div>
                <strong>Version:</strong> v{selectedSpecSheet.version}
              </div>
            </div>
            
            <p style={{ marginBottom: '1rem' }}>{selectedSpecSheet.description}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <strong>Created By:</strong> {selectedSpecSheet.createdBy}
              </div>
              <div>
                <strong>Created On:</strong> {formatDate(selectedSpecSheet.createdAt)}
              </div>
              <div>
                <strong>Last Updated:</strong> {formatDate(selectedSpecSheet.updatedAt)}
              </div>
              <div>
                <strong>Approved By:</strong> {selectedSpecSheet.approvedBy || 'Not approved yet'}
              </div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <strong>Tags:</strong>
              <div className={styles.cardTags}>
                {selectedSpecSheet.tags.map((tag, index) => (
                  <span key={index} className={styles.cardTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={`${styles.modalButton} ${styles.modalCancelButton}`} onClick={closeModal}>
              Close
            </button>
            <Link to={`/spec-sheet/${selectedSpecSheet.id}`} className={`${styles.modalButton} ${styles.modalActionButton}`}>
              View Full Spec Sheet
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Spec Sheet Dashboard</h1>
          <p className={styles.subtitle}>Manage and track all your product specification sheets</p>
        </div>
        <Link to="/spec-sheet" className={styles.createButton}>
          <span className={styles.createButtonIcon}>+</span>
          Create New Spec Sheet
        </Link>
      </div>
      
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Spec Sheets</h3>
          <p className={styles.statValue}>{totalSpecSheets}</p>
          <div className={`${styles.statTrend} ${styles.statTrendUp}`}>
            <span>↑</span>
            <span>12% from last month</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Approved</h3>
          <p className={styles.statValue}>{approvedSpecSheets}</p>
          <div className={`${styles.statTrend} ${styles.statTrendUp}`}>
            <span>↑</span>
            <span>8% from last month</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Pending Approval</h3>
          <p className={styles.statValue}>{pendingSpecSheets}</p>
          <div className={`${styles.statTrend} ${styles.statTrendDown}`}>
            <span>↓</span>
            <span>5% from last month</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Drafts</h3>
          <p className={styles.statValue}>{draftSpecSheets}</p>
          <div className={`${styles.statTrend} ${styles.statTrendUp}`}>
            <span>↑</span>
            <span>15% from last month</span>
          </div>
        </div>
      </div>
      
      <div className={styles.filterContainer}>
        <div className={styles.filterControls}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search spec sheets..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          
          <select
            className={styles.filterSelect}
            name="status"
            value={filterOptions.status}
            onChange={handleFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            className={styles.filterSelect}
            name="category"
            value={filterOptions.category}
            onChange={handleFilterChange}
          >
            {getCategories().map((category, index) => (
              <option key={index} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <select
            className={styles.filterSelect}
            name="sortBy"
            value={filterOptions.sortBy}
            onChange={handleFilterChange}
          >
            <option value="dateDesc">Newest First</option>
            <option value="dateAsc">Oldest First</option>
            <option value="nameAsc">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
          </select>
          
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ≡
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? renderGridView() : renderListView()}
          {renderPagination()}
        </>
      )}
      
      {showModal && renderSpecSheetModal()}
    </div>
  );
};

export default Dashboard;
