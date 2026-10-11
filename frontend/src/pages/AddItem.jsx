import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import ItemForm from '../components/ItemForm.jsx';

function AddItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleSubmit(values) {
    setServerError('');
    setLoading(true);

    try {
      await api.post('/items', values);
      navigate('/dashboard', { state: { message: 'Item added' } });
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        setServerError(data.errors ? data.errors.join(' ') : data.message);
      } else {
        setServerError('Cannot reach the server.');
      }
      setLoading(false);
    }
  }

  return (
    <section className="form-page">
      <h1>Add item</h1>
      <ItemForm
        onSubmit={handleSubmit}
        submitLabel="Add item"
        loading={loading}
        serverError={serverError}
      />
      <p>
        <Link to="/dashboard">Back to dashboard</Link>
      </p>
    </section>
  );
}

export default AddItem;
