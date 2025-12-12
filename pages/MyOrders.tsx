import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Clock, XCircle, ChevronRight, AlertCircle } from 'lucide-react';

const MyOrders: React.FC = () => {
  const { user, orders, cancelOrder, t } = useStore();

  if (!user || user.role !== 'customer') {
    return <div className="p-10 text-center text-red-500 font-bold">Please log in as a customer to view your orders.</div>;
  }

  const myOrders = orders.filter(o => o.customerId === user.id);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-tribal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
           <Package className="text-tribal-600" /> {t('myOrders')}
        </h1>

        {myOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
             <div className="text-gray-300 mb-4">
               <Package size={64} className="mx-auto" />
             </div>
             <h3 className="text-lg font-medium text-gray-900">{t('noOrders')}</h3>
             <p className="text-gray-500 mt-2">{t('tryAdjusting')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-tribal-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <div>
                         <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-lg text-gray-900">Order #{order.id.slice(-6)}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} uppercase tracking-wide`}>
                              {order.status === 'cancelled' ? t('cancelled') : order.status}
                            </span>
                         </div>
                         <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock size={14} /> {new Date(order.date).toLocaleString()}
                         </div>
                      </div>
                      
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => {
                             if(window.confirm('Are you sure you want to cancel this order?')) {
                               cancelOrder(order.id);
                             }
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                        >
                          <XCircle size={16} /> {t('cancelOrder')}
                        </button>
                      )}
                      
                      {order.status === 'cancelled' && (
                          <div className="flex items-center gap-1.5 text-red-500 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg">
                             <AlertCircle size={16} /> {t('orderCancelled')}
                          </div>
                      )}
                   </div>

                   <div className="border-t border-gray-100 pt-4 space-y-4">
                      {order.items.map((item, idx) => (
                         <div key={idx} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                               <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                               <h4 className="font-medium text-gray-900">{item.title}</h4>
                               <p className="text-sm text-gray-500">{item.category}</p>
                               <div className="mt-1 flex justify-between text-sm">
                                  <span>Qty: {item.quantity}</span>
                                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                   
                   <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div>
                         <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">Total Amount</span>
                         <span className="text-xl font-bold text-tribal-800">₹{order.total.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                         <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-1">Payment Method</span>
                         <span className="text-sm font-semibold text-gray-800 uppercase">{order.paymentMethod || 'COD'}</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;