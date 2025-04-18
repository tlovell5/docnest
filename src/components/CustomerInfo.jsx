import React, { useState, useCallback } from 'react';
import styles from '../styles/CustomerInfo.module.css';
import { useDropzone } from 'react-dropzone';

const CustomerInfo = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <section className={styles.container}>
      <div
        className={styles.toggleHeader}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className={styles.header}>Customer Info</h2>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`} aria-label="Toggle">
          ▶
        </span>
      </div>

      {isOpen && (
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Company Name</label>
            <input type="text" placeholder="e.g. Nexaware Foods LLC" />
          </div>

          <div className={styles.field}>
            <label>Company Address</label>
            <textarea rows="3" placeholder="1234 Blending Way, Utah" />
          </div>

          <div className={styles.field}>
            <label>Contact Name</label>
            <input type="text" placeholder="John Smith" />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input type="email" placeholder="email@example.com" />
          </div>

          <div className={styles.field}>
            <label>Phone Number</label>
            <input type="tel" placeholder="(555) 555-5555" />
          </div>

          <div className={styles.field}>
            <label>Company Logo</label>
            <div {...getRootProps({ className: styles.dropzone })}>
              <input {...getInputProps()} />
              {logoPreview ? (
                <div className={styles.logoPreviewContainer}>
                  <img
                    src={logoPreview}
                    alt="Company Logo Preview"
                    className={styles.logoPreview}
                  />
                  <button 
                    type="button" 
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogoPreview(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : isDragActive ? (
                <p>Drop the logo here ...</p>
              ) : (
                <p>Drag & drop a logo here, or click to select a file</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomerInfo;
