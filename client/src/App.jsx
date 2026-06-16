import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import AdminBookings from "./pages/AdminBookings";
import BookingHistory from "./pages/BookingHistory";
import AdminGallery from "./pages/AdminGallery";
import Gallery from "./pages/Gallery";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />
<Route
  path="/admin-login"
  element={
    <AdminLogin />
  }
/>

<Route
  path="/admin"
  element={
    <AdminRoute>
      <Admin />
    </AdminRoute>
  }
/>

<Route
  path="/admin/bookings"
  element={
    <AdminRoute>
      <AdminBookings />
    </AdminRoute>
  }
/>

<Route
  path="/admin/gallery"
  element={
    <AdminRoute>
      <AdminGallery />
    </AdminRoute>
  }
/>

        <Route
          path="/gallery"
          element={<Gallery />}
        />
       
        <Route
          path="/history"
          element={
            <BookingHistory />
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;