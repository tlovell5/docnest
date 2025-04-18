// src/components/MixInstructions.jsx
import React, { useState, useContext, useCallback, useEffect } from 'react';
import styles from '../styles/MixInstructions.module.css';
import { ProductContext } from '../context/ProductContext';
import { useDropzone } from 'react-dropzone';

const MixInstructions = () => {
  const { mixSteps, setMixSteps } = useContext(ProductContext);
  const [isOpen, setIsOpen] = useState(true);
  const [draggedStep, setDraggedStep] = useState(null);

  // Initialize with one step if empty
  useEffect(() => {
    if (!mixSteps || mixSteps.length === 0) {
      setMixSteps([{ id: Date.now(), step: 1, instructions: '', image: null, duration: '' }]);
    }
  }, [mixSteps, setMixSteps]);

  // Add a new step
  const addStep = () => {
    const newStep = {
      id: Date.now(),
      step: mixSteps.length + 1,
      instructions: '',
      image: null,
      duration: ''
    };
    setMixSteps([...mixSteps, newStep]);
  };

  // Remove a step
  const removeStep = (id) => {
    const updatedSteps = mixSteps.filter(step => step.id !== id);
    // Renumber the steps
    updatedSteps.forEach((step, index) => {
      step.step = index + 1;
    });
    setMixSteps(updatedSteps);
  };

  // Update step instructions
  const updateInstructions = (id, value) => {
    setMixSteps(mixSteps.map(step => 
      step.id === id ? { ...step, instructions: value } : step
    ));
  };

  // Update step duration
  const updateDuration = (id, value) => {
    setMixSteps(mixSteps.map(step => 
      step.id === id ? { ...step, duration: value } : step
    ));
  };

  // Handle image upload for a specific step
  const handleImageDrop = useCallback((acceptedFiles, id) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setMixSteps(mixSteps.map(step => 
        step.id === id ? { ...step, image: URL.createObjectURL(file) } : step
      ));
    }
  }, [mixSteps, setMixSteps]);

  // Remove image from a step
  const removeImage = (id) => {
    setMixSteps(mixSteps.map(step => 
      step.id === id ? { ...step, image: null } : step
    ));
  };

  // Handle drag start
  const handleDragStart = (e, id) => {
    setDraggedStep(id);
    e.dataTransfer.effectAllowed = 'move';
    // Add a ghost image
    const ghost = document.createElement('div');
    ghost.classList.add(styles.dragGhost);
    ghost.textContent = `Step ${mixSteps.find(step => step.id === id)?.step}`;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    setTimeout(() => {
      ghost.remove();
    }, 0);
  };

  // Handle drag over
  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (draggedStep === null || draggedStep === id) return;
    
    const draggedIndex = mixSteps.findIndex(step => step.id === draggedStep);
    const targetIndex = mixSteps.findIndex(step => step.id === id);
    
    if (draggedIndex === targetIndex) return;
    
    // Create a copy of the steps array
    const newSteps = [...mixSteps];
    // Remove the dragged step
    const [draggedItem] = newSteps.splice(draggedIndex, 1);
    // Insert it at the target position
    newSteps.splice(targetIndex, 0, draggedItem);
    
    // Renumber the steps
    newSteps.forEach((step, index) => {
      step.step = index + 1;
    });
    
    setMixSteps(newSteps);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedStep(null);
  };

  // Duplicate a step
  const duplicateStep = (id) => {
    const stepToDuplicate = mixSteps.find(step => step.id === id);
    if (!stepToDuplicate) return;
    
    const duplicatedStep = {
      ...stepToDuplicate,
      id: Date.now(),
      step: stepToDuplicate.step + 1
    };
    
    const stepIndex = mixSteps.findIndex(step => step.id === id);
    const newSteps = [...mixSteps];
    newSteps.splice(stepIndex + 1, 0, duplicatedStep);
    
    // Renumber steps after the duplicated one
    for (let i = stepIndex + 2; i < newSteps.length; i++) {
      newSteps[i].step = i + 1;
    }
    
    setMixSteps(newSteps);
  };

  // Calculate total mix time
  const calculateTotalTime = () => {
    let totalMinutes = 0;
    
    mixSteps.forEach(step => {
      if (step.duration) {
        // Try to parse the duration as minutes
        const durationMatch = step.duration.match(/(\d+)\s*(?:min|minutes?)?/i);
        if (durationMatch) {
          totalMinutes += parseInt(durationMatch[1], 10);
        }
      }
    });
    
    if (totalMinutes === 0) return '';
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  return (
    <section className={styles.container}>
      <div className={styles.toggleHeader} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <h2 className={styles.header}>Mix Instructions</h2>
        <div className={styles.headerInfo}>
          {calculateTotalTime() && (
            <span className={styles.totalTime}>Total Mix Time: {calculateTotalTime()}</span>
          )}
          <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▶</span>
        </div>
      </div>
      
      {isOpen && (
        <div className={styles.content}>
          <div className={styles.tableContainer}>
            <table className={styles.instructionsTable}>
              <thead>
                <tr>
                  <th className={styles.stepColumn}>Step</th>
                  <th className={styles.instructionsColumn}>Instructions</th>
                  <th className={styles.durationColumn}>Duration</th>
                  <th className={styles.imageColumn}>Process Picture</th>
                  <th className={styles.actionsColumn}></th>
                </tr>
              </thead>
              <tbody>
                {mixSteps.map((step) => {
                  // Create a custom dropzone for each step
                  const StepDropzone = () => {
                    const { getRootProps, getInputProps, isDragActive } = useDropzone({
                      onDrop: (acceptedFiles) => handleImageDrop(acceptedFiles, step.id),
                      accept: { 'image/*': [] }
                    });
                    
                    return (
                      <div 
                        {...getRootProps()} 
                        className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
                      >
                        <input {...getInputProps()} />
                        {step.image ? (
                          <div className={styles.imagePreviewContainer}>
                            <img 
                              src={step.image} 
                              alt={`Step ${step.step}`} 
                              className={styles.imagePreview} 
                            />
                            <button 
                              type="button" 
                              className={styles.removeImageButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(step.id);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className={styles.dropzoneContent}>
                            <p>Drag & drop an image here, or click to select</p>
                          </div>
                        )}
                      </div>
                    );
                  };
                  
                  return (
                    <tr 
                      key={step.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, step.id)}
                      onDragOver={(e) => handleDragOver(e, step.id)}
                      onDragEnd={handleDragEnd}
                      className={draggedStep === step.id ? styles.dragging : ''}
                    >
                      <td className={styles.stepCell}>
                        <div className={styles.stepNumber}>{step.step}</div>
                      </td>
                      <td className={styles.instructionsCell}>
                        <textarea
                          value={step.instructions}
                          onChange={(e) => updateInstructions(step.id, e.target.value)}
                          placeholder="Enter mix instructions..."
                          className={styles.instructionsInput}
                          rows={3}
                        />
                      </td>
                      <td className={styles.durationCell}>
                        <input
                          type="text"
                          value={step.duration}
                          onChange={(e) => updateDuration(step.id, e.target.value)}
                          placeholder="e.g. 5 min"
                          className={styles.durationInput}
                        />
                      </td>
                      <td className={styles.imageCell}>
                        <StepDropzone />
                      </td>
                      <td className={styles.actionsCell}>
                        <div className={styles.actionButtons}>
                          <button 
                            type="button" 
                            className={styles.duplicateButton}
                            onClick={() => duplicateStep(step.id)}
                            title="Duplicate step"
                          >
                            ⧉
                          </button>
                          {mixSteps.length > 1 && (
                            <button 
                              type="button" 
                              className={styles.removeButton}
                              onClick={() => removeStep(step.id)}
                              title="Remove step"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className={styles.addButtonContainer}>
            <button 
              type="button" 
              className={styles.addButton}
              onClick={addStep}
            >
              + Add Step
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MixInstructions;
