import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const AddProduct = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    Frais_de_livraison: "",
    image: null,
    quantity_disponible: "",

  });

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async () => {
    if (!formData.image) throw new Error("Aucune image sélectionnée.");

    if (uploading) {
      console.warn("Image déjà en cours de téléchargement");
      return null;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", formData.image);

      const res = await axios.post("http://localhost:5000/api/upload/image", data);
      return res.data.imageUrl;
    } catch (err) {
      console.error("Erreur upload image:", err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "admin") {
      setMessage("❌ Vous n'êtes pas autorisé à ajouter un produit.");
      return;
    }

    try {
      const imageUrl = await handleImageUpload();
      if (!imageUrl) {
        setMessage("❌ Échec du téléchargement de l'image.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/products",
        {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          Frais_de_livraison: formData.Frais_de_livraison,
          image: imageUrl,
              quantity_disponible: formData.quantity_disponible,
          
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Produit ajouté avec succès !");
      setFormData({
        name: "",
        description: "",
        price: "",
        Frais_de_livraison: "",
        image: null,
        quantity_disponible: "",
      });
     navigate("/"); // ← بحرف صغير لأنه جاي من useNavigate()
// Rediriger vers la page d'accueil ou une autre page
    } catch (error) {
      console.error("Erreur serveur:", error.response?.data || error.message);
      setMessage("❌ Erreur lors de l'ajout du produit.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>Ajouter un Produit</h2>
      {message && (
        <p style={{ color: message.includes("succès") ? "green" : "red" }}>{message}</p>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: "10px" }}>
          <label>Nom :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Description :</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Prix :</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Frais de livraison :</label>
          <input
            type="number"
            name="Frais_de_livraison"
            value={formData.Frais_de_livraison}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Image :</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

<div style={{ marginBottom: "10px" }}>
  <label>Quantité disponible :</label>
  <input
    type="number"
    name="quantity_disponible"
    value={formData.quantity_disponible}
    onChange={handleChange}
    required
    min="0"
    style={{ width: "100%", padding: "8px" }}
  />
</div>


        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: "10px 20px",
            backgroundColor: uploading ? "#999" : "#28a745",
            color: "white",
            border: "none",
            cursor: uploading ? "not-allowed" : "pointer",
            borderRadius: "5px",
          }}
        >
          {uploading ? "Uploading..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
