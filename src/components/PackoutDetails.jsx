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
    unitNetWeight
  } = useContext(ProductContext);

  const [isOpen, setIsOpen] = useState(true);
  const [singleLayerImage, setSingleLayerImage] = useState(null);
  const [twoLayersImage, setTwoLayersImage] = useState(null);
  const [fullPalletImage, setFullPalletImage] = useState(null);
  const [labelSize, setLabelSize] = useState('2x2');
  const [tiHi, setTiHi] = useState({ ti: '', hi: '' });
  const [palletConfig, setPalletConfig] = useState('');

  // Format numbers with 2 decimal places
  const formatNumber = (num) => (parseFloat(num) || 0).toFixed(2);

  // Convert grams to pounds
  const gramsToPounds = (grams) => {
    return (parseFloat(grams) / 453.592) || 0;
  };

  // Get case materials from BillOfMaterials
  const caseMaterials = caseRows?.map(row => ({
    sku: row.sku,
    description: row.description || '',
    qty: row.qty || '',
    uom: 'ea'
  })) || [];

  // Calculate total case weight in pounds
  const calculateTotalCaseWeight = () => {
    // Calculate total weight of all units in the case
    const unitsWeight = (parseFloat(unitsPerCase) || 0) * (parseFloat(unitNetWeight) || 0);
    
    // Calculate total weight of case materials
    const caseWeight = caseRows?.reduce((sum, row) => sum + parseFloat(row.weight || 0), 0) || 0;
    
    // Convert total weight from grams to pounds
    return gramsToPounds(unitsWeight + caseWeight);
  };

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
                  <span className={styles.materialQtyCompact}>Quantity</span>
                </div>
                {caseMaterials.length > 0 ? (
                  caseMaterials.map((material, index) => (
                    <div key={index} className={styles.materialItemCompact}>
                      <span className={styles.materialSku}>{material.sku}</span>
                      <span className={styles.materialDescriptionCompact}>{material.description}</span>
                      <span className={styles.materialQtyCompact}>{material.qty} {material.uom}</span>
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
                  <textarea
                    placeholder="Enter pallet configuration instructions..."
                    value={palletConfig}
                    onChange={(e) => setPalletConfig(e.target.value)}
                    className={styles.configTextarea}
                    rows={3}
                  />
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
