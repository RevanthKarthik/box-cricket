import { useState } from "react";
import api from "../services/api";
import { useNavigate }
from "react-router-dom";

export default function AdminLogin() {

  const navigate =
    useNavigate();

  const [username,
  setUsername] =
    useState("");

  const [password,
  setPassword] =
    useState("");

  const login =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await api.post(
            "/admin/login",
            {
              username,
              password,
            }
          );

        localStorage.setItem(
          "adminToken",
          res.data.token
        );

        navigate("/admin");

      } catch {

        alert(
          "Invalid Login"
        );
      }
    };

  return (
    <div className="container py-5">

      <form
        onSubmit={login}
        className="card p-4 shadow mx-auto"
        style={{
          maxWidth: "400px",
        }}
      >

        <h3 className="mb-4">
          Admin Login
        </h3>

        <input
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          className="btn btn-success"
        >
          Login
        </button>

      </form>

    </div>
  );
}