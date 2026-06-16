import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function BookingHistory() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [searched, setSearched] = useState(false); // State to track if a search was performed

  const searchBookings = async () => {
    if (!phone.trim()) return;
    try {
      const res = await api.get(`/bookings/history/${phone}`);
      setBookings(res.data);
      setSearched(true);

      // Extract the name from the first booking if it exists
      if (res.data && res.data.length > 0) {
        setUserName(res.data[0].name);
      } else {
        setUserName(""); // Reset if no bookings found for this number
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4" style={{ minHeight: "80vh" }}>
        
        {/* Dynamic Greeting Section */}
        {searched && userName && (
          <div className="mb-4 p-3 bg-light rounded shadow-sm border-start border-success border-4">
            <h3 className="mb-1 fw-bold text-dark">
              👋 Hello, {userName}!
            </h3>
            <p className="text-muted mb-0">
              Here is your registered slot booking history for <strong>{phone}</strong>.
            </p>
          </div>
        )}

        <h2 className="fw-bold mb-4">Booking History</h2>

        {/* Search Input Controls */}
        <div className="row mb-4">
          <div className="col-md-6 col-8">
            <input
              type="tel"
              className="form-control form-control-lg"
              placeholder="Enter Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchBookings()}
            />
          </div>
          <div className="col-md-2 col-4">
            <button
              className="btn btn-success btn-lg w-100"
              onClick={searchBookings}
            >
              Search
            </button>
          </div>
        </div>

        {/* Conditional Rendering for Bookings Table */}
        {bookings.length > 0 ? (
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Slot Time</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="fw-semibold">
                      {booking.slot
                        ? new Date(booking.slot.startTime).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </td>
                    <td className="fw-bold text-success">
                      ₹{booking.amount}
                    </td>
                    <td>
                      <span
                        className={`badge px-3 py-2 rounded-pill ${
                          booking.paymentStatus === "paid"
                            ? "bg-success-subtle text-success"
                            : "bg-warning-subtle text-warning"
                        }`}
                      >
                        {booking.paymentStatus?.toUpperCase() || "PENDING"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge px-3 py-2 rounded-pill ${
                          booking.bookingStatus === "confirmed"
                            ? "bg-primary-subtle text-primary"
                            : "bg-secondary-subtle text-secondary"
                        }`}
                      >
                        {booking.bookingStatus?.toUpperCase() || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          searched && (
            <div className="text-center py-5">
              <p className="text-muted fs-5">No bookings found for this mobile number.</p>
            </div>
          )
        )}
      </div>
    </>
  );
}