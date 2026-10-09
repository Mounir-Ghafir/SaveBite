import { register, login } from '../services/authService.js';

export async function registerHandler(req, res, next) {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function loginHandler(req, res, next) {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
