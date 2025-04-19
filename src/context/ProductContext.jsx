import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // New structured state
  const [productIdentification, setProductIdentification] = useState(null);
  const [productionDetails, setProductionDetails] = useState(null);
  const [billOfMaterials, setBillOfMaterials] = useState(null);
  const [packoutDetails, setPackoutDetails] = useState(null);
  const [mixSteps, setMixSteps] = useState(null);
  const [productTesting, setProductTesting] = useState(null);
  
  // Original state variables (needed for backward compatibility)
  const [wipId, setWipId] = useState('');
  const [wipWeight, setWipWeight] = useState('');
  const [wipDescription, setWipDescription] = useState('');
  const [unitsPerCase, setUnitsPerCase] = useState(0);
  const [casesPerPallet, setCasesPerPallet] = useState(0);
  const [caseUpc, setCaseUpc] = useState('');
  const [upc, setUpc] = useState('');
  const [lotCodeFormat, setLotCodeFormat] = useState('');
  const [shelfLife, setShelfLife] = useState('');
  const [unitClaimWeight, setUnitClaimWeight] = useState('');
  const [unitNetWeight, setUnitNetWeight] = useState(0);
  const [uom, setUom] = useState('lbs');
  const [ingredientRows, setIngredientRows] = useState([]);
  const [inclusionRows, setInclusionRows] = useState([]);
  const [packagingRows, setPackagingRows] = useState([]);
  const [caseRows, setCaseRows] = useState([]);

  return (
    <ProductContext.Provider value={{
      // New structured state
      productIdentification,
      setProductIdentification,
      productionDetails,
      setProductionDetails,
      billOfMaterials,
      setBillOfMaterials,
      packoutDetails,
      setPackoutDetails,
      mixSteps,
      setMixSteps,
      productTesting,
      setProductTesting,
      
      // Original state variables
      wipId, 
      setWipId, 
      wipWeight, 
      setWipWeight,
      wipDescription,
      setWipDescription,
      unitsPerCase,
      setUnitsPerCase,
      casesPerPallet,
      setCasesPerPallet,
      caseUpc,
      setCaseUpc,
      upc,
      setUpc,
      lotCodeFormat,
      setLotCodeFormat,
      shelfLife,
      setShelfLife,
      unitClaimWeight,
      setUnitClaimWeight,
      unitNetWeight,
      setUnitNetWeight,
      uom,
      setUom,
      ingredientRows,
      setIngredientRows,
      inclusionRows,
      setInclusionRows,
      packagingRows,
      setPackagingRows,
      caseRows,
      setCaseRows
    }}>
      {children}
    </ProductContext.Provider>
  );
};
