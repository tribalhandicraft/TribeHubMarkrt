import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Login from './pages/Login';
import About from './pages/About';
import ProducerDashboard from './pages/ProducerDashboard';
import ProducerRegister from './pages/ProducerRegister';
import AdminDashboard from './pages/AdminDashboard';
import MyOrders from './pages/MyOrders';
import ProductDetails from './pages/ProductDetails';
import AdminNotification from './components/AdminNotification';

// Layout wrapper for pages with Navbar and Notification systems
const Layout = ({ children }: { children?: React.ReactNode }) => (
  <>
    <Navbar />
    <AdminNotification />
    {children}
  </>
);

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/my-orders" element={<Layout><MyOrders /></Layout>} />
          <Route path="/producer" element={<Layout><ProducerDashboard /></Layout>} />
          <Route path="/register-producer" element={<Layout><ProducerRegister /></Layout>} />
          <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;