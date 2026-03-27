import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#1e293b' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1e293b' },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
