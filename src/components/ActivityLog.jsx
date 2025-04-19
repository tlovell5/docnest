// src/components/ActivityLog.jsx
import React, { useState, useContext, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import styles from '../styles/ActivityLog.module.css';
import sharedStyles from '../styles/SharedStyles.module.css';

const ActivityLog = () => {
  const { activityLog, setActivityLog } = useContext(ProductContext);
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    user: '',
    actionType: 'edit',
    section: '',
    details: ''
  });
  
  const entriesPerPage = 10;
  
  // Initialize with empty log if null
  useEffect(() => {
    if (!activityLog) {
      setActivityLog({
        entries: []
      });
    }
  }, [activityLog, setActivityLog]);
  
  // Add a new log entry
  const addLogEntry = (entry) => {
    if (!activityLog) return;
    
    const newEntry = {
      id: Date.now(),
      timestamp: new Date(),
      ...entry
    };
    
    setActivityLog({
      ...activityLog,
      entries: [newEntry, ...activityLog.entries]
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    addLogEntry(newEntry);
    
    // Reset form
    setNewEntry({
      user: '',
      actionType: 'edit',
      section: '',
      details: ''
    });
    
    setShowAddForm(false);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setNewEntry({
      ...newEntry,
      [name]: value
    });
  };
  
  // Filter and search log entries
  const getFilteredEntries = () => {
    if (!activityLog || !activityLog.entries) return [];
    
    return activityLog.entries.filter(entry => {
      // Apply filter
      if (filter !== 'all' && entry.actionType !== filter) {
        return false;
      }
      
      // Apply search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          entry.user.toLowerCase().includes(searchLower) ||
          entry.section.toLowerCase().includes(searchLower) ||
          entry.details.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };
  
  // Get paginated entries
  const getPaginatedEntries = () => {
    const filtered = getFilteredEntries();
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filtered.slice(startIndex, startIndex + entriesPerPage);
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(date).toLocaleDateString('en-US', options);
  };
  
  // Get action icon class
  const getActionIconClass = (actionType) => {
    switch (actionType) {
      case 'edit':
        return styles.edit;
      case 'approval':
        return styles.approval;
      case 'rejection':
        return styles.rejection;
      case 'comment':
        return styles.comment;
      default:
        return styles.edit;
    }
  };
  
  // Get action icon text
  const getActionIconText = (actionType) => {
    switch (actionType) {
      case 'edit':
        return 'E';
      case 'approval':
        return 'A';
      case 'rejection':
        return 'R';
      case 'comment':
        return 'C';
      default:
        return 'E';
    }
  };
  
  // Get action text
  const getActionText = (actionType) => {
    switch (actionType) {
      case 'edit':
        return 'Edited';
      case 'approval':
        return 'Approved';
      case 'rejection':
        return 'Rejected';
      case 'comment':
        return 'Commented on';
      default:
        return 'Edited';
    }
  };
  
  // Render pagination
  const renderPagination = () => {
    const filteredEntries = getFilteredEntries();
    const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
    
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
  
  // Render add entry form
  const renderAddEntryForm = () => {
    return (
      <form className={styles.addEntryForm} onSubmit={handleSubmit}>
        <h3 className={styles.formTitle}>Add Activity Log Entry</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>User</label>
          <input
            type="text"
            name="user"
            className={styles.input}
            value={newEntry.user}
            onChange={handleInputChange}
            placeholder="Enter user name"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Action Type</label>
          <select
            name="actionType"
            className={styles.select}
            value={newEntry.actionType}
            onChange={handleInputChange}
            required
          >
            <option value="edit">Edit</option>
            <option value="approval">Approval</option>
            <option value="rejection">Rejection</option>
            <option value="comment">Comment</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Section</label>
          <select
            name="section"
            className={styles.select}
            value={newEntry.section}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a section</option>
            <option value="Product Identification">Product Identification</option>
            <option value="Production Details">Production Details</option>
            <option value="Bill of Materials">Bill of Materials</option>
            <option value="Packout Details">Packout Details</option>
            <option value="Mix Instructions">Mix Instructions</option>
            <option value="Equipment Setup">Equipment Setup</option>
            <option value="Product Testing">Product Testing</option>
            <option value="Signatures">Signatures</option>
            <option value="Packaging Claims">Packaging Claims</option>
            <option value="Entire Document">Entire Document</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Details</label>
          <textarea
            name="details"
            className={styles.textarea}
            value={newEntry.details}
            onChange={handleInputChange}
            placeholder="Enter details about the action"
            required
          />
        </div>
        
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            Add Entry
          </button>
        </div>
      </form>
    );
  };
  
  return (
    <section className={`${styles.container} ${sharedStyles.standardContainer}`}>
      <div 
        className={`${styles.toggleHeader} ${sharedStyles.toggleHeader}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className={`${styles.header} ${sharedStyles.header}`}>Activity Log</h2>
        <span className={`${styles.arrow} ${sharedStyles.arrow} ${isOpen ? styles.open : ''}`}>▶</span>
      </div>
      
      {isOpen && (
        <div className={`${styles.content} ${sharedStyles.content}`}>
          <div className={styles.logControls}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search activity log..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className={styles.filterSelect}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Activities</option>
              <option value="edit">Edits</option>
              <option value="approval">Approvals</option>
              <option value="rejection">Rejections</option>
              <option value="comment">Comments</option>
            </select>
            
            <button
              className={styles.addEntryButton}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : '+ Add Entry'}
            </button>
          </div>
          
          {showAddForm && renderAddEntryForm()}
          
          {activityLog && activityLog.entries && activityLog.entries.length > 0 ? (
            <>
              <table className={styles.logTable}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Section</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedEntries().map(entry => (
                    <tr key={entry.id}>
                      <td className={styles.timestamp}>{formatDate(entry.timestamp)}</td>
                      <td className={styles.user}>{entry.user}</td>
                      <td className={styles.action}>
                        <span className={`${styles.actionIcon} ${getActionIconClass(entry.actionType)}`}>
                          {getActionIconText(entry.actionType)}
                        </span>
                        {getActionText(entry.actionType)}
                      </td>
                      <td className={styles.section}>{entry.section}</td>
                      <td className={styles.details}>{entry.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {renderPagination()}
            </>
          ) : (
            <div className={styles.noActivity}>
              No activity recorded yet. Add an entry to start tracking changes.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ActivityLog;
