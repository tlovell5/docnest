import React from "react";
import CustomerInfo from "../components/CustomerInfo";
import ProductIdentification from "../components/ProductIdentification";
import PackagingClaims from "../components/PackagingClaims";
import BillOfMaterials from "../components/BillOfMaterials";
import ProductionDetails from "../components/ProductionDetails";
import PackoutDetails from "../components/PackoutDetails";
import MixInstructions from "../components/MixInstructions";
import ProductTesting from '../components/ProductTesting';
import styles from '../styles/SpecSheetPage.module.css';

const SpecSheetPage = () => {
  return (
    <main className={styles.mainContainer}>
      <CustomerInfo />
      <div className={styles.content}>
        <ProductIdentification />
        <ProductionDetails />
        <BillOfMaterials />
        <PackoutDetails />
        <MixInstructions />
        <ProductTesting />
      </div>
      <PackagingClaims />
    </main>
  );
};

export default SpecSheetPage;
