import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions';
import logo from './logo.jpg';
import {  useNavigate } from 'react-router-dom';


const Navbar = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
const navigate = useNavigate();

const handleLogout = () => {
localStorage.removeItem('token');
localStorage.removeItem('user');

  dispatch(logoutUser()); 
  navigate('/login');
};


  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="logo" className="logo-img" />
      </Link>
      
      <div className="links">
        <Link to="/" className="nav-link">Home</Link>
        {user?.role !== 'admin' && (
  <Link to="/cart" className="nav-link">
    Cart <span className="badge">{cartItems.length}</span>
  </Link>
)}

        <Link to="/about">about</Link>

      </div>
      <div className="auth-links">
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">Login</Link><br/>
            <Link to="/signup" className="signup-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
