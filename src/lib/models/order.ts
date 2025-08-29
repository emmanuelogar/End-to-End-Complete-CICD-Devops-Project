import mongoose, { Model } from 'mongoose';
import { ICartItem } from './cart'; // Note: ICartItem is not used in the provided code
import { IOrder } from './order'; // Added to ensure correct type usage

export interface IOrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  user: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: string;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>({
  product: {
    type: String,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema<IOrder>({
  user: {
    type: String,
    required: true,
    ref: 'User'
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const IS_BUILD_MODE = process.env.BUILD_WITH_MOCK_DB === 'true';

let Order: Model<IOrder>;

if (IS_BUILD_MODE) {
  const mockModel = {
    find: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
    findById: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    updateOne: () => Promise.resolve({}),
  };
  Order = mockModel as unknown as Model<IOrder>;
  console.log('Using mock Order model for build.');
} else {
  // Use the real Mongoose model at runtime
  Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
}

export default Order;