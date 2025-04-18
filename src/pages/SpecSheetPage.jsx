import React from "react";
import CustomerInfo from "../components/CustomerInfo";
import ProductIdentification from "../components/ProductIdentification";
import PackagingClaims from "../components/PackagingClaims";
import BillOfMaterials from "../components/BillOfMaterials";
import ProductionDetails from "../components/ProductionDetails";

const SpecSheetPage = () => {
  return (
    <main style={{ padding: "2rem" }}>
      <CustomerInfo />
      <ProductIdentification />
      <PackagingClaims />
      <BillOfMaterials />
      <ProductionDetails />
    </main>
  );
};

export default SpecSheetPage;
