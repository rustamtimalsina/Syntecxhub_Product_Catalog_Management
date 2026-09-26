import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors">
          TECHNOVA
        </Link>

        <div className="flex items-center gap-6 text-sm text-white/70">
          <Link to="/" className="hover:text-white transition-colors">
            Catalog
          </Link>

          {/* Admin link appears here when logged in */}
          {isAuthenticated && (
            <Link to="/admin" className="hover:text-cyan-400 text-white/70 transition-colors">
              Admin
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-white/40 text-xs hidden sm:inline">
                {user?.name || user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="hover:text-red-400 text-xs transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          )}

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
    </header>
  );
}

export default Navbar;