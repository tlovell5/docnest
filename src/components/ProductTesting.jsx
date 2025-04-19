import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import styles from '../styles/ProductTesting.module.css';
import sharedStyles from '../styles/SharedStyles.module.css';

const ProductTesting = () => {
  const { productTesting, setProductTesting } = useContext(ProductContext);
  const [isOpen, setIsOpen] = useState(true);
  const [additionalTables, setAdditionalTables] = useState([]);

  // Initialize with default values if empty
  useEffect(() => {
    if (!productTesting) {
      setProductTesting({
        organoleptic: [
          {
            id: Date.now(),
            test: '',
            method: '',
            testingStage: '',
            limit: ''
          }
        ],
        biological: [
          {
            id: Date.now() + 1,
            test: 'Total Aerobic Plate Count',
            method: 'USP <2021>',
            testingStage: 'Finished Product',
            limit: '≤1500 CFU/g'
          },
          {
            id: Date.now() + 2,
            test: 'Yeast and Mold',
            method: 'AOAC 2014.05',
            testingStage: 'Finished Product',
            limit: '≤100 CFU/g'
          },
          {
            id: Date.now() + 3,
            test: 'Total Coliforms',
            method: 'AOAC 991.14',
            testingStage: 'Finished Product',
            limit: '≤10 CFU/g'
          },
          {
            id: Date.now() + 4,
            test: 'Escherichia coli (E.Coli)',
            method: 'USP <2022>',
            testingStage: 'Finished Product',
            limit: 'Absent/10 g'
          },
          {
            id: Date.now() + 5,
            test: 'Staphylococcus aureus',
            method: 'USP <2022>',
            testingStage: 'Finished Product',
            limit: 'Absent/25 g'
          },
          {
            id: Date.now() + 6,
            test: 'Salmonella',
            method: 'USP <2022>',
            testingStage: 'Finished Product',
            limit: 'Negative'
          }
        ],
        additional: []
      });
    }
  }, [productTesting, setProductTesting]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Handle changes to organoleptic tests
  const handleOrganolepticChange = (id, field, value) => {
    if (!productTesting) return;
    
    setProductTesting({
      ...productTesting,
      organoleptic: productTesting.organoleptic.map(test => 
        test.id === id ? { ...test, [field]: value } : test
      )
    });
  };

  // Handle changes to biological tests
  const handleBiologicalChange = (id, field, value) => {
    if (!productTesting) return;
    
    setProductTesting({
      ...productTesting,
      biological: productTesting.biological.map(test => 
        test.id === id ? { ...test, [field]: value } : test
      )
    });
  };

  // Handle changes to additional tests
  const handleAdditionalChange = (tableIndex, id, field, value) => {
    if (!productTesting) return;
    
    const updatedAdditional = [...productTesting.additional];
    updatedAdditional[tableIndex].tests = updatedAdditional[tableIndex].tests.map(test => 
      test.id === id ? { ...test, [field]: value } : test
    );
    
    setProductTesting({
      ...productTesting,
      additional: updatedAdditional
    });
  };

  // Add a new organoleptic test
  const addOrganolepticTest = () => {
    if (!productTesting) return;
    
    const newTest = {
      id: Date.now(),
      test: '',
      method: '',
      testingStage: '',
      limit: ''
    };
    
    setProductTesting({
      ...productTesting,
      organoleptic: [...productTesting.organoleptic, newTest]
    });
  };

  // Add a new biological test
  const addBiologicalTest = () => {
    if (!productTesting) return;
    
    const newTest = {
      id: Date.now(),
      test: '',
      method: '',
      testingStage: '',
      limit: ''
    };
    
    setProductTesting({
      ...productTesting,
      biological: [...productTesting.biological, newTest]
    });
  };

  // Add a new additional test
  const addAdditionalTest = (tableIndex) => {
    if (!productTesting) return;
    
    const updatedAdditional = [...productTesting.additional];
    const newTest = {
      id: Date.now(),
      test: '',
      method: '',
      testingStage: '',
      limit: ''
    };
    
    updatedAdditional[tableIndex].tests.push(newTest);
    
    setProductTesting({
      ...productTesting,
      additional: updatedAdditional
    });
  };

  // Remove an organoleptic test
  const removeOrganolepticTest = (id) => {
    if (!productTesting) return;
    
    // Don't remove if it's the only test
    if (productTesting.organoleptic.length <= 1) return;
    
    setProductTesting({
      ...productTesting,
      organoleptic: productTesting.organoleptic.filter(test => test.id !== id)
    });
  };

  // Remove a biological test
  const removeBiologicalTest = (id) => {
    if (!productTesting) return;
    
    // Don't remove if it's the only test
    if (productTesting.biological.length <= 1) return;
    
    setProductTesting({
      ...productTesting,
      biological: productTesting.biological.filter(test => test.id !== id)
    });
  };

  // Remove an additional test
  const removeAdditionalTest = (tableIndex, id) => {
    if (!productTesting) return;
    
    const updatedAdditional = [...productTesting.additional];
    
    // Don't remove if it's the only test
    if (updatedAdditional[tableIndex].tests.length <= 1) return;
    
    updatedAdditional[tableIndex].tests = updatedAdditional[tableIndex].tests.filter(test => test.id !== id);
    
    setProductTesting({
      ...productTesting,
      additional: updatedAdditional
    });
  };

  // Add a new additional testing table
  const addAdditionalTable = () => {
    if (!productTesting) return;
    
    const newTable = {
      id: Date.now(),
      name: 'Additional Testing',
      tests: [
        {
          id: Date.now() + 1,
          test: '',
          method: '',
          testingStage: '',
          limit: ''
        }
      ]
    };
    
    setProductTesting({
      ...productTesting,
      additional: [...(productTesting.additional || []), newTable]
    });
    
    // Add to local state to track table names
    setAdditionalTables([...additionalTables, { id: newTable.id, name: newTable.name }]);
  };

  // Update additional table name
  const updateAdditionalTableName = (tableIndex, name) => {
    if (!productTesting) return;
    
    const updatedAdditional = [...productTesting.additional];
    updatedAdditional[tableIndex].name = name;
    
    setProductTesting({
      ...productTesting,
      additional: updatedAdditional
    });
    
    // Update local state
    const updatedTables = [...additionalTables];
    updatedTables[tableIndex].name = name;
    setAdditionalTables(updatedTables);
  };

  // Remove an additional table
  const removeAdditionalTable = (tableIndex) => {
    if (!productTesting) return;
    
    const updatedAdditional = [...productTesting.additional];
    updatedAdditional.splice(tableIndex, 1);
    
    setProductTesting({
      ...productTesting,
      additional: updatedAdditional
    });
    
    // Update local state
    const updatedTables = [...additionalTables];
    updatedTables.splice(tableIndex, 1);
    setAdditionalTables(updatedTables);
  };

  // Testing options
  const organolepticTestOptions = ['Color', 'Appearance', 'Taste', 'Smell', 'Texture', 'Consistency'];
  const methodOptions = ['Visual Verification', 'Sensory Evaluation', 'Physical Measurement', 'Chemical Analysis', 'Instrumental Analysis'];
  const testingStageOptions = ['Ingredient', 'WIP', 'Finished Product'];
  const additionalTestingOptions = [
    'Heavy Metals', 
    'Pesticides', 
    'Mycotoxins', 
    'Allergens', 
    'Nutritional Analysis', 
    'Stability Testing',
    'Dissolution Testing',
    'Viscosity',
    'pH Testing',
    'Water Activity'
  ];

  if (!productTesting) return null;

  return (
    <section className={`${styles.container} ${sharedStyles.standardContainer}`}>
      <div className={`${styles.toggleHeader} ${sharedStyles.toggleHeader}`} onClick={toggleOpen} style={{ cursor: 'pointer' }}>
        <h2 className={`${styles.header} ${sharedStyles.header}`}>Product Testing</h2>
        <span className={`${styles.arrow} ${sharedStyles.arrow} ${isOpen ? sharedStyles.open : ''}`}>▶</span>
      </div>
      
      {isOpen && (
        <div className={`${styles.content} ${sharedStyles.content}`}>
          {/* Organoleptic Specifications Table */}
          <div className={styles.tableContainer}>
            <h3 className={styles.tableTitle}>Organoleptic Specifications</h3>
            <table className={styles.testingTable}>
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Method</th>
                  <th>Testing Stage</th>
                  <th>Limit</th>
                  <th className={styles.actionsColumn}></th>
                </tr>
              </thead>
              <tbody>
                {productTesting.organoleptic.map((test, index) => (
                  <tr key={test.id}>
                    <td>
                      <select
                        value={test.test}
                        onChange={(e) => handleOrganolepticChange(test.id, 'test', e.target.value)}
                        className={styles.selectInput}
                      >
                        <option value="">Select Test</option>
                        {organolepticTestOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={test.method}
                        onChange={(e) => handleOrganolepticChange(test.id, 'method', e.target.value)}
                        className={styles.selectInput}
                      >
                        <option value="">Select Method</option>
                        {methodOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={test.testingStage}
                        onChange={(e) => handleOrganolepticChange(test.id, 'testingStage', e.target.value)}
                        className={styles.selectInput}
                      >
                        <option value="">Select Stage</option>
                        {testingStageOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={test.limit}
                        onChange={(e) => handleOrganolepticChange(test.id, 'limit', e.target.value)}
                        placeholder="Enter limit"
                        className={styles.textInput}
                      />
                    </td>
                    <td className={styles.actionsCell}>
                      {productTesting.organoleptic.length > 1 && (
                        <button 
                          className={styles.removeButton}
                          onClick={() => removeOrganolepticTest(test.id)}
                          aria-label="Remove test"
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.addButtonContainer}>
              <button className={styles.addButton} onClick={addOrganolepticTest}>
                + Add Test
              </button>
            </div>
          </div>

          {/* Biological Specifications Table */}
          <div className={styles.tableContainer}>
            <h3 className={styles.tableTitle}>Biological Specifications</h3>
            <table className={styles.testingTable}>
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Method</th>
                  <th>Testing Stage</th>
                  <th>Limit</th>
                  <th className={styles.actionsColumn}></th>
                </tr>
              </thead>
              <tbody>
                {productTesting.biological.map((test, index) => (
                  <tr key={test.id}>
                    <td>
                      <input
                        type="text"
                        value={test.test}
                        onChange={(e) => handleBiologicalChange(test.id, 'test', e.target.value)}
                        className={styles.textInput}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={test.method}
                        onChange={(e) => handleBiologicalChange(test.id, 'method', e.target.value)}
                        className={styles.textInput}
                      />
                    </td>
                    <td>
                      <select
                        value={test.testingStage}
                        onChange={(e) => handleBiologicalChange(test.id, 'testingStage', e.target.value)}
                        className={styles.selectInput}
                      >
                        <option value="">Select Stage</option>
                        {testingStageOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={test.limit}
                        onChange={(e) => handleBiologicalChange(test.id, 'limit', e.target.value)}
                        className={styles.textInput}
                      />
                    </td>
                    <td className={styles.actionsCell}>
                      {productTesting.biological.length > 1 && (
                        <button 
                          className={styles.removeButton}
                          onClick={() => removeBiologicalTest(test.id)}
                          aria-label="Remove test"
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.addButtonContainer}>
              <button className={styles.addButton} onClick={addBiologicalTest}>
                + Add Test
              </button>
            </div>
          </div>

          {/* Additional Testing Tables */}
          {productTesting.additional && productTesting.additional.map((table, tableIndex) => (
            <div className={styles.tableContainer} key={table.id}>
              <div className={styles.tableHeaderWithSelect}>
                <select
                  value={table.name}
                  onChange={(e) => updateAdditionalTableName(tableIndex, e.target.value)}
                  className={styles.tableNameSelect}
                >
                  <option value="Additional Testing">Additional Testing</option>
                  {additionalTestingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <button 
                  className={styles.removeTableButton}
                  onClick={() => removeAdditionalTable(tableIndex)}
                  aria-label="Remove table"
                >
                  ×
                </button>
              </div>
              <table className={styles.testingTable}>
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Method</th>
                    <th>Testing Stage</th>
                    <th>Limit</th>
                    <th className={styles.actionsColumn}></th>
                  </tr>
                </thead>
              <tbody>
                {table.tests.map((test, index) => (
                  <tr key={test.id}>
                    <td>
                      <input
                        type="text"
                        value={test.test}
                        onChange={(e) => handleAdditionalChange(tableIndex, test.id, 'test', e.target.value)}
                        placeholder="Enter test"
                        className={styles.textInput}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={test.method}
                        onChange={(e) => handleAdditionalChange(tableIndex, test.id, 'method', e.target.value)}
                        placeholder="Enter method"
                        className={styles.textInput}
                      />
                    </td>
                    <td>
                      <select
                        value={test.testingStage}
                        onChange={(e) => handleAdditionalChange(tableIndex, test.id, 'testingStage', e.target.value)}
                        className={styles.selectInput}
                      >
                        <option value="">Select Stage</option>
                        {testingStageOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={test.limit}
                        onChange={(e) => handleAdditionalChange(tableIndex, test.id, 'limit', e.target.value)}
                        placeholder="Enter limit"
                        className={styles.textInput}
                      />
                    </td>
                    <td className={styles.actionsCell}>
                      {table.tests.length > 1 && (
                        <button 
                          className={styles.removeButton}
                          onClick={() => removeAdditionalTest(tableIndex, test.id)}
                          aria-label="Remove test"
                        >
                          ×
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.addButtonContainer}>
              <button className={styles.addButton} onClick={() => addAdditionalTest(tableIndex)}>
                + Add Test
              </button>
            </div>
          </div>
          ))}
          {/* Add Additional Testing Table Button */}
          <div className={styles.addTableButtonContainer}>
            <button className={styles.addTableButton} onClick={addAdditionalTable}>
              + Add Additional Testing Table
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductTesting;
