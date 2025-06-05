import React, { useState } from 'react';
import './PricePlan.css';
import CreatePricePlan from './CreatePricePlan';

const ratePlans = [
  { id: 1, name: "API Call Rate", product: "API", status: "In Progress", pricing: "Tiered" },
  { id: 2, name: "Extra Storage Rate", product: "Storage", status: "In Progress", pricing: "Falt" },
  { id: 3, name: "Peak Data Rate", product: "Data Set", status: "In Progress", pricing: "Time-based" },
  { id: 4, name: "API Call Rate – Tiered", product: "API", status: "In Progress", pricing: "Tiered" },
];

const PricePlan = () => {
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [currentView, setCurrentView] = useState('list');
  

  const handleNewRatePlan = () => {
    setCurrentView('create');
  };

  const handleCloseCreatePlan = () => {
    setCurrentView('list');
  };

  return (
    <div className="cpp-screen">
      
      <div className="cpp-header">
        <div className="cpp-breadcrumb">
          {currentView === 'list' ? (
            <>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7.99992 12.6668L3.33325 8.00016M3.33325 8.00016L7.99992 3.3335M3.33325 8.00016H12.6666" stroke="#726E6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Price Plans
              </span>
            </>
          ) : (
            <>
              <span onClick={handleCloseCreatePlan} style={{ cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.15625 10.8438L1.84375 5.53125L7.15625 0.21875L8.59375 1.65625L4.28125 6.96875H12.75V7.15625H4.28125L8.59375 12.4688L7.15625 13.9062L1.84375 8.59375L7.15625 3.28125V4.71875H13.4062V3.28125L7.15625 10.8438Z" fill="#6D8836"/>
                </svg>
              </span>
              <span onClick={handleCloseCreatePlan} style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7.99992 12.6668L3.33325 8.00016M3.33325 8.00016L7.99992 3.3335M3.33325 8.00016H12.6666" stroke="#726E6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Price Plans
              </span>
              <span>></span>
              <span> Create New Price Plan</span>
            </>
          )}
        </div>
      </div>

      {currentView === 'list' && (
        <>
          <div className="title-container">
            <div className="cpp-title">Rate Plans</div>
            <div className="search-bar-container">
              <input
                className="pp-search-input"
                type="text"
                placeholder="Search among your rate plans"
              />
              <button className="pp-new-rate-btn" onClick={handleNewRatePlan}>
                + New Rate Plan
              </button>
            </div>
          </div>

          <table className="pp-rate-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Rate Plan Name</th>
                <th>Product Name, product type</th>
                <th>Status</th>
                <th>Pricing Model</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratePlans.map((plan, index) => (
                <tr key={plan.id}>
                  <td>{index + 1}</td>
                  <td>{plan.name}</td>
                  <td>
                    <span className={`pp-badge ${plan.product.toLowerCase().replace(' ', '-')}`}>
                      {plan.product}
                    </span>
                  </td>
                  <td>
                    <span className="pp-status">In Progress</span>
                  </td>
                  <td>{plan.pricing}</td>
                  <td>
                    <button className="pp-edit-btn">Edit</button>
                    <button className="pp-delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {currentView === 'create' && (
          <CreatePricePlan onClose={handleCloseCreatePlan} />
      )}
    </div>
  );
};

export default PricePlan;