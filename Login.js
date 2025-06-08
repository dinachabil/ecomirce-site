import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../redux/actions';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:5000/api/login', {
      email,
      password
    });

    const token = res.data.token;
    localStorage.setItem('token', token);

    // ✅ خزّن user بشكل آمن
    localStorage.setItem('user', JSON.stringify({
      email: res.data.email,
      name: res.data.name,
      numero: res.data.numero,
      role: res.data.role,
    }));

    dispatch(loginSuccess(
      {
        email: res.data.email,
        name: res.data.name,
        numero: res.data.numero,
        role: res.data.role,
      },
      token
    ));

    // ✅ جلب السلة
    const responseCart = await axios.get('http://localhost:5000/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });

    dispatch({
      type: 'LOAD_CART',
      payload: responseCart.data,
    });

    navigate('/');
  } catch (err) {
    alert(err.response?.data?.message || 'Login failed');
  }
};


  return (
    <form onSubmit={handleLogin}>
      <br />
      <br />
      <br />
      <center><h2>Login</h2></center>
      <br />

      <input
        type="email"
        placeholder="Write your email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Write your password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      <p style={{
        textAlign: 'center',
        marginTop: '15px',
        fontSize: '14px',
        color: '#555',
      }}>
        Don't have an account?{' '}
        <Link
          to="/signup"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onMouseOver={e => e.target.style.textDecoration = 'underline'}
          onMouseOut={e => e.target.style.textDecoration = 'none'}
        >
          Create Account
        </Link>
      </p>
    </form>
  );
};

export default Login;
