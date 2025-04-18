import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
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
  const [mixSteps, setMixSteps] = useState([]);

  return (
    <ProductContext.Provider value={{ 
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
      setCaseRows,
      mixSteps,
      setMixSteps
    }}>
      {children}
    </ProductContext.Provider>
  );
};
