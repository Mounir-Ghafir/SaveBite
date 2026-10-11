import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const expired = searchParams.get('expired') === '1';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function validate() {
    const nextErrors = {};

    if (form.email.trim() === '') {
      nextErrors.email = 'Email is required.';
    }
    if (form.password === '') {
      nextErrors.password = 'Password is required.';
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
      const response = await api.post('/auth/login', form);
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
      <h1>Log in</h1>

      {expired && (
        <p className="alert alert-warning">
          Your session expired. Please log in again.
        </p>
      )}
      {serverError && <p className="alert alert-error">{serverError}</p>}

      <form onSubmit={handleSubmit} noValidate>
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

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p>
        No account yet? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}

export default Login;
