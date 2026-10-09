import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/userModel.js';
import Item from '../src/models/itemModel.js';
import { addDays } from '../src/utils/dates.js';

const DEMO_PASSWORD = 'password123';

async function seed() {
  await connectDB();

  await Item.deleteMany({});
  await User.deleteMany({});
  console.log('Deleted all users and items');

  const password_hash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const users = await User.create([
    { name: 'Fresh Mart', email: 'freshmart@savebite.test', password_hash, role: 'store' },
    { name: 'City Bakery', email: 'bakery@savebite.test', password_hash, role: 'store' },
    { name: 'Alice Consumer', email: 'alice@savebite.test', password_hash, role: 'consumer' },
    { name: 'Bob Consumer', email: 'bob@savebite.test', password_hash, role: 'consumer' },
  ]);

  const freshMart = users[0];
  const bakery = users[1];

  const items = await Item.create([
    { name: 'Milk 1L', quantity: 10, original_price: 2.5, new_price: 1.2, expiry_date: addDays(2), store: freshMart._id },
    { name: 'Eggs (12)', quantity: 5, original_price: 4, new_price: 2.5, expiry_date: addDays(5), store: freshMart._id },
    { name: 'Yogurt Pack', quantity: 3, original_price: 3.5, new_price: 2, expiry_date: addDays(1), store: freshMart._id },
    { name: 'Chicken Breast', quantity: 2, original_price: 8, new_price: 5, expiry_date: addDays(0), store: freshMart._id },
    { name: 'Sourdough Bread', quantity: 4, original_price: 3, new_price: 1.5, expiry_date: addDays(1), store: bakery._id },
    { name: 'Croissants (6)', quantity: 6, original_price: 5, new_price: 2.5, expiry_date: addDays(3), store: bakery._id },
    { name: 'Chocolate Cake', quantity: 1, original_price: 12, new_price: 7, expiry_date: addDays(4), store: bakery._id },
    { name: 'Muffins (4)', quantity: 2, original_price: 4.5, new_price: 2, expiry_date: addDays(-1), store: bakery._id },
  ]);

  console.log(`Created ${users.length} users (2 stores, 2 consumers)`);
  console.log(`Created ${items.length} items (1 already expired)`);
  console.log(`Demo password for every account: ${DEMO_PASSWORD}`);
  console.log('Stores: freshmart@savebite.test, bakery@savebite.test');
  console.log('Consumers: alice@savebite.test, bob@savebite.test');

  await mongoose.disconnect();
  console.log('Disconnected');
}

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
