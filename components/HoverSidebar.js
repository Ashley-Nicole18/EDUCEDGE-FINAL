'use client';

import { useState, useEffect } from 'react';

export default function HoverSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const sidebar = document.getElementById('sidebar');
      const sidebarRect = sidebar.getBoundingClientRect();
      if (e.clientX < sidebarRect.right + 60) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      id="sidebar"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "fixed",
        top: 0,
        left: isOpen ? 0 : -150,
        height: "100vh",
        width: "250px",
        background: "#4a6ea9",
        padding: "1rem",
        color: "white",
        transition: "left 0.3s ease",
        zIndex: 1000,
      }}
    >
      <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem" }}>EducEdge</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "1.5rem" }}>
          <a href="#" style={{ color: "white", fontSize: "1.2rem", padding: "0.5rem 0", display: "block" }}>
            Profile
          </a>
        </li>
        <li style={{ marginBottom: "1.5rem" }}>
          <a href="#" style={{ color: "white", fontSize: "1.2rem", padding: "0.5rem 0", display: "block" }}>
            Dashboard
          </a>
        </li>
        <li style={{ marginBottom: "1.5rem" }}>
          <a href="#" style={{ color: "white", fontSize: "1.2rem", padding: "0.5rem 0", display: "block" }}>
            Booking
          </a>
        </li>
        <li>
          <a href="#" style={{ color: "white", fontSize: "1.2rem", padding: "0.5rem 0", display: "block" }}>
            Sign Out
          </a>
        </li>
      </ul>
    </div>
  );
}