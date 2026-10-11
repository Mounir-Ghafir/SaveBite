import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'consumer',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function validate() {
    const nextErrors = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = 'Enter at least 2 characters.';
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (form.password.length < 6) {
      nextErrors.password = 'Use at least 6 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', form);
      login(response.data);
      navigate(response.data.user.role === 'store' ? '/dashboard' : '/items');
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        setServerError(data.errors ? data.errors.join(' ') : data.message);
      } else {
        setServerError('Cannot reach the server.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-page">
      <h1>Create your account</h1>

      {serverError && <p className="alert alert-error">{serverError}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label={form.role === 'store' ? 'Store name' : 'Name'}
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormField label="I am a" name="role">
          <select id="role" name="role" value={form.role} onChange={handleChange}>
            <option value="consumer">Consumer</option>
            <option value="store">Store</option>
          </select>
        </FormField>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
}

export default Register;
