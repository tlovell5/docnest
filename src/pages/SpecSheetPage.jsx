import React from "react";
import CustomerInfo from "../components/CustomerInfo";
import ProductIdentification from "../components/ProductIdentification";
import PackagingClaims from "../components/PackagingClaims";
import BillOfMaterials from "../components/BillOfMaterials";
import ProductionDetails from "../components/ProductionDetails";
import PackoutDetails from "../components/PackoutDetails";

const SpecSheetPage = () => {
  return (
    <main style={{ padding: "2rem" }}>
      <CustomerInfo />
      <ProductIdentification />
      <PackagingClaims />
      <BillOfMaterials />
      <ProductionDetails />
      <PackoutDetails />
    </main>
  );
};

export default SpecSheetPage;
