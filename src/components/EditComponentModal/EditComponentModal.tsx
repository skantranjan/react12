import React, { useState, useEffect } from 'react';
import { apiPut, apiPost } from '../../utils/api';
import MultiSelect from '../MultiSelect';

interface EditComponentModalProps {
  show: boolean;
  onClose: () => void;
  component: any;
  onSuccess: () => void;
}

interface EditComponentData {
  componentType: string;
  componentCode: string;
  componentDescription: string;
  componentCategory: string;
  componentQuantity: string;
  componentUnitOfMeasure: string;
  componentBaseQuantity: string;
  componentBaseUnitOfMeasure: string;
  wW: string;
  componentPackagingType: string;
  componentPackagingMaterial: string;
  componentUnitWeight: string;
  componentWeightUnitOfMeasure: string;
  percentPostConsumer: string;
  percentPostIndustrial: string;
  percentChemical: string;
  percentBioSourced: string;
  materialStructure: string;
  packagingColour: string;
  packagingLevel: string;
  componentDimensions: string;
  packagingEvidence: File[];
  validityFrom: string;
  validityTo: string;
  chPack?: string;
  kpisEvidenceMapping?: string;
  browseFiles?: File[];
  componentPackagingLevel?: string;
  evidenceChemicalRecycled?: File[];
}

interface EditComponentErrors {
  componentType: string;
  componentCode: string;
  componentDescription: string;
  componentCategory: string;
  componentQuantity: string;
  componentUnitOfMeasure: string;
  componentBaseQuantity: string;
  componentBaseUnitOfMeasure: string;
  wW: string;
  componentPackagingType: string;
  componentPackagingMaterial: string;
  componentUnitWeight: string;
  componentWeightUnitOfMeasure: string;
  percentPostConsumer: string;
  percentPostIndustrial: string;
  percentChemical: string;
  percentBioSourced: string;
  materialStructure: string;
  packagingColour: string;
  packagingLevel: string;
  componentDimensions: string;
  validityFrom: string;
  validityTo: string;
  general?: string;
}

