import React, { useState, useEffect } from 'react';

function StockForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    price: 0,
    description: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        quantity: product.quantity || 0,
        price: product.price || 0,
        description: product.description || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
      <div>
        <label>Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="0"
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default StockForm;
