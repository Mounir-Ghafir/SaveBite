import { AppError } from '../utils/AppError.js';
import { getToday, isRealDate } from '../utils/dates.js';
import {
  findAllActive,
  findByStore,
  findById,
  create as createItem,
  update as updateItem,
  remove as removeItem,
} from '../models/itemModel.js';

function checkExpiryDate(expiry_date) {
  if (!isRealDate(expiry_date)) {
    throw new AppError('expiry_date is not a real date', 400);
  }
  if (expiry_date < getToday()) {
    throw new AppError('expiry_date cannot be in the past', 400);
  }
}

function isOwner(item, user) {
  return String(item.store._id) === user.id;
}

export async function listActive() {
  return findAllActive(getToday());
}

export async function listMine(user) {
  return findByStore(user.id);
}

export async function getOne(id) {
  const item = await findById(id);
  if (!item) {
    throw new AppError('Item not found', 404);
  }
  return item;
}

export async function create(user, data) {
  checkExpiryDate(data.expiry_date);
  return createItem({ ...data, store: user.id });
}

export async function update(user, id, data) {
  checkExpiryDate(data.expiry_date);

  const item = await findById(id);
  if (!item) {
    throw new AppError('Item not found', 404);
  }
  if (!isOwner(item, user)) {
    throw new AppError('Not allowed to change this item', 403);
  }

  return updateItem(id, data);
}

export async function remove(user, id) {
  const item = await findById(id);
  if (!item) {
    throw new AppError('Item not found', 404);
  }
  if (!isOwner(item, user)) {
    throw new AppError('Not allowed to delete this item', 403);
  }

  return removeItem(id);
}
