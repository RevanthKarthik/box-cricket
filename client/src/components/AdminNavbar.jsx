import {
  Link,
  useLocation,
} from "react-router-dom";

import "../styles/adminNavbar.css";

export default function AdminNavbar() {

  const location =
    useLocation();

  return (
    <div className="admin-navbar">

      <Link
        to="/admin"
        className={`admin-link ${
          location.pathname ===
          "/admin"
            ? "active"
            : ""
        }`}
      >
        Dashboard
      </Link>

      <Link
        to="/admin/bookings"
        className={`admin-link ${
          location.pathname ===
          "/admin/bookings"
            ? "active"
            : ""
        }`}
      >
        Bookings
      </Link>

      <Link
        to="/admin/gallery"
        className={`admin-link ${
          location.pathname ===
          "/admin/gallery"
            ? "active"
            : ""
        }`}
      >
        Gallery
      </Link>

      <Link
        to="/"
        className="admin-link admin-site-btn"
      >
        Website
      </Link>

    </div>
  );
}