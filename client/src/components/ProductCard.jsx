import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    // Stop the <Link> wrapper from navigating to the product details page
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col justify-between"
    >
      <Link to={`/products/${product._id}`} className="block flex-1">
        <div className="aspect-square bg-white/5 flex items-center justify-center overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';
            }}
          />

          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-green-500/90 text-black font-semibold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="p-5">
          <p className="text-xs text-cyan-400 uppercase tracking-wider mb-1 font-medium">
            {product.brand || 'TechNova'}
          </p>
          <h3 className="text-base font-semibold mb-2 line-clamp-1 text-white group-hover:text-cyan-300 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3 text-xs text-white/60">
            <span className="text-yellow-400">★</span>
            <span className="text-white font-medium">{product.rating || 4.8}</span>
            <span className="text-white/30">({product.reviewCount || 100})</span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-white">${product.price}</span>
            {hasDiscount && (
              <span className="text-xs text-white/40 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-0">
        <button
          type="button"
          onClick={handleQuickAdd}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 ${
            added
              ? 'bg-green-500 text-black shadow-md shadow-green-500/20'
              : 'bg-white/10 hover:bg-cyan-400 hover:text-black text-white border border-white/10 hover:border-transparent'
          }`}
        >
          {added ? (
            <>
              <span>✓</span> Added
            </>
          ) : (
            <>
              <span>+</span> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default ProductCard;