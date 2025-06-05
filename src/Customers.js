import React, { useState } from 'react';
import './Customer.css';
import { FaCopy } from 'react-icons/fa';
import AddCustomerPanel from './AddCustomerPanel';

const customerData = [
  {
    id: 1,
    name: 'Aditya Inc',
    email: 'customer-1@gmail.com',
    customerId: 'GUJ23HBMKK',
    status: 'In Progress',
    createdOn: '06 Jan, 2025 08:58 IST',
  },
  {
    id: 2,
    name: 'Customer 2',
    email: 'customer-2@gmail.com',
    customerId: 'GUJ23HBMKL',
    status: 'In Progress',
    createdOn: '07 Jan, 2025 09:15 IST',
  },
  {
    id: 3,
    name: 'Customer 3',
    email: 'customer-3@gmail.com',
    customerId: 'GUJ23HBMKM',
    status: 'In Progress',
    createdOn: '08 Jan, 2025 10:30 IST',
  },
  {
    id: 4,
    name: 'Customer 4',
    email: 'customer-4@gmail.com',
    customerId: 'GUJ23HBMKN',
    status: 'In Progress',
    createdOn: '09 Jan, 2025 11:45 IST',
  },
  {
    id: 5,
    name: 'Customer 5',
    email: 'customer-5@gmail.com',
    customerId: 'GUJ23HBMKO',
    status: 'In Progress',
    createdOn: '10 Jan, 2025 12:00 IST',
  },
];

const Customers = () => {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState(['Customers']);

  const handleOpenAddCustomer = () => {
    setShowAddPanel(true);
    setBreadcrumb(['Customers', 'New Customer']);
  };

  const handleCloseAddCustomer = () => {
    setShowAddPanel(false);
    setBreadcrumb(['Customers']);
  };

  return (
    <div className="cust-customers-container">
      {/* Breadcrumb */}
      <div className="cust-breadcrumb">
        {breadcrumb.map((item, index) => (
          <span
            key={index}
            className={`cust-breadcrumb-item ${
              index === breadcrumb.length - 1 ? 'active' : ''
            }`}
          >
            {item}
            {index < breadcrumb.length - 1 && (
              <span className="cust-separator"> &gt; </span>
            )}
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="cust-customers-header">
        <h2>Customers</h2>
        <div className="cust-customers-actions">
          <input
            type="text"
            placeholder="Search among customers"
            className="cust-customers-search"
          />
          <button className="cust-new-customer-btn" onClick={handleOpenAddCustomer}>
            + New Customer
          </button>
        </div>
      </div>

      {/* Add Customer Panel */}
      {showAddPanel && <AddCustomerPanel onClose={handleCloseAddCustomer} />}

      {/* Customer Table */}
      <table className="cust-customers-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Customer ID</th>
            <th>Status</th>
            <th>Created On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customerData.map((customer, index) => (
            <tr key={customer.id}>
              <td>{index + 1}</td>
              <td className="cust-customer-name">
                <span>{customer.name}</span>
                <span className="email">{customer.email}</span>
              </td>
              <td>{customer.email}</td>
              <td className="cust-customer-id">
                {customer.customerId}
                <FaCopy className="cust-copy-icon" />
              </td>
              <td>
                <span className="cust-status">{customer.status}</span>
              </td>
              <td>{customer.createdOn}</td>
              <td>
                <button className="cust-edit-btn">Edit</button>
                <button className="cust-delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
