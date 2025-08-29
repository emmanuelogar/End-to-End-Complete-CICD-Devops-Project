import mongoose, { Document, Model } from 'mongoose';

export interface ICartItem {
  product: string;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const cartItemSchema = new mongoose.Schema<ICartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema<ICart>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
});

// Check for the build environment flag
const IS_BUILD_MODE = process.env.BUILD_WITH_MOCK_DB === 'true';

let Cart: Model<ICart>;

if (IS_BUILD_MODE) {
  // Return a mock model for the build process
  const mockModel = {
    find: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
    findById: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    updateOne: () => Promise.resolve({}),
  };
  Cart = mockModel as unknown as Model<ICart>;
  console.log('Using mock Cart model for build.');
} else {
  // Use the real Mongoose model at runtime
  Cart = (mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema)) as Model<ICart>;
}

export default Cart;