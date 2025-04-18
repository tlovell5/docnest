// src/components/PackagingClaims.jsx
import React, { useState } from 'react';
import styles from '../styles/PackagingClaims.module.css';
import { FaAllergies, FaBoxOpen, FaLeaf } from 'react-icons/fa';

const allergens = [
  'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts',
  'Wheat', 'Soy', 'Sesame', 'Mustard', 'Celery', 'Lupin', 'Mollusks', 'None'
];

const packagingClaimsList = [
  'Gluten-Free', 'Non-GMO', 'Organic', 'No Artificial Colors', 'No Artificial Flavors',
  'Vegan', 'Keto-Friendly', 'Whole30 Approved', 'Paleo', 'Low Sugar', 'Sugar-Free', 'Recyclable Packaging'
];

const sustainabilityLabels = [
  'Compostable', 'Biodegradable', 'Reusable', 'Carbon Neutral', 'Fair Trade Certified', 'Rainforest Alliance'
];

const PackagingClaims = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [selectedSustainability, setSelectedSustainability] = useState([]);

  const toggleCheckbox = (list, setList, item) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const renderPills = (items, selectedItems, setSelectedItems) => (
    <div className={styles.pillGrid}>
      {items.map((item) => (
        <button
          key={item}
          className={`${styles.pill} ${selectedItems.includes(item) ? styles.pillSelected : ''}`}
          onClick={() => toggleCheckbox(selectedItems, setSelectedItems, item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <section className={styles.container}>
      <div
        className={styles.toggleHeader}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className={styles.header}>Packaging Claims</h2>
        <span
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
          aria-label="Toggle"
        >
          ▶
        </span>
      </div>

      {isOpen && (
        <div className={styles.cardGrid}>
          <div className={styles.claimCard}>
            <h4><FaAllergies style={{ marginRight: '0.4rem' }} />Allergen Claims</h4>
            {renderPills(allergens, selectedAllergens, setSelectedAllergens)}
          </div>

          <div className={styles.claimCard}>
            <h4><FaBoxOpen style={{ marginRight: '0.4rem' }} />Packaging Claims</h4>
            {renderPills(packagingClaimsList, selectedClaims, setSelectedClaims)}
          </div>

          <div className={styles.claimCard}>
            <h4><FaLeaf style={{ marginRight: '0.4rem' }} />Sustainability Certifications</h4>
            {renderPills(sustainabilityLabels, selectedSustainability, setSelectedSustainability)}
          </div>
        </div>
      )}
    </section>
  );
};

export default PackagingClaims;
