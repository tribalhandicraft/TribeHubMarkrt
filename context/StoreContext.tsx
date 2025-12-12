import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order, User, Language, UserRole, ShippingDetails, PaymentMethod, Review } from '../types';
import { MOCK_PRODUCTS, TRANSLATIONS } from '../constants';

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  login: (role: UserRole, userData?: Partial<User>) => void;
  logout: () => void;
  products: Product[];
  addProduct: (product: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (shippingDetails: ShippingDetails, paymentMethod: PaymentMethod) => void;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addReview: (productId: string, review: Review) => void;
  t: (key: string) => string;
  artisans: User[]; // Exposed artisans list
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Initial mock artisans with contact numbers for login testing
  const [artisans, setArtisans] = useState<User[]>([
    {
      id: 'a1',
      name: 'Ramesh Kumar',
      role: 'producer',
      shopName: 'Ramesh Tribal Arts',
      location: 'Bastar, Chhattisgarh',
      artType: 'Dhokra Art',
      contact: '9876543210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 'a2',
      name: 'Sita Devi',
      role: 'producer',
      shopName: 'Mithila Colors',
      location: 'Madhubani, Bihar',
      artType: 'Madhubani Painting',
      contact: '9876543211',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 'a3',
      name: 'Arjun Singh',
      role: 'producer',
      shopName: 'Bamboo Crafts',
      location: 'Guwahati, Assam',
      artType: 'Bamboo Handicrafts',
      contact: '9876543212',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
    }
  ]);

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  const login = (role: UserRole, userData?: Partial<User>) => {
    // Determine ID: use mock IDs for standard roles, or generate new ID if registration data is present
    const isRegistration = userData && Object.keys(userData).length > 0;
    // If logging in with existing data (userData provided), use that ID if available
    let userId = userData?.id;
    
    if (!userId) {
       userId = isRegistration ? `u-${Date.now()}` : (role === 'producer' ? 's1' : (role === 'admin' ? 'a1' : 'c1'));
    }

    const baseUser: User = {
      id: userId,
      name: role === 'producer' ? 'Ramesh Artisan' : (role === 'admin' ? 'Admin User' : 'Priya Sharma'),
      role: role,
      shopName: role === 'producer' ? 'Ramesh Tribal Arts' : undefined,
    };
    
    // Merge base mock data with any provided overrides (from registration or login lookup)
    const newUser = { ...baseUser, ...userData };
    setUser(newUser);

    // If a producer registers, add them to the public artisan list
    // Check if name is provided to assume it's a registration event vs just a login event
    if (role === 'producer' && isRegistration && !artisans.some(a => a.contact === newUser.contact)) {
      setArtisans(prev => {
        // Prevent adding duplicate if logic runs multiple times
        if (prev.some(a => a.contact === newUser.contact)) return prev;
        return [newUser, ...prev];
      });
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]); // simple cleanup
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (shippingDetails: ShippingDetails, paymentMethod: PaymentMethod) => {
    if (!user || cart.length === 0) return;
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerId: user.id,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      date: new Date().toISOString(),
      shippingDetails,
      paymentMethod
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
        if (p.id === productId) {
            return { ...p, reviews: [review, ...p.reviews] };
        }
        return p;
    }));
  };

  return (
    <StoreContext.Provider value={{
      language, setLanguage,
      user, login, logout,
      products, addProduct,
      cart, addToCart, removeFromCart, clearCart,
      orders, placeOrder, cancelOrder, updateOrderStatus,
      addReview,
      t,
      artisans // Export artisans
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};