import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const total = cartItems.reduce(
    (acc, item) => acc + (item.price + item.Frais_de_livraison) * item.quantity,
    0
  );

  const handleRemove = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to modify the cart');
    return;
  }

  try {
    await axios.delete(`http://localhost:5000/api/cart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update Redux state
    dispatch(removeFromCart(id));
  } catch (error) {
    console.error("Erreur suppression serveur:", error.response?.data || error.message);
    alert("❌ Impossible de supprimer le produit du panier.");
  }
};


  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity(id, quantity));
  };

 const handleCheckout = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login before checkout');
    navigate('/login');
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/order',
      { cartItems, total },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ Response:", response.data);
    alert('✅ Commande enregistrée avec succès !');

    navigate('/checkout'); // 👈 مشي لصفحة checkout مباشرة

    // ⏱️ فرّغ الكارت بعد 3 ثواني باش تقرا checkout المعطيات
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
    }, 3000);

  } catch (error) {
    console.error('Erreur commande:', error.response?.data || error.message);
    alert('❌ Erreur lors de l\'enregistrement de la commande.');
  }
};

  if (cartItems.length === 0) {
    return <p className="text-center text-lg mt-8">Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Price (MAD)</th>
            <th>Delivery Fee (MAD)</th>
            <th>Quantity</th>
            <th>Total (MAD)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
       {cartItems.map((item, index) => (
  <tr key={`${item.id}-${index}`}>

              <td>
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="cart-img"
                />
              </td>
              <td>{item.name}</td>
              <td>{item.price.toFixed(2)}</td>
              <td>{item.Frais_de_livraison.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max={item.quantity_disponible || 1}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  style={{ width: '60px', textAlign: 'center' }}
                />
              </td>
              <td>
                {((item.price + item.Frais_de_livraison) * item.quantity).toFixed(2)}
              </td>
              <td>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-total">Total: {total.toFixed(2)} MAD</div>
      <button
        onClick={handleCheckout}
        className="btn-checkout"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
