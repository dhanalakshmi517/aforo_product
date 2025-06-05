import React, { useState } from 'react';
import './Contracts.css';
import CreateContract from './CreateContract';

const contractData = [
  {
    sno: 1,
    customer: 'Aditya Inc',
    email: 'emilyjones@example.com',
    contractName: 'ABC Storage Solutions – Contract',
    contractId: 'GUJ123HBMKX',
    status: 'In Progress',
    contractPeriod: 'Jan 01, 2025',
  },
  {
    sno: 2,
    customer: 'Isabella Anderson',
    email: 'noah.thompson@example.com',
    contractName: 'Olivia Martin Contract',
    contractId: 'GUJ123HBMKX',
    status: 'In Progress',
    contractPeriod: 'Jan 01, 2025',
  },
  {
    sno: 3,
    customer: 'Mia Taylor',
    email: 'alexander.thompson@example.com',
    contractName: 'John Doe Contract',
    contractId: 'GUJ123HBMKX',
    status: 'In Progress',
    contractPeriod: 'Jan 01, 2025',
  },
  {
    sno: 4,
    customer: 'Joseph Martinez',
    email: 'alexander.thompson@example.com',
    contractName: 'Christopher White Contract',
    contractId: 'GUJ123HBMKX',
    status: 'Not Started',
    contractPeriod: 'Jan 01, 2025',
  },
  {
    sno: 5,
    customer: 'Joseph Martinez',
    email: 'bob.johnson@example.com',
    contractName: 'James Rodriguez Contract',
    contractId: 'GUJ123HBMKX',
    status: 'Not Started',
    contractPeriod: 'Jan 01, 2025',
  },
];

const Contracts = () => {
  const [isCreatingContract, setIsCreatingContract] = useState(false);

  const BreadcrumbSeparator = () => (
    <span className="separator">></span>
  );

  const handleCreateContract = () => {
    setIsCreatingContract(true);
  };

  const handleCancelCreate = () => {
    setIsCreatingContract(false);
  };

  const handleBackToContracts = () => {
    setIsCreatingContract(false);
  };

  return (
    <div className="contracts-container">
      <div className="con-breadcrumb-container">
        <nav className="con-breadcrumb">
          <span 
            className="con-breadcrumb-item" 
            style={{ 
              fontWeight: isCreatingContract ? 400 : 600,
              color: isCreatingContract ? '#333' : '#6D8836',
              cursor: isCreatingContract ? 'pointer' : 'default'
            }}
            onClick={isCreatingContract ? handleBackToContracts : undefined}
          >
            Contracts
          </span>
          {isCreatingContract && (
            <>
              <BreadcrumbSeparator />
              <span className="con-breadcrumb-item active">New Contract</span>
            </>
          )}
        </nav>
      </div>

      <div className="contracts-header">
        {!isCreatingContract && (
          <>
            <h2>Contracts</h2>
            <div className="actions">
              <input
                type="text"
                className="search-input"
                placeholder="Search contracts..."
              />
              <button
                className="new-contract-button"
                onClick={handleCreateContract}
                disabled={isCreatingContract}
              >
                + Create Contract
              </button>
            </div>
          </>
        )}
      </div>

      {isCreatingContract ? (
        <CreateContract onCancel={handleCancelCreate} />
      ) : (
        <div className="contracts-table-container">
          <table className="contracts-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Customer</th>
                <th>Contract Name</th>
                <th>Contract ID</th>
                <th>Status</th>
                <th>Contract Period</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contractData.map((contract) => (
                <tr key={contract.sno}>
                  <td>{contract.sno}</td>
                  <td className="customer-info">
                    <div>{contract.customer}</div>
                    <div className="email">{contract.email}</div>
                  </td>
                  <td>{contract.contractName}</td>
                  <td>{contract.contractId}</td>
                  <td>
                    <span className={`status-badge ${contract.status.toLowerCase()}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td>{contract.contractPeriod}</td>
                  <td>
                    <button className="action-btn">View</button>
                    <button className="action-btn">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Contracts;
