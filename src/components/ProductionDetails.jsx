// src/components/ProductionDetails.jsx
import React, { useState, useContext, useCallback } from 'react';
import styles from '../styles/ProductionDetails.module.css';
import { ProductContext } from '../context/ProductContext';
import { useDropzone } from 'react-dropzone';

const ProductionDetails = () => {
  const {
    wipId,
    wipWeight,
    wipDescription,
    ingredientRows,
    inclusionRows,
    packagingRows,
    upc,
    lotCodeFormat,
    shelfLife,
    unitClaimWeight,
    uom
  } = useContext(ProductContext);

  const [isOpen, setIsOpen] = useState(true);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [lotCodeImage, setLotCodeImage] = useState(null);
  const [inclusionImage, setInclusionImage] = useState(null);

  const formatNumber = (num) => (parseFloat(num) || 0).toFixed(2);

  // Function to convert weights to grams
  const convertToGrams = (value, uomType) => {
    const numValue = parseFloat(value) || 0;
    switch (uomType.toLowerCase()) {
      case 'g':
        return numValue;
      case 'oz':
        return numValue * 28.3495;
      case 'lbs':
        return numValue * 453.592;
      case 'kg':
        return numValue * 1000;
      default:
        return numValue;
    }
  };

  // Function to determine if a UOM is weight-based
  const isWeightUOM = (uom) => {
    const weightUOMs = ['g', 'oz', 'lbs', 'kg'];
    return weightUOMs.includes(uom.toLowerCase());
  };

  // Calculate weights
  const packagingWeight = packagingRows?.reduce((sum, row) => sum + parseFloat(row.weight || 0), 0) || 0;
  
  const inclusionWeight = inclusionRows?.reduce((sum, row) => sum + parseFloat(row.weight || 0), 0) || 0;
  
  // Convert ingredient weight based on UOM
  let ingredientWeightInGrams = 0;
  if (unitClaimWeight) {
    const weight = parseFloat(unitClaimWeight);
    if (!isNaN(weight)) {
      switch (uom) {
        case 'g':
          ingredientWeightInGrams = weight;
          break;
        case 'oz':
          ingredientWeightInGrams = weight * 28.3495;
          break;
        case 'lbs':
          ingredientWeightInGrams = weight * 453.592;
          break;
        case 'kg':
          ingredientWeightInGrams = weight * 1000;
          break;
        default:
          ingredientWeightInGrams = weight;
      }
    }
  }
  
  const netWeight = packagingWeight + inclusionWeight + ingredientWeightInGrams;

  // Collect all materials with their details
  const materials = [];
  
  // Add WIP or ingredients
  if (wipId) {
    materials.push({
      sku: wipId,
      description: wipDescription || 'WIP',
      qty: wipWeight || '',
      uom: 'lbs'
    });
  } else if (ingredientRows?.length === 1) {
    const row = ingredientRows[0];
    materials.push({
      sku: row.sku || '',
      description: row.description || '',
      qty: row.weight || '',
      uom: 'lbs'
    });
  } else if (ingredientRows?.length > 1) {
    ingredientRows.forEach(row => {
      if (row.sku) {
        materials.push({
          sku: row.sku,
          description: row.description || '',
          qty: row.weight || '',
          uom: 'lbs'
        });
      }
    });
  }
  
  // Add inclusion SKUs
  if (inclusionRows?.length > 0) {
    inclusionRows.forEach(row => {
      if (row.sku) {
        materials.push({
          sku: row.sku,
          description: row.description || '',
          qty: row.qty || '',
          uom: 'ea'
        });
      }
    });
  }
  
  // Add packaging SKUs
  if (packagingRows?.length > 0) {
    packagingRows.forEach(row => {
      if (row.sku) {
        materials.push({
          sku: row.sku,
          description: row.description || '',
          qty: row.qty || '',
          uom: 'ea'
        });
      }
    });
  }

  // Filter out duplicates by SKU
  const uniqueMaterials = [];
  const skuSet = new Set();
  
  materials.forEach(material => {
    if (!skuSet.has(material.sku)) {
      skuSet.add(material.sku);
      uniqueMaterials.push(material);
    }
  });

  // Convert shelf life from days to a readable format
  const shelfLifeDays = parseInt(shelfLife) || 0;
  const shelfLifeMonths = shelfLifeDays > 0 ? Math.round(shelfLifeDays / 30) : 0;
  const shelfLifeFormatted = shelfLifeDays > 0 ? `${shelfLifeMonths} months` : 'Not specified';

  // Handle image uploads
  const onDropFront = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFrontImage(URL.createObjectURL(file));
    }
  }, []);

  const onDropBack = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setBackImage(URL.createObjectURL(file));
    }
  }, []);

  const onDropLotCode = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setLotCodeImage(URL.createObjectURL(file));
    }
  }, []);

  const onDropInclusion = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setInclusionImage(URL.createObjectURL(file));
    }
  }, []);

  const getFrontDropzone = useDropzone({
    onDrop: onDropFront,
    accept: { 'image/*': [] }
  });

  const getBackDropzone = useDropzone({
    onDrop: onDropBack,
    accept: { 'image/*': [] }
  });

  const getLotCodeDropzone = useDropzone({
    onDrop: onDropLotCode,
    accept: { 'image/*': [] }
  });

  const getInclusionDropzone = useDropzone({
    onDrop: onDropInclusion,
    accept: { 'image/*': [] }
  });

  return (
    <section className={styles.container}>
      <div className={styles.toggleHeader} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <h2 className={styles.header}>Production Details</h2>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▶</span>
      </div>
      
      {isOpen && (
        <>
          <div className={styles.detailsContainer}>
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>Product Information</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.row}>
                  <label>Unit UPC:</label>
                  <span>{upc || 'Not specified'}</span>
                </div>
                <div className={styles.row}>
                  <label>Lot Code Format:</label>
                  <span>{lotCodeFormat || 'Not specified'}</span>
                </div>
                <div className={styles.row}>
                  <label>Shelf Life:</label>
                  <span>{shelfLifeFormatted}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>Weight Information</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.row}>
                  <label>Packaging Weight:</label>
                  <span>{formatNumber(packagingWeight)} g</span>
                </div>
                <div className={styles.row}>
                  <label>Unit Inclusion Weight:</label>
                  <span>{formatNumber(inclusionWeight)} g</span>
                </div>
                <div className={styles.row}>
                  <label>Unit Ingredient Weight:</label>
                  <span>{formatNumber(ingredientWeightInGrams)} g</span>
                </div>
                <div className={styles.row}>
                  <label>Unit Net Weight:</label>
                  <span>{formatNumber(netWeight)} g</span>
                </div>
              </div>
            </div>
            
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>Materials</h3>
              <div className={styles.materialsTable}>
                <div className={styles.materialHeader}>
                  <span className={styles.materialSku}>SKU</span>
                  <span className={styles.materialDescriptionCompact}>Description</span>
                  <span className={styles.materialQtyCompact}>Quantity</span>
                </div>
                {uniqueMaterials.length > 0 ? (
                  uniqueMaterials.map((material, index) => (
                    <div key={index} className={styles.materialItemCompact}>
                      <span className={styles.materialSku}>{material.sku}</span>
                      <span className={styles.materialDescriptionCompact}>{material.description}</span>
                      <span className={styles.materialQtyCompact}>
                        {isWeightUOM(material.uom) 
                          ? `${formatNumber(convertToGrams(material.qty, material.uom))} g` 
                          : `${material.qty} ${material.uom}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyMessage}>No materials specified</div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.imagesGrid}>
            <div className={styles.imageUpload}>
              <label>Front of Product Artwork:</label>
              <div {...getFrontDropzone.getRootProps({ className: styles.dropzone })}>
                <input {...getFrontDropzone.getInputProps()} />
                {frontImage ? (
                  <img src={frontImage} alt="Front of Product" className={styles.uploadedImage} />
                ) : (
                  <p>Drag & drop or click to upload</p>
                )}
              </div>
            </div>
            
            <div className={styles.imageUpload}>
              <label>Back of Product Artwork:</label>
              <div {...getBackDropzone.getRootProps({ className: styles.dropzone })}>
                <input {...getBackDropzone.getInputProps()} />
                {backImage ? (
                  <img src={backImage} alt="Back of Product" className={styles.uploadedImage} />
                ) : (
                  <p>Drag & drop or click to upload</p>
                )}
              </div>
            </div>
            
            <div className={styles.imageUpload}>
              <label>Lot Code Placement Image:</label>
              <div {...getLotCodeDropzone.getRootProps({ className: styles.dropzone })}>
                <input {...getLotCodeDropzone.getInputProps()} />
                {lotCodeImage ? (
                  <img src={lotCodeImage} alt="Lot Code Placement" className={styles.uploadedImage} />
                ) : (
                  <p>Drag & drop or click to upload</p>
                )}
              </div>
            </div>
            
            <div className={styles.imageUpload}>
              <label>Inclusion Image:</label>
              <div {...getInclusionDropzone.getRootProps({ className: styles.dropzone })}>
                <input {...getInclusionDropzone.getInputProps()} />
                {inclusionImage ? (
                  <img src={inclusionImage} alt="Inclusion" className={styles.uploadedImage} />
                ) : (
                  <p>Drag & drop or click to upload</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductionDetails;
