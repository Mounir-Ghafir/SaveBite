import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ['store', 'consumer'],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const User = mongoose.model('User', userSchema);

export async function findByEmail(email) {
  return User.findOne({ email }).select('+password_hash');
}

export async function findById(id) {
  return User.findById(id);
}

export async function create(data) {
  return User.create(data);
}

export default User;
