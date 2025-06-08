import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { addToCart, fetchProducts } from "../redux/actions";

const Home = () => {
  const products = useSelector((state) => state.products.products);
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleQuantityChange = (productId, value) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 1;
    setQuantities((prev) => ({ ...prev, [productId]: numericValue }));
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    const selectedQuantity = quantities[product.id] || 1;
    const existingItem = cart.find((item) => item.id === product.id);

    if (!existingItem) {
      dispatch(addToCart({ ...product, quantity: selectedQuantity }));
      alert(`${product.name} added to the cart with ${selectedQuantity} unit(s).`);
    } else {
      alert(`${product.name} is already in the cart.`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tu es sûr de vouloir supprimer ce produit ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchProducts()); // refresh products list
        alert("Produit supprimé avec succès !");
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home" >
      <div >
        <input
          className="search-bar"
          type="text"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        />
      </div>

      {/* Button Ajouter produit visible ghir l'admin */}
      {user?.role === "admin" && (
        <div >
          <Link to="/add-product">
            <button style={{ padding: "10px", fontWeight: "bold" }}>
              ➕ Ajouter un produit
            </button>
          </Link>
        </div>
      )}

      <div className="product-list" >
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "250px",
            }}
          >
            <Link to={`/product/${product.id}`}>
             <img
  src={`http://localhost:5000${product.image}`}
  alt={product.name}
  style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px" }}
/>

            </Link>

            <Link to={`/product/${product.id}`}>
              <h3>{product.name}</h3>
            </Link>

            <p>Price: {product.price} MAD</p>

            {/* Delete button visible ghir l'admin */}
            {user?.role === "admin" && (
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  marginBottom: "10px",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(product.id)}
              >
                🗑️ Supprimer
              </button>
            )}

            {/* Quantity input and Add to Cart button visible only if user is NOT admin */}
            {user?.role !== "admin" && (
              <>
                <div style={{ marginBottom: "10px" }}>
                  <label>Quantity:</label>
                  <center>
                    <input
                      type="number"
                      min="1"
                      max={product.quantity_disponible > 0 ? product.quantity_disponible : 1}
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    />
                  </center>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    padding: "10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
