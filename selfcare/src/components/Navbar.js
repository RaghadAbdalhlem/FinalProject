import React from 'react';
import './Navbar.css'; // ייבוא קובץ CSS

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">SELF CARE</a>
      </div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
