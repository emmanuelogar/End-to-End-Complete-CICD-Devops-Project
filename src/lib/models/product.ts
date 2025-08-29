import mongoose, { Model } from 'mongoose';

const productSchema = new mongoose.Schema({
  originalId: {
    type: String,
    required: true,
    unique: true
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  oldPrice: { 
    type: Number 
  },
  categories: [{ 
    type: String 
  }],
  image: [{ 
    type: String 
  }],
  rating: { 
    type: Number, 
    default: 0 
  },
  sales: {
    type: Number,
    default: 0
  },
  amount: { 
    type: Number, 
    required: true 
  },
  shop_category: { 
    type: String, 
    required: true 
  },
  unit_of_measure: { 
    type: String 
  },
  colors: [{ 
    type: String 
  }],
  sizes: [{ 
    type: String 
  }]
}, {
  timestamps: true
});

// Access the environment variable, but with a fallback in case it's not set
const IS_BUILD_MODE = process.env.BUILD_WITH_MOCK_DB === 'true';

let Product: mongoose.Model<any>;

// Conditionally export the model
if (IS_BUILD_MODE) {
  // Mock the model's methods for the build environment
  const mockModel = {
    find: () => Promise.resolve([]),
    // Add other necessary mocked methods as needed
    // e.g., findOne, findById, create, updateOne, etc.
  };
  Product = mockModel as any;
} else {
  // Use the real Mongoose model at runtime
  Product = mongoose.models.Product || mongoose.model('Product', productSchema);
}

export default Product;
