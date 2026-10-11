import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import ItemForm from '../components/ItemForm.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const loadItem = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('This item does not exist.');
      } else if (err.response && err.response.status === 403) {
        setError('You are not allowed to edit this item.');
      } else if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Cannot reach the server.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  async function handleSubmit(values) {
    setServerError('');
    setSaving(true);

    try {
      await api.put(`/items/${id}`, values);
      navigate('/dashboard', { state: { message: 'Item updated' } });
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setServerError('You are not allowed to edit this item.');
      } else if (err.response && err.response.status === 404) {
        setServerError('This item no longer exists.');
      } else if (err.response) {
        const data = err.response.data;
        setServerError(data.errors ? data.errors.join(' ') : data.message);
      } else {
        setServerError('Cannot reach the server.');
      }
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="form-page">
        <h1>Edit item</h1>
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section className="form-page">
        <h1>Edit item</h1>
        <ErrorMessage message={error} onRetry={loadItem} />
        <p>
          <Link to="/dashboard">Back to dashboard</Link>
        </p>
      </section>
    );
  }

  if (String(item.store._id) !== user._id) {
    return (
      <section className="form-page">
        <h1>Edit item</h1>
        <ErrorMessage message="You are not allowed to edit this item." />
        <p>
          <Link to="/dashboard">Back to dashboard</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="form-page">
      <h1>Edit item</h1>
      <ItemForm
        initialValues={item}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        loading={saving}
        serverError={serverError}
      />
      <p>
        <Link to="/dashboard">Back to dashboard</Link>
      </p>
    </section>
  );
}

export default EditItem;
