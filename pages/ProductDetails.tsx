import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Star, Plus, User, ArrowLeft, Send } from 'lucide-react';
import { Review } from '../types';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, user, addReview, t } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }

  const handleOrderNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const newReview: Review = {
        id: `r-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0]
    };

    addReview(product.id, newReview);
    setComment('');
    setRating(5);
  };

  // Calculate average rating
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-tribal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-tribal-700 transition-colors">
            <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-tribal-100 overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                
                {/* Image Gallery */}
                <div className="p-6 bg-gray-50 flex flex-col gap-4">
                    <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                        <img 
                            src={product.images[selectedImage]} 
                            alt={product.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-tribal-600 ring-2 ring-tribal-200' : 'border-gray-200 opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-8 flex flex-col">
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-tribal-100 text-tribal-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                            {product.category}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={18} fill={s <= Math.round(avgRating) ? "currentColor" : "none"} className={s <= Math.round(avgRating) ? "" : "text-gray-300"} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500 font-medium">
                                {avgRating.toFixed(1)} ({product.reviews.length} {t('reviews')})
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-tribal-700 mb-6">₹{product.price}</div>
                        
                        <div className="prose text-gray-600 mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">{t('description')}</h3>
                            <p className="leading-relaxed">{product.description}</p>
                        </div>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => addToCart(product)}
                            className="flex items-center justify-center gap-2 bg-white border-2 border-tribal-600 text-tribal-700 px-6 py-3 rounded-xl hover:bg-tribal-50 transition-all font-bold"
                        >
                            <Plus size={20} /> {t('addToCart')}
                        </button>
                        <button 
                            onClick={handleOrderNow}
                            className="flex items-center justify-center gap-2 bg-tribal-600 text-white px-6 py-3 rounded-xl hover:bg-tribal-700 transition-all font-bold shadow-lg shadow-tribal-200"
                        >
                            <ShoppingBag size={20} /> {t('buyNow')}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-tribal-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <Star className="text-tribal-500" /> {t('reviews')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* List of Reviews */}
                <div className="space-y-6">
                    {product.reviews.length === 0 ? (
                        <div className="text-gray-500 italic">{t('noReviews')}</div>
                    ) : (
                        product.reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                            <User size={16} />
                                        </div>
                                        <span className="font-semibold text-gray-900">{review.userName}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                </div>
                                <div className="flex text-yellow-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Review Form */}
                <div className="bg-gray-50 p-6 rounded-xl h-fit">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">{t('writeReview')}</h3>
                    
                    {user ? (
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('rating')}</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button 
                                            key={s}
                                            type="button"
                                            onClick={() => setRating(s)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star 
                                                size={24} 
                                                className={`${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-tribal-500 outline-none resize-none bg-white"
                                    placeholder="Share your thoughts..."
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-tribal-600 text-white py-2 rounded-lg font-semibold hover:bg-tribal-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Send size={16} /> {t('submitReview')}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                           <p>{t('loginToReview')}</p>
                           <button onClick={() => navigate('/login')} className="mt-2 text-tribal-600 font-semibold underline">Login Now</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;