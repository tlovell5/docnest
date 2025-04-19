// src/components/EquipmentSetup.jsx
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { ProductContext } from '../context/ProductContext';
import styles from '../styles/EquipmentSetup.module.css';
import sharedStyles from '../styles/SharedStyles.module.css';
import { useDropzone } from 'react-dropzone';

const EquipmentSetup = () => {
  const { equipmentSetup, setEquipmentSetup } = useContext(ProductContext);
  const [isOpen, setIsOpen] = useState(true);
  const [activeEquipment, setActiveEquipment] = useState(0);
  const [activeSection, setActiveSection] = useState('general');

  // Initialize with default values if empty
  useEffect(() => {
    if (!equipmentSetup) {
      setEquipmentSetup([{
        id: Date.now(),
        equipmentType: '',
        modelId: '',
        partSizes: [],
        settings: '',
        configuration: '',
        capacity: '',
        maintenanceTips: '',
        operatorNotes: '',
        image: null
      }]);
    }
  }, [equipmentSetup, setEquipmentSetup]);

  // Add new equipment
  const addEquipment = () => {
    if (!equipmentSetup) return;
    
    const newEquipment = {
      id: Date.now(),
      equipmentType: '',
      modelId: '',
      partSizes: [],
      settings: '',
      configuration: '',
      capacity: '',
      maintenanceTips: '',
      operatorNotes: '',
      image: null
    };
    
    setEquipmentSetup([...equipmentSetup, newEquipment]);
    setActiveEquipment(equipmentSetup.length);
    setActiveSection('general');
  };

  // Remove equipment
  const removeEquipment = (index) => {
    if (!equipmentSetup || equipmentSetup.length <= 1) return;
    
    const updatedEquipment = equipmentSetup.filter((_, i) => i !== index);
    setEquipmentSetup(updatedEquipment);
    
    // Adjust active equipment index if needed
    if (activeEquipment >= index) {
      setActiveEquipment(Math.max(0, activeEquipment - 1));
    }
  };

  // Update equipment field
  const updateEquipmentField = (index, field, value) => {
    if (!equipmentSetup) return;
    
    const updatedEquipment = [...equipmentSetup];
    updatedEquipment[index] = {
      ...updatedEquipment[index],
      [field]: value
    };
    
    setEquipmentSetup(updatedEquipment);
  };

  // Add part size
  const addPartSize = () => {
    if (!equipmentSetup) return;
    
    const updatedEquipment = [...equipmentSetup];
    if (!updatedEquipment[activeEquipment].partSizes) {
      updatedEquipment[activeEquipment].partSizes = [];
    }
    
    updatedEquipment[activeEquipment].partSizes.push({
      id: Date.now(),
      description: '',
      size: ''
    });
    
    setEquipmentSetup(updatedEquipment);
  };

  // Remove part size
  const removePartSize = (partId) => {
    if (!equipmentSetup) return;
    
    const updatedEquipment = [...equipmentSetup];
    updatedEquipment[activeEquipment].partSizes = updatedEquipment[activeEquipment].partSizes.filter(
      part => part.id !== partId
    );
    
    setEquipmentSetup(updatedEquipment);
  };

  // Update part size field
  const updatePartSizeField = (partId, field, value) => {
    if (!equipmentSetup) return;
    
    const updatedEquipment = [...equipmentSetup];
    const partIndex = updatedEquipment[activeEquipment].partSizes.findIndex(
      part => part.id === partId
    );
    
    if (partIndex !== -1) {
      updatedEquipment[activeEquipment].partSizes[partIndex] = {
        ...updatedEquipment[activeEquipment].partSizes[partIndex],
        [field]: value
      };
      
      setEquipmentSetup(updatedEquipment);
    }
  };

  // Handle image upload
  const onDrop = useCallback((acceptedFiles) => {
    if (!equipmentSetup || acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const updatedEquipment = [...equipmentSetup];
    updatedEquipment[activeEquipment] = {
      ...updatedEquipment[activeEquipment],
      image: URL.createObjectURL(file)
    };
    
    setEquipmentSetup(updatedEquipment);
  }, [equipmentSetup, activeEquipment, setEquipmentSetup]);

  // Remove image
  const removeImage = () => {
    if (!equipmentSetup) return;
    
    const updatedEquipment = [...equipmentSetup];
    updatedEquipment[activeEquipment] = {
      ...updatedEquipment[activeEquipment],
      image: null
    };
    
    setEquipmentSetup(updatedEquipment);
  };

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  // Render equipment tabs
  const renderEquipmentTabs = () => {
    if (!equipmentSetup) return null;
    
    return (
      <div className={styles.equipmentTabs}>
        {equipmentSetup.map((equipment, index) => (
          <div key={equipment.id} className={`${styles.equipmentTab} ${activeEquipment === index ? styles.active : ''}`}>
            <span onClick={() => setActiveEquipment(index)}>
              {equipment.equipmentType || `Equipment ${index + 1}`}
            </span>
            {equipmentSetup.length > 1 && (
              <span 
                className={styles.removeEquipmentButton} 
                onClick={(e) => {
                  e.stopPropagation();
                  removeEquipment(index);
                }}
              >
                ×
              </span>
            )}
          </div>
        ))}
        <div className={styles.addEquipmentButton} onClick={addEquipment}>
          + Add Equipment
        </div>
      </div>
    );
  };

  // Render section tabs
  const renderSectionTabs = () => {
    return (
      <div className={styles.sectionTabs}>
        <div 
          className={`${styles.sectionTab} ${activeSection === 'general' ? styles.active : ''}`}
          onClick={() => setActiveSection('general')}
        >
          General
        </div>
        <div 
          className={`${styles.sectionTab} ${activeSection === 'technical' ? styles.active : ''}`}
          onClick={() => setActiveSection('technical')}
        >
          Technical
        </div>
        <div 
          className={`${styles.sectionTab} ${activeSection === 'maintenance' ? styles.active : ''}`}
          onClick={() => setActiveSection('maintenance')}
        >
          Maintenance
        </div>
        <div 
          className={`${styles.sectionTab} ${activeSection === 'photo' ? styles.active : ''}`}
          onClick={() => setActiveSection('photo')}
        >
          Photo
        </div>
      </div>
    );
  };

  // Render general section
  const renderGeneralSection = () => {
    if (!equipmentSetup || !equipmentSetup[activeEquipment]) return null;
    
    const equipment = equipmentSetup[activeEquipment];
    
    return (
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Equipment Type</label>
          <input
            type="text"
            className={styles.input}
            value={equipment.equipmentType || ''}
            onChange={(e) => updateEquipmentField(activeEquipment, 'equipmentType', e.target.value)}
            placeholder="e.g., Mixer, Filler, Conveyor"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Model/ID</label>
          <input
            type="text"
            className={styles.input}
            value={equipment.modelId || ''}
            onChange={(e) => updateEquipmentField(activeEquipment, 'modelId', e.target.value)}
            placeholder="Model number or unique identifier"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Part Sizes</label>
          {equipment.partSizes && equipment.partSizes.length > 0 ? (
            <table className={styles.partSizesTable}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {equipment.partSizes.map((part) => (
                  <tr key={part.id}>
                    <td>
                      <input
                        type="text"
                        className={styles.input}
                        value={part.description || ''}
                        onChange={(e) => updatePartSizeField(part.id, 'description', e.target.value)}
                        placeholder="Part description"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.input}
                        value={part.size || ''}
                        onChange={(e) => updatePartSizeField(part.id, 'size', e.target.value)}
                        placeholder="Size"
                      />
                    </td>
                    <td>
                      <button 
                        className={styles.removePartButton}
                        onClick={() => removePartSize(part.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No part sizes added yet.</p>
          )}
          <button className={styles.addPartButton} onClick={addPartSize}>
            Add Part Size
          </button>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Capacity</label>
          <input
            type="text"
            className={styles.input}
            value={equipment.capacity || ''}
            onChange={(e) => updateEquipmentField(activeEquipment, 'capacity', e.target.value)}
            placeholder="e.g., 50 liters, 100 units per hour"
          />
        </div>
      </div>
    );
  };

  // Render technical section
  const renderTechnicalSection = () => {
    if (!equipmentSetup || !equipmentSetup[activeEquipment]) return null;
    
    const equipment = equipmentSetup[activeEquipment];
    
    return (
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Settings</label>
          <textarea
            className={styles.textarea}
            value={equipment.settings || ''}
            onChange={(e) => updateEquipmentField(activeEquipment, 'settings', e.target.value)}
            placeholder="Detail specific settings required for operation (e.g., temperature, speed, pressure)"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Configuration</label>
          <textarea
            className={styles.textarea}
            value={equipment.configuration || ''}
            onChange={(e) => updateEquipmentField(activeEquipment, 'configuration', e.target.value)}
            placeholder="Describe the setup or configuration details necessary for the equipment to function as intended"
          />
        </div>
      </div>
    );
  };

  // Render maintenance section
  const renderMaintenanceSection = () => {
    if (!equipmentSetup || !equipmentSetup[activeEquipment]) return null;
    
    const equipment = equipmentSetup[activeEquipment];
    
    return (
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Maintenance Tips</label>
          <textarea
            className={styles.textarea}
            value={equipment.maintenanceTips || ''}
            onChange={(e) => updateEquipmentField(activeEquipment, 'maintenanceTips', e.target.value)}
            placeholder="Provide brief maintenance tips or checks to ensure optimal performance"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Operator Notes</label>
          <textarea
            className={styles.textarea}
            value={equipment.operatorNotes || ''}
            onChange={(e) => updateEquipmentField(activeEquipment, 'operatorNotes', e.target.value)}
            placeholder="Allow space for operators to add notes or special instructions based on experience"
          />
        </div>
      </div>
    );
  };

  // Render photo section
  const renderPhotoSection = () => {
    if (!equipmentSetup || !equipmentSetup[activeEquipment]) return null;
    
    const equipment = equipmentSetup[activeEquipment];
    
    return (
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Equipment Photo</label>
          <div 
            {...getRootProps()} 
            className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
          >
            <input {...getInputProps()} />
            {equipment.image ? (
              <div>
                <img 
                  src={equipment.image} 
                  alt="Equipment" 
                  className={styles.imagePreview} 
                />
                <button 
                  className={styles.removeImage}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <p>Drag and drop an image here, or click to select a file</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render active section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSection();
      case 'technical':
        return renderTechnicalSection();
      case 'maintenance':
        return renderMaintenanceSection();
      case 'photo':
        return renderPhotoSection();
      default:
        return renderGeneralSection();
    }
  };

  return (
    <section className={`${styles.container} ${sharedStyles.standardContainer}`}>
      <div 
        className={`${styles.toggleHeader} ${sharedStyles.toggleHeader}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className={`${styles.header} ${sharedStyles.header}`}>Equipment Setup</h2>
        <span className={`${styles.arrow} ${sharedStyles.arrow} ${isOpen ? styles.open : ''}`}>▶</span>
      </div>
      
      {isOpen && (
        <div className={`${styles.content} ${sharedStyles.content}`}>
          {renderEquipmentTabs()}
          {renderSectionTabs()}
          {renderSectionContent()}
        </div>
      )}
    </section>
  );
};

export default EquipmentSetup;
