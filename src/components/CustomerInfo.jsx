import React, { useState } from 'react';
import styles from '../styles/CustomerInfo.module.css';

const CustomerInfo = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

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
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Company Logo Preview"
                className={styles.logoPreview}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomerInfo;
