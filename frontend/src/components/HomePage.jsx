import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <header className="header">
        <h1>Virtual Deal Room</h1>
        <p>Secure Business Transactions in Real Time</p>
      </header>

      <main className="content" style={{ flex: 1 }}>
        <section className="hero">
          <h2>Connect, Negotiate, and Finalize Deals</h2>
          <p>
            A secure platform where buyers and sellers can chat, upload
            documents, and track deals in real-time.
          </p>
          <div className="buttons">
            <button className="btn login" onClick={() => navigate("/login")}>
              Login
            </button>
            <button
              className="btn signup"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Virtual Deal Room. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
