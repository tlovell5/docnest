// src/components/ProductIdentification.jsx
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ProductContext } from '../context/ProductContext';
import styles from '../styles/ProductIdentification.module.css';

const ProductIdentification = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [unitsPerCase, setUnitsPerCase] = useState(0);
  const [casesPerPallet, setCasesPerPallet] = useState(0);
  const [unitClaimWeight, setUnitClaimWeight] = useState('');
  const [uom, setUom] = useState('lbs');
  const [wipIdValue, setWipIdValue] = useState('');

  const { setWipId, setWipWeight } = useContext(ProductContext);

  useEffect(() => {
    setWipId(wipIdValue);
  }, [wipIdValue, setWipId]);

  useEffect(() => {
    const numericWeight = parseFloat(unitClaimWeight);
    if (isNaN(numericWeight)) {
      setWipWeight('');
      return;
    }

    let weightInLbs = numericWeight;
    switch (uom) {
      case 'g':
        weightInLbs = numericWeight / 453.592;
        break;
      case 'oz':
        weightInLbs = numericWeight / 16;
        break;
      case 'kg':
        weightInLbs = numericWeight * 2.20462;
        break;
      default:
        weightInLbs = numericWeight;
    }
    setWipWeight(weightInLbs.toFixed(2));
  }, [unitClaimWeight, uom, setWipWeight]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const unitsPerPallet = unitsPerCase * casesPerPallet;

  return (
    <section className={styles.container}>
      <div
        className={styles.toggleHeader}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className={styles.header}>Product Identification</h2>
        <span
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
          aria-label="Toggle"
        >
          ▶
        </span>
      </div>

      {isOpen && (
        <>
          <div className={styles.flexRowWrap}>
            <div className={styles.flexColumn}>
              <div className={styles.field}>
                <label>Product Name</label>
                <input type="text" placeholder="e.g. Chocolate Protein Blend" />
              </div>

              <div className={styles.field}>
                <label>SKU ID</label>
                <input type="text" placeholder="e.g. SKU-12345" />
              </div>

              <div className={styles.field}>
                <label>BOM ID</label>
                <input type="text" placeholder="e.g. BOM-2024-001" />
              </div>

              <div className={styles.field}>
                <label>WIP ID</label>
                <input
                  type="text"
                  placeholder="e.g. WIP-001"
                  value={wipIdValue}
                  onChange={(e) => setWipIdValue(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Spec Revision</label>
                <input type="text" placeholder="Rev A" />
              </div>

              <div className={styles.field}>
                <label>Intended Use</label>
                <select className={styles.dropdown}>
                  <option value="">Select an option</option>
                  <option value="Retail">Retail</option>
                  <option value="Ingredient">Ingredient</option>
                  <option value="Inclusion">Inclusion</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Unit Claim Weight</label>
                <input
                  type="number"
                  value={unitClaimWeight}
                  onChange={(e) => setUnitClaimWeight(e.target.value)}
                  placeholder="e.g. 16"
                />
              </div>

              <div className={styles.fieldCompact}>
                <label>UOM</label>
                <select
                  className={styles.dropdownCompact}
                  value={uom}
                  onChange={(e) => setUom(e.target.value)}
                >
                  <option value="g">g</option>
                  <option value="oz">oz</option>
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Units per Case</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 12"
                  value={unitsPerCase}
                  onChange={(e) => setUnitsPerCase(Number(e.target.value))}
                />
              </div>

              <div className={styles.field}>
                <label>Cases per Pallet</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 50"
                  value={casesPerPallet}
                  onChange={(e) => setCasesPerPallet(Number(e.target.value))}
                />
              </div>

              <div className={styles.field}>
                <label>Units per Pallet</label>
                <input
                  type="text"
                  value={unitsPerPallet || ''}
                  readOnly
                  placeholder="Auto-calculated"
                />
              </div>
            </div>

            <div className={styles.imagePreviewColumn}>
              <label>Product Image</label>
              <div {...getRootProps({ className: styles.dropzone })}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <p>Drag & drop an image here, or click to select a file</p>
                )}
              </div>
              {imagePreview && (
                <div className={styles.imagePreviewWrapper}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className={styles.imagePreview}
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={handleRemoveImage}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.subgrid}>
            <div className={styles.field}>
              <label>Unit UPC</label>
              <input type="text" placeholder="UPC code" />
            </div>
            <div className={styles.field}>
              <label>Case UPC</label>
              <input type="text" placeholder="Case UPC" />
            </div>
            <div className={styles.field}>
              <label>Pallet UPC</label>
              <input type="text" placeholder="Pallet UPC" />
            </div>
            <div className={styles.field}>
              <label>Lot Code Format</label>
              <input type="text" placeholder="e.g. YYMMDD-###" />
            </div>
          </div>

          <div className={styles.subgrid}>
            <div className={styles.field}>
              <label>Shelf Life</label>
              <div className={styles.shelfLifeGroup}>
                <select>
                  <option>Years</option>
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
                <select>
                  <option>Months</option>
                  <option>0</option>
                  <option>3</option>
                  <option>6</option>
                  <option>9</option>
                  <option>12</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductIdentification;
