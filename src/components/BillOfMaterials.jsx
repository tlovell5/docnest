// src/components/BillOfMaterials.jsx
import React, { useState, useContext, useEffect } from 'react';
import styles from '../styles/BillOfMaterials.module.css';
import { ProductContext } from '../context/ProductContext';

const BillOfMaterials = () => {
  const { 
    wipId, 
    wipWeight, 
    unitsPerCase, 
    setIngredientRows: setContextIngredientRows,
    setInclusionRows: setContextInclusionRows,
    setPackagingRows: setContextPackagingRows,
    setCaseRows: setContextCaseRows,
    unitClaimWeight,
    uom
  } = useContext(ProductContext);

  const [isOpen, setIsOpen] = useState(true);
  
  const [ingredientRows, setIngredientRows] = useState([
    { id: Date.now(), percent: '', weight: '', allergen: 'No', sku: '', description: '', substitutes: [] }
  ]);
  const [inclusionRows, setInclusionRows] = useState([{ id: Date.now(), sku: '', description: '', qty: '', weight: '', allergen: 'No' }]);
  const [packagingRows, setPackagingRows] = useState([{ id: Date.now(), sku: '', description: '', length: '', width: '', height: '', qty: '', weight: '' }]);
  const [caseRows, setCaseRows] = useState([{ id: Date.now(), sku: '', description: 'Box', length: '', width: '', height: '', qty: '', weight: '' }]);

  useEffect(() => {
    setContextIngredientRows(ingredientRows);
  }, [ingredientRows, setContextIngredientRows]);

  useEffect(() => {
    setContextInclusionRows(inclusionRows);
  }, [inclusionRows, setContextInclusionRows]);

  useEffect(() => {
    setContextPackagingRows(packagingRows);
  }, [packagingRows, setContextPackagingRows]);

  useEffect(() => {
    setContextCaseRows(caseRows);
  }, [caseRows, setContextCaseRows]);

  const addRow = (setRows, defaultValues = {}) => setRows((prev) => [...prev, { id: Date.now(), ...defaultValues }]);
  const removeRow = (id, setRows) => setRows((prev) => prev.filter((row) => row.id !== id));

  const handleChange = (setter, id, field, value, context) => {
    setter((prev) => prev.map((row) => {
      if (row.id === id) {
        let updated = { ...row, [field]: value };
  
        // 💡 When changing the description in the "case" context to "Box"
        if (context === 'case' && field === 'description' && value === 'Box' && unitsPerCase) {
          updated.qty = (1 / unitsPerCase).toFixed(2); // ← This auto-fills qty
        }
  
        return updated;
      }
      return row;
    }));
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

  // Convert weight from grams to target UOM
  const convertFromGrams = (grams, targetUom) => {
    const gramsNum = parseFloat(grams) || 0;
    switch (targetUom) {
      case 'g':
        return gramsNum;
      case 'oz':
        return gramsNum / 28.3495;
      case 'lbs':
        return gramsNum / 453.592;
      case 'kg':
        return gramsNum / 1000;
      default:
        return gramsNum;
    }
  };

  // Get unit claim weight in the current UOM
  const getUnitWeightInCurrentUom = () => {
    // Convert unit claim weight to grams first, then to the current UOM
    const weightInGrams = convertToGrams(unitClaimWeight, uom);
    return convertFromGrams(weightInGrams, 'lbs'); // Ingredients table always shows weight in lbs
  };

  const handleIngredientChange = (id, field, value) => {
    setIngredientRows((prev) => {
      const updatedRows = prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          if (field === 'percent') {
            const percent = parseFloat(value) || 0;
            // Calculate weight based on percentage of unit claim weight
            const unitWeightInLbs = getUnitWeightInCurrentUom();
            const weight = (unitWeightInLbs * percent) / 100;
            updated.weight = weight.toFixed(2);
          }
          return updated;
        }
        return row;
      });

      // Recalculate weights if percentages change to ensure they sum to unit claim weight
      if (field === 'percent') {
        const totalPercent = updatedRows.reduce((sum, row) => sum + (parseFloat(row.percent) || 0), 0);
        
        // If total percent is not 0, adjust weights to match unit claim weight
        if (totalPercent > 0) {
          const unitWeightInLbs = getUnitWeightInCurrentUom();
          
          updatedRows.forEach(row => {
            const percent = parseFloat(row.percent) || 0;
            if (percent > 0) {
              const weight = (unitWeightInLbs * percent) / 100;
              row.weight = weight.toFixed(2);
            }
          });
        }
      }
      
      return updatedRows;
    });
  };

  const addSubstitute = (id) => {
    setIngredientRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updated = { ...row };
          updated.substitutes = [...(updated.substitutes || []), { id: Date.now(), sku: '', description: '' }];
          return updated;
        }
        return row;
      })
    );
  };

  const handleSubstituteChange = (ingredientId, subId, field, value) => {
    setIngredientRows((prev) =>
      prev.map((row) => {
        if (row.id === ingredientId) {
          const updated = { ...row };
          updated.substitutes = updated.substitutes.map((sub) =>
            sub.id === subId ? { ...sub, [field]: value } : sub
          );
          return updated;
        }
        return row;
      })
    );
  };

  const countDuplicates = (rows) => {
    const counts = rows.reduce((acc, row) => {
      const sku = row.sku || '';
      acc[sku] = (acc[sku] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).filter((sku) => counts[sku] > 1);
  };

  const duplicateIngredientSKUs = countDuplicates(ingredientRows);
  const duplicateInclusionSKUs = countDuplicates(inclusionRows);

  const totalPercent = ingredientRows.reduce((sum, row) => sum + parseFloat(row.percent || 0), 0);
  const totalWeight = ingredientRows.reduce((sum, row) => sum + parseFloat(row.weight || 0), 0);
  const percentDelta = 100 - totalPercent;

  return (
    <section className={styles.container}>
<div className={styles.toggleHeader} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
  <h2 className={styles.header}>Bill of Materials</h2>
  <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▶</span>
</div>

{isOpen && (
  <>
      {/* Ingredients Table */}
      <div className={styles.tableContainer}>
        <h4 className={styles.subHeader}>Ingredients</h4>
        <table className={`${styles.table} ${styles.ingredientsTable}`}>
          <thead>
            <tr><th>SKU</th><th>Description</th><th>%</th><th>Weight (lbs)</th><th>Allergens</th><th></th></tr>
          </thead>
          <tbody>
            {ingredientRows.map((row) => (
              <React.Fragment key={row.id}>
                <tr>
                  <td>
                    <input
                      type="text"
                      value={row.sku}
                      onChange={(e) => handleIngredientChange(row.id, 'sku', e.target.value)}
                      style={duplicateIngredientSKUs.includes(row.sku) ? { borderColor: 'red' } : {}}
                      title={duplicateIngredientSKUs.includes(row.sku) ? 'Duplicate SKU' : ''}
                    />
                  </td>
                  <td><input type="text" value={row.description} onChange={(e) => handleIngredientChange(row.id, 'description', e.target.value)} /></td>
                  <td><input type="number" value={row.percent} onChange={(e) => handleIngredientChange(row.id, 'percent', e.target.value)} /></td>
                  <td><input type="text" value={row.weight} readOnly /></td>
                  <td>
                    <select
                      value={row.allergen}
                      onChange={(e) => handleIngredientChange(row.id, 'allergen', e.target.value)}
                      title={row.allergen === 'Yes' ? 'Contains allergens' : 'No allergens'}
                      style={{ backgroundColor: row.allergen === 'Yes' ? '#ffe3e3' : '#e3ffe3', color: row.allergen === 'Yes' ? '#d00' : '#060', borderRadius: '6px', padding: '0.2rem', fontWeight: 'bold' }}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td>
                    {ingredientRows.length > 1 && <button className={styles.removeButton} onClick={() => removeRow(row.id, setIngredientRows)}>✕</button>}
                    <button className={styles.addButton} onClick={() => addSubstitute(row.id)} title="Add Substitute">＋</button>
                  </td>
                </tr>
                {row.substitutes?.map((sub) => (
                  <tr key={sub.id} className={styles.substituteRow}>
                    <td colSpan="2">
                      <input type="text" placeholder="Sub SKU" value={sub.sku} onChange={(e) => handleSubstituteChange(row.id, sub.id, 'sku', e.target.value)} />
                      <input type="text" placeholder="Sub Description" value={sub.description} onChange={(e) => handleSubstituteChange(row.id, sub.id, 'description', e.target.value)} />
                    </td>
                    <td colSpan="4" className={styles.subNote}>Substitute for above</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2"><strong>Totals:</strong></td>
              <td><strong>{totalPercent.toFixed(2)}%</strong></td>
              <td><strong>{totalWeight.toFixed(2)}</strong></td>
              <td colSpan="2">
                {totalPercent !== 100 && (
                  <span className={styles.warning}>⚠ Delta: {percentDelta.toFixed(2)}%</span>
                )}
                {totalPercent === 100 && Math.abs(totalWeight - getUnitWeightInCurrentUom()) > 0.01 && (
                  <span className={styles.warning}>⚠ Weight doesn't match unit claim weight</span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
        <button className={styles.addButton} onClick={() => addRow(setIngredientRows)}>+ Add Ingredient</button>
      </div>

      {/* Inclusions Table */}
      <div className={styles.tableContainer}>
        <h4 className={styles.subHeader}>Inclusions</h4>
        <table className={`${styles.table} ${styles.inclusionsTable}`}>
          <thead>
            <tr><th>SKU</th><th>Description</th><th>QTY (ea)</th><th>Weight (g)</th><th>Allergens</th><th></th></tr>
          </thead>
          <tbody>
            {inclusionRows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    title={row.sku}
                    type="text"
                    value={row.sku}
                    onChange={(e) => handleChange(setInclusionRows, row.id, 'sku', e.target.value)}
                  />
                </td>
                <td><input type="text" value={row.description} onChange={(e) => handleChange(setInclusionRows, row.id, 'description', e.target.value)} /></td>
                <td><input type="number" value={row.qty} onChange={(e) => handleChange(setInclusionRows, row.id, 'qty', e.target.value)} /></td>
                <td><input type="number" value={row.weight} onChange={(e) => handleChange(setInclusionRows, row.id, 'weight', e.target.value)} /></td>
                <td>
                  <select 
                    title={row.allergen === 'Yes' ? 'Contains allergens' : 'No allergens'} 
                    style={{
                      backgroundColor: row.allergen === 'Yes' ? '#ffebeb' : '#e3ffe3',
                      color: row.allergen === 'Yes' ? '#d00' : '#006600',
                      borderRadius: '6px',
                      padding: '0.2rem',
                      fontWeight: 'bold'
                    }}
                    value={row.allergen} 
                    onChange={(e) => handleChange(setInclusionRows, row.id, 'allergen', e.target.value)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td>{inclusionRows.length > 1 && <button className={styles.removeButton} onClick={() => removeRow(row.id, setInclusionRows)}>✕</button>}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"><strong>Total Weight:</strong></td>
              <td>
                <strong>
                  {inclusionRows.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0).toFixed(2)}
                </strong>
              </td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
        <div className={styles.addButtonWrapper}>
          <button className={styles.addButton} onClick={() => addRow(setInclusionRows)}>+ Add Inclusion</button>
        </div>
      </div>

            {/* Packaging Table */}
            <div className={styles.tableContainer}>
        <h4 className={styles.subHeader}>Packaging</h4>
        <table className={`${styles.table} ${styles.packagingTable}`}>
          <thead>
            <tr><th>SKU</th><th>Description</th><th>QTY (ea)</th><th>Weight (g)</th><th>Dimensions (L x W x H in)</th><th></th></tr>
          </thead>
          <tbody>
            {packagingRows.map((row) => (
              <tr key={row.id}>
                <td><input type="text" value={row.sku} onChange={(e) => handleChange(setPackagingRows, row.id, 'sku', e.target.value)} /></td>
                <td><input type="text" value={row.description} onChange={(e) => handleChange(setPackagingRows, row.id, 'description', e.target.value)} /></td>
                <td><input type="number" value={row.qty} onChange={(e) => handleChange(setPackagingRows, row.id, 'qty', e.target.value)} /></td>
                <td><input type="number" value={row.weight} onChange={(e) => handleChange(setPackagingRows, row.id, 'weight', e.target.value)} /></td>
                <td>
                  <div className={styles.dimensionInputs}>
                    <input type="number" placeholder="L" value={row.length} onChange={(e) => handleChange(setPackagingRows, row.id, 'length', e.target.value)} />
                    <input type="number" placeholder="W" value={row.width} onChange={(e) => handleChange(setPackagingRows, row.id, 'width', e.target.value)} />
                    <input type="number" placeholder="H" value={row.height} onChange={(e) => handleChange(setPackagingRows, row.id, 'height', e.target.value)} />
                  </div>
                </td>
                <td>{packagingRows.length > 1 && <button className={styles.removeButton} onClick={() => removeRow(row.id, setPackagingRows)}>✕</button>}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"><strong>Total Weight:</strong></td>
              <td>
                <strong>
                  {packagingRows.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0).toFixed(2)}
                </strong>
              </td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
        <div className={styles.addButtonWrapper}>
          <button className={styles.addButton} onClick={() => addRow(setPackagingRows)}>+ Add Packaging</button>
        </div>
      </div>
      

       {/* Case Table */}
      <div className={styles.tableContainer}>
        <h4 className={styles.subHeader}>Case</h4>
        <table className={`${styles.table} ${styles.caseTable}`}>
          <thead>
            <tr><th>SKU</th><th>Description</th><th>QTY (ea)</th><th>Weight (g)</th><th>Dimensions (L x W x H in)</th><th></th></tr>
          </thead>
          <tbody>
            {caseRows.map((row) => (
              <tr key={row.id}>
                <td><input type="text" value={row.sku} onChange={(e) => handleChange(setCaseRows, row.id, 'sku', e.target.value)} /></td>
                <td>
                <select 
                  value={row.description} 
                  onChange={(e) => handleChange(setCaseRows, row.id, 'description', e.target.value, 'case')}
                  style={{
                    backgroundColor: '#f0f7ff',
                    color: '#4a90e2',
                    borderRadius: '6px',
                    padding: '0.2rem',
                    fontWeight: 'bold',
                    width: '100%'
                  }}
                >
                    <option value="Box">Box</option>
                    <option value="Tray">Tray</option>
                    <option value="Divider">Divider</option>
                  </select>
                </td>
                <td><input type="number" value={row.qty} onChange={(e) => handleChange(setCaseRows, row.id, 'qty', e.target.value)} /></td>
                <td><input type="number" value={row.weight} onChange={(e) => handleChange(setCaseRows, row.id, 'weight', e.target.value)} /></td>
                <td>
                  <div className={styles.dimensionInputs}>
                    <input type="number" placeholder="L" value={row.length} onChange={(e) => handleChange(setCaseRows, row.id, 'length', e.target.value)} />
                    <input type="number" placeholder="W" value={row.width} onChange={(e) => handleChange(setCaseRows, row.id, 'width', e.target.value)} />
                    <input type="number" placeholder="H" value={row.height} onChange={(e) => handleChange(setCaseRows, row.id, 'height', e.target.value)} />
                  </div>
                </td>
                <td>{caseRows.length > 1 && <button className={styles.removeButton} onClick={() => removeRow(row.id, setCaseRows)}>✕</button>}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3"><strong>Total Weight:</strong></td>
              <td>
                <strong>
                  {caseRows.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0).toFixed(2)}
                </strong>
              </td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
        <div className={styles.addButtonWrapper}>
          <button className={styles.addButton} onClick={() => addRow(setCaseRows)}>+ Add Case</button>
        </div>
      </div>

      {duplicateIngredientSKUs.length > 0 && (
        <div className={styles.warning} title="Duplicate SKUs detected">
          ⚠ Duplicate Ingredient SKUs detected: {duplicateIngredientSKUs.join(', ')}
        </div>
           )}
           </>
      )}
    </section>
  );
};

export default BillOfMaterials;
