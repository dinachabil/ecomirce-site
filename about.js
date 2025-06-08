import React from "react";

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "2rem auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgb(0 0 0 / 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  h1: {
    fontSize: "2.5rem",
    marginBottom: "1.2rem",
    color: "#2c3e50",
    textAlign: "center",
  },
  p: {
    fontSize: "1.15rem",
    lineHeight: 1.8,
    marginBottom: "1rem",
  },
  ul: {
    listStyleType: "none",
    paddingLeft: 0,
    marginTop: "1rem",
  },
  li: {
    fontSize: "1.1rem",
    marginBottom: "0.6rem",
    paddingLeft: "1.5rem",
    position: "relative",
    color: "#34495e",
  },
  liBefore: {
    content: '"✔"', // this won’t work inline, so we’ll fake with a span
    position: "absolute",
    left: 0,
    color: "#27ae60",
    fontWeight: "bold",
  },
  h3: {
    marginTop: "2.5rem",
    fontSize: "1.6rem",
    color: "#34495e",
    borderBottom: "2px solid #27ae60",
    paddingBottom: "0.3rem",
  },
};

const About = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>About Our Company</h1>
      <p style={styles.p}>
        Welcome to <strong>Electo Menagé </strong> – your trusted specialist in modern
        and reliable home appliances. We are committed to providing you with
        high-quality products at competitive prices while ensuring excellent
        customer service.
      </p>

      <p style={styles.p}>
        Since our establishment, our mission has been to improve your comfort at
        home with efficient, durable, and energy-saving appliances. Whether
        you're looking for a refrigerator, washing machine, oven, or other
        devices, we are here to serve you.
      </p>

      <h3 style={styles.h3}>Our Values:</h3>
      <ul style={styles.ul}>
        {[
          "Quality and Reliability",
          "Responsive After-Sales Service",
          "Commitment to Innovation",
          "Customer Satisfaction First",
        ].map((item, i) => (
          <li key={i} style={styles.li}>
            <span
              style={{
                color: "#27ae60",
                fontWeight: "bold",
                marginRight: "0.5rem",
              }}
            >
              ✔
            </span>
            {item}
          </li>
        ))}
      </ul>

      <h3 style={styles.h3}>Contact Us:</h3>
      <p style={styles.p}>Email: electrooussam@electom.com</p>
      <p style={styles.p}>Phone: +212 695704124</p>
      <p style={styles.p}>Address: Nador,Ttaouima Morocco</p>
    </div>
  );
};

export default About;
