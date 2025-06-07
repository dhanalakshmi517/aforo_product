import React, { useState } from 'react';
import './CreatePricePlan.css';
import Extras from './Extras';
import PlanDetails from './PlanDetails';

function CreatePricePlan() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedPricingModel, setSelectedPricingModel] = useState('');
  const [pricingFormData, setPricingFormData] = useState({
    flat: {
      recurringFee: '',
      billingFrequency: '',
      currency: ''
    },
    tiered: {
      tiers: [
        { start: '', end: '', cost: '' },
        { start: '', end: '', cost: '' },
        { start: '', end: '', cost: '' }
      ]
    },
    volume: {
      tiers: [
        { start: '', end: '', cost: '' },
        { start: '', end: '', cost: '' },
        { start: '', end: '', cost: '' }
      ]
    },
    stairstep: {
      tiers: [
        { start: '', end: '', cost: '' },
        { start: '', end: '', cost: '' },
        { start: '', end: '', cost: '' }
      ]
    }
  });

  const handlePricingModelSelect = (model) => {
    setSelectedPricingModel(model);
  };

  const handleFlatDetailsChange = (field, value) => {
    setPricingFormData(prev => ({
      ...prev,
      flat: {
        ...prev.flat,
        [field]: value
      }
    }));
  };

  const handleTierChange = (type, index, field, value) => {
    setPricingFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        tiers: prev[type].tiers.map((tier, i) => 
          i === index ? {
            ...tier,
            [field]: value
          } : tier
        )
      }
    }));
  };

  const handleAddTier = (type) => {
    setPricingFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        tiers: [...prev[type].tiers, { start: '', end: '', cost: '' }]
      }
    }));
  };

  const handleRemoveTier = (type, index) => {
    setPricingFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        tiers: prev[type].tiers.filter((_, i) => i !== index)
      }
    }));
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 3) {
        setActiveTab('pricing');
      } else {
        setActiveTab('details');
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      if (currentStep === 1) {
        setActiveTab('pricing');
      } else if (currentStep === 2) {
        setActiveTab('extras');
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="price-plan-outer-container">
      <h2>Create New Price Plan</h2>
      <div className="price-plan-container">
        <div className="price-plan-tabs">
          <div className="price-plan-tab-status">
            <div className="price-plan-progress">
              <div className="price-plan-progress-bar" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="price-plan-tab-status">
            <div className="price-plan-progress">
              <div 
                className="price-plan-progress-bar" 
                style={{ width: activeTab === 'details' ? '0%' : activeTab === 'pricing' ? '50%' : '100%' }}
              ></div>
            </div>
          </div>
          <div className="price-plan-tab-status">
            <div className="price-plan-progress">
              <div 
                className="price-plan-progress-bar" 
                style={{ width: activeTab === 'extras' ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
        </div>
        <div className="price-plan-tabs">
          <button 
            className={`price-plan-tab ${activeTab === 'details' ? 'price-plan-tab-active' : ''}`} 
            onClick={() => handleTabClick('details')}
          >
            Plan Details
          </button>
          <button 
            className={`price-plan-tab ${activeTab === 'pricing' ? 'price-plan-tab-active' : ''}`} 
            onClick={() => handleTabClick('pricing')}
          >
            Pricing Model setup
          </button>
          <button 
            className={`price-plan-tab ${activeTab === 'extras' ? 'price-plan-tab-active' : ''}`} 
            onClick={() => handleTabClick('extras')}
          >
            Extras (Optional)
          </button>
        </div>

        <div className="price-plan-form-section">
          {activeTab === 'details' && (
            <div className="price-plan-details-section">
              <PlanDetails onPricingModelSelect={handlePricingModelSelect} />
            </div>
          )}
          {activeTab === 'pricing' && (
            <div className="price-plan-pricing-section">
              {/* <div className="price-plan-model-details"> */}
                {selectedPricingModel === 'flat-rate' && (
                  <div>
                    <div className="price-plan-form-group">
                      <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'210px '}}>Recurring Fee</label>
                      <select
                        value={pricingFormData.flat.recurringFee}
                        onChange={(e) => handleFlatDetailsChange('recurringFee', e.target.value)}
                        className="flat-recurring-fee-select"
                        style={{ flex: 1, maxWidth: '410px', marginLeft: '210px' }}
                      >
                        <option>--Select--</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </div>

                    <div className="price-plan-form-group">
                      <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'210px '}}>Billing Frequency</label>
                      <select
                        value={pricingFormData.flat.billingFrequency}
                        onChange={(e) => handleFlatDetailsChange('billingFrequency', e.target.value)}
                        className="flat-billing-frequency-select"
                        style={{ flex: 1, maxWidth: '410px', marginLeft: '210px' }}
                      >
                        <option>--Select--</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    <div className="price-plan-form-group">
                      <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'210px '}}>Currency</label>
                      <select
                        value={pricingFormData.flat.currency}
                        onChange={(e) => handleFlatDetailsChange('currency', e.target.value)}
                        className="flat-currency-select"
                        style={{ flex: 1, maxWidth: '410px', marginLeft: '210px' }}
                      >
                        <option>--Select--</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                )}
               {selectedPricingModel === 'stairstep' && (
                  <div>
                    <div className="price-plan-model-form-header">
                      <h5>Stair-step Pricing</h5>
                      <p>Customer pays one price for all units based on total usage.</p>
                    </div>
                    <div className="price-plan-model-form-body">
                      {pricingFormData.tiered.tiers.map((tier, index) => (
                        <div key={index} className="price-plan-tier-row">
                          
                          <input
                            type="number"
                            value={tier.start}
                            onChange={(e) => handleTierChange('tiered', index, 'start', e.target.value)}
                            placeholder="Start"
                                                    style={{ flex: 1, maxWidth: '480px', marginLeft: '270px' }}

                          />
                          <input
                            type="number"
                            value={tier.end}
                            onChange={(e) => handleTierChange('tiered', index, 'end', e.target.value)}
                            placeholder="End"
                          />
                          <input
                            type="number"
                            value={tier.cost}
                            onChange={(e) => handleTierChange('tiered', index, 'cost', e.target.value)}
                            placeholder="Cost"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTier('tiered', index)}
                            className="price-plan-delete-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M2 3.99992H14M12.6667 3.99992V13.3333C12.6667 13.9999 12 14.6666 11.3333 14.6666H4.66667C4 14.6666 3.33333 13.9999 3.33333 13.3333V3.99992M5.33333 3.99992V2.66659C5.33333 1.99992 6 1.33325 6.66667 1.33325H9.33333C10 1.33325 10.6667 1.99992 10.6667 2.66659V3.99992M6.66667 7.33325V11.3333M9.33333 7.33325V11.3333" stroke="#E34935" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddTier('tiered')}
                        className="price-plan-add-tier-btn"
                      >
                        + Add Tier
                      </button>
                    </div>
                  </div>
                )}

                {selectedPricingModel === 'tiered' && (
                  <div>
                    <div className="price-plan-model-form-header">
                      <h5>Tiered Pricing</h5>
                      <p>Each tier’s rate applies only to units within that tier.</p>
                    </div>
                    <div className="price-plan-model-form-body">
                      {pricingFormData.tiered.tiers.map((tier, index) => (
                        <div key={index} className="price-plan-tier-row">
                          
                          <input
                            type="number"
                            value={tier.start}
                            onChange={(e) => handleTierChange('tiered', index, 'start', e.target.value)}
                            placeholder="Start"
                                                    style={{ flex: 1, maxWidth: '480px', marginLeft: '270px' }}

                          />
                          <input
                            type="number"
                            value={tier.end}
                            onChange={(e) => handleTierChange('tiered', index, 'end', e.target.value)}
                            placeholder="End"
                          />
                          <input
                            type="number"
                            value={tier.cost}
                            onChange={(e) => handleTierChange('tiered', index, 'cost', e.target.value)}
                            placeholder="Cost"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTier('tiered', index)}
                            className="price-plan-delete-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M2 3.99992H14M12.6667 3.99992V13.3333C12.6667 13.9999 12 14.6666 11.3333 14.6666H4.66667C4 14.6666 3.33333 13.9999 3.33333 13.3333V3.99992M5.33333 3.99992V2.66659C5.33333 1.99992 6 1.33325 6.66667 1.33325H9.33333C10 1.33325 10.6667 1.99992 10.6667 2.66659V3.99992M6.66667 7.33325V11.3333M9.33333 7.33325V11.3333" stroke="#E34935" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddTier('tiered')}
                        className="price-plan-add-tier-btn"
                      >
                        + Add Tier
                      </button>
                    </div>
                  </div>
                )}
                 {selectedPricingModel === 'volume-based' && (
                  <div>
                    <div className="price-plan-model-form-header">
                      <h5>Volume-Based Pricing</h5>
                      <p>Customer pays one price for all units based on total usage.</p>
                    </div>
                    <div className="price-plan-model-form-body">
                      {pricingFormData.tiered.tiers.map((tier, index) => (
                        <div key={index} className="price-plan-tier-row">
                          
                          <input
                            type="number"
                            value={tier.start}
                            onChange={(e) => handleTierChange('tiered', index, 'start', e.target.value)}
                            placeholder="Start"
                                                    style={{ flex: 1, maxWidth: '480px', marginLeft: '270px' }}

                          />
                          <input
                            type="number"
                            value={tier.end}
                            onChange={(e) => handleTierChange('tiered', index, 'end', e.target.value)}
                            placeholder="End"
                          />
                          <input
                            type="number"
                            value={tier.cost}
                            onChange={(e) => handleTierChange('tiered', index, 'cost', e.target.value)}
                            placeholder="Cost"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTier('tiered', index)}
                            className="price-plan-delete-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M2 3.99992H14M12.6667 3.99992V13.3333C12.6667 13.9999 12 14.6666 11.3333 14.6666H4.66667C4 14.6666 3.33333 13.9999 3.33333 13.3333V3.99992M5.33333 3.99992V2.66659C5.33333 1.99992 6 1.33325 6.66667 1.33325H9.33333C10 1.33325 10.6667 1.99992 10.6667 2.66659V3.99992M6.66667 7.33325V11.3333M9.33333 7.33325V11.3333" stroke="#E34935" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddTier('tiered')}
                        className="price-plan-add-tier-btn"
                      >
                        + Add Tier
                      </button>
                    </div>
                  </div>
                )}

               
              </div>
            // </div>
          )}
          {activeTab === 'extras' && (
            <div className="price-plan-extras-section">
              <Extras />
            </div>
          )}
        </div>


      <div className="button-group">
        <button type="button" className="custom-button cancel-button" onClick={handleBack}
          disabled={currentStep === 1}>
         <h6>Back</h6>
        </button>
        <button type="button" className="custom-button aforo-button" onClick={handleNext}
          disabled={currentStep === 3}>
         <h6>Next</h6>
        </button>
      </div>
    </div>
    </div>

  );
}

export default CreatePricePlan;
