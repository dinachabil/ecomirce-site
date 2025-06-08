import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cartItems = useSelector(state => state.cart.items);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + (item.price + item.Frais_de_livraison) * item.quantity,
    0
  );

  const handlePayment = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('خاصك تكون مسجل الدخول باش تدير الأداء.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
  'http://localhost:5000/api/create-checkout-session',
  {
   cartItems: cartItems.map
(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || '',
    })),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError('وقعت مشكلة أثناء إنشاء جلسة الأداء.');
      }
    } catch (err) {
      console.error(err);
      setError('وقعت مشكلة أثناء الأداء. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">الدفع</h2>

      <ul className="mb-4">
        {cartItems.map((item, index) => (
          <li key={index} className="mb-2 flex justify-between text-gray-700">
            <span>{item.name} × {item.quantity}</span>
            <span>
              {((item.price + item.Frais_de_livraison) * item.quantity).toFixed(2)} MAD
            </span>
          </li>
        ))}
      </ul>

      <div className="text-right font-bold text-xl mb-4 text-gray-800">
        المجموع: {total.toFixed(2)} MAD
      </div>

      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-3 rounded text-white transition duration-300 ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'جارٍ المعالجة...' : 'الدفع بالبطاقة'}
      </button>
    </div>
  );
};

export default Checkout;
