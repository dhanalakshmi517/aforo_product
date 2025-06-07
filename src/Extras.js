import React, { useState } from 'react';
import './Extras.css';

export default function Extras() {
  const [activeSections, setActiveSections] = useState([]);

  const toggleSection = (section) => {
    setActiveSections(prev => {
      if (prev.includes(section)) {
        return prev.filter(s => s !== section);
      } else {
        return [...prev, section];
      }
    });
  };

  const renderHeader = (label, section) => (
    <div className="section-header" onClick={() => toggleSection(section)}>
      <span>{label}</span>
      <span className="dropdown-icon">
        {activeSections.includes(section) ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 12.5L10 7.5L5 12.5" stroke="#726E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="#726E6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </div>
  );

  return (
    <div className="extras-container">
      {/* Setup Fee */}
      <div className="section">
        {renderHeader('Setup Fee', 'setupFee')}
        {activeSections.includes('setupFee') && (
          <div className="section-content">
            <label style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Enter one-time Setup Fee <span className="optional">(optional)</span></label>
            <input type="text" value="$22" />
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Application Timing</label>
            <input type="text" value="$22" />
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Invoice Description</label>
            <textarea placeholder="Invoice Description"></textarea>
          </div>
        )}
      </div>

      {/* Overage Charges */}
      <div className="section">
        {renderHeader('Overage Charges', 'overageCharges')}
        {activeSections.includes('overageCharges') && (
          <div className="section-content">
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Usage Amount</label>
            <input type="text" placeholder="Placeholder" />
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Overage unit rate</label>
            <input type="text" placeholder="Placeholder" />
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Grace buffer <span className="optional">(optional)</span></label>
            <input type="text" placeholder="Placeholder" />
          </div>
        )}
      </div>

      {/* Discounts & Promotions */}
      <div className="section">
        {renderHeader('Discounts & Promotions', 'discounts')}
        {activeSections.includes('discounts') && (
          <div className="section-content">
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Discount Type</label>
            <select><option>Placeholder</option></select>
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Eligibility</label>
            <select><option>Placeholder</option></select>
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Validity Period</label>
            <div className="date-range">
  <div className="date-input">
    <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Start Date</label>
    <input type="date" />
  </div>
  <div className="date-input">
    <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>End Date</label>
    <input type="date" />
  </div>
</div>

          </div>
        )}
      </div>

      {/* Freemium Setup */}
      <div className="section">
        {renderHeader('Freemium Setup', 'freemium')}
        {activeSections.includes('freemium') && (
          <div className="section-content">
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Freemium Type</label>
            <select><option>Placeholder</option></select>
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Validity Period</label>
            <div className="date-range">
  <div className="date-input">
    <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Start Date</label>
    <input type="date" />
  </div>
  <div className="date-input">
    <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>End Date</label>
    <input type="date" />
  </div>
</div>

          </div>
        )}
      </div>
      {/* Minimum Commitment */}
      <div className="section">
        {renderHeader('Minimum Commitment', 'commitment')}
        {activeSections.includes('commitment') && (
          <div className="section-content">
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Minimum Usage</label>
            <input type="text" placeholder="Placeholder" />
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Minimum Charge</label>
            <input type="text" placeholder="Placeholder" />
          </div>
        )}
      </div>

      {/* Reset Period */}
      <div className="section">
        {renderHeader('Reset Period', 'resetPeriod')}
        {activeSections.includes('resetPeriod') && (
         <div className="section-content">
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Reset Frequency</label>
            <select><option>Placeholder</option></select>
            <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Validity Period</label>
            <div className="date-range">
  <div className="date-input">
    <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>Start Date</label>
    <input type="date" />
  </div>
  <div className="date-input">
    <label  style={{ display: 'block', margin: 0, padding: 0,marginLeft:'5px '}}>End Date</label>
    <input type="date" />
  </div>
</div>

          </div>
        )}
      </div>
    </div>
  );
}
