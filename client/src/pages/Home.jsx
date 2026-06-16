import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import Navbar from "../components/Navbar";
import BookingModal from "../components/BookingModal";
import SlotCategoryModal from "../components/SlotCategoryModal";
import api from "../services/api";

export default function Home() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState("today");

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await api.get("/slots");
      setSlots(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (slot) => {
    setSelectedSlot(slot);
  };

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const filteredSlots = slots.filter((slot) => {
    const slotDate = new Date(slot.startTime);
    const slotDay = new Date(slotDate);
    slotDay.setHours(0, 0, 0, 0);

    const isSelectedDate =
      selectedDate === "today"
        ? slotDay.getTime() === today.getTime()
        : slotDay.getTime() === tomorrow.getTime();

    const isAvailableFilter = showAvailableOnly
      ? slot.status === "available"
      : true;

    const isFuture = new Date(slot.endTime) > now;

    return isSelectedDate && isAvailableFilter && isFuture;
  });

  // 6:00 AM to 4:59 PM
  const daySlots = filteredSlots.filter((slot) => {
    const hour = new Date(slot.startTime).getHours();
    return hour >= 6 && hour < 17;
  });

  // 5:00 PM to 9:59 PM
  const eveningSlots = filteredSlots.filter((slot) => {
    const hour = new Date(slot.startTime).getHours();
    return hour >= 17 && hour < 22;
  });

  // 10:00 PM to 5:59 AM
  const nightSlots =
  slots.filter((slot) => {

    const startTime =
      new Date(
        slot.startTime
      );

    const endTime =
      new Date(
        slot.endTime
      );

    const hour =
      startTime.getHours();

    const isAvailableFilter =
      showAvailableOnly
        ? slot.status ===
          "available"
        : true;

    if (
      !isAvailableFilter ||
      endTime <= now
    ) {
      return false;
    }

    const slotDay =
      new Date(startTime);

    slotDay.setHours(
      0,
      0,
      0,
      0
    );

    if (
      selectedDate ===
      "today"
    ) {

      const nextMorning =
        new Date(today);

      nextMorning.setDate(
        nextMorning.getDate() +
          1
      );

      return (
        (
          slotDay.getTime() ===
            today.getTime() &&
          hour >= 22
        ) ||
        (
          slotDay.getTime() ===
            nextMorning.getTime() &&
          hour < 6
        )
      );
    }

    if (
      selectedDate ===
      "tomorrow"
    ) {

      const dayAfterTomorrow =
        new Date(tomorrow);

      dayAfterTomorrow.setDate(
        dayAfterTomorrow.getDate() +
          1
      );

      return (
        (
          slotDay.getTime() ===
            tomorrow.getTime() &&
          hour >= 22
        ) ||
        (
          slotDay.getTime() ===
            dayAfterTomorrow.getTime() &&
          hour < 6
        )
      );
    }

    return false;
  });
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="text-white text-center d-flex align-items-center"
        style={{
          minHeight: "80vh",
          background:
            "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1500&q=80') center/cover",
        }}
      >
        <div className="container">
          <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(2.2rem, 8vw, 4rem)" }}>
            RK BOX CRICKET
          </h1>
          <p className="lead mb-4">Metpally's Premier Box Cricket Arena</p>
          <div>
            <a href="#slots" className="btn btn-success btn-lg me-3">
              Book Now
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Pricing</h2>
          <div className="row complex-mobile-scroller">
            <div className="col-md-4 mb-4 scroller-item">
              <div className="card shadow h-100">
                <div className="card-body text-center">
                  <h4>Morning & Day</h4>
                  <h2 className="text-success">₹500</h2>
                  <p className="mb-0 text-muted">6 AM - 5 PM</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4 scroller-item">
              <div className="card shadow h-100 border-success">
                <div className="card-body text-center">
                  <h4>Peak Hours</h4>
                  <h2 className="text-success">₹700</h2>
                  <p className="mb-0 text-muted">5 PM - 10 PM</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4 scroller-item">
              <div className="card shadow h-100">
                <div className="card-body text-center">
                  <h4>Night Hours</h4>
                  <h2 className="text-success">₹500</h2>
                  <p className="mb-0 text-muted">10 PM - 6 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="slots" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Book Your Slot</h2>
            <p className="text-muted">Select Date & Time Category</p>

            <div className="row justify-content-center mb-4">
              <div className="col-lg-4 col-md-6 px-4">
                <select
                  className="form-select form-select-lg shadow-sm"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="today">📅 Today's Slots</option>
                  <option value="tomorrow">📅 Tomorrow's Slots</option>
                </select>
              </div>
            </div>

            <div className="btn-group mt-2">
              <button
                className={`btn ${!showAvailableOnly ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setShowAvailableOnly(false)}
              >
                All Slots
              </button>
              <button
                className={`btn ${showAvailableOnly ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setShowAvailableOnly(true)}
              >
                Available Only
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success mb-2" role="status"></div>
              <div>Loading Slots...</div>
            </div>
          ) : (
            <div className="row g-4 complex-mobile-scroller">
              {/* Day Card */}
              <div className="col-lg-4 col-md-6 scroller-item">
                <div
                  className="card border-0 shadow-lg h-100 text-white slot-category-card"
                  style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)" }}
                  onClick={() => setActiveCategory("day")}
                >
                  <div className="card-body p-4 text-center">
                    <h2>☀️</h2>
                    <h4 className="fw-bold">Day Slots</h4>
                    <p className="small opacity-90">6 AM - 5 PM</p>
                    <h5>{daySlots.length} Slots Available</h5>
                    <button className="btn btn-light mt-3 w-100">View Slots</button>
                  </div>
                </div>
              </div>

              {/* Evening Card */}
              <div className="col-lg-4 col-md-6 scroller-item">
                <div
                  className="card border-0 shadow-lg h-100 text-white slot-category-card"
                  style={{ background: "linear-gradient(135deg,#f59e0b,#ea580c)" }}
                  onClick={() => setActiveCategory("evening")}
                >
                  <div className="card-body p-4 text-center">
                    <h2>🌆</h2>
                    <h4 className="fw-bold">Evening Slots</h4>
                    <p className="small opacity-90">5 PM - 10 PM</p>
                    <h5>{eveningSlots.length} Slots Available</h5>
                    <button className="btn btn-light mt-3 w-100">View Slots</button>
                  </div>
                </div>
              </div>

              {/* Night Card */}
              <div className="col-lg-4 col-md-6 scroller-item">
                <div
                  className="card border-0 shadow-lg h-100 text-white slot-category-card"
                  style={{ background: "linear-gradient(135deg,#2563eb,#1e293b)" }}
                  onClick={() => setActiveCategory("night")}
                >
                  <div className="card-body p-4 text-center">
                    <h2>🌙</h2>
                    <h4 className="fw-bold">Night Slots</h4>
                    <p className="small opacity-90">10 PM - 6 AM</p>
                    <h5>{nightSlots.length} Slots Available</h5>
                    <button className="btn btn-light mt-3 w-100">View Slots</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* History Card Strip */}
      <section className="py-4">
        <div className="container">
          <div className="my-bookings-card text-center">
            <h3>📖 My Bookings</h3>
            <p>View your booking history and upcoming reservations.</p>
            <Link to="/history" className="btn btn-success px-4">
              View My Bookings
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Promotion Section */}
      <section className="gallery-glimpse-section py-5 bg-white border-top">
        <div className="container text-center">
          <h2 className="fw-bold">Gallery</h2>
          <p className="text-muted">Explore our ground, premium turf facilities, and match highlights.</p>
          <Link to="/gallery" className="btn btn-success">
            📸 View Gallery
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Why Choose RK Box Cricket?</h2>
          <div className="row text-center complex-mobile-scroller">
            <div className="col-md-3 mb-3 scroller-item">
              <div className="card shadow border-0 h-100">
                <div className="card-body py-4">
                  <h5 className="mb-0 fw-bold text-success">💡 Flood Lights</h5>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3 scroller-item">
              <div className="card shadow border-0 h-100">
                <div className="card-body py-4">
                  <h5 className="mb-0 fw-bold text-success">🕒 24x7 Open</h5>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3 scroller-item">
              <div className="card shadow border-0 h-100">
                <div className="card-body py-4">
                  <h5 className="mb-0 fw-bold text-success">📱 Easy Booking</h5>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3 scroller-item">
              <div className="card shadow border-0 h-100">
                <div className="card-body py-4">
                  <h5 className="mb-0 fw-bold text-success">⚡ Instant Pay</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Map Arena */}
      <section id="contact" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Find RK Box Cricket</h2>
            <p className="text-muted">Easy to Reach • Open 24 Hours</p>
          </div>

          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div className="card border-0 shadow-lg" style={{ borderRadius: "20px" }}>
                <div className="card-body p-4">
                  <h3 className="fw-bold mb-4">🏏 RK Box Cricket</h3>
                  <div className="mb-3">
                    <h6 className="text-success fw-bold">Location</h6>
                    <p className="mb-0">Metpally, Telangana</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-success fw-bold">Mobile Number</h6>
                    <p className="mb-0">📞 +91 7780162148</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-success fw-bold">Availability</h6>
                    <p className="mb-0">Open 24 Hours</p>
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success btn-lg"
                    >
                      📍 Open in Maps
                    </a>
                    <a href="tel:+917780162148" className="btn btn-outline-success">
                      📞 Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <iframe
                  src="https://www.google.com/maps/embed" 
                  width="100%"
                  height="380"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen=""
                  title="RK Box Cricket Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedSlot && (
        <BookingModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
      )}

      <SlotCategoryModal
        show={activeCategory !== null}
        title={
          activeCategory === "day"
            ? "☀️ Day Slots"
            : activeCategory === "evening"
            ? "🌆 Evening Slots"
            : "🌙 Night Slots"
        }
        slots={
          activeCategory === "day"
            ? daySlots
            : activeCategory === "evening"
            ? eveningSlots
            : nightSlots
        }
        onClose={() => setActiveCategory(null)}
        onBook={handleBook}
      />

      {/* Simple Footer */}
      <footer className="bg-dark text-white py-4 text-center">
        <div className="container">
          <p className="mb-0 small text-muted">
            © 2026 <strong>RK Box Cricket</strong> • Metpally, Telangana. All Rights Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}