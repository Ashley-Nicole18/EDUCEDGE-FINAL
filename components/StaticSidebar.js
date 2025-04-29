'use client';

export default function StaticSidebar() {
  return (
    <div
      id="sidebar"
      style={{
        position: "fixed",
        top: 0,
        left: 0, 
        height: "100vh",
        width: "250px",
        background: "#4a6ea9",
        padding: "1rem",
        color: "white",
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
