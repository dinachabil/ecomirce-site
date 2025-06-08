import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import ProtectedRoute from './redux/ProtectedRoute';
import ProductDetails from './components/ProductDetails';
import About from './pages/about';
import Checkout from './pages/Checkout';
import Merci from './pages/Merci';
import AddProduct from './pages/AddProduct'; 
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/actions';
import axios from 'axios';

import './styles.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
  const token = localStorage.getItem('token');

  let user = null;
  try {
    const userString = localStorage.getItem('user');
    if (userString && userString !== 'undefined') {
      user = JSON.parse(userString);
    }
  } catch (error) {
    console.error('🔴 Failed to parse user from localStorage:', error);
  }

  if (token && user) {
    dispatch(loginSuccess(user, token));

    // ✅ حمل السلة من قاعدة البيانات حتى من بعد refresh
    axios.get('http://localhost:5000/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      dispatch({ type: 'LOAD_CART', payload: res.data });
    })
    .catch(err => {
      console.error('❌ Failed to load cart on refresh:', err);
    });
  }
}, [dispatch]);


  return (
    <>
      <Navbar />
      <Routes>
        {/* 🔓 Pages publiques */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:productId" element={<ProductDetails />} />

        {/* 🔐 Pages محمية بالتوكن */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/merci" element={<ProtectedRoute><Merci /></ProtectedRoute>} />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
