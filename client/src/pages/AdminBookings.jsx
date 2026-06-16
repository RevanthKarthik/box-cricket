import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";

export default function AdminBookings() {

  const [bookings, setBookings] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedDate,
    setSelectedDate] =
    useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings =
    async () => {
      try {

        const res =
          await api.get(
            "/bookings"
          );

        setBookings(
          res.data
        );

      } catch (error) {
        console.log(error);
      }
    };

  const filteredBookings =
    bookings.filter(
      (booking) => {

        const matchesSearch =
          booking.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          booking.phone
            ?.includes(
              search
            );

        const matchesDate =
          selectedDate
            ? new Date(
                booking.startTime
              )
                .toISOString()
                .split("T")[0] ===
              selectedDate
            : true;

        return (
          matchesSearch &&
          matchesDate
        );
      }
    );

  return (
    <>
      <AdminNavbar />

      <div
  className="container py-4"
  style={{
    paddingBottom: "80px",
  }}
>

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">

          <h2 className="fw-bold">
            Booking Management
          </h2>

          <span className="badge bg-primary fs-6">
            Total:
            {" "}
            {
              filteredBookings.length
            }
          </span>

        </div>

        <div className="row mb-4">

          <div className="col-md-6 mb-2">

            <input
              type="text"
              className="form-control"
              placeholder="Search by customer or phone"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="col-md-3 mb-2">

            <input
              type="date"
              className="form-control"
              value={
                selectedDate
              }
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
            />

          </div>

          <div className="col-md-3 mb-2">

            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setSearch("");
                setSelectedDate("");
              }}
            >
              Clear Filters
            </button>

          </div>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {filteredBookings.map(
                (booking) => (

                  <tr
                    key={
                      booking._id
                    }
                  >

                    <td>
                      {
                        booking.name
                      }
                    </td>

                    <td>
                      {
                        booking.phone
                      }
                    </td>

                    <td>
                      {new Date(
                        booking.startTime
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(
                        booking.startTime
                      ).toLocaleTimeString(
                        [],
                        {
                          hour:
                            "2-digit",
                          minute:
                            "2-digit",
                        }
                      )}
                      {" - "}
                      {new Date(
                        booking.endTime
                      ).toLocaleTimeString(
                        [],
                        {
                          hour:
                            "2-digit",
                          minute:
                            "2-digit",
                        }
                      )}
                    </td>

                    <td>
                      ₹
                      {
                        booking.amount
                      }
                    </td>

                    <td>

                      <span
                        className={`badge ${
                          booking.paymentStatus ===
                          "paid"
                            ? "bg-success"
                            : booking.paymentStatus ===
                              "pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {
                          booking.paymentStatus
                        }
                      </span>

                    </td>

                    <td>

                      <span
                        className={`badge ${
                          booking.bookingStatus ===
                          "confirmed"
                            ? "bg-success"
                            : booking.bookingStatus ===
                              "pending"
                            ? "bg-warning text-dark"
                            : booking.bookingStatus ===
                              "cancelled"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {
                          booking.bookingStatus
                        }
                      </span>

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