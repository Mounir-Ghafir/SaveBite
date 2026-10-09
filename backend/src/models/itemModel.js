import mongoose from 'mongoose';
import './userModel.js';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'quantity must be a whole number',
      },
    },
    original_price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    new_price: {
      type: Number,
      required: true,
      min: 0.01,
    },
    expiry_date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

itemSchema.index({ expiry_date: 1 });

const Item = mongoose.model('Item', itemSchema);

export async function findAllActive(today) {
  return Item.find({ expiry_date: { $gte: today } })
    .populate('store', 'name')
    .sort({ expiry_date: 1 })
    .lean();
}

export async function findByStore(store_id) {
  return Item.find({ store: store_id })
    .populate('store', 'name')
    .sort({ expiry_date: 1 })
    .lean();
}

export async function findById(id) {
  return Item.findById(id).populate('store', 'name').lean();
}

export async function create(data) {
  return Item.create(data);
}

export async function update(id, data) {
  return Item.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true })
    .populate('store', 'name')
    .lean();
}

export async function remove(id) {
  return Item.findByIdAndDelete(id).lean();
}

export default Item;
