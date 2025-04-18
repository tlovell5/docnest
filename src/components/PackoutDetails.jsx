// src/components/PackoutDetails.jsx
import React, { useState, useContext, useCallback } from 'react';
import styles from '../styles/PackoutDetails.module.css';
import { ProductContext } from '../context/ProductContext';
import { useDropzone } from 'react-dropzone';

const PackoutDetails = () => {
  const {
    unitsPerCase,
    caseUpc,
    casesPerPallet,
    packagingRows,
    caseRows,
    ingredientRows,
    inclusionRows,
    unitClaimWeight,
    uom
  } = useContext(ProductContext);

  const [isOpen, setIsOpen] = useState(true);
  const [singleLayerImage, setSingleLayerImage] = useState(null);
  const [twoLayersImage, setTwoLayersImage] = useState(null);
  const [fullPalletImage, setFullPalletImage] = useState(null);
  const [labelSize, setLabelSize] = useState('2x2');
  const [tiHi, setTiHi] = useState({ ti: '', hi: '' });
  const [palletConfigSteps, setPalletConfigSteps] = useState([{ id: Date.now(), text: '' }]);

  // Format numbers with 2 decimal places
  const formatNumber = (num) => (parseFloat(num) || 0).toFixed(2);

  // Convert grams to pounds
  const gramsToPounds = (grams) => {
    return (parseFloat(grams) / 453.592) || 0;
  };

  // Convert weight to grams based on UOM
  const convertToGrams = (weight, sourceUom) => {
    const weightNum = parseFloat(weight) || 0;
    switch (sourceUom) {
      case 'g':
        return weightNum;
      case 'oz':
        return weightNum * 28.3495;
      case 'lbs':
        return weightNum * 453.592;
      case 'kg':
        return weightNum * 1000;
      default:
        return weightNum;
    }
  };

  // Calculate unit weight in grams (same as in ProductionDetails)
  const calculateUnitWeightInGrams = () => {
    // Calculate packaging weight
    const packagingWeight = packagingRows?.reduce((sum, row) => sum + parseFloat(row.weight || 0), 0) || 0;
    
    // Calculate inclusion weight
    const inclusionWeight = inclusionRows?.reduce((sum, row) => sum + parseFloat(row.weight || 0), 0) || 0;
    
    // Convert ingredient weight based on UOM
    let ingredientWeightInGrams = 0;
    if (unitClaimWeight) {
      const weight = parseFloat(unitClaimWeight);
      if (!isNaN(weight)) {
        ingredientWeightInGrams = convertToGrams(weight, uom);
      }
    }
    
    // Total unit weight in grams
    return packagingWeight + inclusionWeight + ingredientWeightInGrams;
  };

  // Calculate total case weight in pounds
  const calculateTotalCaseWeight = () => {
    // 1. Get unit weight in grams (from ProductionDetails calculation)
    const unitWeightInGrams = calculateUnitWeightInGrams();
    
    // 2. Multiply by units per case
    const unitsWeightInGrams = unitWeightInGrams * (parseFloat(unitsPerCase) || 0);
    
    // 3. Get case materials weight in grams
    const caseMaterialsWeightInGrams = caseRows?.reduce((sum, row) => 
      sum + parseFloat(row.weight || 0), 0) || 0;
    
    // 4. Add units weight and case materials weight, then convert to pounds
    return gramsToPounds(unitsWeightInGrams + caseMaterialsWeightInGrams);
  };

  // Get case materials from BillOfMaterials with formatted descriptions
  const caseMaterials = caseRows?.map(row => {
    // Format dimensions if available
    let dimensionsText = '';
    if (row.length && row.width && row.height) {
      dimensionsText = ` (${row.length}" x ${row.width}" x ${row.height}")`;
    }
    
    return {
      sku: row.sku || '',
      // Combine description and dimensions
      description: `${row.description || ''}${dimensionsText}`,
      qty: row.qty || '',
      uom: 'ea'
    };
  }) || [];

  const totalCaseWeight = calculateTotalCaseWeight();
  
  // Calculate pallet weight
  const palletWeight = totalCaseWeight * (parseFloat(casesPerPallet) || 0);

  // Handle image uploads
  const onDropSingleLayer = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSingleLayerImage(URL.createObjectURL(file));
    }
  }, []);

  const onDropTwoLayers = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setTwoLayersImage(URL.createObjectURL(file));
    }
  }, []);

  const onDropFullPallet = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFullPalletImage(URL.createObjectURL(file));
    }
  }, []);

  const getSingleLayerDropzone = useDropzone({
    onDrop: onDropSingleLayer,
    accept: { 'image/*': [] }
  });

  const getTwoLayersDropzone = useDropzone({
    onDrop: onDropTwoLayers,
    accept: { 'image/*': [] }
  });

  const getFullPalletDropzone = useDropzone({
    onDrop: onDropFullPallet,
    accept: { 'image/*': [] }
  });

  return (
    <section className={styles.container}>
      <div className={styles.toggleHeader} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <h2 className={styles.header}>Packout Details</h2>
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▶</span>
      </div>
      
      {isOpen && (
        <>
          <div className={styles.detailsContainer}>
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>Case Information</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.row}>
                  <label>Units per Case:</label>
                  <span>{unitsPerCase || 'Not specified'}</span>
                </div>
                <div className={styles.row}>
                  <label>Case UPC:</label>
                  <span>{caseUpc || 'Not specified'}</span>
                </div>
                <div className={styles.row}>
                  <label>Total Case Weight:</label>
                  <span>{formatNumber(totalCaseWeight)} lbs</span>
                </div>
                <div className={styles.row}>
                  <label>Label Size:</label>
                  <select 
                    value={labelSize}
                    onChange={(e) => setLabelSize(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="2x2">2x2</option>
                    <option value="4x6">4x6</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>Case Materials</h3>
              <div className={styles.materialsTable}>
                <div className={styles.materialHeader}>
                  <span className={styles.materialSku}>SKU</span>
                  <span className={styles.materialDescriptionCompact}>Description</span>
                </div>
                {caseMaterials.length > 0 ? (
                  caseMaterials.map((material, index) => (
                    <div key={index} className={styles.materialItemCompact}>
                      <span className={styles.materialSku}>{material.sku}</span>
                      <span className={styles.materialDescriptionCompact}>{material.description}</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyMessage}>No case materials specified</div>
                )}
              </div>
            </div>
            
            <div className={styles.detailsSection}>
              <h3 className={styles.sectionTitle}>Pallet Configuration</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.row}>
                  <label>TI/HI:</label>
                  <div className={styles.tiHiInputs}>
                    <input
                      type="number"
                      placeholder="TI"
                      value={tiHi.ti}
                      onChange={(e) => setTiHi({...tiHi, ti: e.target.value})}
                      className={styles.tiHiInput}
                    />
                    <span>/</span>
                    <input
                      type="number"
                      placeholder="HI"
                      value={tiHi.hi}
                      onChange={(e) => setTiHi({...tiHi, hi: e.target.value})}
                      className={styles.tiHiInput}
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <label>Cases per Pallet:</label>
                  <span>{casesPerPallet || 'Not specified'}</span>
                </div>
                <div className={styles.row}>
                  <label>Pallet Weight:</label>
                  <span>{formatNumber(palletWeight)} lbs</span>
                </div>
                <div className={styles.fullWidthRow}>
                  <label>Configuration Instructions:</label>
                  <div className={styles.stepByStepContainer}>
                    {palletConfigSteps.map((step, index) => (
                      <div key={step.id} className={styles.stepRow}>
                        <div className={styles.stepNumber}>{index + 1}</div>
                        <input
                          type="text"
                          placeholder={`Step ${index + 1}...`}
                          value={step.text}
                          onChange={(e) => {
                            const updatedSteps = [...palletConfigSteps];
                            updatedSteps[index].text = e.target.value;
                            setPalletConfigSteps(updatedSteps);
                          }}
                          className={styles.stepInput}
                        />
                        <div className={styles.stepActions}>
                          {palletConfigSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPalletConfigSteps(palletConfigSteps.filter((_, i) => i !== index));
                              }}
                              className={styles.removeStepButton}
                              title="Remove step"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setPalletConfigSteps([...palletConfigSteps, { id: Date.now(), text: '' }]);
                      }}
                      className={styles.addStepButton}
                    >
                      + Add Step
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.imagesGrid}>
            <div className={styles.imageUpload}>
              <label>Single Layer Configuration:</label>
              <div {...getSingleLayerDropzone.getRootProps({ className: styles.dropzone })}>
                <input {...getSingleLayerDropzone.getInputProps()} />
                {singleLayerImage ? (
                  <img src={singleLayerImage} alt="Single Layer Configuration" className={styles.uploadedImage} />
                ) : (
                  <p>Drag & drop or click to upload</p>
                )}
              </div>
            </div>
            
            <div className={styles.imageUpload}>
              <label>Two Layers Configuration:</label>
              <div {...getTwoLayersDropzone.getRootProps({ className: styles.dropzone })}>
                <input {...getTwoLayersDropzone.getInputProps()} />
                {twoLayersImage ? (
                  <img src={twoLayersImage} alt="Two Layers Configuration" className={styles.uploadedImage} />
                ) : (
                  <p>Drag & drop or click to upload</p>
                )}
              </div>
            </div>
            
            <div className={styles.imageUpload}>
              <label>Full Pallet Configuration:</label>
              <div {...getFullPalletDropzone.getRootProps({ className: styles.dropzone })}>
                <input {...getFullPalletDropzone.getInputProps()} />
                {fullPalletImage ? (
                  <img src={fullPalletImage} alt="Full Pallet Configuration" className={styles.uploadedImage} />
                ) : (
                  <p>Drag & drop or click to upload</p>
                )}
              </div>
            </div>
            
            <div className={styles.imageUpload}>
              <label>Case Label Placement:</label>
              <div className={styles.dropzone}>
                <p>Drag & drop or click to upload</p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default PackoutDetails;
