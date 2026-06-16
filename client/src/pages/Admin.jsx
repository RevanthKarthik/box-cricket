
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";

export default function Admin() {
  const [slots, setSlots] =
    useState([]);

const [stats, setStats] =
  useState({
    todayRevenue: 0,
    monthlyRevenue: 0,
    lifetimeRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    fetchSlots();
    fetchStats();
  }, []);

  const fetchStats =
    async () => {
      try {
        const res =
          await api.get(
            "/dashboard/stats"
          );

        setStats(
          res.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const fetchSlots =
    async () => {
      try {
        const res =
          await api.get("/slots");

        setSlots(res.data);
      } catch (error) {
        console.log(error);
      }
    };


  const deleteSlot =
    async (id) => {
      if (
        !window.confirm(
          "Delete slot?"
        )
      )
        return;

      await api.delete(
        `/slots/${id}`
      );

      fetchSlots();
    };

  const toggleStatus =
    async (id) => {
      await api.patch(
        `/slots/toggle/${id}`
      );

      fetchSlots();
    };

  return (
    <>
      <AdminNavbar />
<div
  className="container py-4"
  style={{
    paddingBottom: "80px",
  }}
>

        <h2 className="mb-4 text-center">
          Admin Dashboard
        </h2>
        
        <div className="row mb-4">

  <div className="col-6 col-md-4 col-lg mb-3"><div
  className="card shadow border-0 h-100"
  style={{
    borderRadius: "16px",
  }}
>
      <div className="card-body text-center">
        <h6>Today's Revenue</h6>
        <h3 className="text-success">
          ₹{stats.todayRevenue}
        </h3>
      </div>
    </div>
  </div>

  <div className="col-6 col-md-4 col-lg mb-3"><div
  className="card shadow border-0 h-100"
  style={{
    borderRadius: "16px",
  }}
>
      <div className="card-body text-center">
        <h6>Monthly Revenue</h6>
        <h3 className="text-primary">
          ₹{stats.monthlyRevenue}
        </h3>
      </div>
    </div>
  </div>

  <div className="col-6 col-md-4 col-lg mb-3"><div
  className="card shadow border-0 h-100"
  style={{
    borderRadius: "16px",
  }}
>
      <div className="card-body text-center">
        <h6>Lifetime Revenue</h6>
        <h3 className="text-dark">
          ₹{stats.lifetimeRevenue}
        </h3>
      </div>
    </div>
  </div>

  <div className="col-6 col-md-4 col-lg mb-3"><div
  className="card shadow border-0 h-100"
  style={{
    borderRadius: "16px",
  }}
>
      <div className="card-body text-center">
        <h6>Total Bookings</h6>
        <h3>
          {stats.totalBookings}
        </h3>
      </div>
    </div>
  </div>

  <div className="col-6 col-md-4 col-lg mb-3"><div
  className="card shadow border-0 h-100"
  style={{
    borderRadius: "16px",
  }}
>
      <div className="card-body text-center">
        <h6>Total Customers</h6>
        <h3>
          {stats.totalCustomers}
        </h3>
      </div>
    </div>
  </div>

</div>

        <h3 className="fw-bold mb-3">
  🎯 Upcoming Slot Management
</h3>
        
        <div className="table-responsive">
  <table className="table table-bordered table-hover align-middle">
        

          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {slots.map(
              (slot) => (
                <tr
                  key={
                    slot._id
                  }
                >
                  <td>
                    {new Date(
                      slot.startTime
                    ).toLocaleString()}
                    
                  </td>

                  <td>
                    {new Date(
                      slot.endTime
                    ).toLocaleString()}
                  </td>

                  <td>
                    ₹
                    {slot.price}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        slot.status ===
                        "available"
                          ? "bg-success"
                          : slot.status ===
                            "blocked"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {
                        slot.status
                      }
                    </span>
                  </td>

                  <td>

                    {slot.status !==
                      "booked" && (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() =>
                          toggleStatus(
                            slot._id
                          )
                        }
                      >
                        {slot.status ===
                        "blocked"
                          ? "Unblock"
                          : "Block"}
                      </button>
                    )}

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteSlot(
                          slot._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>
        </div>

      </div>
    </>
  );
}