import mongoose from 'mongoose';

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

export default Item;
