import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Form.css';

const productTypes = [
  { value: 'API', label: 'API', key: 'API' },
  { value: 'FlatFile', label: 'FlatFile', key: 'FlatFile' },
  { value: 'SQLResult', label: 'SQLResult', key: 'SQLResult' },
  { value: 'LLMToken', label: 'LLMToken', key: 'LLMToken' },
];

const EditProductForm = ({ product, onClose }) => {
  const [generalDetails, setGeneralDetails] = useState({
    productName: undefined,
    productType: undefined,
    version: undefined,
    description: undefined,
    category: undefined,
    status: undefined,
    tags: {},
    visibility: false
  });

  const [metadata, setMetadata] = useState({
    internalSkuCode: undefined,
    uom: undefined,
    effectiveStartDate: undefined,
    effectiveEndDate: undefined,
    billable: false,
    auditLogId: undefined,
    labels: {},
    linkedRatePlans: []
  });

  const [tagKey, setTagKey] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [labelKey, setLabelKey] = useState('');
  const [labelValue, setLabelValue] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (product) {
      console.log('Initializing with product:', product);
      console.log('Raw SKU code from product:', product.internalSkuCode);
      
      // Initialize general details
      setGeneralDetails({
        productName: product.productName,
        productType: product.productType,
        version: product.version,
        description: product.description,
        category: product.category,
        status: product.status,
        tags: product.tags || {},
        visibility: Boolean(product.visibility)
      });

      // Initialize metadata
      const skuCode = product.internalSkuCode;
      console.log('Setting SKU code:', skuCode);
      setMetadata({
        internalSkuCode: skuCode,
        uom: product.uom,
        effectiveStartDate: product.effectiveStartDate ? 
          new Date(product.effectiveStartDate).toISOString().split('T')[0] : undefined,
        effectiveEndDate: product.effectiveEndDate ? 
          new Date(product.effectiveEndDate).toISOString().split('T')[0] : undefined,
        billable: product.billable !== undefined ? Boolean(product.billable) : false,
        auditLogId: product.auditLogId,
        labels: product.labels || {},
        linkedRatePlans: product.linkedRatePlans || []
      });
    }
  }, [product]);

  useEffect(() => {
    if (metadata) {
      console.log('Metadata updated:', metadata);
      const skuCode = metadata.internalSkuCode;
      console.log('Current SKU code:', skuCode, typeof skuCode);
      if (skuCode === undefined || skuCode === null) {
        console.log('SKU code is undefined/null, setting to empty string');
        setMetadata(prev => ({
          ...prev,
          internalSkuCode: ''
        }));
      }
    }
  }, [metadata]);

  const handleAddTag = () => {
    if (tagKey && tagValue && Object.keys(generalDetails.tags).length < 3) {
      setGeneralDetails(prev => ({
        ...prev,
        tags: { ...prev.tags, [tagKey]: tagValue }
      }));
      setTagKey('');
      setTagValue('');
    }
  };

  const handleRemoveTag = (key) => {
    setGeneralDetails(prev => ({
      ...prev,
      tags: Object.entries(prev.tags).reduce((acc, [k, v]) => {
        if (k !== key) acc[k] = v;
        return acc;
      }, {})
    }));
  };

  const handleAddLabel = () => {
    if (labelKey && labelValue && Object.keys(metadata.labels).length < 3) {
      setMetadata(prev => ({
        ...prev,
        labels: { ...prev.labels, [labelKey]: labelValue }
      }));
      setLabelKey('');
      setLabelValue('');
    }
  };

  const handleRemoveLabel = (key) => {
    setMetadata(prev => ({
      ...prev,
      labels: Object.entries(prev.labels).reduce((acc, [k, v]) => {
        if (k !== key) acc[k] = v;
        return acc;
      }, {})
    }));
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!generalDetails.productName || !generalDetails.productType || !metadata.internalSkuCode) {
        Swal.fire('Error', 'Product Name, Product Type, and Internal SKU Code are required', 'error');
        return;
      }

      // Prepare data using only what we have from the backend
      const sendData = {
        generalDetails: {
          productName: generalDetails.productName,
          productType: generalDetails.productType,
          version: generalDetails.version,
          description: generalDetails.description,
          category: generalDetails.category,
          status: generalDetails.status,
          tags: generalDetails.tags,
          visibility: generalDetails.visibility
        },
        metadata: {
          internalSkuCode: metadata.internalSkuCode,
          uom: metadata.uom,
          effectiveStartDate: metadata.effectiveStartDate,
          effectiveEndDate: metadata.effectiveEndDate,
          billable: metadata.billable,
          auditLogId: metadata.auditLogId,
          labels: metadata.labels,
          linkedRatePlans: metadata.linkedRatePlans
        }
      };

      // Log the exact data being sent
      console.log('Final data being sent to server:', sendData);

      // Make API call
      const res = await fetch(`http://13.230.194.245:8080/api/products/${product.productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData)
      });

      // Handle response
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error occurred' }));
        console.error('Update error:', errorData);
        throw new Error(errorData.message || 'Failed to update product');
      }

      const data = await res.json();
      console.log('Update successful:', data);
      Swal.fire('Success!', 'Product updated successfully.', 'success');
      onClose();

    } catch (err) {
      console.error("Update error:", err);
      Swal.fire('Error', err.message || 'Error occurred while updating. Please check the console for details.', 'error');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    console.log('Switching to tab:', tab);
  };

  return (
    <div className="product-form-container">
      <div className="product-form-tab-container">
        <div className="product-form-tab-buttons">
          <button
            className={`product-form-tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => handleTabClick('general')}
          >
            General Details
          </button>
          <button
            className={`product-form-tab-button ${activeTab === 'metadata' ? 'active' : ''}`}
            onClick={() => handleTabClick('metadata')}
          >
            Metadata
          </button>
        </div>

        <div className="product-form-tab-content">
          {activeTab === 'general' && (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="product-form-label">Product Name</label>
                <input
                  className="product-form-input"
                  value={generalDetails.productName}
                  onChange={(e) => setGeneralDetails(prev => ({
                    ...prev,
                    productName: e.target.value
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="product-form-label">Product Type</label>
                <select
                  className="product-form-select"
                  value={generalDetails.productType}
                  onChange={(e) => setGeneralDetails(prev => ({
                    ...prev,
                    productType: e.target.value
                  }))}
                >
                  <option value="">--Select--</option>
                  {productTypes.map((type) => (
                    <option key={type.key} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="product-form-label">Version</label>
                <input
                  className="product-form-input"
                  value={generalDetails.version}
                  onChange={(e) => setGeneralDetails(prev => ({
                    ...prev,
                    version: e.target.value
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="product-form-label">Description</label>
                <textarea
                  className="product-form-textarea"
                  value={generalDetails.description}
                  onChange={(e) => setGeneralDetails(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="product-form-label">Category</label>
                <select
                  className="product-form-select"
                  value={generalDetails.category}
                  onChange={(e) => setGeneralDetails(prev => ({
                    ...prev,
                    category: e.target.value
                  }))}
                >
                  <option value="">--Select--</option>
                  <option value="INTERNAL">INTERNAL</option>
                  <option value="PARTNER">PARTNER</option>
                  <option value="PUBLIC">PUBLIC</option>
                </select>
              </div>

              <div className="form-group">
                <label className="product-form-label">Status</label>
                <select
                  className="product-form-select"
                  value={generalDetails.status}
                  onChange={(e) => setGeneralDetails(prev => ({
                    ...prev,
                    status: e.target.value
                  }))}
                >
                  <option value="">--Select--</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="tags-container">
                <div className="tags-form-group">
                  <label className="product-form-label">Tags</label>
                  <div className="tags-inputs">
                    <input
                      className="product-form-input"
                      type="text"
                      id="tagKey"
                      placeholder="Key"
                      value={tagKey}
                      onChange={(e) => setTagKey(e.target.value)}
                    />
                    <input
                      className="product-form-input"
                      type="text"
                      id="tagValue"
                      placeholder="Value"
                      value={tagValue}
                      onChange={(e) => setTagValue(e.target.value)}
                    />
                    <button
                      className="primary-button"
                      onClick={handleAddTag}
                      disabled={!tagKey || !tagValue || Object.keys(generalDetails.tags).length >= 3}
                    >
                      ✚
                    </button>
                  </div>
                  <div className="product-form-tags-container">
                    {Object.entries(generalDetails.tags).map(([key, value], index) => (
                      <div key={index} className="product-form-tag-item">
                        <span className="product-form-tag-key">{key}</span>
                        <span className="product-form-tag-value">{value}</span>
                        <button
                          className="secondary-button"
                          onClick={() => handleRemoveTag(key)}
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="product-form-label">Visibility</label>
                <div className="switch-container">
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="visibility"
                      checked={generalDetails.visibility}
                      onChange={(e) => setGeneralDetails(prev => ({ ...prev, visibility: e.target.checked }))}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'metadata' && (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="product-form-label">Internal SKU Code</label>
                <input
                  className="product-form-input"
                  value={metadata.internalSkuCode}
                  onChange={(e) => setMetadata(prev => ({
                    ...prev,
                    internalSkuCode: e.target.value
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="product-form-label">UOM</label>
                <input
                  className="product-form-input"
                  value={metadata.uom}
                  onChange={(e) => setMetadata(prev => ({
                    ...prev,
                    uom: e.target.value
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="product-form-label">Effective Start Date</label>
                <input
                  className="product-form-input"
                  type="date"
                  value={metadata.effectiveStartDate || ''}
                  onChange={(e) => setMetadata(prev => ({
                    ...prev,
                    effectiveStartDate: e.target.value
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="product-form-label">Effective End Date</label>
                <input
                  className="product-form-input"
                  type="date"
                  value={metadata.effectiveEndDate || ''}
                  onChange={(e) => setMetadata(prev => ({
                    ...prev,
                    effectiveEndDate: e.target.value
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="product-form-label">Billable</label>
                <div className="switch-container">
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="billable"
                      checked={metadata.billable}
                      onChange={(e) => setMetadata(prev => ({ ...prev, billable: e.target.checked }))}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="product-form-label">Audit Log ID</label>
                <input
                  className="product-form-input"
                  value={metadata.auditLogId}
                  onChange={(e) => setMetadata(prev => ({
                    ...prev,
                    auditLogId: e.target.value
                  }))}
                />
              </div>

              <div className="labels-container">
                <div className="form-group">
                  <label className="product-form-label">Labels</label>
                  <div className="labels-inputs">
                    <input
                      className="product-form-input"
                      type="text"
                      id="labelKey"
                      placeholder="Key"
                      value={labelKey}
                      onChange={(e) => setLabelKey(e.target.value)}
                    />
                    <input
                      className="product-form-input"
                      type="text"
                      id="labelValue"
                      placeholder="Value"
                      value={labelValue}
                      onChange={(e) => setLabelValue(e.target.value)}
                    />
                    <button
                      className="primary-button"
                      onClick={handleAddLabel}
                      disabled={!labelKey || !labelValue || Object.keys(metadata.labels).length >= 3}
                    >
                      ✚
                    </button>
                  </div>
                  <div className="labels-list">
                    {Object.entries(metadata.labels).map(([key, value], index) => (
                      <div key={index} className="label-item">
                        <span className="label-key">{key}</span>
                        <span className="label-value">{value}</span>
                        <button
                          className="secondary-button"
                          onClick={() => handleRemoveLabel(key)}
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="product-form-label">Linked Rate Plans</label>
                <input
                  className="product-form-input"
                  type="text"
                  value={metadata.linkedRatePlans.join(',')}
                  onChange={(e) => setMetadata(prev => ({
                    ...prev,
                    linkedRatePlans: e.target.value.split(',')
                  }))}
                  placeholder="Enter rate plan IDs (comma-separated)"
                />
              </div>
            </form>
          )}
        </div>
      </div>

      {activeTab === 'general' && (
        <div className="button-groups">
          <button
            className="secondary-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="primary-button"
            onClick={() => setActiveTab('metadata')}
          >
            Next
          </button>
        </div>
      )}

      {activeTab === 'metadata' && (
        <div className="button-groups">
          <button
            className="secondary-button"
            onClick={() => setActiveTab('general')}
          >
            Back
          </button>
          <button
            className="primary-button"
            onClick={handleSave}
            disabled={!Object.keys(generalDetails).length || !Object.keys(metadata).length}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProductForm;
