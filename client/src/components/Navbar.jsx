import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
const { totalItems, setIsOpen } = useCart();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/60 backdrop-blur-lg border-b border-white/10 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          TECHNOVA
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <a href="#shop" className="hover:text-white transition-colors">Shop</a>
          <a href="#categories" className="hover:text-white transition-colors">Categories</a>
          <a href="#deals" className="hover:text-white transition-colors">Deals</a>
        </div>

        <div className="flex items-center gap-5 text-white/70">
          <button className="hover:text-white transition-colors">Search</button>
          <button
  type="button"
  onClick={() => setIsOpen(true)}
  className="relative hover:text-white transition-colors flex items-center gap-1.5"
>
  <span>Cart</span>
  {totalItems > 0 && (
    <span className="bg-cyan-400 text-black font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
      {totalItems}
    </span>
  )}
</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;