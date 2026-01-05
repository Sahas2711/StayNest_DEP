import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TenantDashboard from "./pages/TenantDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import BookPG from "./pages/BookPG";
import MyReviews from "./pages/MyReviews";
import MyProfile from "./pages/MyProfile";
import MyProfileOwner from "./pages/MyProfileOwner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OwnerNavbarDashboard from "./components/OwnerNavbarDashboard";
import TenantDashboardNavbar from "./components/TenantDashboardNavbar";
import ManageBookings from "./pages/ManageBookings";
import ViewReviewsOwner from "./pages/ViewReviewsOwner";
import AccountSettings from "./pages/AccountSettings";
import ContactSupport from "./pages/ContactSupport";
import ListingBookings from "./pages/ListingBookings";
import BookingDetailsOwner from "./pages/BookingDetailsOwner";
import BookingDetails from "./pages/BookingDetails";
import "./styles/global.css";
import AccountSettingsOwner from "./pages/AccountSettings owner.jsx";
import ContactSupportOwner from "./pages/ContactSupport owner.jsx";
import OwnerNotifications from "./pages/OwnerNotifications";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


function AppContent() {
  const location = useLocation();

  // Paths where Navbar and Footer should be hidden (e.g., login only)
  const hideLayoutPaths = ["/login","/register","/reset-password"];
  const hideLayout = hideLayoutPaths.includes(location.pathname);

  // Show owner/tenant navbars for dashboard routes
  const isOwnerDashboard =
    location.pathname.startsWith("/owner/dashboard") ||
    location.pathname.startsWith("/owner/create-listing") ||
    location.pathname.startsWith("/owner/edit-listing") ||
    location.pathname.startsWith("/owner/view-reviews") ||
    location.pathname.startsWith("/manage-bookings") ||
    location.pathname.startsWith("/listing-bookings") ||
    location.pathname.startsWith("/owner/booking-details") ||
    location.pathname.startsWith("/account-settings-owner") ||
    location.pathname.startsWith("/contact-support-owner") ||
    location.pathname.startsWith("/my-profile-owner") ||
    location.pathname.startsWith("/owner/notifications");
  const isTenantDashboard =
    location.pathname.startsWith("/tenant/dashboard") ||
    location.pathname.startsWith("/my-profile") ||
    location.pathname.startsWith("/my-reviews") ||
    location.pathname.startsWith("/listings") ||
    location.pathname.startsWith("/book-pg") ||
    location.pathname.startsWith("/contactsupport") ||
    location.pathname.startsWith("/booking-details") ||
    location.pathname.startsWith("/account-settings");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && (isOwnerDashboard ? <OwnerNavbarDashboard /> : isTenantDashboard ? <TenantDashboardNavbar /> : <Navbar />)}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/book-pg/:id" element={<BookPG />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-profile-owner" element={<MyProfileOwner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/create-listing" element={<CreateListing />} />
          <Route path="/owner/edit-listing/:listingId" element={<EditListing />} />
          <Route path="/manage-bookings" element={<ManageBookings />} />
          <Route path="/owner/view-reviews" element={<ViewReviewsOwner />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/owner/contact-support" element={<ContactSupport />} />
          <Route path="/listing-bookings/:pgId" element={<ListingBookings />} />
          <Route path="/owner/booking-details/:bookingId" element={<BookingDetailsOwner />} />
          <Route path="/account-settings-owner" element={<AccountSettingsOwner />} />
          <Route path="/contact-support-owner" element={<ContactSupportOwner />} />
          <Route path="/contactsupport" element={<ContactSupport />} />
          <Route path="/owner/notifications" element={<OwnerNotifications />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/booking-details/:bookingId" element={<BookingDetails />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
