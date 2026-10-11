import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { formatDaysLeft, formatPrice, getDaysLeft } from '../utils/helpers.js';

function Dashboard() {
  const location = useLocation();
  const message = location.state ? location.state.message : '';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/items/mine');
      setItems(response.data);
    } catch {
      setError('Could not load your items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <section>
      <div className="page-header">
        <h1>My items</h1>
        <Link className="button-link" to="/dashboard/items/new">
          Add item
        </Link>
      </div>

      {message && <p className="alert alert-success">{message}</p>}

      {loading && <Loader />}

      {!loading && error && <ErrorMessage message={error} onRetry={loadItems} />}

      {!loading && !error && items.length === 0 && (
        <p>You have no items yet. Add your first one!</p>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="item-list">
          {items.map((item) => {
            const daysLeft = getDaysLeft(item.expiry_date);
            const expired = daysLeft < 0;

            return (
              <li key={item._id} className="item-row">
                <div className="item-row-main">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-row-prices">
                  <p>
                    <span className="old-price">{formatPrice(item.original_price)}</span>{' '}
                    <span className="new-price">{formatPrice(item.new_price)}</span>
                  </p>
                  <p>
                    {item.expiry_date}
                    {expired ? '' : ` · ${formatDaysLeft(daysLeft)}`}
                  </p>
                </div>
                {expired && <span className="expired-badge">Expired</span>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Dashboard;
