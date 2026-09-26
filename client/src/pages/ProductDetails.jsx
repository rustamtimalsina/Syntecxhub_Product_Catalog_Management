import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { getProductById } from '../api/products';
import { useCart } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        // Handle whether the API returns data directly or wrapped in { product: ... }
        setProduct(data.product || data);
      } catch (err) {
        setError('Could not load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

const handleAddToCart = () => {
  addToCart(product, quantity);
  setAdded(true);
  setTimeout(() => setAdded(false), 2000);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/50 text-lg animate-pulse">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-red-400">{error || 'Product not found.'}</p>
          <Link
            to="/"
            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
          >
            ← Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-cyan-400 transition-colors"
          >
            <span>←</span> Back to Catalog
          </Link>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm p-4 relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden flex items-center justify-center bg-black/20">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            {hasDiscount && (
              <span className="absolute top-8 left-8 bg-green-500/90 text-black font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Save {discountPercent}%
              </span>
            )}
          </motion.div>

          {/* Right Column: Information & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category & Brand */}
            <div className="flex items-center gap-3 text-xs tracking-wider uppercase mb-2">
              <span className="text-cyan-400 font-semibold">{product.brand || 'TechNova'}</span>
              <span className="text-white/30">•</span>
              <span className="text-white/60">{product.category}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center text-yellow-400 gap-1 text-sm">
                <span>★</span>
                <span className="font-semibold text-white">{product.rating || 4.8}</span>
              </div>
              <span className="text-white/30 text-sm">|</span>
              <span className="text-white/50 text-sm">
                {product.reviewCount || 124} customer reviews
              </span>
              <span className="text-white/30 text-sm">|</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                In Stock ({product.stock ?? 15})
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-extrabold text-white">
                ${product.price}
              </span>
              {hasDiscount && (
                <span className="text-xl text-white/40 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-white/70 leading-relaxed mb-8 text-base">
              {product.description ||
                'High-performance design engineered for daily productivity, premium durability, and modern connectivity.'}
            </p>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {/* Quantity */}
              <div className="flex items-center justify-between border border-white/15 bg-white/5 rounded-full px-4 py-2 sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-white/70 hover:text-white px-2 py-1 text-lg font-bold"
                >
                  −
                </button>
                <span className="text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-white/70 hover:text-white px-2 py-1 text-lg font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-8 rounded-full font-semibold transition-all duration-200 ${
                  added
                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/20'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-lg shadow-cyan-400/20'
                }`}
              >
                {added ? '✓ Added to Cart' : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}
              </button>
            </div>

            {/* Specifications Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
                Specifications
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-white/40">Category</dt>
                  <dd className="font-medium text-white/90 mt-0.5">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-white/40">Brand</dt>
                  <dd className="font-medium text-white/90 mt-0.5">{product.brand || 'TechNova'}</dd>
                </div>
                <div>
                  <dt className="text-white/40">Warranty</dt>
                  <dd className="font-medium text-white/90 mt-0.5">1-Year Official</dd>
                </div>
                <div>
                  <dt className="text-white/40">Shipping</dt>
                  <dd className="font-medium text-white/90 mt-0.5">Standard 2-4 Business Days</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;