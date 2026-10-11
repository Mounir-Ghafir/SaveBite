import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios.js';
import ItemCard from '../components/ItemCard.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/items');
      setItems(response.data);
    } catch {
      setError('Could not load the items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <section>
      <h1>Today&apos;s deals</h1>

      {loading && <Loader />}

      {!loading && error && <ErrorMessage message={error} onRetry={loadItems} />}

      {!loading && !error && items.length === 0 && <p>No deals yet.</p>}

      {!loading && !error && items.length > 0 && (
        <div className="item-grid">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Items;
