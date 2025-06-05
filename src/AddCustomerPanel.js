import React, { useState, useEffect } from "react";
import "./AddCustomer.css";

const AddCustomerPanel = ({ onClose, addNewCustomer }) => {
    const [activeTab, setActiveTab] = useState("customer");
    const [customerData, setCustomerData] = useState({
        name: "",
        email: "",
        customerId: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        postalCode: "",
        state: "",
        country: "",
    });

    const [accountData, setAccountData] = useState({
        accountName: "",
        primaryEmail: "",
        emailRecipient: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        postalCode: "",
        state: "",
        country: "",
        accountId: "",
        currency: "",
        netTerms: "",
        inheritAddress: false,
        emailRecipients: [],
    });

    const [error, setError] = useState({
        customer: {},
        account: {}
    });
    const [customerProgress, setCustomerProgress] = useState(0);
    const [accountProgress, setAccountProgress] = useState(0);
    const [formSubmitted, setFormSubmitted] = useState({  // Track form submission
        customer: false,
        account: false,
    });

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setCustomerData({ ...customerData, [name]: value });
    };

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setAccountData({ ...accountData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === "inheritAddress" && checked) {
            setAccountData((prev) => ({
                ...prev,
                inheritAddress: true,
                address1: customerData.address1,
                address2: customerData.address2,
                city: customerData.city,
                postalCode: customerData.postalCode,
                state: customerData.state,
                country: customerData.country,
            }));
        } else {
            setAccountData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        }
    };

    const addEmailRecipient = () => {
        setAccountData((prev) => ({
            ...prev,
            emailRecipients: [...prev.emailRecipients, ""],
        }));
    };

    const removeEmailRecipient = (index) => {
        setAccountData((prev) => ({
            ...prev,
            emailRecipients: prev.emailRecipients.filter((_, i) => i !== index),
        }));
    };

    const handleEmailChange = (index, value) => {
        const updated = [...accountData.emailRecipients];
        updated[index] = value;
        setAccountData((prev) => ({
            ...prev,
            emailRecipients: updated,
        }));
    };

    const validateFields = (data, type) => {
        const errors = {};
        let filledCount = 0;
        let totalFields = 0;
        Object.keys(data).forEach(key => {
            totalFields++;
            const value = data[key];
             if (typeof value === 'string' ? !value.trim() : value == null || value === false) { //check for string, null and boolean
                errors[key] = "This field is required";
            }
            else {
                filledCount++;
            }
        });

        const progress = (filledCount / totalFields) * 100;
        return { isValid: Object.keys(errors).length === 0, progress, errors };  // Return errors
    };

    const handleProceed = () => {
        setFormSubmitted(prev => ({ ...prev, customer: true })); //set customer form submitted
        const { isValid, progress, errors } = validateFields(customerData, "customer"); // Get errors
        setError(prev => ({ ...prev, customer: errors })); //set errors
        if (isValid) {
            setCustomerProgress(100);
            setActiveTab("account");
        }
        else {
            setCustomerProgress(progress);
        }
    };

    const handleCreateCustomer = () => {
        setFormSubmitted(prev => ({ ...prev, account: true }));  //set account form submitted
        const { isValid, progress, errors } = validateFields(accountData, "account"); // Get errors
        setError(prev => ({ ...prev, account: errors }));  // Set errors
        if (isValid) {
            setAccountProgress(100);
            const newCustomer = {
                id: Date.now(),
                name: customerData.name,
                email: customerData.email,
                customerId: customerData.customerId,
                createdOn: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).replace(/,/g, ''),
            };
            addNewCustomer(newCustomer);
            onClose();
        }
        else {
            setAccountProgress(progress);
        }
    };

    useEffect(() => {
        // Calculate progress whenever customerData or accountData changes
        if (activeTab === 'customer') {
            const { progress } = validateFields(customerData, "customer");
            setCustomerProgress(progress);
        } else if (activeTab === 'account') {
            const { progress } = validateFields(accountData, "account");
            setAccountProgress(progress);
        }
    }, [customerData, accountData, activeTab]);

    return (
        <div className="add-customer-panel-overlay">
            <div className="add-customer-panel">
                <h3>Add New Customer</h3>

                <div className="tab-header">
                    <button
                        className={activeTab === "customer" ? "active" : ""}
                        onClick={() => setActiveTab("customer")}
                    >
                        Customer Details
                    </button>
                    <button
                        className={activeTab === "account" ? "active" : ""}
                        onClick={() => setActiveTab("account")}
                        disabled={false}
                    >
                        Account Details
                    </button>
                </div>

                {(activeTab === "customer" || activeTab === "account") && (
                    <div className="form-sections">
                        <h2>{activeTab === "customer" ? "" : ""}</h2>
                        <div className="progress-bar">
                            <div className="progress-line" style={{ width: `${activeTab === 'customer' ? customerProgress : accountProgress}%` }}></div>
                        </div>
                        {activeTab === "customer" ? (
                            <>
                                <div className="form-groups">
                                    <label>Customer Name</label>
                                    <input
                                        name="name"
                                        value={customerData.name}
                                        onChange={handleCustomerChange}
                                        placeholder="Placeholder"
                                        disabled={activeTab === "account"}
                                    />
                                    {formSubmitted.customer && error.customer.name && <div className="error-message">{error.customer.name}</div>}
                                </div>
                                <div className="form-groups">
                                    <label>Email ID</label>
                                    <input
                                        name="email"
                                        value={customerData.email}
                                        onChange={handleCustomerChange}
                                        placeholder="Placeholder"
                                        disabled={activeTab === "account"}
                                    />
                                    {formSubmitted.customer && error.customer.email && <div className="error-message">{error.customer.email}</div>}
                                </div>
                                <div className="form-groups">
                                    <label>Customer ID</label>
                                    <input
                                        name="customerId"
                                        value={customerData.customerId}
                                        onChange={handleCustomerChange}
                                        placeholder="Placeholder"
                                        disabled={activeTab === "account"}
                                    />
                                    {formSubmitted.customer && error.customer.customerId && <div className="error-message">{error.customer.customerId}</div>}
                                </div>
                                <div className="form-groups">
                                    <label>Phone Number</label>
                                    <input
                                        name="phone"
                                        value={customerData.phone}
                                        onChange={handleCustomerChange}
                                        placeholder="Placeholder"
                                        disabled={activeTab === "account"}
                                    />
                                    {formSubmitted.customer && error.customer.phone && <div className="error-message">{error.customer.phone}</div>}
                                </div>
                                <div className="form-groups">
                                    <label>Billing Address Line 1</label>
                                    <input
                                        name="address1"
                                        value={customerData.address1}
                                        onChange={handleCustomerChange}
                                        placeholder="Placeholder"
                                        disabled={activeTab === "account"}
                                    />
                                    {formSubmitted.customer && error.customer.address1 && <div className="error-message">{error.customer.address1}</div>}
                                </div>
                                <div className="form-groups">
                                    <label>Billing Address Line 2</label>
                                    <input
                                        name="address2"
                                        value={customerData.address2}
                                        onChange={handleCustomerChange}
                                        placeholder="Placeholder"
                                        disabled={activeTab === "account"}
                                    />
                                    {formSubmitted.customer && error.customer.address2 && <div className="error-message">{error.customer.address2}</div>}
                                </div>
                                <div className="form-rows">
                                    <div className="form-group halfs">
                                        <label>City</label>
                                        <input
                                            name="city"
                                            value={customerData.city}
                                            onChange={handleCustomerChange}
                                            placeholder="Placeholder"
                                            disabled={activeTab === "account"}
                                        />
                                        {formSubmitted.customer && error.customer.city && <div className="error-message">{error.customer.city}</div>}
                                    </div>
                                    <div className="form-group halfs">
                                        <label>Postal Code</label>
                                        <input
                                            name="postalCode"
                                            value={customerData.postalCode}
                                            onChange={handleCustomerChange}
                                            placeholder="Placeholder"
                                            disabled={activeTab === "account"}
                                        />
                                        {formSubmitted.customer && error.customer.postalCode && <div className="error-message">{error.customer.postalCode}</div>}
                                    </div>
                                </div>
                                <div className="form-groups">
                                    <label>State</label>
                                    <input
                                        name="state"
                                        value={customerData.state}
                                        onChange={handleCustomerChange}
                                        placeholder="Placeholder"
                                        disabled={activeTab === "account"}
                                    />
                                    {formSubmitted.customer && error.customer.state && <div className="error-message">{error.customer.state}</div>}
                                </div>
                                <div className="form-groups">
                                    <label>Country</label>
                                    <input
                                        name="country"
                                        value={customerData.country}
                                        onChange={handleCustomerChange}
                                        placeholder="Placeholder"
                                        disabled={activeTab === "account"}
                                    />
                                    {formSubmitted.customer && error.customer.country && <div className="error-message">{error.customer.country}</div>}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Account Name */}
                                <div className="form-groups">
                                    <label>Account Name</label>
                                    <input
                                        name="accountName"
                                        value={accountData.accountName}
                                        onChange={handleAccountChange}
                                        placeholder="Placeholder"
                                    />
                                    {formSubmitted.account && error.account.accountName && <div className="error-message">{error.account.accountName}</div>}
                                </div>

                                {/* Currency */}
                                <div className="form-groups">
                                    <label>Currency</label>
                                    <select
                                        name="currency"
                                        value={accountData.currency}
                                        onChange={handleAccountChange}
                                    >
                                        <option value="">Select currency</option>
                                        <option value="USD">USD</option>
                                        <option value="INR">INR</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                    {formSubmitted.account && error.account.currency && <div className="error-message">{error.account.currency}</div>}
                                </div>

                                {/* Net Term Days */}
                                <div className="form-groups">
                                    <label>Enter Net Term Days</label>
                                    <input
                                        name="netTerms"
                                        value={accountData.netTerms}
                                        onChange={handleAccountChange}
                                        placeholder="Placeholder"
                                    />
                                    {formSubmitted.account && error.account.netTerms && <div className="error-message">{error.account.netTerms}</div>}
                                </div>

                                {/* Account ID */}
                                <div className="form-groups">
                                    <label>Account ID</label>
                                    <input
                                        name="accountId"
                                        value={accountData.accountId}
                                        onChange={handleAccountChange}
                                        placeholder="Placeholder"
                                    />
                                    {formSubmitted.account && error.account.accountId && <div className="error-message">{error.account.accountId}</div>}
                                </div>

                                {/* Primary Email */}
                                <div className="form-groups">
                                    <label>Primary Email</label>
                                    <input
                                        name="primaryEmail"
                                        value={accountData.primaryEmail}
                                        onChange={handleAccountChange}
                                        placeholder="Placeholder"
                                    />
                                    {formSubmitted.account && error.account.primaryEmail && <div className="error-message">{error.account.primaryEmail}</div>}
                                </div>

                                {/* Email Recipients */}
                                <div className="form-groups">
                                    <label>Email Recipients</label>
                                    {accountData.emailRecipients.map((email, index) => (
                                        <div key={index} className="form-inline-group">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                                placeholder="Enter email"
                                            />
                                            {formSubmitted.account && error.account.emailRecipients && error.account.emailRecipients[index] && (
                                                <div className="error-message">{error.account.emailRecipients[index]}</div>
                                            )}
                                            <button type="button" onClick={() => removeEmailRecipient(index)}>Remove</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addEmailRecipient}>+ Add Email Recipients</button>
                                </div>

                                {/* Inherit Address */}
                                <div className="form-group checkbox-inline">
                                    <input
                                        type="checkbox"
                                        name="inheritAddress"
                                        checked={accountData.inheritAddress}
                                        onChange={handleCheckboxChange}
                                        id="inheritAddress"
                                    />
                                    <label htmlFor="inheritAddress">Inherit Address from Customer</label>
                                </div>

                                {/* Phone */}
                                <div className="form-groups">
                                    <label>Phone Number</label>
                                    <input
                                        name="phone"
                                        value={accountData.phone}
                                        onChange={handleAccountChange}
                                        placeholder="4325678901"
                                    />
                                    {formSubmitted.account && error.account.phone && <div className="error-message">{error.account.phone}</div>}
                                </div>

                                {/* Billing Address Line 1 */}
                                <div className="form-groups">
                                    <label>Billing Address Line 1</label>
                                    <input
                                        name="address1"
                                        value={accountData.address1}
                                        onChange={handleAccountChange}
                                        placeholder="Placeholder"
                                    />
                                    {formSubmitted.account && error.account.address1 && <div className="error-message">{error.account.address1}</div>}
                                </div>

                                {/* Billing Address Line 2 */}
                                <div className="form-groups">
                                    <label>Billing Address Line 2</label>
                                    <input
                                        name="address2"
                                        value={accountData.address2}
                                        onChange={handleAccountChange}
                                        placeholder="Placeholder"
                                    />
                                    {formSubmitted.account && error.account.address2 && <div className="error-message">{error.account.address2}</div>}
                                </div>

                                {/* City & Postal Code */}
                                <div className="form-rows">
                                    <div className="form-group halfs">
                                        <label>City</label>
                                        <input
                                            name="city"
                                            value={accountData.city}
                                            onChange={handleAccountChange}
                                            placeholder="Placeholder"
                                        />
                                        {formSubmitted.account && error.account.city && <div className="error-message">{error.account.city}</div>}
                                    </div>
                                    <div className="form-group halfs">
                                        <label>Postal Code</label>
                                        <input
                                            name="postalCode"
                                            value={accountData.postalCode}
                                            onChange={handleAccountChange}
                                            placeholder="Placeholder"
                                        />
                                        {formSubmitted.account && error.account.postalCode && <div className="error-message">{error.account.postalCode}</div>}
                                    </div>
                                </div>

                                {/* State */}
                                <div className="form-groups">
                                    <label>State</label>
                                    <input
                                        name="state"
                                        value={accountData.state}
                                        onChange={handleAccountChange}
                                        placeholder="Placeholder"
                                    />
                                    {formSubmitted.account && error.account.state && <div className="error-message">{error.account.state}</div>}
                                </div>

                                {/* Country */}
                                <div className="form-groups">
                                    <label>Country</label>
                                    <input
                                        name="country"
                                        value={accountData.country}
                                        onChange={handleAccountChange}
                                        placeholder="Placeholder"
                                    />
                                    {formSubmitted.account && error.account.country && <div className="error-message">{error.account.country}</div>}
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="panel-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    {activeTab === "customer" ? (
                        <button className="proceed-btn" onClick={handleProceed}>Proceed</button>
                    ) : (
                        <button className="proceed-btn" onClick={handleCreateCustomer}>Create Customer</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddCustomerPanel;

