import React from "react";
import CustomerInfo from "../components/CustomerInfo";
import ProductIdentification from "../components/ProductIdentification";
import PackagingClaims from "../components/PackagingClaims";
import BillOfMaterials from "../components/BillOfMaterials";
import ProductionDetails from "../components/ProductionDetails";
import PackoutDetails from "../components/PackoutDetails";
import MixInstructions from "../components/MixInstructions";
import ProductTesting from '../components/ProductTesting';
import EquipmentSetup from '../components/EquipmentSetup';
import Signatures from '../components/Signatures';
import ActivityLog from '../components/ActivityLog';
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
        <PackagingClaims />
        <ProductTesting />
        <EquipmentSetup />
        <Signatures />
        <ActivityLog />
      </div>
      
    </main>
  );
};

export default SpecSheetPage;
