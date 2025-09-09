import React, { useState } from "react";
import "./Invoice.css";

const Invoice = () => {
  // Demo products data
  const demoProducts = [
    {
      id: 1,
      name: "Laptop Dell XPS 15",
      count: 1,
      pricePerPiece: 1299.99,
      discountPercent: 5,
      originalPrice: 1299.99,
      priceAfterDiscount: 1234.99,
    },
    {
      id: 2,
      name: "Wireless Headphones Sony",
      count: 2,
      pricePerPiece: 199.99,
      discountPercent: 10,
      originalPrice: 399.98,
      priceAfterDiscount: 359.98,
    },
    {
      id: 3,
      name: "Smartphone Samsung Galaxy",
      count: 1,
      pricePerPiece: 899.99,
      discountPercent: 8,
      originalPrice: 899.99,
      priceAfterDiscount: 827.99,
    },
    {
      id: 4,
      name: "Gaming Mouse Logitech",
      count: 3,
      pricePerPiece: 79.99,
      discountPercent: 15,
      originalPrice: 239.97,
      priceAfterDiscount: 203.97,
    },
    {
      id: 5,
      name: "External SSD 1TB",
      count: 2,
      pricePerPiece: 129.99,
      discountPercent: 12,
      originalPrice: 259.98,
      priceAfterDiscount: 228.78,
    },
  ];

  // State for customer information
  const [customerInfo, setCustomerInfo] = useState({
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    date: new Date().toISOString().split("T")[0],
    address: "123 Main Street, New York, NY 10001",
  });

  // State for invoice items with demo products
  const [items, setItems] = useState(demoProducts);

  // GST percentage
  const gstPercent = 5;

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.priceAfterDiscount,
      0
    );
    const gstAmount = (subtotal * gstPercent) / 100;
    const total = subtotal + gstAmount;

    return { subtotal, gstAmount, total };
  };

  const { subtotal, gstAmount, total } = calculateTotals();

  // Handle customer info changes
  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle item changes
  const handleItemChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate priceAfterDiscount if relevant fields change
          if (
            field === "pricePerPiece" ||
            field === "discountPercent" ||
            field === "count"
          ) {
            const discountAmount =
              (updatedItem.pricePerPiece * updatedItem.discountPercent) / 100;
            const discountedPricePerPiece =
              updatedItem.pricePerPiece - discountAmount;
            updatedItem.priceAfterDiscount =
              discountedPricePerPiece * updatedItem.count;
            updatedItem.originalPrice =
              updatedItem.pricePerPiece * updatedItem.count;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Add new item
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        count: 1,
        originalPrice: 0,
        pricePerPiece: 0,
        discountPercent: 0,
        priceAfterDiscount: 0,
      },
    ]);
  };

  // Remove item
  const removeItem = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Generate PDF/Print function
  const handlePrint = () => {
    window.print();
  };

  // Reset form
  const handleReset = () => {
    setCustomerInfo({
      name: "",
      phone: "",
      date: new Date().toISOString().split("T")[0],
      address: "",
    });
    setItems([
      {
        id: 1,
        name: "",
        count: 1,
        originalPrice: 0,
        pricePerPiece: 0,
        discountPercent: 0,
        priceAfterDiscount: 0,
      },
    ]);
  };

  return (
    <div className="invoice-container">
      <h2>Bill Invoice</h2>

      {/* Customer Information Section */}
      <div className="customer-section">
        <h3>Customer Details</h3>
        <div className="customer-form">
          <div className="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => handleCustomerInfoChange("name", e.target.value)}
              placeholder="Enter customer name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) =>
                handleCustomerInfoChange("phone", e.target.value)
              }
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={customerInfo.date}
              onChange={(e) => handleCustomerInfoChange("date", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <textarea
              value={customerInfo.address}
              onChange={(e) =>
                handleCustomerInfoChange("address", e.target.value)
              }
              placeholder="Enter address"
              rows="3"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="items-section">
        <h3>Items Details</h3>
        <div className="items-table">
          <div className="table-header">
            <span>Item Name</span>
            <span>Count</span>
            <span>Price/Piece ($)</span>
            <span>Discount (%)</span>
            <span>Total Price ($)</span>
            <span>Action</span>
          </div>

          {items.map((item) => (
            <div key={item.id} className="table-row">
              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(item.id, "name", e.target.value)
                }
                placeholder="Item name"
              />

              <input
                type="number"
                min="1"
                value={item.count}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "count",
                    parseInt(e.target.value) || 1
                  )
                }
              />

              <input
                type="number"
                min="0"
                step="0.01"
                value={item.pricePerPiece}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "pricePerPiece",
                    parseFloat(e.target.value) || 0
                  )
                }
              />

              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={item.discountPercent}
                onChange={(e) =>
                  handleItemChange(
                    item.id,
                    "discountPercent",
                    parseFloat(e.target.value) || 0
                  )
                }
              />

              <span className="price-display">
                ${item.priceAfterDiscount.toFixed(2)}
              </span>

              <button
                onClick={() => removeItem(item.id)}
                className="remove-btn"
                disabled={items.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button onClick={addItem} className="add-item-btn">
          + Add New Item
        </button>
      </div>

      {/* Totals Section */}
      <div className="totals-section">
        <h3>Bill Summary</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>GST ({gstPercent}%):</span>
          <span>${gstAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total Amount:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={handlePrint} className="print-btn">
          📄 Print Invoice
        </button>
        <button onClick={handleReset} className="reset-btn">
          🔄 Reset Form
        </button>
      </div>
    </div>
  );
};

export default Invoice;
