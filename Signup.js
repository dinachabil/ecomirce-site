import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [numero, setNumero] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/signup", {
        name,
        numero,
        email,
        password,
      });
      alert("Account created successfully 🎉");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Signup error");
    }
  };

  const fieldStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  };

  const labelStyle = {
    width: "120px",
    fontWeight: "bold",
  };

  const inputStyle = {
    flex: "1",           // input yakhod space kbir
    padding: "6px 8px",
    fontSize: "14px",
  };

  return (
    <center>
      <br />
      <br />
      <br />
      <form onSubmit={handleSignup} style={{ maxWidth: "400px", width: "100%" }}>
        <h2>Create Account</h2><br />

        <div style={fieldStyle}>
          <label htmlFor="name" style={labelStyle}>Name:</label>
          <input
            id="name"
            type="text"
            placeholder="Write your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="numero" style={labelStyle}>Numero:</label>
          <input
            id="numero"
            type="text"
            placeholder="Write your numero"
            value={numero}
            onChange={e => setNumero(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="email" style={labelStyle}>Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Write your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="password" style={labelStyle}>Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Write your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Sign Up
        </button>
      </form>
    </center>
  );
};

export default Signup;
