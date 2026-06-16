import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import "../styles/navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] =
    useState(false);

  const location =
    useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 50
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);
 const closeMenu = () => {
  const navbar =
    document.getElementById(
      "navbarNav"
    );

  if (
    navbar &&
    navbar.classList.contains(
      "show"
    )
  ) {
    navbar.classList.remove(
      "show"
    );
  }
}
  const goToSection = (
    sectionId
  ) => {
    if (
      location.pathname !==
      "/"
    ) {
      window.location.href = `/#${sectionId}`;
      return;
    }
  ;
    const section =
      document.getElementById(
        sectionId
      );

    if (section) {
      section.scrollIntoView({
        behavior:
          "smooth",
      });
    }
  };

  return (
  <nav className="user-navbar">

<Link
  to="/"
  onClick={() =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  className="user-link"
>
  Home
</Link>

  <button
    className="user-link nav-btn"
    onClick={() =>
      goToSection("contact")
    }
  >
    Contact Us
  </button>

  <button
    className="book-btn"
    onClick={() =>
      goToSection("slots")
    }
  >
    Book Now
  </button>

</nav>
  );
}