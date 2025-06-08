// redux/
import axios from 'axios';
export const loginSuccess = (user, token) => ({
  type: 'LOGIN',
  payload: { user, token },  // إرسال الـ user والتوكن في payload
});


export const logoutUser = () => (dispatch) => {
  dispatch({ type: 'CLEAR_CART' });
  dispatch({ type: 'LOGOUT' });
};



export const addToCart = (product) => async (dispatch, getState) => {
  const state = getState();
  const cartItem = state.cart.items.find((item) => item.id === product.id);

  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const requestedQuantity = (product.quantity || 1) + currentQuantityInCart;

  if (requestedQuantity > product.quantity_disponible) {
    alert("❌ Quantité demandée supérieure à la quantité disponible !");
    return;
  }

  dispatch({
    type: 'ADD_TO_CART',
    payload: product,
  });

  const token = localStorage.getItem('token');

  if (token) {
    try {
      await axios.post('http://localhost:5000/api/cart', {
        product_id: product.id,
        quantity: product.quantity || 1,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('❌ Erreur en ajoutant au panier (backend):', error.message);
    }
  }
};



export const removeFromCart = (id) => async (dispatch) => {
  dispatch({
    type: 'REMOVE_FROM_CART',
    payload: id,
  });

  const token = localStorage.getItem('token');
  if (token) {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du panier:', error.message);
    }
  }
};

export const updateQuantity = (id, quantity) => async (dispatch) => {
  dispatch({
    type: 'UPDATE_QUANTITY',
    payload: { id, quantity },
  });

  const token = localStorage.getItem('token');
  if (token) {
    try {
      await axios.put('http://localhost:5000/api/cart', {
        product_id: id,
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la quantité:', error.message);
    }
  }
};

export const clearCart = () => ({
  type: 'CLEAR_CART',
});
export const loadCart = (items) => ({
  type: 'LOAD_CART',
  payload: items,
});



export const fetchProducts = () => async (dispatch) => {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('Expected an array but got:', data);
      return;
    }

    dispatch({
      type: 'FETCH_PRODUCTS',
      payload: data,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};



