import React, { useState, useCallback, useEffect } from 'react';
import './NewProductForm.css';

const productTypes = [
  { value: 'API', label: 'API', key: 'API' },
  { value: 'FlatFile', label: 'FlatFile', key: 'FlatFile' },
  { value: 'SQLResult', label: 'SQLResult', key: 'SQLResult' },
  { value: 'LLMToken', label: 'LLMToken', key: 'LLMToken' },
];

export default function NewProductForm({ onCancel, onProductCreated, initialData }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialData || {
    productName: initialData?.productName || '',
    productType: initialData?.productType || '',
    version: initialData?.version || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    visibility: initialData?.visibility === undefined ? false : initialData?.visibility,
    status: initialData?.status || '',
    internalSkuCode: initialData?.internalSkuCode || '',
    uom: initialData?.uom || '',
    effectiveStartDate: initialData?.effectiveStartDate,
    effectiveEndDate: initialData?.effectiveEndDate,
    billable: initialData?.billable === undefined ? false : Boolean(initialData?.billable),
    auditLogId: initialData?.auditLogId,
    linkedRatePlans: initialData?.linkedRatePlans || [],
    tags: initialData?.tags || {},
    labels: initialData?.labels || {},
    endpointUrl: initialData?.endpointUrl || '',
    authType: initialData?.authType || '',
    payloadMetric: initialData?.payloadMetric || '',
    rateLimitPolicy: initialData?.rateLimitPolicy || '',
    granularity: initialData?.granularity || '',
    grouping: initialData?.grouping || '',
    caching: initialData?.caching === undefined ? false : initialData?.caching,
    latencyClass: initialData?.latencyClass || '',
    queryTemplate: initialData?.queryTemplate || '',
    dbType: initialData?.dbType || '',
    freshness: initialData?.freshness || '',
    executionFrequency: initialData?.executionFrequency || '',
    expectedRowRange: initialData?.expectedRowRange || '',
    joinComplexity: initialData?.joinComplexity || '',
    resultSize: initialData?.resultSize || '',
    cached: initialData?.cached === undefined ? false : initialData?.cached,
    size: initialData?.size || '', // Added size field for FlatFile
    format: initialData?.format || '',
    compression: initialData?.compression || '',
    encoding: initialData?.encoding || '',
    schema: initialData?.schema || '',
    deliveryFrequency: initialData?.deliveryFrequency || '',
    accessMethod: initialData?.accessMethod || '',
    retentionPolicy: initialData?.retentionPolicy || '',
    fileNamingConvention: initialData?.fileNamingConvention || '',
    tokenProvider: initialData?.tokenProvider || '',
    modelName: initialData?.modelName || '',
    tokenUnitCost: initialData?.tokenUnitCost || '',
    calculationMethod: initialData?.calculationMethod || '',
    quota: initialData?.quota || '',
    promptTemplate: initialData?.promptTemplate || '',
    inferencePriority: initialData?.inferencePriority || '',
    computeTier: initialData?.computeTier || ''
  });

  // Add enums
  const enums = {
    productTypes: {
      'API': 'API',
      'FlatFile': 'FlatFile',
      'SQLResult': 'SQLResult',
      'LLMToken': 'LLMToken'
    },
    formats: ['JSON', 'CSV', 'XML', 'PARQUET'],
    accessMethods: ['FTP', 'S3', 'EMAIL', 'API'],
    compressionFormats: ['NONE', 'GZIP', 'ZIP'],
    deliveryFrequencies: ['DAILY', 'WEEKLY', 'MONTHLY']
  };

  const [productId, setProductId] = useState(null);
  const [tagsInput, setTagsInput] = useState(initialData?.tags ? Object.entries(initialData.tags).map(([key, value]) => `${key}:${value}`).join(',') : "");
  const [labelsInput, setLabelsInput] = useState(initialData?.labels ? Object.entries(initialData.labels).map(([key, value]) => `${key}:${value}`).join(',') : "");
  const [linkedPlansInput, setLinkedPlansInput] = useState(initialData?.linkedRatePlans ? initialData.linkedRatePlans.join(',') : "");
  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [labelKey, setLabelKey] = useState('');
  const [labelValue, setLabelValue] = useState('');

  const [progress, setProgress] = useState({
    general: 0,
    metadata: 0,
    config: 0,
    review: 0
  });

  const getSectionName = (step) => {
    const sections = ['general', 'metadata', 'config', 'review'];
    return sections[step];
  };

  const TabStatusBar = ({ step, totalSteps, status, message }) => {
    const section = getSectionName(step);
    
    return (
      <div className="tab-status-bar">
        <div className="progress-bar-container">
          <div 
            className={`progress-bar-fill ${section}`} 
            style={{ 
              width: `${progress[section]}%`
            }}
          />
        </div>
        <div className="status-message">
          {status === 'complete' ? 'Complete' : 'In Progress'}
        </div>
        <div className="step-indicator">
          Step {step + 1} of {totalSteps}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const updateProgress = () => {
      const sections = ['general', 'metadata', 'config', 'review'];
      const newProgress = {};
      
      sections.forEach(section => {
        if (section === 'review') {
          // Review section progress is only calculated when we reach that section
          if (step < 3) {
            newProgress[section] = 0;
          } else {
            newProgress[section] = 100;
          }
        } else if (section === 'config') {
          // Calculate config progress based on selected product type
          const requiredFields = {
            API: ['endpointUrl', 'authType', 'payloadMetric', 'rateLimitPolicy', 'granularity', 'grouping', 'latencyClass', 'caching'],
            FlatFile: ['size', 'format', 'deliveryFrequency', 'accessMethod'],
            LLMToken: ['tokenProvider', 'modelName', 'tokenUnitCost'],
            SQLResult: ['queryTemplate', 'dbType', 'freshness', 'executionFrequency']
          };
          
          const productType = formData.productType;
          const fields = requiredFields[productType] || [];
          const filledFields = fields.filter(field => formData[field] !== undefined && formData[field] !== '');
          
          // Calculate progress only for the relevant fields of the selected product type
          if (step === sections.indexOf(section)) {
            newProgress[section] = Math.round((filledFields.length / fields.length) * 100);
          } else {
            // For previous sections, maintain their progress
            if (step > sections.indexOf(section)) {
              newProgress[section] = Math.round((filledFields.length / fields.length) * 100);
            } else {
              // For future sections, show 0%
              newProgress[section] = 0;
            }
          }
        } else {
          // General and metadata sections remain the same
          const requiredFields = {
            general: ['productName', 'productType', 'version', 'description', 'category', 'status'],
            metadata: ['internalSkuCode', 'uom', 'effectiveStartDate', 'effectiveEndDate', 'billable']
          };
          
          const fields = requiredFields[section];
          const filledFields = fields.filter(field => formData[field] !== undefined && formData[field] !== '');
          
          if (step === sections.indexOf(section)) {
            newProgress[section] = Math.round((filledFields.length / fields.length) * 100);
          } else {
            if (step > sections.indexOf(section)) {
              newProgress[section] = Math.round((filledFields.length / fields.length) * 100);
            } else {
              newProgress[section] = 0;
            }
          }
        }
      });
      
      setProgress(newProgress);
    };
    
    updateProgress();
  }, [formData, step]);

  const handleAddLabel = () => {
    if (labelKey && labelValue && Object.keys(formData.labels).length < 3) {
      setFormData(prev => ({
        ...prev,
        labels: {
          ...prev.labels,
          [labelKey]: labelValue
        }
      }));
      setLabelKey('');
      setLabelValue('');
    }
  };

  const handleRemoveLabel = (key) => {
    setFormData(prev => {
      const newLabels = { ...prev.labels };
      delete newLabels[key];
      return { ...prev, labels: newLabels };
    });
  };

  const handleLabelKeyChange = (e) => {
    setLabelKey(e.target.value);
  };

  const handleLabelValueChange = (e) => {
    setLabelValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.productName || !formData.productType || !formData.version || !formData.description || !formData.status || !formData.uom) {
        throw new Error('All required fields must be filled');
      }

      // First create the product in metadata section
      if (step === 1) {
        const createRes = await fetch('http://13.230.194.245:8080/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productName: formData.productName,
            productType: formData.productType,
            version: formData.version,
            description: formData.description,
            category: formData.category,
            visibility: formData.visibility,
            status: formData.status,
            internalSkuCode: formData.internalSkuCode,
            uom: formData.uom,
            effectiveStartDate: formData.effectiveStartDate ? 
              new Date(formData.effectiveStartDate).toISOString() : 
              new Date().toISOString(),
            effectiveEndDate: formData.effectiveEndDate ? 
              new Date(formData.effectiveEndDate).toISOString() : 
              new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            billable: formData.billable,
            auditLogId: formData.auditLogId,
            isReviewed: formData.isReviewed,
            linkedRatePlans: formData.linkedRatePlans,
            tags: formData.tags,
            labels: formData.labels
          })
        });

        if (!createRes.ok) {
          const errorText = await createRes.text();
          throw new Error(`Failed to create product: ${errorText}`);
        }

        const createResult = await createRes.json();
        if (!createResult.productId) throw new Error("Product ID not found in create response");

        // Store the productId for later use
        setFormData(prev => ({ ...prev, productId: createResult.productId }));
        
        // Move to configuration step
        setStep(2);
        return;
      }

      // For configuration step, just validate and move to next step
      if (step === 2) {
        // Validate configuration fields based on product type
        switch (formData.productType) {
          case 'API':
            if (!formData.endpointUrl || !formData.authType || !formData.payloadMetric || !formData.rateLimitPolicy || !formData.granularity || !formData.grouping || !formData.latencyClass || formData.caching === undefined) {
              throw new Error('All API configuration fields are required');
            }
            break;
          case 'FlatFile':
            if (!formData.size || !formData.format || !formData.deliveryFrequency || !formData.accessMethod) {
              throw new Error('All FlatFile configuration fields are required');
            }
            break;
          case 'LLMToken':
            if (!formData.tokenProvider || !formData.modelName || !formData.tokenUnitCost) {
              throw new Error('All LLMToken configuration fields are required');
            }
            break;
          case 'SQLResult':
            if (!formData.queryTemplate || !formData.dbType || !formData.freshness || !formData.executionFrequency) {
              throw new Error('All SQLResult configuration fields are required: queryTemplate, dbType, freshness, and executionFrequency');
            }
            break;
        }

        // Move to review step
        setStep(3);
        return;
      }

      // For review step, create configuration
      if (step === 3) {
        let configEndpoint = '';
        let configData = {};
        
        switch (formData.productType) {
          case 'API':
            configEndpoint = 'http://13.230.194.245:8080/api/products/api';
            configData = {
              productId: formData.productId,
              endpointUrl: formData.endpointUrl,
              authType: formData.authType,
              payloadSizeMetric: formData.payloadMetric,
              rateLimitPolicy: formData.rateLimitPolicy,
              meteringGranularity: formData.granularity,
              grouping: formData.grouping,
              cachingFlag: formData.caching,
              latencyClass: formData.latencyClass
            };
            break;

          case 'FlatFile':
            configEndpoint = 'http://13.230.194.245:8080/api/products/flatfile';
            configData = {
              productId: formData.productId,
              size: formData.size,
              format: formData.format,
              compressionFormat: formData.compressionFormat || 'NONE',
              deliveryFrequency: formData.deliveryFrequency,
              accessMethod: formData.accessMethod,
              retentionPolicy: formData.retentionPolicy,
              fileNamingConvention: formData.fileNamingConvention
            };
            break;

          case 'LLMToken':
            configEndpoint = 'http://13.230.194.245:8080/api/products/llm-token';
            configData = {
              productId: formData.productId,
              tokenProvider: formData.tokenProvider,
              modelName: formData.modelName,
              tokenUnitCost: formData.tokenUnitCost,
              calculationMethod: formData.calculationMethod,
              quota: formData.quota,
              promptTemplate: formData.promptTemplate,
              inferencePriority: formData.inferencePriority,
              computeTier: formData.computeTier
            };
            break;

          case 'SQLResult':
            configEndpoint = 'http://13.230.194.245:8080/api/products/sql-result';
            configData = {
              productId: formData.productId,
              queryTemplate: formData.queryTemplate,
              dbType: formData.dbType,
              freshness: formData.freshness,
              executionFrequency: formData.executionFrequency,
              expectedRowRange: formData.expectedRowRange,
              joinComplexity: formData.joinComplexity,
              resultSize: formData.resultSize,
              cached: formData.cached
            };
            break;
        }

        if (configEndpoint) {
          const configRes = await fetch(configEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(configData)
          });

          if (!configRes.ok) {
            const errorText = await configRes.text();
            console.error('Configuration error:', errorText);
            try {
              const errorData = await configRes.json();
              throw new Error(errorData.message || `HTTP error! status: ${configRes.status}`);
            } catch (parseError) {
              throw new Error(`Failed to create product configuration: ${errorText}`);
            }
          }

          // Update form state
          onProductCreated(formData.productId);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      // Validate current step before moving to next
      const isValid = validateTab(step);
      if (isValid) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleStepChange = (newStep) => {
    // Validate current step before moving
    const isValid = validateTab(step);
    if (isValid || newStep < step) {
      setStep(newStep);
    }
  };

  const prepareDatesForBackend = (data) => {
    if (data.effectiveStartDate) {
      const date = new Date(data.effectiveStartDate);
      // Format in 24-hour format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      data.effectiveStartDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
    }
    if (data.effectiveEndDate) {
      const date = new Date(data.effectiveEndDate);
      // Format in 24-hour format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      data.effectiveEndDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
    }
    return data;
  };

  const transformTags = (input) => {
    const tagsObj = {};
    const pairs = input.split(',').map(pair => pair.trim());

    if (pairs.length !== 3) {
      throw new Error('Please enter exactly 3 tags in format: key:value');
    }

    pairs.forEach(pair => {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (!key) {
        throw new Error('Invalid tag format. Use format: key:value');
      }
      tagsObj[key] = {};
    });

    return tagsObj;
  };

  const transformLabels = (input) => {
    const labelsObj = {};
    const pairs = input.split(',').map(pair => pair.trim());

    if (pairs.length !== 3) {
      throw new Error('Please enter exactly 3 labels in format: key:value');
    }

    pairs.forEach(pair => {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (!key) {
        throw new Error('Invalid label format. Use format: key:value');
      }
      labelsObj[key] = value;
    });

    return labelsObj;
  };

  const handleLinkedPlansChange = (e) => {
    const value = e.target.value;
    setLinkedPlansInput(value);
    const plans = value.split(',').map(plan => plan.trim());
    setFormData(prev => ({
      ...prev,
      linkedRatePlans: plans
    }));
  };

 const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'linkedRatePlans') {
      handleLinkedPlansChange(e);
      return;
    }

    // Handle datetime inputs specifically
    if (name === 'effectiveStartDate' || name === 'effectiveEndDate') {
      // When getting value from input (HTML5 datetime-local format)
      // The input value is already in YYYY-MM-DDTHH:mm format
      newValue = value;
    }

    // Update form data
    setFormData({ ...formData, [name]: newValue });

    // If it's a date field, prepare it for backend submission
    if (name === 'effectiveStartDate' || name === 'effectiveEndDate') {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      // Store the formatted date in a separate field for backend submission
      setFormData(prev => ({
        ...prev,
        [`${name}ForBackend`]: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`
      }));
    }

    if (name === 'tags') {
      const tagsObj = transformTags(value);
      setTagsInput(value);
      newValue = tagsObj;
    } else if (name === 'labels') {
      const labelsObj = transformLabels(value);
      setLabelsInput(value);
      newValue = labelsObj;
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleNumericChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    
    // Only update if value is valid number or empty
    if (value === '' || !isNaN(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTagKeyChange = (e) => {
    setTagKey(e.target.value);
  };

  const handleTagValueChange = (e) => {
    setTagValue(e.target.value);
  };

  const handleAddTag = () => {
    if (!tagKey || !tagValue) return;
    
    // Check if we've reached the maximum number of tags
    const currentTags = Object.keys(formData.tags || {});
    if (currentTags.length >= 3) {
      console.log('Maximum 3 tags allowed');
      return;
    }

    setFormData(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        [tagKey]: tagValue
      }
    }));
    setTagKey('');
    setTagValue('');
  };

  const handleRemoveTag = (key) => {
    setFormData(prev => ({
      ...prev,
      tags: Object.fromEntries(Object.entries(prev.tags).filter(([k]) => k !== key))
    }));
  };

  const [completedSteps, setCompletedSteps] = useState(new Set());

  const renderTabs = () => (
    <div className="tabs">
      {['General Details', 'Product Metadata', 'Configuration', 'Review'].map((label, index) => (
        <div key={index} className="tab-wrapper">
          <TabStatusBar step={index} totalSteps={4} status={completedSteps.has(index) ? 'complete' : 'in_progress'} message={''} />
          <div
            className={`tab ${step === index ? 'active' : ''}`}
            onClick={() => handleStepChange(index)}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );

  const renderGeneralDetails = () => (
    <div className="tabss">
      {/* <h2>General Details</h2> */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            id="productName"
            name="productName"
            type="text"
            onChange={handleChange}
            value={formData.productName || ''}
            style={{ width: '420px' ,    marginLeft: '250px',}}
            placeholder="Enter Product Name"
            required
          />
          <div className="form-error" style={{ display: 'none' }}>Please enter a product name</div>
        </div>

        <div className="form-group">
          <label htmlFor="productType">Product Type</label>
          <select
            id="productType"
            name="productType"
            onChange={handleChange}
            value={formData.productType || ''}
            style={{ width: '420px' ,    marginLeft: '250px',}}
            required
          >
            <option value="">--Select--</option>
            {productTypes.map((type) => (
              <option key={type.key} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="form-error" style={{ display: 'none' }}>Please select a product type</div>
        </div>

        <div className="form-group">
          <label>Version</label>
          <input
            name="version"
            type="text"
            onChange={handleChange}
            value={formData.version || ''}
            placeholder="Enter Version"
            style={{ width: '420px' ,    marginLeft: '250px',}}
            required
          />
          <div className="form-error" style={{ display: 'none' }}>Please enter a version</div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            value={formData.description || ''}
            placeholder="Enter Description"
            style={{ width: '420px' ,    marginLeft: '250px',}}
            required
          />
          <div className="form-error" style={{ display: 'none' }}>Please enter a description</div>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            onChange={handleChange}
            value={formData.category || ''}
            style={{ width: '420px' ,    marginLeft: '250px',}}
            required
          >
            <option value="">--Select--</option>
            <option value="INTERNAL">INTERNAL</option>
            <option value="EXTERNAL">EXTERNAL</option>
            <option value="PARTNER">PARTNER</option>
          </select>
          <div className="form-error" style={{ display: 'none' }}>Please select a category</div>
        </div>

          <div style={{ flex: '0 0 auto' }}>
            <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px '}}>Status</label>
            <select
              name="status"
              onChange={handleChange}
              value={formData.status || ''}
              style={{ width: '420px', padding: '4px 6px', marginTop: '4px' ,marginLeft: '250px'}}
              required
            >
              <option value="">--Select--</option>
              <option value="DRAFT">DRAFT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="DEPRECATED">DEPRECATED</option>
            </select>
            <div className="form-error" style={{ display: 'none' }}>Please select a status</div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <div style={{ flex: '0 0 420px' }}>
              <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px', }}>Tags</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', marginTop: '4px' }}>
                <input
                  type="text"
                  id="tagKey"
                  placeholder="Key"
                  value={tagKey}
                  onChange={handleTagKeyChange}
                  style={{ flex: 1 ,width:'345px',marginLeft: '250px'}}
                  
                />
                          {/* <div className="form-error">Please enter a version</div> */}

                <input
                  type="text"
                  id="tagValue"
                  placeholder="Value"
                  value={tagValue}
                  onChange={handleTagValueChange}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleAddTag}
                  disabled={!tagKey || !tagValue || Object.keys(formData.tags).length >= 3}
                  style={{ padding: '4px 12px' }}
                  title={Object.keys(formData.tags).length >= 3 ? 'Maximum 3 tags allowed' : ''}
                >
                  ✚
                </button>
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '8px',marginLeft:'250px' }}>
                {Object.entries(formData.tags).map(([key, value], index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ flex: 1 }}>{key}</span>
                    <span style={{ flex: 1 }}>{value}</span>
                    <button
                      onClick={() => handleRemoveTag(key)}
                      style={{ padding: '4px 8px', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.64258 3.33317C7.98577 2.36218 8.91183 1.6665 10.0003 1.6665C11.0888 1.6665 12.0149 2.36218 12.3581 3.33317" stroke-llinccap="round" stroke="#4A4442"/>
                        <path d="M17.0833 5H2.9165" stroke-llinccap="round" stroke="#4A4442"/>
                        <path d="M15.6941 7.0835L15.3108 12.8327C15.1633 15.0452 15.0895 16.1514 14.3687 16.8257C13.6478 17.5002 12.5392 17.5002 10.3218 17.5002H9.67743C7.46005 17.5002 6.35138 17.5002 5.63054 16.8257C4.90971 16.1514 4.83596 15.0452 4.68846 12.8327L4.30518 7.0835" stroke-llinccap="round" stroke="#4A4442"/>
                        <path d="M7.9165 9.1665L8.33317 13.3332" stroke-llinccap="round" stroke="#4A4442"/>
                        <path d="M12.0832 9.1665L11.6665 13.3332" stroke-llinccap="round" stroke="#4A4442"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px' }}>Visibility</label>
                <div className="switch-container">
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="visibility"
                      onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.checked }))}
                      checked={formData.visibility}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="form-error" style={{ display: 'none' }}>Please select visibility</div>
              </div>
            </div>
          </div>

        <div className="button-group">
          <button type="button" className="custom-button cancel-button" onClick={onCancel}>
           <h6> Cancel</h6>
          </button>
          <button type="button" className="custom-button aforo-button" onClick={handleNext}>
            <h6>Next</h6>
          </button>
        </div>
      </form>
    </div>
  );



  const renderProductMetadata = () => (
    <div className="tabss">

      <form onSubmit={(e) => e.preventDefault()}>

        <div style={{ flex: '0 0 auto' }}>
          <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px' }}>Internal Sku Code</label>
          <input
            name="internalSkuCode"
            type="text"
            onChange={handleChange}
            value={formData.internalSkuCode || ''}
            placeholder="Enter Internal SKU Code"
            style={{ width: '420px', padding: '4px 6px',marginLeft:'250px' }}
            required
          />
        </div>
        <div style={{ flex: '0 0 auto' }}>
          <label style={{ display: 'block', margin: 0, padding: 0 ,marginLeft:'250px'}}>UOM</label>
          <input
            name="uom"
            type="text"
            onChange={handleChange}
            value={formData.uom || ''}
            placeholder="Enter UOM (e.g., pcs, kg)"
            style={{ width: '418px', padding: '4px 6px',marginLeft:'250px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <div style={{ flex: '0 0 auto' }}>
            <label htmlFor="effectiveStartDate" style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px',color:'#1E1A20'}}>Effective Start Date</label>
              <input
                type="datetime-local"
                id="effectiveStartDate"
                name="effectiveStartDate"
                value={formData.effectiveStartDate}
                onChange={handleChange}
                style={{ width: '420px', padding: '4px 6px', marginLeft: '250px' }}
              />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <label htmlFor="effectiveEndDate" style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px',color:'#1E1A20'}}>Effective End Date</label>
              <input
                type="datetime-local"
                id="effectiveEndDate"
                name="effectiveEndDate" // Changed from effectiveStartDate to effectiveEndDate
                value={formData.effectiveEndDate}
                onChange={handleChange}
                style={{ width: '420px', padding: '4px 6px', marginLeft: '250px' }}
              />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <div style={{ flex: '0 0 auto' }}>
            <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px'}}>billable</label>
            <div className="switch-container">
              <label className="switch">
                <input
                  type="checkbox"
                  name="billable"
                  onChange={(e) => setFormData(prev => ({ ...prev, billable: e.target.checked }))}
                  checked={formData.billable}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <div style={{ flex: '0 0 auto' }}>
            <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px' }}>Labels</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', marginTop: '4px' }}>
              <input
                type="text"
                id="labelKey"
                placeholder="Key"
                value={labelKey}
                onChange={handleLabelKeyChange}
                style={{ flex: 1, maxWidth: '200px' ,marginLeft:'250px'}}
              />
              <input
                type="text"
                id="labelValue"
                placeholder="Value"
                value={labelValue}
                onChange={handleLabelValueChange}
                style={{ flex: 1, maxWidth: '165px' }}
              />
              <button
                onClick={handleAddLabel}
                disabled={!labelKey || !labelValue || Object.keys(formData.labels).length >= 3}
                style={{ padding: '4px 12px' }}
                title={Object.keys(formData.labels).length >= 3 ? 'Maximum 3 labels allowed' : ''}
              >
                ✚
              </button>
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '8px', maxWidth: '421px',marginLeft:'250px' }}>
              {Object.entries(formData.labels).map(([key, value], index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', }}>
                  <span style={{ flex: 1 }}>{key}</span>
                  <span style={{ flex: 1 }}>{value}</span>
                  <button
                    onClick={() => handleRemoveLabel(key)}
                    style={{ padding: '4px 8px', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.64258 3.33317C7.98577 2.36218 8.91183 1.6665 10.0003 1.6665C11.0888 1.6665 12.0149 2.36218 12.3581 3.33317" stroke-llinccap="round" stroke="#4A4442"/>
                      <path d="M17.0833 5H2.9165" stroke-llinccap="round" stroke="#4A4442"/>
                      <path d="M15.6941 7.0835L15.3108 12.8327C15.1633 15.0452 15.0895 16.1514 14.3687 16.8257C13.6478 17.5002 12.5392 17.5002 10.3218 17.5002H9.67743C7.46005 17.5002 6.35138 17.5002 5.63054 16.8257C4.90971 16.1514 4.83596 15.0452 4.68846 12.8327L4.30518 7.0835" stroke-llinccap="round" stroke="#4A4442"/>
                      <path d="M7.9165 9.1665L8.33317 13.3332" stroke-llinccap="round" stroke="#4A4442"/>
                      <path d="M12.0832 9.1665L11.6665 13.3332" stroke-llinccap="round" stroke="#4A4442"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* <div style={{ flex: '0 0 auto' }}>
            <label style={{ display: 'block', margin: 0, padding: 0 }}>Tags</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', marginTop: '4px' }}>
              <input
                type="text"
                id="tagKey"
                placeholder="Key"
                value={tagKey}
                onChange={handleTagKeyChange}
                style={{ flex: 1, maxWidth: '200px' }}
              />
              <input
                type="text"
                id="tagValue"
                placeholder="Value"
                value={tagValue}
                onChange={handleTagValueChange}
                style={{ flex: 1, maxWidth: '165px' }}
              />
              <button
                onClick={handleAddTag}
                disabled={!tagKey || !tagValue || Object.keys(formData.tags).length >= 3}
                style={{ padding: '4px 12px' }}
                title={Object.keys(formData.tags).length >= 3 ? 'Maximum 3 tags allowed' : ''}
              >
                ✚
              </button>
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '8px', maxWidth: '421px' }}>
              {Object.entries(formData.tags).map(([key, value], index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ flex: 1 }}>{key}</span>
                  <span style={{ flex: 1 }}>{value}</span>
                  <button
                    onClick={() => handleRemoveTag(key)}
                    style={{ padding: '4px 8px', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.64258 3.33317C7.98577 2.36218 8.91183 1.6665 10.0003 1.6665C11.0888 1.6665 12.0149 2.36218 12.3581 3.33317" stroke-llinccap="round" stroke="#4A4442"/>
                      <path d="M17.0833 5H2.9165" stroke-llinccap="round" stroke="#4A4442"/>
                      <path d="M15.6941 7.0835L15.3108 12.8327C15.1633 15.0452 15.0895 16.1514 14.3687 16.8257C13.6478 17.5002 12.5392 17.5002 10.3218 17.5002H9.67743C7.46005 17.5002 6.35138 17.5002 5.63054 16.8257C4.90971 16.1514 4.83596 15.0452 4.68846 12.8327L4.30518 7.0835" stroke-llinccap="round" stroke="#4A4442"/>
                      <path d="M7.9165 9.1665L8.33317 13.3332" stroke-llinccap="round" stroke="#4A4442"/>
                      <path d="M12.0832 9.1665L11.6665 13.3332" stroke-llinccap="round" stroke="#4A4442"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div> */}

         
        </div>
        <div className="form-group">
          <label>Linked Rate Plans</label>
          <input
            type="text"
            name="linkedRatePlans"
            value={linkedPlansInput}
            onChange={handleChange}
            placeholder="Enter rate plan IDs (comma-separated)"
            style={{ width: '421px', padding: '4px 6px', marginTop: '4px' ,marginLeft:'250px'}}

          />
        </div>
         <div style={{ flex: '0 0 auto' }}>
            <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px' }}>Audit Log ID</label>
            <input
              name="auditLogId"
              type="text"
              placeholder="Enter Audit Log ID"
              onChange={(e) =>
                setFormData({ ...formData, auditLogId: e.target.value })
              }
              value={formData.auditLogId || ''}
              style={{ width: '421px', padding: '4px 6px', marginTop: '4px' ,marginLeft:'250px'}}
              required
            />
          </div> 
        <div className="button-group">
          <button type="button" className="custom-button cancel-button" onClick={handleBack}>
           <h6> Back</h6>
          </button>
          {step === 1 ? (
            <button type="button" className="custom-button aforo-button" onClick={handleSubmit}>
             <h6>Next</h6> 
            </button>
          ) : step === 2 ? (
            <button type="button" className="custom-button aforo-button" onClick={handleNext}>
              <h6>Next</h6>
            </button>
          ) : (
            <button type="button" className="custom-button aforo-button" onClick={handleSubmit}>
              <h6>Submit</h6>
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderConfiguration = () => {
    if (!formData.productType) return [];

    const commonFields = [];

    switch (formData.productType) {
      case 'API':
        return [
          ...commonFields,
          <div key="apiFields" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <div key="endpointUrlField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="endpointUrl" style={{ display: 'block', margin: 0, padding: 0,marginLeft:'255px',color:'#1E1A20' }}>Endpoint URL</label>
              <input
                type="text"
                id="endpointUrl"
                name="endpointUrl"
                value={formData.endpointUrl}
                onChange={handleChange}
                name="endpointUrl"
                                style={{ width: '206px', padding: '4px 6px',marginLeft:'250px' }}

                required
              />
                        <div className="form-error" style={{ display: 'none' }}>Please enter endpointUrl</div>

            </div>

            <div key="authTypeField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="authType" style={{ display: 'block', margin: 0, padding: 0 ,marginLeft:'0px',color:'#1E1A20'}}>Authentication Type</label>
              <select
                id="authType"
                name="authType"
                value={formData.authType}
                onChange={handleChange}
                name="authType"
                style={{ width: '206px', padding: '4px 6px' }}
                required
              >

                <option value="">--Select--</option>
                <option value="NONE">NONE</option>
                <option value="API_KEY">API_KEY</option>
                <option value="OAUTH2">OAUTH2</option>
                <option value="BASIC_AUTH">BASIC_AUTH</option>
              </select>
                                                    <div className="form-error" style={{ display: 'none' }}>Please select Auth Type</div>

            </div>

          </div>,

          <div key="payloadMetricField" style={{ display: 'flex', gap: '10px', marginTop: '20px', }}>
            <div key="payloadMetricInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="payloadMetric" style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px',color:'#1E1A20' }}>Payload Size Metric</label>
              <input
                type="text"
                id="payloadMetric"
                name="payloadMetric"
                value={formData.payloadMetric}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' ,marginLeft:'250px'}}
                placeholder="Enter metric (e.g., BYTES, KB, MB)"
                required
              />
                                                    <div className="form-error" style={{ display: 'none' }}>Please enter a payloadMetric</div>

            </div>

            <div key="rateLimitPolicyField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="rateLimitPolicy" style={{ display: 'block', margin: 0, padding: '0' }}>Rate Limit Policy</label>
              <input
                type="text"
                id="rateLimitPolicy"
                name="rateLimitPolicy"
                value={formData.rateLimitPolicy}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                placeholder="Enter rate limit policy"
                required
              />
                                                    <div className="form-error" style={{ display: 'none' }}>Please enter a rateLimitPolicy</div>
            </div>
          </div>,

          <div key="granularityField" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <div key="granularityInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="granularity" style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px',color:'#1E1A20'}}>Metering Granularity</label>
              <input
                type="text"
                id="granularity"
                name="granularity"
                value={formData.granularity}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px',marginLeft:'250px' }}
                placeholder="Enter metering granularity"
                required
              />
                                                    <div className="form-error" style={{ display: 'none' }}>Please enter a meteringGranularity</div>
            </div>

            <div key="groupingField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="grouping" style={{ display: 'block', margin: 0, padding: 0 ,color:'#1E1A20'}}>Grouping</label>
              <input
                type="text"
                id="grouping"
                name="grouping"
                value={formData.grouping}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                placeholder="Enter grouping"
                required
              />
                                                    <div className="form-error" style={{ display: 'none' }}>Please enter a grouping</div>
            </div>
          </div>,


          <div key="latencyClassField" className="form-group">
            <label htmlFor="latencyClass">Latency Class</label>
            <select
              id="latencyClass"
              value={formData.latencyClass}
              onChange={handleChange}
              name="latencyClass"
              className="form-control"
                              style={{ width: '420px', padding: '4px 6px',marginLeft:'250px' }}

              required
            >
              <option value="">--Select--</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
            <div className="form-error" style={{ display: 'none' }}>Please select a latency class</div>
          </div>,
          <div key="cachingField" className="form-group">
            <label>Caching Flag</label>
            <div className="switch-container">
              <label className="switch">
                <input
                  type="checkbox"
                  name="caching"
                  onChange={(e) => setFormData(prev => ({ ...prev, caching: Boolean(e.target.checked) }))}
                  checked={Boolean(formData.caching)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        ];
        case 'FlatFile':
        return [
          ...commonFields,
          <div key="sizeField" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <div key="sizeInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="size" style={{ display: 'block', margin: 0, padding: 0,marginLeft:'250px', }}>Size</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px',marginLeft:'250px' }}
                placeholder="Enter file size (e.g., 10MB, 5GB)"
                required
              />
              <div className="form-error" style={{ display: 'none' }}>Please enter a size</div>
            </div>

            <div key="formatField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="format" style={{ display: 'block', margin: 0, padding: 0 }}>Format</label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                required
              >
                <option value="">--Select--</option>
                {enums.formats.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select a format</div>
            </div>
          </div>,

          <div key="deliveryFrequencyField" style={{ display: 'flex', gap: '10px', marginTop: '20px',marginLeft:'250px' }}>
            <div key="deliveryFrequencyInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="deliveryFrequency" style={{ display: 'block', margin: 0, padding: 0 }}>Delivery Frequency</label>
              <select
                id="deliveryFrequency"
                name="deliveryFrequency"
                value={formData.deliveryFrequency}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                required
              >
                <option value="">--Select--</option>
                {enums.deliveryFrequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select a delivery frequency</div>
            </div>

            <div key="accessMethodField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="accessMethod" style={{ display: 'block', margin: 0, padding: '0' }}>Access Method</label>
              <select
                id="accessMethod"
                name="accessMethod"
                value={formData.accessMethod}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                required
              >
                <option value="">--Select--</option>
                {enums.accessMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select an access method</div>        
            </div>
          </div>,

          <div key="retentionPolicyField" style={{ display: 'flex', gap: '10px', marginTop: '20px' ,marginLeft:'250px'}}>
            <div key="retentionPolicyInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="retentionPolicy" style={{ display: 'block', margin: '0', padding: '0' }}>Retention Policy</label>
              <input
                type="text"
                id="retentionPolicy"
                name="retentionPolicy"
                value={formData.retentionPolicy || ''}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                placeholder="e.g., 30 days"
                required
              />
              <div className="form-error" style={{ display: 'none' }}>Please enter a retention policy</div>
            </div>

            <div key="compressionFormatField" style={{ flex: '0 0 auto' }}>
              <label style={{ display: 'block', margin: 0, padding: 0 }}>Compression Format</label>
              <div style={{ position: 'relative' }}>
                <select
                  id="compressionFormat"
                  name="compressionFormat"
                  value={formData.compressionFormat}
                  onChange={handleChange}
                  style={{ width: '206px', padding: '4px 6px' }}
                >
                  <option value="">--Select--</option>
                  {enums.compressionFormats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
                <div className="form-error" style={{ display: 'none' }}>Please select a compression format</div>
              </div>
            </div>
          </div>,

          <div key="fileNamingConventionField" className="form-group">
            <label htmlFor="fileNamingConvention">File Naming Convention</label>
            <input
              type="text"
              id="fileNamingConvention"
              name="fileNamingConvention"
              value={formData.fileNamingConvention || ''}
              onChange={handleChange}
              style={{ width: '46%', padding: '4px 6px',marginLeft:'250px' }}
              placeholder="e.g., YYYYMMDD_HHMMSS"
              required
            />
            <div className="form-error" style={{ display: 'none' }}>Please enter a file naming convention</div>
          </div>
          
        ];

         
         
       case 'SQLResult':
        return [
          ...commonFields,
          <div key="queryTemplateField" className="form-group">
            <label>Query Template:</label>
            <input
              type="text"
              value={formData.queryTemplate}
              onChange={handleChange}
              name="queryTemplate"
              placeholder="Enter SQL query template"
                          style={{ width: '420px', padding: '4px 6px',marginLeft:'250px' }}

              required
            />
            <div className="form-error" style={{ display: 'none' }}>Please enter a query template</div>
          </div>,
          <div key="dbTypeField" style={{ display: 'flex', gap: '10px', marginTop: '20px' ,marginLeft:'250px'}}>
            <div key="dbTypeSelect" style={{ flex: '0 0 auto' }}>
              <label htmlFor="dbType" style={{ display: 'block', margin: 0, padding: 0 }}>DB Type</label>
              <select
                id="dbType"
                name="dbType"
                value={formData.dbType}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
              >
                <option value="">--Select--</option>
                <option value="POSTGRES">POSTGRES</option>
                <option value="MYSQL">MYSQL</option>
                <option value="MONGODB">MONGODB</option>
                <option value="SQLSERVER"> SQLSERVER</option>
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select a database type</div>
            </div>

            <div key="freshnessField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="freshness" style={{ display: 'block', margin: 0, padding: 0 }}>Freshness</label>
              <select
                id="freshness"
                name="freshness"
                value={formData.freshness}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
              >
                <option value="">--Select--</option>
                <option value="REALTIME">REALTIME</option>
                <option value="HOURLY">HOURLY</option>
                <option value="DAILY">DAILY</option>
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select a freshness</div>
            </div>
          </div>,

          <div key="executionFrequencyField" style={{ display: 'flex', gap: '10px', marginTop: '20px',marginLeft:'250px' }}>
            <div key="executionFrequencyInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="executionFrequency" style={{ display: 'block', margin: 0, padding: 0 }}>Execution Frequency</label>
              <select
                id="executionFrequency"
                name="executionFrequency"
                value={formData.executionFrequency}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
              >
                <option value="">--Select--</option>
                <option value="ON_DEMAND">ON_DEMAND</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="EVENT_DRIVEN">EVENT_DRIVEN</option>
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select an execution frequency</div>
            </div>

            <div key="expectedRowRangeField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="expectedRowRange" style={{ display: 'block', margin: 0, padding: 0 }}>Expected Row Range</label>
              <input
                type="text"
                id="expectedRowRange"
                name="expectedRowRange"
                value={formData.expectedRowRange}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                placeholder="e.g., 100-1000"
              />
              <div className="form-error" style={{ display: 'none' }}>Please enter an expected row range</div>
            </div>

          </div>,

          <div key="joinComplexityField" style={{ display: 'flex', gap: '10px', marginTop: '20px' ,marginLeft:'250px'}}>
            <div key="joinComplexityInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="joinComplexity" style={{ display: 'block', margin: 0, padding: 0 }}>Join Complexity</label>
              <select
                id="joinComplexity"
                name="joinComplexity"
                value={formData.joinComplexity}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
              >
                <option value="">--Select--</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select a join complexity</div>
            </div>

            <div key="resultSizeField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="resultSize" style={{ display: 'block', margin: 0, padding: 0 }}>Result Size</label>
              <input
                type="text"
                id="resultSize"
                name="resultSize"
                value={formData.resultSize}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                placeholder="e.g., 10MB, 1000 rows"
              />
              <div className="form-error" style={{ display: 'none' }}>Please enter a result size</div>
            </div>
          </div>,

          <div key="cachedField" className="form-group">
            <label>Cached</label>
            <div className="switch-container">
              <label className="switch">
                <input
                  type="checkbox"
                  name="cached"
                  onChange={(e) => setFormData(prev => ({ ...prev, cached: Boolean(e.target.checked) }))}
                  checked={Boolean(formData.cached)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        ];


      case 'LLMToken':
        return [
          ...commonFields,
          <div key="tokenProviderField" style={{ display: 'flex', gap: '10px', marginTop: '20px' ,marginLeft:'250px'}}>
            <div key="tokenProviderInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="tokenProvider" style={{ display: 'block', margin: 0, padding: 0 }}>Token Provider</label>
              <select
                id="tokenProvider"
                name="tokenProvider"
                value={formData.tokenProvider}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
              >
                <option value="">--Select--</option>
                <option value="OPENAI">OPENAI</option>
                <option value="ANTHROPIC">ANTHROPIC</option>
                <option value="MISTRAL">MISTRAL</option>
                <option value="CUSTOM">CUSTOM</option>
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select a token provider</div>
            </div>

            <div key="modelNameField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="modelName" style={{ display: 'block', margin: 0, padding: 0 }}>Model Name</label>
              <input
                type="text"
                id="modelName"
                name="modelName"
                value={formData.modelName || ''}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                placeholder="Enter model name"
              />
              <div className="form-error" style={{ display: 'none' }}>Please enter a model name</div>
            </div>
          </div>,

          <div key="tokenUnitCostField" style={{ display: 'flex', gap: '10px', marginTop: '20px', marginLeft: '250px' }}>
            <div key="tokenUnitCostInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="tokenUnitCost" style={{ display: 'block', margin: 0, padding: 0 }}>Token Unit Cost</label>
              <input
                type="text"
                id="tokenUnitCost"
                name="tokenUnitCost"
                value={formData.tokenUnitCost}
                onChange={handleNumericChange}
                style={{ width: '206px', padding: '4px 6px' }}
                placeholder="Enter cost"
              />
              <div className="form-error" style={{ display: 'none' }}>Please enter a token unit cost</div>
            </div>

            <div key="calculationMethodField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="calculationMethod" style={{ display: 'block', margin: 0, padding: 0 }}>Calculation Method</label>
              <select
                id="calculationMethod"
                name="calculationMethod"
                value={formData.calculationMethod}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
              >
                <option value="">--Select--</option>
                <option value="FIXED">FIXED</option>
                <option value="DYNAMIC">DYNAMIC</option>
                <option value="HYBRID">HYBRID</option>
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select a calculation method</div>
            </div>
          </div>,

          <div key="quotaField" style={{ display: 'flex', gap: '10px', marginTop: '20px' ,marginLeft:'250px'}}>
            <div key="quotaInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="quota" style={{ display: 'block', margin: 0, padding: 0 }}>Quota</label>
              <input
                type="text"
                id="quota"
                name="quota"
                value={formData.quota}
                onChange={handleNumericChange}
                style={{ width: '206px', padding: '4px 6px' }}
                placeholder="Enter quota"
              />
              <div className="form-error" style={{ display: 'none' }}>Please enter a quota</div>
            </div>

            <div key="promptTemplateField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="promptTemplate" style={{ display: 'block', margin: 0, padding: 0 }}>Prompt Template</label>
              <input
                type="text"
                id="promptTemplate"
                name="promptTemplate"
                value={formData.promptTemplate || ''}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
                placeholder="Enter prompt"
              />
              <div className="form-error" style={{ display: 'none' }}>Please enter a prompt template</div>
            </div>
          </div>,

          <div key="inferencePriorityField" style={{ display: 'flex', gap: '10px', marginTop: '20px', marginLeft: '250px' }}>
            <div key="inferencePriorityInput" style={{ flex: '0 0 auto' }}>
              <label htmlFor="inferencePriority" style={{ display: 'block', margin: 0, padding: 0 }}>Inference Priority</label>
              <select
                id="inferencePriority"
                name="inferencePriority"
                value={formData.inferencePriority}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
              >
                <option value="">--Select--</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select an inference priority</div>
            </div>

            <div key="computeTierField" style={{ flex: '0 0 auto' }}>
              <label htmlFor="computeTier" style={{ display: 'block', margin: 0, padding: 0 }}>Compute Tier</label>
              <select
                id="computeTier"
                name="computeTier"
                value={formData.computeTier}
                onChange={handleChange}
                style={{ width: '206px', padding: '4px 6px' }}
              >
                <option value="">--Select--</option>
                <option value="STANDARD">STANDARD</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="GPU_OPTIMIZED">GPU_OPTIMIZED</option>
              </select>
              <div className="form-error" style={{ display: 'none' }}>Please select a compute tier</div>
            </div>
          </div>
        ];

      default:
        return [];
    }
  };

  const renderConfigurationWithButtons = () => {
    const config = renderConfiguration();
    return (
      <div>
        {config}
        <div className="review-actions">
          <button type="button" className="custom-button cancel-button" onClick={handleBack}>
           <h6> Back</h6>
          </button>
          <button type="button" className="custom-button aforo-button" onClick={handleNext}>
            <h6>Next</h6>
          </button>
        </div>
      </div>
    );
  };


  
  const renderReview = () => (
    <div className="review-grid">
      {formData.showSuccessMessage ? (
        <div className="success-message-container">
          <h3>Product Created Successfully!</h3>
          <p><strong>Product ID:</strong> {formData.productId}</p>
          <p><strong>Product Type:</strong> {formData.productType}</p>
          <p><strong>Status:</strong> Successfully configured in PostgreSQL</p>
          <button onClick={() => setStep(0)}>Create New Product</button>
        </div>
      ) : (
        <>
          <div>
            <h5>Configuration</h5>
            <p>Product Type: {formData.productType || '-'}</p>
            {formData.productType === 'API' && (
              <>
                <p>Endpoint URL: {formData.endpointUrl || '-'}</p>
                <p>Authentication Type: {formData.authType || '-'}</p>
                <p>Latency Class: {formData.latencyClass || '-'}</p>
                <p>Rate Limit Policy: {formData.rateLimitPolicy || '-'}</p>
                <p>Payload Size Metric: {formData.payloadMetric || '-'}</p>
                <p>Metering Granularity: {formData.granularity || '-'}</p>
                <p>Grouping: {formData.grouping || '-'}</p>
                <p>Caching Flag: {formData.caching === true ? 'True' : 'False'}</p>
              </>
            )}
            {formData.productType === 'LLMToken' && (
              <>
                <p>Token Provider: {formData.tokenProvider || '-'}</p>
                <p>Model Name: {formData.modelName || '-'}</p>
                <p>Token Unit Cost: {formData.tokenUnitCost || 0}</p>
                <p>Calculation Method: {formData.calculationMethod || '-'}</p>
                <p>Quota: {formData.quota || 0}</p>
                <p>Prompt Template: {formData.promptTemplate || ''}</p> 
                <p>Inference Priority: {formData.inferencePriority || '-'}</p>
                <p>Compute Tier: {formData.computeTier || '-'}</p>
              </>
            )}
            {formData.productType === 'SQLResult' && (
              <>
                <p>Query Template: {formData.queryTemplate || '-'}</p>
                <p>DB Type: {formData.dbType || '-'}</p>
                <p>Freshness: {formData.freshness || '-'}</p>
                <p>Execution Frequency: {formData.executionFrequency || '-'}</p>
                <p>Expected Row Range: {formData.expectedRowRange || '-'}</p>
                <p>Join Complexity: {formData.joinComplexity || '-'}</p>
                <p>Result Size: {formData.resultSize || '-'}</p>
                <p>
                  Cached: {
                    formData.cached === true
                      ? 'True'
                      : formData.cached === false
                        ? 'False'
                        : '-'
                  }
                </p>
              </>
            )}
             {formData.productType === 'FlatFile' && (
              <>
                                <p>Format: {formData.format || '-'}</p>

                <p>Size: {formData.size || '-'}</p>
                <p>Delivery Frequency: {formData.deliveryFrequency || '-'}</p>
                <p>Access Method: {formData.accessMethod || '-'}</p>
                <p>Retention Policy: {formData.retentionPolicy || '-'}</p>
                <p>Compression Format: {formData.compressionFormat || '-'}</p>
                <p>File Naming Convention: {formData.fileNamingConvention || '-'}</p>
              </>
            )}
          </div>
          <div>
            <h5>Product Metadata</h5>
            <p>Internal SKU Code: {formData.internalSkuCode || '-'}</p>
            <p>UOM: {formData.uom || '-'}</p>
            <p>Effective Start Date: {formData.effectiveStartDate ? new Date(formData.effectiveStartDate).toISOString() : '-'}</p>
            <p>Effective End Date: {formData.effectiveEndDate ? new Date(formData.effectiveEndDate).toISOString() : '-'}</p>
            <p>Billable: {formData.billable ? 'true' : 'false'}</p>
            <p>Audit Log ID: {formData.auditLogId || '-'}</p>
            <p>
              Linked Rate Plans: {
                formData.linkedRatePlans?.length > 0
                  ? formData.linkedRatePlans.join(", ")
                  : linkedPlansInput || "-"
              }
            </p>
            <p>
              Labels: {
                formData.labels && Object.keys(formData.labels).length > 0
                  ? Object.keys(formData.labels).map(key => `${key}:${formData.labels[key]}`).join(', ')
                  : '-'
              }
            </p>
          </div>
          <div>
            <h5>General Details</h5>
            <p>Product Name: {formData.productName || '-'}</p>
            <p>Product Type: {formData.productType || '-'}</p>
            <p>Version: {formData.version || '-'}</p>
            <p>Description: {formData.description || '-'}</p>
            <p>Tags: {
                formData.tags && Object.keys(formData.tags).length > 0
                  ? Object.keys(formData.tags).map(key => `${key}:${formData.tags[key]}`).join(', ')
                  : '-'
              }</p>
            <p>Visibility: {formData.visibility ? 'true' : 'false'}</p>
            <p>Status: {formData.status || '-'}</p>
            <p>Category: {formData.category || '-'}</p>
          </div>
          <div className="review-actions" style={{ marginTop: '20px' }}>
            <button
              type="button"
              className="custom-button cancel-button"
              onClick={handleBack}
            >
              <h6>Back</h6>
            </button>
            <button
              type="submit"
              className="custom-button aforo-button"
              onClick={handleSubmit}
            >
             <h6> Submit</h6>
            </button>
          </div>
        </>
      )}
    </div>
  );

  const validateTab = (index) => {
    const isValid = (() => {
      switch (index) {
        case 0: // General Details
          return !!formData.productName && !!formData.productType && !!formData.version && !!formData.description && !!formData.status && !!formData.category && !!formData.visibility && !!formData.tags;
        case 1: // Product Metadata
          return !!formData.internalSkuCode && !!formData.uom && !!formData.effectiveStartDate && !!formData.effectiveEndDate && !!formData.billable && !!formData.auditLogId && !!formData.labels && !!formData.linkedRatePlans;
        case 2: // Configuration
          if (formData.productType === 'FlatFile') {
            return !!formData.size && 
                   !!formData.format && 
                   !!formData.deliveryFrequency && 
                   !!formData.accessMethod && 
                   !!formData.retentionPolicy && 
                   !!formData.fileNamingConvention &&
                   !!formData.compressionFormat;
          } else if (formData.productType === 'API') {
            return !!formData.endpointUrl && 
                   !!formData.authType && 
                   !!formData.payloadMetric && 
                   !!formData.rateLimitPolicy &&
                   !!formData.granularity &&
                   !!formData.grouping &&
                   !!formData.latencyClass &&
                   formData.caching !== undefined;
          } else if (formData.productType === 'LLMToken') {
            return !!formData.tokenProvider && 
                   !!formData.modelName && 
                   !!formData.tokenUnitCost;
          } else if (formData.productType === 'SQLResult') {
            return !!formData.queryTemplate &&
                   !!formData.dbType &&
                   !!formData.freshness &&
                   !!formData.executionFrequency;
          }
          return false;
        case 3: // Review
          return true;
        default:
          return false;
      }
    })();

    // Update completed steps when validation passes
    if (isValid && !completedSteps.has(index)) {
      setCompletedSteps(prev => new Set([...prev, index]));
    }

    return isValid;
  };

  return (
    <>
          <h2>Create New Pricing Product</h2>

    <div className="new-product-form">
      <h2></h2>
      {renderTabs()}
      {step === 0 && renderGeneralDetails()}
      {step === 1 && renderProductMetadata()}
      {step === 2 && renderConfigurationWithButtons()}
      {step === 3 && renderReview()}
    </div>
    </>
  );
}