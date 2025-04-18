import React from "react";
import SpecSheetPage from "./pages/SpecSheetPage";
import { ProductProvider } from "./context/ProductContext";
function App() {
  return (
    <div className="App">
      <ProductProvider>
        <SpecSheetPage />
      </ProductProvider>
    </div>
  );
}

export default App;

