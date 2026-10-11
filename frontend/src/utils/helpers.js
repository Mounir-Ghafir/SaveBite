export const CURRENCY = '';

export function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function getDaysLeft(expiry_date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = expiry_date.split('-').map(Number);
  const expiry = new Date(year, month - 1, day);
  expiry.setHours(0, 0, 0, 0);

  return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
}

export function formatDaysLeft(days) {
  if (days < 0) {
    return 'Expired';
  }
  if (days === 0) {
    return 'Expires today';
  }
  if (days === 1) {
    return '1 day left';
  }
  return days + ' days left';
}

export function formatPrice(value) {
  return value.toFixed(2) + CURRENCY;
}

export function getDiscountPercent(original_price, new_price) {
  return Math.round(((original_price - new_price) / original_price) * 100);
}
