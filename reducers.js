const initialState = {
  auth: {
    user: null,
    token: null,
  },
  products: {
    products: [],
  },
  cart: {
    items: [],
    total: 0,
  },
};

const calculateTotal = (items) => {
  return items.reduce(
    (sum, item) =>
      sum + (item.price + (item.Frais_de_livraison || 0)) * item.quantity,
    0
  );
};


const rootReducer = (state = initialState, action) => {
  switch (action.type) {
case 'LOGIN':
  return {
    ...state,
    auth: {
      user: {
        email: action.payload.user.email,
        name: action.payload.user.name,
        numero: action.payload.user.numero,
        role: action.payload.user.role, // ← hna khasha tkoun
      },
      token: action.payload.token,
    },
  };


    case 'LOGOUT':
      return {
        ...state,
        auth: {
          user: null,
          token: null,
        },
      };

    // CART
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.id === action.payload.id
      );
      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = [...state.cart.items];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
      } else {
        updatedCart = [...state.cart.items, { ...action.payload, quantity: action.payload.quantity }];
      }
      return {
        ...state,
        cart: {
          items: updatedCart,
          total: calculateTotal(updatedCart),
        },
      };
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.cart.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        cart: {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        },
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.cart.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        cart: {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        },
      };
    }
case 'CLEAR_CART':
  return {
    ...state,
    cart: {
      items: [],
      total: 0, 
    },
  };
case 'LOAD_CART':
  return {
    ...state,
    cart: {
      items: action.payload,
      total: calculateTotal(action.payload),
    },
  };



    // PRODUCTS
    case 'FETCH_PRODUCTS':
      return {
        ...state,
        products: {
          products: action.payload,
        },
      };

    default:
      return state;
  }
};

export default rootReducer;
