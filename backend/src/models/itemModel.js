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
    // Stored as a plain "YYYY-MM-DD" string.
    expiry_date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    // Reference to the store (a user with role "store").
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

// Fast filtering/sorting by expiry for the consumer list.
itemSchema.index({ expiry_date: 1 });

const Item = mongoose.model('Item', itemSchema);

export default Item;
