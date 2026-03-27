import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaCalendar, FaUsers, FaCreditCard } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(1);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }
    const fetchHotel = async () => {
      try {
        const { data } = await API.get(`/hotels/${id}`);
        setHotel(data);
      } catch (err) {
        console.error('Failed to fetch hotel:', err);
        toast.error('Hotel not found');
        navigate('/hotels');
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id, user, navigate]);

  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const totalPrice = hotel ? hotel.price * nights : 0;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error('Check-out must be after check-in');
      return;
    }

    setProcessing(true);
    try {
      // Step 1: Create booking
      const { data: booking } = await API.post('/bookings', {
        hotel: hotel._id,
        checkIn,
        checkOut,
        guests,
        totalPrice,
      });

      // Step 2: Create Razorpay order
      const { data: order } = await API.post('/payment/create-order', {
        amount: totalPrice,
        bookingId: booking._id,
      });

      // Step 3: Load Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Payment gateway failed to load');
        setProcessing(false);
        return;
      }

      // Step 4: Open Razorpay checkout
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Quickstay',
        description: `Booking at ${hotel.name}`,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });
            toast.success('Booking confirmed! 🎉');
            navigate('/my-bookings');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 w-1/3 skeleton rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="h-6 w-1/2 skeleton rounded" />
            <div className="h-10 skeleton rounded" />
            <div className="h-10 skeleton rounded" />
            <div className="h-10 skeleton rounded" />
          </div>
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="h-40 skeleton rounded" />
            <div className="h-6 skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <HiArrowLeft /> Back
        </button>

        <h1 className="font-display font-bold text-3xl text-white mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display font-semibold text-lg text-white mb-5">Booking Details</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  <FaCalendar className="inline mr-2 text-blue-400" />Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (e.target.value >= checkOut) {
                      const next = new Date(e.target.value);
                      next.setDate(next.getDate() + 1);
                      setCheckOut(next.toISOString().split('T')[0]);
                    }
                  }}
                  className="w-full px-4 py-3 bg-dark-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  <FaCalendar className="inline mr-2 text-blue-400" />Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">
                  <FaUsers className="inline mr-2 text-blue-400" />Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-dark-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Hotel Summary + Price */}
          <div className="space-y-6">
            <div className="glass rounded-2xl overflow-hidden">
              <img src={hotel.image} alt={hotel.name} className="w-full h-44 object-cover" />
              <div className="p-5">
                <h3 className="font-display font-semibold text-lg text-white">{hotel.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-slate-400 text-sm">
                  <FaMapMarkerAlt className="text-blue-400 text-xs" />
                  {hotel.location}, Mumbai
                </div>
                <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
                  <FaStar className="text-xs" /> {hotel.rating}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-white mb-4">Price Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>{formatPrice(hotel.price)} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-display font-bold text-xl text-blue-400">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FaCreditCard />
                {processing ? 'Processing...' : `Pay ${formatPrice(totalPrice)}`}
              </button>

              <p className="text-center text-slate-500 text-xs mt-3 flex items-center justify-center gap-1">
                <FaCreditCard className="text-[10px]" /> Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
