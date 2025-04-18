import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [wipId, setWipId] = useState('');
  const [wipWeight, setWipWeight] = useState('');

  return (
    <ProductContext.Provider value={{ wipId, setWipId, wipWeight, setWipWeight }}>
      {children}
    </ProductContext.Provider>
  );
};
