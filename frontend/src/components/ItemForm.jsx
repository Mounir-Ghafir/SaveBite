import { useState } from 'react';
import FormField from './FormField.jsx';
import { getToday } from '../utils/helpers.js';

function ItemForm({ initialValues, onSubmit, submitLabel, loading, serverError }) {
  const [form, setForm] = useState({
    name: initialValues ? initialValues.name : '',
    quantity: initialValues ? String(initialValues.quantity) : '',
    original_price: initialValues ? String(initialValues.original_price) : '',
    new_price: initialValues ? String(initialValues.new_price) : '',
    expiry_date: initialValues ? initialValues.expiry_date : '',
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function validate() {
    const nextErrors = {};
    const quantity = Number(form.quantity);
    const original = Number(form.original_price);
    const nextPrice = Number(form.new_price);

    if (form.name.trim().length < 2 || form.name.trim().length > 100) {
      nextErrors.name = 'Name must be 2 to 100 characters.';
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      nextErrors.quantity = 'Quantity must be a whole number of 1 or more.';
    }
    if (!(original > 0)) {
      nextErrors.original_price = 'Original price must be greater than 0.';
    }
    if (!(nextPrice > 0)) {
      nextErrors.new_price = 'New price must be greater than 0.';
    } else if (nextPrice >= original) {
      nextErrors.new_price = 'New price must be less than the original price.';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.expiry_date)) {
      nextErrors.expiry_date = 'Choose an expiry date.';
    } else if (form.expiry_date < getToday()) {
      nextErrors.expiry_date = 'Expiry date cannot be in the past.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: form.name.trim(),
      quantity: Number(form.quantity),
      original_price: Number(form.original_price),
      new_price: Number(form.new_price),
      expiry_date: form.expiry_date,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <p className="alert alert-error">{serverError}</p>}

      <FormField
        label="Item name"
        name="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />
      <FormField
        label="Quantity"
        name="quantity"
        type="number"
        min="1"
        step="1"
        value={form.quantity}
        onChange={handleChange}
        error={errors.quantity}
      />
      <FormField
        label="Original price"
        name="original_price"
        type="number"
        min="0"
        step="0.01"
        value={form.original_price}
        onChange={handleChange}
        error={errors.original_price}
      />
      <FormField
        label="New price"
        name="new_price"
        type="number"
        min="0"
        step="0.01"
        value={form.new_price}
        onChange={handleChange}
        error={errors.new_price}
      />
      <FormField
        label="Expiry date"
        name="expiry_date"
        type="date"
        min={getToday()}
        value={form.expiry_date}
        onChange={handleChange}
        error={errors.expiry_date}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

export default ItemForm;
