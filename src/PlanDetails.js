import React, { useState, useEffect } from 'react';

function PlanDetails({ onPricingModelSelect }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [pricingModel, setPricingModel] = useState('');

  useEffect(() => {
    // Fetch products from backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://13.230.194.245:8080/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handlePricingModelChange = (e) => {
    setPricingModel(e.target.value);
    onPricingModelSelect(e.target.value);
  };

  return (
    <div className="price-plan-details-section">
      <div className="price-plan-form-group">
        <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'200px '}}>Rate Plan Name</label>
        <input type="text"
         placeholder="Google Maps API" 
                         style={{ flex: 1, maxWidth: '400px' ,marginLeft:'200px'}}

         className="rate-plan-name-input" />
      </div>
      <div className="price-plan-form-group">
        <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'200px '}}>Select Product Name</label>
        <select 
          className="product-select" 
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
                          style={{ flex: 1, maxWidth: '420px' ,marginLeft:'200px'}}

        >
          <option value="">--Select--</option>
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </select>
      </div>
      <div className='price-plan-form-group'>
        <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'200px '}}>Description</label>
        <textarea placeholder="Enter description here" className="description-textarea"
                        style={{ flex: 1, maxWidth: '400px' ,marginLeft:'200px'}}
></textarea>
      </div>
      <div className="price-plan-form-group">
        <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'200px '}}>Status</label>
        <select className="status-select"                 style={{ flex: 1, maxWidth: '420px' ,marginLeft:'200px'}}
>
          <option value="">--Select--</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>

        </select>
      </div>
      <div className="price-plan-form-group">
        <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'200px '}}>Pricing Model</label>
        <select 
          className="pricing-model-select"
          value={pricingModel}
          onChange={handlePricingModelChange}
                          style={{ flex: 1, maxWidth: '420px' ,marginLeft:'200px'}}

        >
          <option value="">--Select--</option>
          <option value="flat-rate">Flat Fee</option>
          <option value="tiered">Tiered Pricing</option>
          <option value="volume-based">Volume Based Pricing</option>
          <option value="stairstep">Stair Step Pricing</option>
        </select>
      </div>
    </div>
  );
}

export default PlanDetails;