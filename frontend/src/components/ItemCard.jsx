import {
  formatDaysLeft,
  formatPrice,
  getDaysLeft,
  getDiscountPercent,
} from '../utils/helpers.js';

function ItemCard({ item }) {
  const daysLeft = getDaysLeft(item.expiry_date);
  const discount = getDiscountPercent(item.original_price, item.new_price);
  const urgent = daysLeft <= 1;

  return (
    <article className={urgent ? 'item-card item-card-urgent' : 'item-card'}>
      <div className="item-card-header">
        <h3>{item.name}</h3>
        <span className="discount-badge">-{discount}%</span>
      </div>
      <p className="item-store">{item.store.name}</p>
      <p className="item-prices">
        <span className="old-price">{formatPrice(item.original_price)}</span>
        <span className="new-price">{formatPrice(item.new_price)}</span>
      </p>
      <p className="item-meta">
        <span>Quantity: {item.quantity}</span>
        <span className={urgent ? 'days-left urgent' : 'days-left'}>
          {formatDaysLeft(daysLeft)}
        </span>
      </p>
    </article>
  );
}

export default ItemCard;
