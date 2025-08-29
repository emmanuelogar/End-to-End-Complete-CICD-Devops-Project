import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  addresses?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Please provide your name'] 
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: {
    type: String,
  },
  addresses: [{
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  }],
}, {
  timestamps: true,
});

// Check for the build environment flag
const IS_BUILD_MODE = process.env.BUILD_WITH_MOCK_DB === 'true';

let User: Model<IUser>;

if (IS_BUILD_MODE) {
  // Return a mock model for the build process
  const mockModel = {
    find: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
    findById: () => Promise.resolve(null),
    create: () => Promise.resolve({}),
    updateOne: () => Promise.resolve({}),
  };
  User = mockModel as unknown as Model<IUser>;
  console.log('Using mock User model for build.');
} else {
  // Hash password before saving
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error: any) {
      next(error);
    }
  });

  // Method to check if password matches
  userSchema.methods.matchPassword = async function(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  // Use the real Mongoose model at runtime
  User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
}

export default User;