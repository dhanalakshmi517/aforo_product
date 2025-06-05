// src/App.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import GetStarted from './GetStarted';
import Customers from './Customers';
import Contracts from './Contracts';
import Products from './Products';
import PricePlan from './PricePlan';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Get Started');

  const renderContent = () => {
    switch (activeTab) {
      case 'Get Started':
        return <GetStarted />;
      case 'Customers':
        return <Customers />;
      case 'Payments':
        return <Contracts />;
      case 'Products':
        return <Products />;
      case 'Rate Plan':
        return <PricePlan />;
      case 'Dashboard':
        return <Dashboard />;
      default:
        return <GetStarted />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabClick={setActiveTab} />
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
