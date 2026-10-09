import mongoose from 'mongoose';

// Connect to MongoDB. If it fails, stop the process (there is nothing to serve).
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}