const EditComponentModal: React.FC<EditComponentModalProps> = ({
  show,
  onClose,
  component,
  onSuccess
}) => {
  // State for collapsible sections
  const [showAdvancedComponentFields, setShowAdvancedComponentFields] = useState(false);
  const [showRecyclingComponentFields, setShowRecyclingComponentFields] = useState(false);

  // Component data state
  const [editComponentData, setEditComponentData] = useState<EditComponentData>({
    componentType: '',
    componentCode: '',
    componentDescription: '',
    componentCategory: '',
    componentQuantity: '',
    componentUnitOfMeasure: '',
    componentBaseQuantity: '',
    componentBaseUnitOfMeasure: '',
    wW: '',
    componentPackagingType: '',
    componentPackagingMaterial: '',
    componentUnitWeight: '',
    componentWeightUnitOfMeasure: '',
    percentPostConsumer: '',
    percentPostIndustrial: '',
    percentChemical: '',
    percentBioSourced: '',
    materialStructure: '',
    packagingColour: '',
    packagingLevel: '',
    componentDimensions: '',
    packagingEvidence: [],
    validityFrom: '',
    validityTo: ''
  });

  // Error state
  const [editComponentErrors, setEditComponentErrors] = useState<EditComponentErrors>({
    componentType: '',
    componentCode: '',
    componentDescription: '',
    componentCategory: '',
    componentQuantity: '',
    componentUnitOfMeasure: '',
    componentBaseQuantity: '',
    componentBaseUnitOfMeasure: '',
    wW: '',
    componentPackagingType: '',
    componentPackagingMaterial: '',
    componentUnitWeight: '',
    componentWeightUnitOfMeasure: '',
    percentPostConsumer: '',
    percentPostIndustrial: '',
    percentChemical: '',
    percentBioSourced: '',
    materialStructure: '',
    packagingColour: '',
    packagingLevel: '',
    componentDimensions: '',
    validityFrom: '',
    validityTo: ''
  });

  // Success and loading states
  const [editComponentSuccess, setEditComponentSuccess] = useState('');
  const [editComponentLoading, setEditComponentLoading] = useState(false);

  // Add state for category selection (same as Add Component modal)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryError, setCategoryError] = useState<string>('');
  
  // Add state for file upload and table (same as Add Component modal)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{id: string, categories: string[], categoryName?: string, files: File[]}>>([]);

  // Load component data when modal opens
  useEffect(() => {
    if (show && component) {
      setEditComponentData({
        componentType: component.material_type_id || '',
        componentCode: component.component_code || '',
        componentDescription: component.component_description || '',
        componentCategory: component.component_material_group || '',
        componentQuantity: component.component_quantity || '',
        componentUnitOfMeasure: component.component_uom_id || '',
        componentBaseQuantity: component.component_base_quantity || '',
        componentBaseUnitOfMeasure: component.component_base_uom_id || '',
        wW: component.percent_w_w || '',
        componentPackagingType: component.component_packaging_type_id || '',
        componentPackagingMaterial: component.component_packaging_material || '',
        componentUnitWeight: component.component_unit_weight || '',
        componentWeightUnitOfMeasure: component.weight_unit_measure_id || '',
        percentPostConsumer: component.percent_mechanical_pcr_content || '',
        percentPostIndustrial: component.percent_mechanical_pir_content || '',
        percentChemical: component.percent_chemical_recycled_content || '',
        percentBioSourced: component.percent_bio_sourced_content || '',
        materialStructure: component.material_structure || '',
        packagingColour: component.packaging_colour || '',
        packagingLevel: component.packaging_level_id || '',
        componentDimensions: component.component_dimensions || '',
        packagingEvidence: [],
        validityFrom: component.component_valid_from ? component.component_valid_from.split('T')[0] : '',
        validityTo: component.component_valid_to ? component.component_valid_to.split('T')[0] : '',
        chPack: component.ch_pack || '',
        kpisEvidenceMapping: component.kpis_evidence_mapping || '',
        browseFiles: [],
        componentPackagingLevel: component.component_packaging_level_id || '',
        evidenceChemicalRecycled: []
      });
      
      // Load selected categories if they exist
      if (component.kpis_evidence_mapping) {
        try {
          const categories = JSON.parse(component.kpis_evidence_mapping);
          setSelectedCategories(Array.isArray(categories) ? categories : [categories]);
        } catch (e) {
          setSelectedCategories([]);
        }
      } else {
        setSelectedCategories([]);
      }
      
      // Load uploaded files if they exist (you may need to adjust this based on your data structure)
      if (component.uploaded_files) {
        try {
          setUploadedFiles(component.uploaded_files);
        } catch (e) {
          setUploadedFiles([]);
        }
      } else {
        setUploadedFiles([]);
      }
    }
  }, [show, component]);

  // Reset states when modal closes
  useEffect(() => {
    if (!show) {
      setEditComponentData({
        componentType: '',
        componentCode: '',
        componentDescription: '',
        componentCategory: '',
        componentQuantity: '',
        componentUnitOfMeasure: '',
        componentBaseQuantity: '',
        componentBaseUnitOfMeasure: '',
        wW: '',
        componentPackagingType: '',
        componentPackagingMaterial: '',
        componentUnitWeight: '',
        componentWeightUnitOfMeasure: '',
        percentPostConsumer: '',
        percentPostIndustrial: '',
        percentChemical: '',
        percentBioSourced: '',
        materialStructure: '',
        packagingColour: '',
        packagingLevel: '',
        componentDimensions: '',
        packagingEvidence: [],
        validityFrom: '',
        validityTo: '',
        chPack: '',
        kpisEvidenceMapping: '',
        browseFiles: [],
        componentPackagingLevel: '',
        evidenceChemicalRecycled: []
      });
      setEditComponentErrors({
        componentType: '',
        componentCode: '',
        componentDescription: '',
        componentCategory: '',
        componentQuantity: '',
        componentUnitOfMeasure: '',
        componentBaseQuantity: '',
        componentBaseUnitOfMeasure: '',
        wW: '',
        componentPackagingType: '',
        componentPackagingMaterial: '',
        componentUnitWeight: '',
        componentWeightUnitOfMeasure: '',
        percentPostConsumer: '',
        percentPostIndustrial: '',
        percentChemical: '',
        percentBioSourced: '',
        materialStructure: '',
        packagingColour: '',
        packagingLevel: '',
        componentDimensions: '',
        validityFrom: '',
        validityTo: ''
      });
      setEditComponentSuccess('');
      setEditComponentLoading(false);
      setSelectedCategories([]);
      setCategoryError('');
      setSelectedFiles([]);
      setUploadedFiles([]);
    }
  }, [show]);

  // Handle save
  const handleEditComponentSave = async () => {
    // Validation logic here
    const errors: EditComponentErrors = {
      componentType: '',
      componentCode: '',
      componentDescription: '',
      componentCategory: '',
      componentQuantity: '',
      componentUnitOfMeasure: '',
      componentBaseQuantity: '',
      componentBaseUnitOfMeasure: '',
      wW: '',
      componentPackagingType: '',
      componentPackagingMaterial: '',
      componentUnitWeight: '',
      componentWeightUnitOfMeasure: '',
      percentPostConsumer: '',
      percentPostIndustrial: '',
      percentChemical: '',
      percentBioSourced: '',
      materialStructure: '',
      packagingColour: '',
      packagingLevel: '',
      componentDimensions: '',
      validityFrom: '',
      validityTo: ''
    };

    let hasErrors = false;

    if (!editComponentData.validityFrom) {
      errors.validityFrom = 'Component validity date - From is required';
      hasErrors = true;
    }

    if (!editComponentData.validityTo) {
      errors.validityTo = 'Component validity date - To is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setEditComponentErrors(errors);
      return;
    }

    setEditComponentLoading(true);

    try {
      // Update component API call
      const updateResult = await apiPut(`/component-details/${component.mapping_id}`, editComponentData);
      
      if (updateResult.success) {
        setEditComponentSuccess('Component updated successfully!');
        
        // Add audit log
        const auditData = {
          component_id: component.mapping_id,
          action: 'UPDATE',
          details: 'Component details updated',
          user_id: 'current_user_id' // Replace with actual user ID
        };
        
        await apiPost('/add-component-audit-log', auditData);
        
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setEditComponentErrors({ ...editComponentErrors, general: updateResult.message || 'Failed to update component' });
      }
    } catch (error) {
      console.error('Error updating component:', error);
      setEditComponentErrors({ ...editComponentErrors, general: 'An error occurred while updating the component' });
    } finally {
      setEditComponentLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.6)' }} tabIndex={-1}>
      <div className="modal-dialog modal-xl" style={{ maxWidth: '90vw', margin: '2vh auto' }}>
        <div className="modal-content" style={{ 
          borderRadius: '12px', 
          border: 'none',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          maxHeight: '90vh'
        }}>
          {/* Modal Header */}
          <div className="modal-header" style={{ 
            backgroundColor: '#30ea03', 
            color: '#000', 
            borderBottom: '2px solid #000', 
            alignItems: 'center',
            padding: '20px 30px',
            borderRadius: '12px 12px 0 0'
          }}>
            <h5 className="modal-title" style={{ 
              color: '#000', 
              fontWeight: 700, 
              flex: 1,
              fontSize: '20px',
              margin: 0,
              marginLeft: '20px',
            }}>
              <i className="ri-edit-line" style={{ marginRight: '10px', fontSize: '22px' }} />
              Edit Component Details
            </h5>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#000', 
                fontSize: 28, 
                fontWeight: 900, 
                lineHeight: 1, 
                cursor: 'pointer', 
                marginLeft: 8,
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%'
              }}
            >
              &times;
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body" style={{ 
            background: '#fff',
            padding: '30px',
            maxHeight: 'calc(90vh - 120px)',
            overflowY: 'auto'
          }}>
            {/* Success/Error Messages */}
            {editComponentSuccess && (
              <div style={{
                padding: '12px 16px',
                marginBottom: '20px',
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '6px',
                color: '#155724',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="ri-check-line" style={{ fontSize: '16px' }} />
                {editComponentSuccess}
              </div>
            )}

            {editComponentErrors.general && (
              <div style={{
                padding: '12px 16px',
                marginBottom: '20px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '6px',
                color: '#721c24',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="ri-error-warning-line" style={{ fontSize: '16px' }} />
                {editComponentErrors.general}
              </div>
            )}

            {/* Basic Component Information Section */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                padding: '20px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                backgroundColor: '#fff'
              }}>
                <div className="row">
                  {/* Component Type */}
                  <div className="col-md-6">
                    <label>
                      Component Type <span style={{ color: 'red' }}>*</span>
                      <span 
                        style={{ 
                          marginLeft: '8px', 
                          cursor: 'pointer', 
                          color: '#888',
                          fontSize: '16px',
                          transition: 'color 0.2s ease'
                        }} 
                        title="Select the type of component"
                      >
                        <i className="ri-information-line"></i>
                      </span>
                    </label>
                    <select
                      value={editComponentData.componentType}
                      onChange={(e) => setEditComponentData({ ...editComponentData, componentType: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        backgroundSize: '16px',
                        paddingRight: '32px',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#30ea03';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#30ea03';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                        e.currentTarget.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Component Type</option>
                      <option value="1">Plastic</option>
                      <option value="2">Paper</option>
                      <option value="3">Metal</option>
                      <option value="4">Glass</option>
                      <option value="5">Wood</option>
                      <option value="6">Textile</option>
                      <option value="7">Other</option>
                    </select>
                    {editComponentErrors.componentType && (
                      <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                        {editComponentErrors.componentType}
                      </div>
                    )}
                  </div>

                  {/* Component Code */}
                  <div className="col-md-6">
                    <label>
                      Component Code <span style={{ color: 'red' }}>*</span>
                      <span 
                        style={{ 
                          marginLeft: '8px', 
                          cursor: 'pointer', 
                          color: '#888',
                          fontSize: '16px',
                          transition: 'color 0.2s ease'
                        }} 
                        title="Enter the unique code for this component"
                      >
                        <i className="ri-information-line"></i>
                      </span>
                    </label>
                    <input
                      type="text"
                      value={editComponentData.componentCode}
                      onChange={(e) => setEditComponentData({ ...editComponentData, componentCode: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    {editComponentErrors.componentCode && (
                      <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                        {editComponentErrors.componentCode}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row" style={{ marginTop: '20px' }}>
                  {/* Component Description */}
                  <div className="col-md-6">
                    <label>
                      Component Description <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={editComponentData.componentDescription}
                      onChange={(e) => setEditComponentData({ ...editComponentData, componentDescription: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    {editComponentErrors.componentDescription && (
                      <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                        {editComponentErrors.componentDescription}
                      </div>
                    )}
                  </div>

                  {/* Component Category */}
                  <div className="col-md-6">
                    <label>Component Category</label>
                    <input
                      type="text"
                      value={editComponentData.componentCategory}
                      onChange={(e) => setEditComponentData({ ...editComponentData, componentCategory: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div className="row" style={{ marginTop: '20px' }}>
                  {/* Component Unit of Measure */}
                  <div className="col-md-6">
                    <label>
                      Component Unit of Measure <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      value={editComponentData.componentUnitOfMeasure}
                      onChange={(e) => setEditComponentData({ ...editComponentData, componentUnitOfMeasure: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        backgroundSize: '16px',
                        paddingRight: '32px',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#30ea03';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#30ea03';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                        e.currentTarget.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select UoM</option>
                      <option value="1">PCS (Pieces)</option>
                      <option value="2">KG (Kilograms)</option>
                      <option value="3">G (Grams)</option>
                      <option value="4">L (Liters)</option>
                      <option value="5">ML (Milliliters)</option>
                      <option value="6">M (Meters)</option>
                      <option value="7">CM (Centimeters)</option>
                      <option value="8">MM (Millimeters)</option>
                      <option value="9">M2 (Square Meters)</option>
                      <option value="10">M3 (Cubic Meters)</option>
                    </select>
                    {editComponentErrors.componentUnitOfMeasure && (
                      <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                        {editComponentErrors.componentUnitOfMeasure}
                      </div>
                    )}
                  </div>

                  {/* Component Base Quantity */}
                  <div className="col-md-6">
                    <label>Component Base Quantity</label>
                    <input
                      type="number"
                      value={editComponentData.componentBaseQuantity}
                      onChange={(e) => setEditComponentData({ ...editComponentData, componentBaseQuantity: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div className="row" style={{ marginTop: '20px' }}>
                  {/* Component Base Unit of Measure */}
                  <div className="col-md-6">
                    <label>Component Base Unit of Measure</label>
                    <select
                      value={editComponentData.componentBaseUnitOfMeasure}
                      onChange={(e) => setEditComponentData({ ...editComponentData, componentBaseUnitOfMeasure: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        backgroundSize: '16px',
                        paddingRight: '32px',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#30ea03';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#30ea03';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                        e.currentTarget.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Base UoM</option>
                      <option value="1">PCS (Pieces)</option>
                      <option value="2">KG (Kilograms)</option>
                      <option value="3">G (Grams)</option>
                      <option value="4">L (Liters)</option>
                      <option value="5">ML (Milliliters)</option>
                      <option value="6">M (Meters)</option>
                      <option value="7">CM (Centimeters)</option>
                      <option value="8">MM (Millimeters)</option>
                      <option value="9">M2 (Square Meters)</option>
                      <option value="10">M3 (Cubic Meters)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Component Information - Second Collapsible Section */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  backgroundColor: '#000',
                  padding: '15px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
                onClick={() => setShowAdvancedComponentFields(!showAdvancedComponentFields)}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  color: '#fff',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '1px solid #fff',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#fff'
                  }}>
                    {showAdvancedComponentFields ? '−' : '+'}
                  </div>
                  Advanced Component Information
                </div>
              </div>

              {showAdvancedComponentFields && (
                <div style={{ 
                  padding: '20px',
                  border: '1px solid #dee2e6',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  backgroundColor: '#fff'
                }}>
                  <div className="row">
                    {/* Component Packaging Type */}
                    <div className="col-md-6">
                      <label>Component Packaging Type</label>
                      <select
                        value={editComponentData.componentPackagingType}
                        onChange={(e) => setEditComponentData({ ...editComponentData, componentPackagingType: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          appearance: 'none',
                          backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 8px center',
                          backgroundSize: '16px',
                          paddingRight: '32px',
                          cursor: 'pointer',
                          backgroundColor: '#fff',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#30ea03';
                          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#ddd';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#30ea03';
                          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                          e.currentTarget.style.outline = 'none';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#ddd';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <option value="">Select Packaging Type</option>
                        <option value="1">Primary</option>
                        <option value="2">Secondary</option>
                        <option value="3">Tertiary</option>
                        <option value="4">Transport</option>
                        <option value="5">Sales</option>
                        <option value="6">Grouped</option>
                        <option value="7">Composite</option>
                      </select>
                    </div>

                    {/* Component Packaging Material */}
                    <div className="col-md-6">
                      <label>Component Packaging Material</label>
                      <input
                        type="text"
                        value={editComponentData.componentPackagingMaterial}
                        onChange={(e) => setEditComponentData({ ...editComponentData, componentPackagingMaterial: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: '20px' }}>
                    {/* Component Unit Weight */}
                    <div className="col-md-6">
                      <label>Component Unit Weight</label>
                      <input
                        type="number"
                        value={editComponentData.componentUnitWeight}
                        onChange={(e) => setEditComponentData({ ...editComponentData, componentUnitWeight: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    {/* Component Weight Unit of Measure */}
                    <div className="col-md-6">
                      <label>Component Weight Unit of Measure</label>
                      <select
                        value={editComponentData.componentWeightUnitOfMeasure}
                        onChange={(e) => setEditComponentData({ ...editComponentData, componentWeightUnitOfMeasure: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          appearance: 'none',
                          backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 8px center',
                          backgroundSize: '16px',
                          paddingRight: '32px',
                          cursor: 'pointer',
                          backgroundColor: '#fff',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#30ea03';
                          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#ddd';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#30ea03';
                          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                          e.currentTarget.style.outline = 'none';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#ddd';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <option value="">Select Weight UoM</option>
                        <option value="1">KG (Kilograms)</option>
                        <option value="2">G (Grams)</option>
                        <option value="3">MG (Milligrams)</option>
                        <option value="4">LB (Pounds)</option>
                        <option value="5">OZ (Ounces)</option>
                        <option value="6">T (Tons)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recycling and Material Information - Third Collapsible Section */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  backgroundColor: '#000',
                  padding: '15px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
                onClick={() => setShowRecyclingComponentFields(!showRecyclingComponentFields)}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  color: '#fff',
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '1px solid #fff',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#fff'
                  }}>
                    {showRecyclingComponentFields ? '−' : '+'}
                  </div>
                  Recycling and Material Information
                </div>
              </div>

              {showRecyclingComponentFields && (
                <div style={{ 
                  padding: '20px',
                  border: '1px solid #dee2e6',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  backgroundColor: '#fff'
                }}>
                  <div className="row">
                    {/* % Mechanical Post-Consumer Recycled Content */}
                    <div className="col-md-6">
                      <label>% Mechanical Post-Consumer Recycled Content (inc. Chemical)</label>
                      <input
                        type="number"
                        value={editComponentData.percentPostConsumer}
                        onChange={(e) => setEditComponentData({ ...editComponentData, percentPostConsumer: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                        placeholder="Percentage"
                      />
                    </div>

                    {/* % Mechanical Post-Industrial Recycled Content */}
                    <div className="col-md-6">
                      <label>% Mechanical Post-Industrial Recycled Content</label>
                      <input
                        type="number"
                        value={editComponentData.percentPostIndustrial}
                        onChange={(e) => setEditComponentData({ ...editComponentData, percentPostIndustrial: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                        placeholder="Percentage"
                      />
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: '20px' }}>
                    {/* % Chemical Recycled Content */}
                    <div className="col-md-6">
                      <label>% Chemical Recycled Content</label>
                      <input
                        type="number"
                        value={editComponentData.percentChemical}
                        onChange={(e) => setEditComponentData({ ...editComponentData, percentChemical: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                        placeholder="Percentage"
                      />
                    </div>

                    {/* % Bio-sourced */}
                    <div className="col-md-6">
                      <label>% Bio-sourced?</label>
                      <input
                        type="number"
                        value={editComponentData.percentBioSourced}
                        onChange={(e) => setEditComponentData({ ...editComponentData, percentBioSourced: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                        placeholder="Percentage"
                      />
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: '20px' }}>
                    {/* Material Structure */}
                    <div className="col-md-6">
                      <label>Material structure - multimaterials only (with % wt)</label>
                      <input
                        type="text"
                        value={editComponentData.materialStructure}
                        onChange={(e) => setEditComponentData({ ...editComponentData, materialStructure: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    {/* Packaging Colour */}
                    <div className="col-md-6">
                      <label>Component packaging colour / opacity</label>
                      <input
                        type="text"
                        value={editComponentData.packagingColour}
                        onChange={(e) => setEditComponentData({ ...editComponentData, packagingColour: e.target.value })}
                        className="form-control"
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Component Information - Non-Collapsible Section */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                padding: '20px',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                backgroundColor: '#fff'
              }}>
                <div className="row">
                  {/* CH Pack */}
                  <div className="col-md-6">
                    <label>
                      CH Pack
                      <span 
                        style={{ 
                          marginLeft: '8px', 
                          cursor: 'pointer', 
                          color: '#888',
                          fontSize: '16px',
                          transition: 'color 0.2s ease'
                        }} 
                        title="Enter CH Pack value"
                      >
                        <i className="ri-information-line"></i>
                      </span>
                    </label>
                    <input
                      type="text"
                      value={editComponentData.chPack || ''}
                      onChange={(e) => setEditComponentData({ ...editComponentData, chPack: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      placeholder="Enter CH Pack value"
                    />
                  </div>

                  {/* KPIS for Evidence Mapping */}
                  <div className="col-md-6">
                    <label>
                      KPIS for Evidence Mapping
                      <span 
                        style={{ 
                          marginLeft: '8px', 
                          cursor: 'pointer', 
                          color: '#888',
                          fontSize: '16px',
                          transition: 'color 0.2s ease'
                        }} 
                        title="Choose one or more categories for file upload."
                      >
                        <i className="ri-information-line"></i>
                      </span>
                    </label>
                    <MultiSelect
                      options={[
                        { value: '1', label: 'Weight' },
                        { value: '2', label: 'Weight UoM' },
                        { value: '3', label: 'Packaging Type' },
                        { value: '4', label: 'Material Type' }
                      ]}
                      selectedValues={selectedCategories}
                      onSelectionChange={(categories) => {
                        setSelectedCategories(categories);
                        setCategoryError(''); // Clear error when categories change
                        // Update the kpisEvidenceMapping field with selected categories
                        setEditComponentData({ 
                          ...editComponentData, 
                          kpisEvidenceMapping: categories.join(',') 
                        });
                      }}
                      placeholder="Select Categories..."
                    />
                    {categoryError && (
                      <div style={{ 
                        color: '#dc3545', 
                        fontSize: '12px', 
                        marginTop: '4px' 
                      }}>
                        {categoryError}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row" style={{ marginTop: '20px' }}>
                  {/* Browse Files */}
                  <div className="col-md-6">
                    <label>
                      Browse Files
                      <span 
                        style={{ 
                          marginLeft: '8px', 
                          cursor: 'pointer', 
                          color: '#888',
                          fontSize: '16px',
                          transition: 'color 0.2s ease'
                        }} 
                        title="Upload files"
                      >
                        <i className="ri-information-line"></i>
                      </span>
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setSelectedFiles(files);
                        }}
                        style={{ 
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '14px',
                          flex: 1
                        }}
                      />
                      <button
                        type="button"
                        className="btn"
                        style={{ 
                          backgroundColor: 'rgb(48, 234, 3)', 
                          border: 'none', 
                          color: '#000', 
                          fontWeight: '600',
                          borderRadius: '8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          whiteSpace: 'nowrap'
                        }}
                        onClick={() => {
                          if (selectedCategories.length > 0 && selectedFiles.length > 0) {
                            // Check if any selected categories are already assigned to other files
                            const alreadyAssignedCategories = selectedCategories.filter(category => 
                              uploadedFiles.some(upload => 
                                upload.categories.includes(category)
                              )
                            );

                            if (alreadyAssignedCategories.length > 0) {
                              const categoryNames = alreadyAssignedCategories.map(cat => {
                                const categoryName = cat === '1' ? 'Weight' : 
                                                    cat === '2' ? 'Weight UoM' : 
                                                    cat === '3' ? 'Packaging Type' : 
                                                    cat === '4' ? 'Material Type' : `Category ${cat}`;
                                return categoryName;
                              }).join(', ');
                              setCategoryError(`${categoryNames} ${alreadyAssignedCategories.length === 1 ? 'is' : 'are'} already assigned to another file. Please remove ${alreadyAssignedCategories.length === 1 ? 'it' : 'them'} from the other file first.`);
                              return;
                            }

                            const newUpload = {
                              id: Date.now().toString(),
                              categories: selectedCategories,
                              files: selectedFiles
                            };
                            setUploadedFiles(prev => [...prev, newUpload]);
                            setCategoryError(''); // Clear any previous errors
                            setSelectedFiles([]); // Clear selected files after adding
                          }
                        }}
                        disabled={selectedCategories.length === 0 || selectedFiles.length === 0}
                      >
                        + Add
                      </button>
                    </div>
                    {categoryError && (
                      <div style={{ 
                        color: '#dc3545', 
                        fontSize: '12px', 
                        marginTop: '4px' 
                      }}>
                        {categoryError}
                      </div>
                    )}
                  </div>

                  {/* Component packaging level */}
                  <div className="col-md-6">
                    <label>
                      Component packaging level
                      <span 
                        style={{ 
                          marginLeft: '8px', 
                          cursor: 'pointer', 
                          color: '#888',
                          fontSize: '16px',
                          transition: 'color 0.2s ease'
                        }} 
                        title="Select packaging level"
                      >
                        <i className="ri-information-line"></i>
                      </span>
                    </label>
                    <select
                      value={editComponentData.componentPackagingLevel || ''}
                      onChange={(e) => setEditComponentData({ ...editComponentData, componentPackagingLevel: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        backgroundSize: '16px',
                        paddingRight: '32px',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#30ea03';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#30ea03';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(48, 234, 3, 0.2)';
                        e.currentTarget.style.outline = 'none';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#ddd';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Packaging Level</option>
                      <option value="1">Level 1 - Primary</option>
                      <option value="2">Level 2 - Secondary</option>
                      <option value="3">Level 3 - Tertiary</option>
                      <option value="4">Level 4 - Transport</option>
                      <option value="5">Level 5 - Sales</option>
                    </select>
                  </div>
                </div>

                <div className="row" style={{ marginTop: '20px' }}>
                  {/* Component dimensions (3D - LxWxH, 2D - LxW) */}
                  <div className="col-md-6">
                    <label>
                      Component dimensions (3D - LxWxH, 2D - LxW)
                      <span 
                        style={{ 
                          marginLeft: '8px', 
                          cursor: 'pointer', 
                          color: '#888',
                          fontSize: '16px',
                          transition: 'color 0.2s ease'
                        }} 
                        title="Enter component dimensions"
                      >
                        <i className="ri-information-line"></i>
                      </span>
                    </label>
                    <input
                      type="text"
                      value={editComponentData.componentDimensions || ''}
                      onChange={(e) => setEditComponentData({ ...editComponentData, componentDimensions: e.target.value })}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      placeholder="Enter dimensions (e.g., 10x5x3 cm)"
                    />
                  </div>

                  {/* Evidence of % of chemical recycled or bio-source */}
                  <div className="col-md-6">
                    <label>
                      Evidence of % of chemical recycled or bio-source
                      <span 
                        style={{ 
                          marginLeft: '8px', 
                          cursor: 'pointer', 
                          color: '#888',
                          fontSize: '16px',
                          transition: 'color 0.2s ease'
                        }} 
                        title="Upload evidence files"
                      >
                        <i className="ri-information-line"></i>
                      </span>
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setEditComponentData({ ...editComponentData, evidenceChemicalRecycled: files });
                      }}
                      className="form-control"
                      style={{ 
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Display Uploaded Files Table */}
            {uploadedFiles.length > 0 && (
              <div className="row" style={{ marginTop: '24px' }}>
                <div className="col-12">
                  <div style={{ 
                    background: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #e9ecef',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ padding: '0 24px 24px 24px' }}>
                      <div className="table-responsive">
                        <table style={{ 
                          width: '100%', 
                          borderCollapse: 'collapse',
                          backgroundColor: '#fff'
                        }}>
                          <thead>
                            <tr style={{ backgroundColor: '#000' }}>
                              <th style={{ 
                                padding: '16px 20px', 
                                fontSize: '14px', 
                                fontWeight: '600',
                                textAlign: 'left',
                                borderBottom: '1px solid #e9ecef',
                                color: '#fff'
                              }}>
                                Category
                              </th>
                              <th style={{ 
                                padding: '16px 20px', 
                                fontSize: '14px', 
                                fontWeight: '600',
                                textAlign: 'left',
                                borderBottom: '1px solid #e9ecef',
                                color: '#fff'
                              }}>
                                Files
                              </th>
                              <th style={{ 
                                padding: '16px 20px', 
                                fontSize: '14px', 
                                fontWeight: '600',
                                textAlign: 'center',
                                borderBottom: '1px solid #e9ecef',
                                width: '100px',
                                color: '#fff'
                              }}>
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {uploadedFiles.map((upload, index) => (
                              <tr key={upload.id} style={{ 
                                backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                                transition: 'background-color 0.2s ease'
                              }}>
                                <td style={{ 
                                  padding: '16px 20px', 
                                  fontSize: '14px',
                                  borderBottom: '1px solid #e9ecef',
                                  color: '#333'
                                }}>
                                  {upload.categoryName || upload.categories.map(cat => {
                                    // Map category number to category name
                                    const categoryName = cat === '1' ? 'Weight' : 
                                                        cat === '2' ? 'Weight UoM' : 
                                                        cat === '3' ? 'Packaging Type' : 
                                                        cat === '4' ? 'Material Type' : `Category ${cat}`;
                                    return categoryName;
                                  }).join(', ')}
                                </td>
                                <td style={{ 
                                  padding: '16px 20px', 
                                  fontSize: '14px',
                                  borderBottom: '1px solid #e9ecef',
                                  color: '#333'
                                }}>
                                  {upload.files.map(file => file.name).join(', ')}
                                </td>
                                <td style={{ 
                                  padding: '16px 20px', 
                                  textAlign: 'center',
                                  borderBottom: '1px solid #e9ecef'
                                }}>
                                  <button
                                    type="button"
                                    style={{
                                      backgroundColor: '#dc3545',
                                      border: 'none',
                                      color: '#fff',
                                      padding: '8px 12px',
                                      fontSize: '13px',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      minWidth: '40px'
                                    }}
                                    onClick={() => {
                                      setUploadedFiles(prev => prev.filter(item => item.id !== upload.id));
                                    }}
                                    title="Delete"
                                  >
                                    <i className="ri-delete-bin-line" style={{ fontSize: '14px' }}></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ 
            background: '#fff', 
            borderTop: '2px solid #000', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 25px',
            borderRadius: '0 0 12px 12px'
          }}>
            {/* Left side - Component validity date fields */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {/* Component validity date - From */}
              <div>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#333', 
                  marginBottom: '4px',
                  display: 'block'
                }}>
                  Component validity date - From <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="date" 
                  className={`form-control${editComponentErrors.validityFrom ? ' is-invalid' : ''}`}
                  name="validityFrom"
                  data-field="validityFrom"
                  value={editComponentData.validityFrom} 
                  onChange={e => {
                    setEditComponentData({ ...editComponentData, validityFrom: e.target.value });
                    if (editComponentErrors.validityFrom) {
                      setEditComponentErrors(prev => ({ ...prev, validityFrom: '' }));
                    }
                  }} 
                  style={{
                    width: '160px',
                    padding: '5px 8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: '#fff'
                  }}
                />
                {editComponentErrors.validityFrom && <div style={{ color: 'red', fontSize: '10px', marginTop: '1px' }}>{editComponentErrors.validityFrom}</div>}
              </div>
              
              {/* Component validity date - To */}
              <div>
                <label style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#333', 
                  marginBottom: '4px',
                  display: 'block'
                }}>
                  Component validity date - To <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="date" 
                  className={`form-control${editComponentErrors.validityTo ? ' is-invalid' : ''}`}
                  name="validityTo"
                  data-field="validityTo"
                  value={editComponentData.validityTo} 
                  onChange={e => {
                    setEditComponentData({ ...editComponentData, validityTo: e.target.value });
                    if (editComponentErrors.validityTo) {
                      setEditComponentErrors(prev => ({ ...prev, validityTo: '' }));
                    }
                  }} 
                  style={{
                    width: '160px',
                    padding: '5px 8px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: '#fff'
                  }}
                />
                {editComponentErrors.validityTo && <div style={{ color: 'red', fontSize: '10px', marginTop: '1px' }}>{editComponentErrors.validityTo}</div>}
              </div>
            </div>

            {/* Right side - Update button */}
            <button
              type="button"
              className="btn"
              style={{ 
                backgroundColor: 'rgb(48, 234, 3)', 
                border: 'none', 
                color: '#000', 
                fontWeight: 600,
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px'
              }}
              onClick={handleEditComponentSave}
              disabled={editComponentLoading}
            >
              {editComponentLoading ? (
                <>
                  <i className="ri-loader-4-line" style={{ fontSize: '14px', animation: 'spin 1s linear infinite' }} />
                  Updating...
                </>
              ) : (
                <>
                  Update Component
                  <i className="ri-save-line" style={{ fontSize: '14px' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditComponentModal;
