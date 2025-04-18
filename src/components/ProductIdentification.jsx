// src/components/ProductIdentification.jsx
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ProductContext } from '../context/ProductContext';
import styles from '../styles/ProductIdentification.module.css';

const ProductIdentification = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [unitsPerCase, setLocalUnitsPerCase] = useState(0);
  const [casesPerPallet, setLocalCasesPerPallet] = useState(0);
  const [unitClaimWeight, setLocalUnitClaimWeight] = useState('');
  const [uom, setLocalUom] = useState('lbs');
  const [wipIdValue, setWipIdValue] = useState('');
  const [wipDescription, setWipDescriptionState] = useState('');
  const [unitUpc, setUnitUpc] = useState('');
  const [lotCodeFormatValue, setLotCodeFormatValue] = useState('');
  const [shelfLifeYears, setShelfLifeYears] = useState(0);
  const [shelfLifeMonths, setShelfLifeMonths] = useState(0);
  const [productName, setProductName] = useState('');
  const [skuId, setSkuId] = useState('');
  const [bomId, setBomId] = useState('');
  const [specRevision, setSpecRevision] = useState('');
  const [intendedUse, setIntendedUse] = useState('');
  const [caseUpcValue, setCaseUpcValue] = useState('');

  const { 
    setWipId, 
    setWipWeight, 
    setUnitsPerCase, 
    setUpc, 
    setLotCodeFormat, 
    setShelfLife,
    setUnitClaimWeight,
    setUom,
    setWipDescription,
    setCaseUpc,
    setCasesPerPallet
  } = useContext(ProductContext);

  useEffect(() => {
    setWipId(wipIdValue);
    setWipDescription(wipDescription);
  }, [wipIdValue, wipDescription, setWipId, setWipDescription]);

  useEffect(() => {
    setUnitsPerCase(unitsPerCase);
  }, [unitsPerCase, setUnitsPerCase]);

  useEffect(() => {
    setUpc(unitUpc);
  }, [unitUpc, setUpc]);

  useEffect(() => {
    setLotCodeFormat(lotCodeFormatValue);
  }, [lotCodeFormatValue, setLotCodeFormat]);

  useEffect(() => {
    // Convert years and months to total days
    const totalDays = (shelfLifeYears * 365) + (shelfLifeMonths * 30);
    setShelfLife(totalDays.toString());
  }, [shelfLifeYears, shelfLifeMonths, setShelfLife]);

  useEffect(() => {
    setUnitClaimWeight(unitClaimWeight);
  }, [unitClaimWeight, setUnitClaimWeight]);

  useEffect(() => {
    setUom(uom);
  }, [uom, setUom]);

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

  useEffect(() => {
    setCaseUpc(caseUpcValue);
  }, [caseUpcValue, setCaseUpc]);

  useEffect(() => {
    setCasesPerPallet(Number(casesPerPallet));
  }, [casesPerPallet, setCasesPerPallet]);

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
              <h3 className={styles.sectionDivider}>Basic Information</h3>
              <div className={styles.field}>
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chocolate Protein Blend"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>SKU ID</label>
                <input
                  type="text"
                  placeholder="e.g. SKU-12345"
                  value={skuId}
                  onChange={(e) => setSkuId(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>BOM ID</label>
                <input
                  type="text"
                  placeholder="e.g. BOM-2024-001"
                  value={bomId}
                  onChange={(e) => setBomId(e.target.value)}
                />
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
                <label>WIP Description</label>
                <input
                  type="text"
                  placeholder="e.g. Chocolate Base Blend"
                  value={wipDescription}
                  onChange={(e) => setWipDescriptionState(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Spec Revision</label>
                <input
                  type="text"
                  placeholder="Rev A"
                  value={specRevision}
                  onChange={(e) => setSpecRevision(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Intended Use</label>
                <select
                  value={intendedUse}
                  onChange={(e) => setIntendedUse(e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option value="Retail">Retail</option>
                  <option value="Ingredient">Ingredient</option>
                  <option value="Inclusion">Inclusion</option>
                </select>
              </div>

              <h3 className={styles.sectionDivider}>Weight & Packaging</h3>
              <div className={styles.field}>
                <label>Unit Claim Weight</label>
                <input
                  type="number"
                  value={unitClaimWeight}
                  onChange={(e) => setLocalUnitClaimWeight(e.target.value)}
                  placeholder="e.g. 16"
                />
              </div>

              <div className={styles.fieldCompact}>
                <label>UOM</label>
                <select
                  className={styles.dropdownCompact}
                  value={uom}
                  onChange={(e) => setLocalUom(e.target.value)}
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
                  onChange={(e) => setLocalUnitsPerCase(Number(e.target.value))}
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
                  onChange={(e) => setLocalCasesPerPallet(Number(e.target.value))}
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
              
              <h3 className={styles.sectionDivider}>Product Details</h3>
              <div className={styles.field}>
                <label>Unit UPC</label>
                <input
                  type="text"
                  value={unitUpc}
                  onChange={(e) => setUnitUpc(e.target.value)}
                  placeholder="UPC code"
                />
              </div>

              <div className={styles.field}>
                <label>Lot Code Format</label>
                <input
                  type="text"
                  value={lotCodeFormatValue}
                  onChange={(e) => setLotCodeFormatValue(e.target.value)}
                  placeholder="e.g. YYMMDD-###"
                />
              </div>

              <div className={styles.field}>
                <label>Shelf Life</label>
                <div className={styles.shelfLifeGroup}>
                  <select
                    value={shelfLifeYears}
                    onChange={(e) => setShelfLifeYears(Number(e.target.value))}
                  >
                    <option>Years</option>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                  <select
                    value={shelfLifeMonths}
                    onChange={(e) => setShelfLifeMonths(Number(e.target.value))}
                  >
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

            <div className={styles.imagePreviewColumn}>
              <label>Product Image</label>
              <div {...getRootProps({ className: styles.dropzone })}>
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div className={styles.imagePreviewContainer}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <p>Drag & drop an image here, or click to select a file</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.subgrid}>
            <div className={styles.field}>
              <label>Case UPC</label>
              <input
                type="text"
                placeholder="Case UPC"
                value={caseUpcValue}
                onChange={(e) => setCaseUpcValue(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Pallet UPC</label>
              <input type="text" placeholder="Pallet UPC" />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductIdentification;
