import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { findByEmail, create } from '../models/userModel.js';

function createToken(user) {
  const payload = { id: String(user._id), role: user.role };
  const options = { expiresIn: process.env.JWT_EXPIRES_IN };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

function buildResponse(user) {
  const token = createToken(user);
  const publicUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return { token, user: publicUser };
}

export async function register(data) {
  const existing = await findByEmail(data.email);
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const password_hash = await bcrypt.hash(data.password, 10);

  const user = await create({
    name: data.name,
    email: data.email,
    password_hash,
    role: data.role,
  });

  return buildResponse(user);
}

export async function login(data) {
  const user = await findByEmail(data.email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(data.password, user.password_hash);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  return buildResponse(user);
}
