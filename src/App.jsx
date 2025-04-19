import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SpecSheetPage from "./pages/SpecSheetPage";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation";
import { ProductProvider } from "./context/ProductContext";
import { DashboardProvider } from "./context/DashboardContext";

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Routes>
          <Route 
            path="/" 
            element={
              <DashboardProvider>
                <Dashboard />
              </DashboardProvider>
            } 
          />
          <Route 
            path="/spec-sheet/:id?" 
            element={
              <ProductProvider>
                <SpecSheetPage />
              </ProductProvider>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
