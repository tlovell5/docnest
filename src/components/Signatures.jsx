// src/components/Signatures.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
import { ProductContext } from '../context/ProductContext';
import styles from '../styles/Signatures.module.css';
import sharedStyles from '../styles/SharedStyles.module.css';

const Signatures = () => {
  const { signatures, setSignatures } = useContext(ProductContext);
  const [isOpen, setIsOpen] = useState(true);
  
  const customerCanvasRef = useRef(null);
  const qualityManagerCanvasRef = useRef(null);
  const productionManagerCanvasRef = useRef(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Initialize with default values if empty
  useEffect(() => {
    if (!signatures) {
      setSignatures({
        customer: {
          name: '',
          signature: null,
          signedAt: null
        },
        qualityManager: {
          name: '',
          signature: null,
          signedAt: null
        },
        productionManager: {
          name: '',
          signature: null,
          signedAt: null
        }
      });
    }
  }, [signatures, setSignatures]);

  // Update name field
  const updateName = (role, value) => {
    if (!signatures) return;
    
    setSignatures({
      ...signatures,
      [role]: {
        ...signatures[role],
        name: value
      }
    });
  };

  // Setup canvas for drawing
  const setupCanvas = (canvasRef) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match its display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Set line style
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
  };

  // Initialize all canvases
  useEffect(() => {
    setupCanvas(customerCanvasRef);
    setupCanvas(qualityManagerCanvasRef);
    setupCanvas(productionManagerCanvasRef);
    
    // Handle window resize
    const handleResize = () => {
      setupCanvas(customerCanvasRef);
      setupCanvas(qualityManagerCanvasRef);
      setupCanvas(productionManagerCanvasRef);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Start drawing
  const startDrawing = (e, canvasRef) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    setIsDrawing(true);
    
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  // Draw
  const draw = (e, canvasRef) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear signature
  const clearSignature = (role, canvasRef) => {
    if (!canvasRef.current || !signatures) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    setSignatures({
      ...signatures,
      [role]: {
        ...signatures[role],
        signature: null,
        signedAt: null
      }
    });
  };

  // Save signature
  const saveSignature = (role, canvasRef) => {
    if (!canvasRef.current || !signatures) return;
    
    const canvas = canvasRef.current;
    const signatureImage = canvas.toDataURL('image/png');
    const currentDate = new Date();
    
    setSignatures({
      ...signatures,
      [role]: {
        ...signatures[role],
        signature: signatureImage,
        signedAt: currentDate
      }
    });
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

  // Render signature box
  const renderSignatureBox = (title, role, canvasRef) => {
    if (!signatures) return null;
    
    const signatureData = signatures[role];
    
    return (
      <div className={styles.signatureBox}>
        <h3 className={styles.signatureTitle}>{title}</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Printed Name</label>
          <input
            type="text"
            className={styles.input}
            value={signatureData?.name || ''}
            onChange={(e) => updateName(role, e.target.value)}
            placeholder="Enter full name"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Signature</label>
          {signatureData?.signature ? (
            <div>
              <img 
                src={signatureData.signature} 
                alt="Signature" 
                className={styles.signedImage} 
              />
              <div className={styles.signatureInfo}>
                <div>Signed by: {signatureData.name}</div>
                <div className={styles.signatureDate}>
                  Date: {formatDate(signatureData.signedAt)}
                </div>
              </div>
              <button 
                className={styles.clearButton}
                onClick={() => clearSignature(role, canvasRef)}
              >
                Clear Signature
              </button>
            </div>
          ) : (
            <div>
              <canvas
                ref={canvasRef}
                className={styles.signatureCanvas}
                onMouseDown={(e) => startDrawing(e, canvasRef)}
                onMouseMove={(e) => draw(e, canvasRef)}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
              />
              <div className={styles.signatureActions}>
                <button 
                  className={styles.clearButton}
                  onClick={() => clearSignature(role, canvasRef)}
                >
                  Clear
                </button>
                <button 
                  className={styles.signButton}
                  onClick={() => saveSignature(role, canvasRef)}
                >
                  Sign
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className={`${styles.container} ${sharedStyles.standardContainer}`}>
      <div 
        className={`${styles.toggleHeader} ${sharedStyles.toggleHeader}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className={`${styles.header} ${sharedStyles.header}`}>Signatures</h2>
        <span className={`${styles.arrow} ${sharedStyles.arrow} ${isOpen ? styles.open : ''}`}>▶</span>
      </div>
      
      {isOpen && (
        <div className={`${styles.content} ${sharedStyles.content}`}>
          <div className={styles.signaturesGrid}>
            {renderSignatureBox('Customer', 'customer', customerCanvasRef)}
            {renderSignatureBox('Quality Manager', 'qualityManager', qualityManagerCanvasRef)}
            {renderSignatureBox('Production Manager', 'productionManager', productionManagerCanvasRef)}
          </div>
        </div>
      )}
    </section>
  );
};

export default Signatures;
