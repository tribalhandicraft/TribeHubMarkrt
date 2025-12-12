import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Plus, ShoppingBag, Star } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, t } = useStore();
  const navigate = useNavigate();

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to details
    addToCart(product);
    navigate('/cart');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      addToCart(product);
  }

  // Calculate average rating
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-tribal-100 overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-tribal-800 uppercase tracking-wide">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
             <Star size={14} className={`${avgRating >= 1 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>
             <span className="text-xs text-gray-500">
               {avgRating > 0 ? avgRating.toFixed(1) : ''} ({product.reviews.length})
             </span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between mb-3">
             <span className="text-xl font-bold text-tribal-700">₹{product.price}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1 bg-tribal-50 text-tribal-700 px-2 py-2 rounded-lg hover:bg-tribal-100 transition-all text-sm font-medium border border-tribal-100"
            >
              <Plus size={16} />
              {t('addToCart')}
            </button>
            <button 
              onClick={handleOrderNow}
              className="flex items-center justify-center gap-1 bg-tribal-600 text-white px-2 py-2 rounded-lg hover:bg-tribal-700 transition-all text-sm font-medium shadow-sm"
            >
              <ShoppingBag size={16} />
              {t('buyNow')}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;