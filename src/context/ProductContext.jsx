import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [wipId, setWipId] = useState('');
  const [wipWeight, setWipWeight] = useState('');
  const [wipDescription, setWipDescription] = useState('');
  const [unitsPerCase, setUnitsPerCase] = useState(0);
  const [upc, setUpc] = useState('');
  const [lotCodeFormat, setLotCodeFormat] = useState('');
  const [shelfLife, setShelfLife] = useState('');
  const [unitClaimWeight, setUnitClaimWeight] = useState('');
  const [uom, setUom] = useState('lbs');
  const [ingredientRows, setIngredientRows] = useState([]);
  const [inclusionRows, setInclusionRows] = useState([]);
  const [packagingRows, setPackagingRows] = useState([]);

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
      upc,
      setUpc,
      lotCodeFormat,
      setLotCodeFormat,
      shelfLife,
      setShelfLife,
      unitClaimWeight,
      setUnitClaimWeight,
      uom,
      setUom,
      ingredientRows,
      setIngredientRows,
      inclusionRows,
      setInclusionRows,
      packagingRows,
      setPackagingRows
    }}>
      {children}
    </ProductContext.Provider>
  );
};
