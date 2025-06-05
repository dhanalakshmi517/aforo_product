import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './Products.css';
import NewProductForm from './NewProductForm';
import EditProductForm from './EditProductForm';
import { FiCopy } from 'react-icons/fi';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const headers = ['productId', 'productName', 'productType', 'billable', 'status'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://13.230.194.245:8080/api/products");
      const data = await res.json();
      const sortedData = data.sort((a, b) => Number(a.productId) - Number(b.productId));
      setProducts(sortedData);
    } catch (error) {
      console.error("Failed to fetch products", error);
      Swal.fire('Error', 'Failed to fetch products', 'error');
    }
  };

  const filterProducts = () => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      Object.values(product).some(value =>
        String(value).toLowerCase().includes(lowerQuery)
      )
    );
    filtered.sort((a, b) => a.productId - b.productId);
    setFilteredProducts(filtered);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`http://13.230.194.245:8080/api/products/${selectedProduct.productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        Swal.fire('Success!', 'Product updated successfully.', 'success');
        fetchProducts();
        handleModalClose();
      } else {
        Swal.fire('Failed!', 'Failed to update product.', 'error');
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire('Error', 'Error occurred while updating.', 'error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        const copyIcon = document.querySelector('.copy-icon');
        if (copyIcon) {
          const copiedText = document.createElement('span');
          copiedText.className = 'copied-text';
          copiedText.textContent = 'Copied!';
          copyIcon.parentNode.appendChild(copiedText);
          
          // Remove the copied text after 2 seconds
          setTimeout(() => {
            copiedText.remove();
          }, 2000);
        }
      })
      .catch(() => {
        // No need to show error message
      });
  };

  const renderCell = (product, header) => {
    if (header === 'productId') {
      return (
        <div className="product-id-container">
          <span className="product-id" onClick={() => copyToClipboard(product[header])}>
            {product[header]}
            <FiCopy className="copy-icon" />
          </span>
        </div>
      );
    }
    if (header === 'productType') {
      return (
        <span className={`type-badge ${product[header]}`}>
          {product[header]}
        </span>
      );
    }
    if (header === 'billable') {
      return (
        <span>{product[header] ? 'Yes' : 'No'}</span>
      );
    }
    return product[header];
  };

  const handleDelete = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://13.230.194.245:8080/api/products/${deleteProductId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setNotificationMessage("Product deleted successfully");
        setNotificationType("success");
        setShowNotification(true);
        fetchProducts();
      } else {
        setNotificationMessage("Failed to delete product");
        setNotificationType("error");
        setShowNotification(true);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setNotificationMessage("Error occurred while deleting");
      setNotificationType("error");
      setShowNotification(true);
    } finally {
      setShowDeleteModal(false);
      setDeleteProductId(null);
    }
  };

  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;
    
    return (
      <div className="delete-modal-overlay">
        <div className="delete-modal-content">
          <div className="delete-modal-header">
          </div>
          <div className="delete-modal-body">
            <h5>Are you sure you sure you want to be delete the rate plan "Data set Prod"</h5>
            <p className="warning-text">This action cannot be undone.</p>
          </div>
          <div className="delete-modal-footer">
            <button className="delete-modal-cancel" onClick={() => {
              setShowDeleteModal(false);
              setDeleteProductId(null);
            }}>Cancel</button>
            <button className="delete-modal-confirm" onClick={confirmDelete}>Delete</button>
          </div>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal || !selectedProduct) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <EditProductForm
            product={selectedProduct}
            onClose={handleModalClose}
          />
        </div>
      </div>
    );
  };

  const SuccessIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M20 6L9 17L4 12" stroke="#23A36D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const ErrorIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 7.99999V12M12 16H12.01M7.9 20C9.80858 20.979 12.0041 21.2442 14.0909 20.7478C16.1777 20.2513 18.0186 19.0258 19.2818 17.2922C20.545 15.5585 21.1474 13.4307 20.9806 11.2921C20.8137 9.1536 19.8886 7.14496 18.3718 5.62818C16.855 4.1114 14.8464 3.18624 12.7078 3.0194C10.5693 2.85257 8.44147 3.45503 6.70782 4.71823C4.97417 5.98143 3.74869 7.8223 3.25222 9.9091C2.75575 11.9959 3.02094 14.1914 4 16.1L2 22L7.9 20Z" stroke="#E34935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const Notification = ({ message, type, productId }) => {
    const Icon = type === 'success' ? SuccessIcon : ErrorIcon;
    const title = type === 'success' ? 'Product Deleted ' : 'Failed to delete the Product';
    const details = type === 'success' 
      ? 'The rate plan “Data Set Prod” was successfully deleted.' 
      : 'Something went wrong while deleting “Data Set Prod”. Please try again.';
    
    return (
      <div className={`notification ${type === 'error' ? 'error' : ''}`}>
        <div className="notification-icon">
          <Icon />
        </div>
        <div className="notification-text">
          <h5>{title}</h5>
          <p className="notification-details">{details}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="products-container">
     
      {/* Breadcrumb */}
      <nav className="pro-breadcrumb">
        <span 
          className={`pro-breadcrumb-item ${showForm ? 'new-product' : 'active'}`}
          onClick={() => setShowForm(false)}
        >
          Products
        </span>
        {showForm && (
          <span className="pro-separator">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none">
              <mask id="mask0_2670_1156" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="1" y="0" width="8" height="16">
                <rect x="1.5" y="15.1428" width="14.2857" height="7" transform="rotate(-90 1.5 15.1428)" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_2670_1156)">
                <path d="M6.51063 8.54324L3.61147 11.4424C3.57148 11.4824 3.52683 11.5139 3.47751 11.5369C3.42818 11.5599 3.37533 11.5714 3.31897 11.5714C3.20623 11.5714 3.10828 11.5333 3.02513 11.457C2.94197 11.3808 2.90039 11.2803 2.90039 11.1556L2.90039 5.04799C2.90039 4.92326 2.94237 4.82279 3.02632 4.74656C3.11029 4.67032 3.20825 4.6322 3.32019 4.6322C3.34819 4.6322 3.44534 4.67526 3.61166 4.76137L6.51065 7.66037C6.57729 7.72701 6.62595 7.7959 6.65661 7.86703C6.68728 7.93818 6.70262 8.01644 6.70262 8.10181C6.70262 8.18717 6.68728 8.26543 6.65661 8.33658C6.62595 8.40771 6.57729 8.4766 6.51063 8.54324Z" fill="#98959A"/>
              </g>
            </svg>
          </span>
        )}
        {showForm && (
          <span className="pro-breadcrumb-item active">New Product</span>
        )}
      </nav>

      {renderModal()}
      {renderDeleteModal()}
      
      {showNotification && (
        <div className="notification-container">
          <Notification 
            message={notificationMessage} 
            type={notificationType} 
            productId={deleteProductId}
          />
        </div>
      )}

      {isEditing ? (
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <NewProductForm
            onCancel={() => setIsEditing(false)}
            onProductCreated={handleEditSave}
            initialData={formData}
          />
        </div>
      ) : showForm ? (
        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <NewProductForm
            onCancel={() => setShowForm(false)}
            onProductCreated={() => {
              setShowForm(false);
              fetchProducts();
            }}
          />
        </div>
      ) : (
        <>
          <div className="pro-header">
            <h2>Products</h2>
            <div className="pro-actions">
              <input
                type="text"
                className="pro-search-input"
                placeholder="Search among your products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="pro-new-product-button"
                onClick={() => setShowForm(true)}
              >
                + New Product
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <table className="pro-table pro-products-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  {headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={product.productId}>
                    <td>{index + 1}</td>
                    {headers.map((header) => (
                      <td key={header}>
                        {renderCell(product, header)}
                      </td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEditClick(product)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(product.productId)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
