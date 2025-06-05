import React from 'react';
import './CreateContract.css';

const CreateContract = () => {
  return (
    <>
      <h4>Create New Contract</h4>
      <div className="container">

        <div className="section">
          <h6>Contract Details</h6>
          <div className="form-grid">
            <div className="form-group">
              <label>Contract Name</label>
              <input type="text" value="ABC API Solutions" readOnly />
            </div>
            <div className="form-group">
              <label>Currency ID</label>
              <input type="text" value="gvhjhbxn" readOnly />
            </div>
          </div>
        </div>

        <div className="section">
          <h6>Product 1</h6>
          <div className="form-grid">
            <div className="form-group">
              <label>Product ID</label>
              <input type="text" value="GJUI23HBMKK" readOnly />
            </div>
            <div className="form-group">
              <label>Rate Plan Description</label>
              <textarea placeholder="Placeholder Placeholder Placeholder Placeholder" />
            </div>
            <div className="form-group full-width">
              <label>Select Pricing Model</label>
              <select>
                <option>Placeholder</option>
                <option>Select from pre made price plans</option>
                <option>Select from raw price plans</option>
              </select>
            </div>
            <div className="form-group">
              <label>Unit Rate (Cost per usage of one Product)</label>
              <input type="text" placeholder="Placeholder" />
            </div>
            <div className="form-group">
              <label>Unit Type</label>
              <select>
                <option>Placeholder</option>
              </select>
            </div>
            <div className="form-group">
              <label>Unit Measurement</label>
              <select>
                <option>Placeholder</option>
              </select>
            </div>
            <div className="form-group">
              <label>Falt Rate Unit</label>
              <input type="text" placeholder="Placeholder" />
            </div>
            <div className="form-group">
              <label>Max Limit Frequency</label>
              <select>
                <option>Placeholder</option>
              </select>
            </div>
          </div>
        </div>

        <button className="add-product-btn">+ New Product</button>
      </div>
    </>
  );
};

export default CreateContract;
