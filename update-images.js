import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const imageMap = {
  Smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
  Laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
  Audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  Wearables: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  Gaming: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80',
  Accessories: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
  Cameras: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80'
};

const defaultImage = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';

async function updateImages() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGO_URI or MONGODB_URI missing from .env');

    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');

    // Access the raw collection directly (no model import required)
    const collection = mongoose.connection.collection('products');
    const products = await collection.find({}).toArray();

    if (products.length === 0) {
      console.log('No products found in the "products" collection.');
      process.exit(0);
    }

    for (const prod of products) {
      const newImg = imageMap[prod.category] || defaultImage;
      await collection.updateOne(
        { _id: prod._id },
        { $set: { image: newImg } }
      );
      console.log(`Updated: ${prod.name} -> ${prod.category}`);
    }

    console.log('Successfully updated all product images!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating images:', error);
    process.exit(1);
  }
}

updateImages();