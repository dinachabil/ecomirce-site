import React, {  useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from '../redux/actions';

function ProductDetails() {
  const { productId } = useParams(); // Récupère l'ID du produit depuis l'URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector((state) =>
    state.products?.products?.find((p) => p.id === parseInt(productId))
  );
  const user = useSelector((state) => state.auth?.user);

  const [quantity, setQuantity] = useState(1); // État pour la quantité

 

  if (!product) return <p>Produit non trouvé.</p>;

  const handleAddToCart = () => {
    if (!user) {
      alert('Vous devez vous connecter pour ajouter au panier.');
      return navigate('/login');
    }
    dispatch(addToCart({ ...product, quantity }));
    alert(`${quantity} ${product.name} ajouté(s) au panier !`);
  };

  
  return (
    <div className="product-details-container">
      <center>
<img
  src={`http://localhost:5000${product.image}`}
  alt={product.name}
  className="product-image"
/>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p><strong>Prix:</strong> {product.price} MAD</p>
        <p><strong>Frais de livraison:</strong> {product.Frais_de_livraison} MAD</p>

        <div className="quantity-section">
          <label>Quantité:</label>
          <center>      <input
            className="quantity-input"
            type="number"
            min="1"
max={product.quantity_disponible > 0 ? product.quantity_disponible : 1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
          /></center>
    
        </div>

        <button onClick={handleAddToCart} className="add-to-cart-button">
          Ajouter au panier
        </button>

       
      </center>
    </div>
  );
}

export default ProductDetails;
