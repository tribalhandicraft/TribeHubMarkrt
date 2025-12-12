import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, CheckCircle, Truck, MapPin, User, Phone, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PaymentMethod } from '../types';

const Cart: React.FC = () => {
  const { cart, removeFromCart, placeOrder, t, orders } = useStore();
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  
  // Shipping form state
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [paymentDetails, setPaymentDetails] = useState({
      cardNumber: '',
      expiry: '',
      cvv: '',
      upiId: '',
      bank: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = total * 0.05; // 5% GST
  const finalTotal = total + gst;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    setStep('shipping');
  };

  const handleToPayment = () => {
     // Validate shipping fields
     if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone || !shippingDetails.pincode || !isConfirmed) {
        alert(t('fillFieldsErr'));
        return;
      }
      setStep('payment');
  }

  const handlePlaceOrder = () => {
    // Validate Payment Fields if necessary
    if (paymentMethod === 'upi' && !paymentDetails.upiId) {
        alert("Please enter a valid UPI ID");
        return;
    }
    if (paymentMethod === 'card' && (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv)) {
        alert("Please enter card details");
        return;
    }

    // Simulate API call
    setTimeout(() => {
        placeOrder(shippingDetails, paymentMethod);
        setStep('success');
    }, 1500);
  };

  if (step === 'success') {
      const lastOrder = orders[0];
      return (
          <div className="min-h-screen bg-tribal-50 flex items-center justify-center p-4">
              <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                      <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">{t('orderSuccess')}</h2>
                  <p className="text-gray-500">
                      {t('thankYouOrder')} <span className="font-mono font-bold text-black">{lastOrder?.id}</span>.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg text-left text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                        <span>{t('estDelivery')}:</span>
                        <span className="font-semibold">7 Days</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t('courier')}:</span>
                        <span className="font-semibold">TribalExpress</span>
                    </div>
                    {lastOrder?.shippingDetails && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                         <p className="font-semibold mb-1">Shipping To:</p>
                         <p>{lastOrder.shippingDetails.fullName}</p>
                         <p className="truncate">{lastOrder.shippingDetails.address}</p>
                         <p>{lastOrder.shippingDetails.city}, {lastOrder.shippingDetails.pincode}</p>
                         <p>Ph: {lastOrder.shippingDetails.phone}</p>
                      </div>
                    )}
                  </div>
                  <Link to="/shop" className="block w-full bg-tribal-600 text-white py-3 rounded-lg font-semibold hover:bg-tribal-700">
                      {t('continueShopping')}
                  </Link>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-tribal-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <ShoppingBag className="text-tribal-600" />
            {step === 'cart' ? t('cart') : t('secureCheckout')}
        </h1>

        {cart.length === 0 && step === 'cart' ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-sm">
            <p className="text-xl text-gray-500 mb-6">{t('emptyCart')}</p>
            <Link to="/shop" className="inline-block bg-tribal-600 text-white px-6 py-2 rounded-lg hover:bg-tribal-700">
              {t('goToShop')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Cart Items or Forms */}
            <div className="lg:col-span-2 space-y-6">
                {step === 'cart' && (
                    <div className="bg-white rounded-xl shadow-sm border border-tribal-100 overflow-hidden">
                        {cart.map(item => (
                            <div key={item.id} className="p-4 flex gap-4 border-b border-gray-100 last:border-0">
                                <img src={item.images[0]} alt={item.title} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">{t('qty')}: {item.quantity}</div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-tribal-700">₹{item.price * item.quantity}</span>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 'shipping' && (
                    <div className="bg-white rounded-xl shadow-sm border border-tribal-100 p-6 space-y-6">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-2">
                            <MapPin size={20} className="text-tribal-600" /> {t('shippingAddress')}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')} <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        value={shippingDetails.fullName}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500"
                                        placeholder="e.g. John Doe" 
                                    />
                                </div>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('addressLabel')} <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        name="address"
                                        value={shippingDetails.address}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" 
                                        placeholder="House No, Street, Landmark"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    value={shippingDetails.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" 
                                    placeholder="e.g. Mumbai"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('pincode')} <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="pincode"
                                    value={shippingDetails.pincode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" 
                                    placeholder="e.g. 400001"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')} <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        value={shippingDetails.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tribal-500" 
                                        placeholder="e.g. +91 9876543210"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Checkbox */}
                        <div className="bg-tribal-50 p-4 rounded-lg border border-tribal-100 flex items-start gap-3">
                            <div className="pt-1">
                                <input 
                                    type="checkbox" 
                                    id="confirmOrder"
                                    checked={isConfirmed}
                                    onChange={(e) => setIsConfirmed(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-tribal-600 focus:ring-tribal-500 cursor-pointer"
                                />
                            </div>
                            <label htmlFor="confirmOrder" className="text-sm text-gray-700 cursor-pointer">
                                <span className="font-semibold block mb-1">Confirmation Required</span>
                                {t('confirmOrderCheck')}
                            </label>
                        </div>
                    </div>
                )}

                {step === 'payment' && (
                    <div className="bg-white rounded-xl shadow-sm border border-tribal-100 p-6 space-y-6">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-2">
                            <CreditCard size={20} className="text-tribal-600" /> {t('paymentMethod')}
                        </h3>
                        
                        <div className="space-y-4">
                            {/* UPI */}
                            <label className={`block border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-tribal-500 bg-tribal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="text-tribal-600 focus:ring-tribal-500" />
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white p-1 rounded border border-gray-100"><Smartphone size={20} className="text-purple-600"/></div>
                                        <span className="font-medium">{t('upi')}</span>
                                    </div>
                                </div>
                                {paymentMethod === 'upi' && (
                                    <div className="mt-4 pl-7">
                                        <label className="text-xs text-gray-500 mb-1 block">{t('vpa')}</label>
                                        <input 
                                          type="text" 
                                          placeholder="username@upi" 
                                          value={paymentDetails.upiId}
                                          onChange={e => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-tribal-500"
                                        />
                                    </div>
                                )}
                            </label>

                            {/* Card */}
                            <label className={`block border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-tribal-500 bg-tribal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="text-tribal-600 focus:ring-tribal-500" />
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white p-1 rounded border border-gray-100"><CreditCard size={20} className="text-blue-600"/></div>
                                        <span className="font-medium">{t('card')}</span>
                                    </div>
                                </div>
                                {paymentMethod === 'card' && (
                                    <div className="mt-4 pl-7 space-y-3">
                                        <div>
                                            <input 
                                                type="text" 
                                                placeholder={t('cardNumber')}
                                                value={paymentDetails.cardNumber}
                                                onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-tribal-500"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <input 
                                                type="text" 
                                                placeholder={t('expiry')}
                                                value={paymentDetails.expiry}
                                                onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                                                className="w-1/2 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-tribal-500"
                                            />
                                            <input 
                                                type="text" 
                                                placeholder={t('cvv')}
                                                value={paymentDetails.cvv}
                                                onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                                                className="w-1/2 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-tribal-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </label>

                             {/* Net Banking */}
                             <label className={`block border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-tribal-500 bg-tribal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className="text-tribal-600 focus:ring-tribal-500" />
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white p-1 rounded border border-gray-100"><Banknote size={20} className="text-green-600"/></div>
                                        <span className="font-medium">{t('netBanking')}</span>
                                    </div>
                                </div>
                                {paymentMethod === 'netbanking' && (
                                    <div className="mt-4 pl-7">
                                        <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-tribal-500 bg-white">
                                            <option>State Bank of India</option>
                                            <option>HDFC Bank</option>
                                            <option>ICICI Bank</option>
                                            <option>Axis Bank</option>
                                        </select>
                                    </div>
                                )}
                            </label>

                            {/* COD */}
                            <label className={`block border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-tribal-500 bg-tribal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-tribal-600 focus:ring-tribal-500" />
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white p-1 rounded border border-gray-100"><Truck size={20} className="text-orange-600"/></div>
                                        <span className="font-medium">{t('cod')}</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-tribal-100 p-6 sticky top-24">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">{t('orderSummary')}</h3>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>{t('subtotal')}</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>{t('gst')}</span>
                            <span>₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>{t('shipping')}</span>
                            <span className="text-green-600">{t('free')}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-xl text-tribal-800">
                            <span>{t('total')}</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {step === 'cart' ? (
                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-tribal-600 text-white py-3 rounded-lg font-semibold hover:bg-tribal-700 transition-colors shadow-lg shadow-tribal-500/20"
                        >
                            {t('checkout')}
                        </button>
                    ) : step === 'shipping' ? (
                        <button 
                            onClick={handleToPayment}
                            className={`w-full text-white py-3 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 ${
                                isConfirmed ? 'bg-tribal-600 hover:bg-tribal-700 shadow-tribal-500/20' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                           {t('payPlaceOrder')} <Truck size={18} />
                        </button>
                    ) : (
                        <button 
                            onClick={handlePlaceOrder}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                        >
                           {t('payPlaceOrder')} <CheckCircle size={18} />
                        </button>
                    )}
                    
                    <div className="mt-4 text-xs text-center text-gray-400">
                        {t('secureMsg')}
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;