import {
  listActive,
  listMine,
  getOne,
  create,
  update,
  remove,
} from '../services/itemService.js';

export async function listActiveHandler(req, res, next) {
  try {
    const items = await listActive();
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function listMineHandler(req, res, next) {
  try {
    const items = await listMine(req.user);
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getOneHandler(req, res, next) {
  try {
    const item = await getOne(req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function createHandler(req, res, next) {
  try {
    const item = await create(req.user, req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function updateHandler(req, res, next) {
  try {
    const item = await update(req.user, req.params.id, req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function removeHandler(req, res, next) {
  try {
    await remove(req.user, req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    next(error);
  }
}
