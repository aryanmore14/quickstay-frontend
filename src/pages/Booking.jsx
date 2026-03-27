import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaUser, FaCheckCircle, FaChild, FaDoorOpen, FaShieldAlt, FaFire } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TAG_STYLES = {
  'Luxury': 'tag-luxury', 'Trending': 'tag-trending', 'Best Value': 'tag-best-value',
  'Beach': 'tag-beach', 'Eco-Friendly': 'tag-eco',
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80';
const handleImgError = (e) => { e.target.onerror = null; e.target.src = FALLBACK_IMG; };

const Booking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [booking, setBooking] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [h, r] = await Promise.all([API.get(`/hotels/${id}`), API.get(`/reviews/${id}`)]);
        setHotel(h.data);
        if (Array.isArray(r.data)) setReviews(r.data);
      } catch (err) { toast.error('Hotel not found'); navigate('/hotels'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const allImages = hotel ? [hotel.image, ...(hotel.images || [])].filter(Boolean) : [];
  const nights = checkIn && checkOut ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)) : 0;
  const roomPrice = nights * (hotel?.price || 0) * rooms;
  const taxes = Math.round(roomPrice * 0.18);
  const totalPrice = roomPrice + taxes;

  const handleBookNow = () => { if (!user) { toast.error('Please login first'); navigate('/login'); return; } if (!checkIn || !checkOut || nights <= 0) { toast.error('Select valid dates'); return; } setShowSummary(true); };

  const confirmBooking = async () => {
    setBooking(true);
    try {
      await API.post('/bookings', { hotel: id, checkIn, checkOut, guests: adults + children, totalPrice: roomPrice });
      toast.success('🎉 Booking confirmed!');
      navigate('/my-bookings');
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
    finally { setBooking(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login'); return; }
    if (!reviewText.trim()) { toast.error('Write a comment'); return; }
    setSubmittingReview(true);
    try {
      const { data } = await API.post('/reviews', { hotel: id, rating: reviewRating, comment: reviewText });
      setReviews([data, ...reviews]);
      setReviewText(''); setReviewRating(5);
      toast.success('Review posted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div className="pt-20 min-h-screen max-w-6xl mx-auto px-4 py-8">
      <div className="aspect-[2/1] skeleton rounded-2xl mb-6" /><div className="h-8 w-1/2 skeleton mb-4" /><div className="h-32 skeleton rounded-2xl" />
    </div>
  );
  if (!hotel) return null;

  return (
    <div className="pt-20 min-h-screen">
      {/* Booking Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'}}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-md rounded-2xl p-6" style={{background: 'var(--bg-card)', border: '1px solid var(--border)'}}>
              <h2 className="font-display font-bold text-xl mb-4" style={{color: 'var(--text-primary)'}}>Booking Summary</h2>
              <div className="flex gap-3 mb-4 pb-4" style={{borderBottom: '1px solid var(--border)'}}>
                <img src={hotel.image || FALLBACK_IMG} alt="" className="w-20 h-16 rounded-xl object-cover" onError={handleImgError} />
                <div>
                  <p className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>{hotel.name}</p>
                  <p className="text-xs" style={{color: 'var(--text-muted)'}}>{hotel.location}, Mumbai</p>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span style={{color:'var(--text-secondary)'}}>Check-in</span><span className="font-medium" style={{color:'var(--text-primary)'}}>{formatDate(checkIn)}</span></div>
                <div className="flex justify-between"><span style={{color:'var(--text-secondary)'}}>Check-out</span><span className="font-medium" style={{color:'var(--text-primary)'}}>{formatDate(checkOut)}</span></div>
                <div className="flex justify-between"><span style={{color:'var(--text-secondary)'}}>Duration</span><span className="font-medium" style={{color:'var(--text-primary)'}}>{nights} night{nights > 1 ? 's' : ''}</span></div>
                <div className="flex justify-between"><span style={{color:'var(--text-secondary)'}}>Guests</span><span className="font-medium" style={{color:'var(--text-primary)'}}>{adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}</span></div>
                <div className="flex justify-between"><span style={{color:'var(--text-secondary)'}}>Rooms</span><span className="font-medium" style={{color:'var(--text-primary)'}}>{rooms}</span></div>
              </div>
              <div className="space-y-2 text-sm p-3 rounded-xl mb-4" style={{background:'var(--bg-secondary)'}}>
                <div className="flex justify-between" style={{color:'var(--text-secondary)'}}><span>{formatPrice(hotel.price)} × {nights} nights × {rooms} room{rooms > 1 ? 's' : ''}</span><span>{formatPrice(roomPrice)}</span></div>
                <div className="flex justify-between" style={{color:'var(--text-secondary)'}}><span>Taxes (18% GST)</span><span>{formatPrice(taxes)}</span></div>
                <div className="flex justify-between font-bold pt-2" style={{borderTop:'1px solid var(--border)', color:'var(--text-primary)'}}><span>Total</span><span>{formatPrice(totalPrice)}</span></div>
              </div>
              <div className="flex items-center gap-2 text-[11px] mb-4" style={{color:'var(--text-muted)'}}><FaShieldAlt className="text-green-500" /> Secure payment · Free cancellation</div>
              <div className="flex gap-3">
                <button onClick={() => setShowSummary(false)} className="btn-outline flex-1">Edit</button>
                <button onClick={confirmBooking} disabled={booking} className="btn-primary flex-1">{booking ? 'Confirming...' : 'Confirm & Pay'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-2xl overflow-hidden mb-8" style={{background:'var(--bg-secondary)'}}>
          <div className="aspect-[2.2/1] sm:aspect-[2.5/1]">
            <img src={allImages[currentImg] || FALLBACK_IMG} alt={hotel.name} className="w-full h-full object-cover" loading="lazy" onError={handleImgError} />
          </div>
          {allImages.length > 1 && (<>
            <button onClick={() => setCurrentImg(p => p === 0 ? allImages.length - 1 : p - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"><FaChevronLeft className="text-gray-700 text-sm" /></button>
            <button onClick={() => setCurrentImg(p => p === allImages.length - 1 ? 0 : p + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"><FaChevronRight className="text-gray-700 text-sm" /></button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">{allImages.map((_, i) => <button key={i} onClick={() => setCurrentImg(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-white w-5' : 'bg-white/50'}`} />)}</div>
          </>)}
          {allImages.length > 1 && <div className="flex gap-2 mt-3">{allImages.map((img, i) => <button key={i} onClick={() => setCurrentImg(i)} className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImg ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-80'}`}><img src={img || FALLBACK_IMG} alt="" className="w-full h-full object-cover" loading="lazy" onError={handleImgError} /></button>)}</div>}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {hotel.tags?.map((tag, i) => <span key={i} className={`badge text-xs ${TAG_STYLES[tag] || 'tag-default'}`}>{tag === 'Trending' && <FaFire className="mr-0.5" />}{tag}</span>)}
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl mb-2" style={{color:'var(--text-primary)'}}>{hotel.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1" style={{color:'var(--text-muted)'}}><FaMapMarkerAlt className="text-blue-500" /> {hotel.location}, Mumbai</span>
                <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-medium"><FaStar className="text-amber-400" /> {hotel.rating}</span>
                <span style={{color:'var(--text-muted)'}}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                {hotel.bookingCount > 10 && <span className="text-xs text-rose-500 font-medium pulse-soft">🔥 Booked {hotel.bookingCount} times</span>}
              </div>
            </div>

            <div className="card-static p-5"><h3 className="font-semibold mb-2" style={{color:'var(--text-primary)'}}>About</h3><p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>{hotel.description}</p></div>

            <div className="card-static p-5">
              <h3 className="font-semibold mb-3" style={{color:'var(--text-primary)'}}>Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hotel.amenities?.map((a, i) => <div key={i} className="flex items-center gap-2 text-sm py-1.5" style={{color:'var(--text-secondary)'}}><FaCheckCircle className="text-green-500 text-xs" /> {a}</div>)}
              </div>
            </div>

            {/* Reviews */}
            <div className="card-static p-5">
              <h3 className="font-semibold mb-4" style={{color:'var(--text-primary)'}}>Guest Reviews ({reviews.length})</h3>
              {user && (
                <form onSubmit={handleReviewSubmit} className="mb-6 p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm mr-2" style={{color:'var(--text-secondary)'}}>Your rating:</span>
                    {[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setReviewRating(s)} className="text-lg"><FaStar className={s <= reviewRating ? 'text-amber-400' : 'text-gray-300'} /></button>)}
                  </div>
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience..." rows={3} className="input-field resize-none text-sm mb-3" />
                  <button type="submit" disabled={submittingReview} className="btn-primary text-sm !py-2.5">{submittingReview ? 'Posting...' : 'Post Review'}</button>
                </form>
              )}
              {reviews.length === 0 ? <p className="text-sm" style={{color:'var(--text-muted)'}}>No reviews yet. Be the first!</p> : (
                <div className="space-y-4">{reviews.map(r => (
                  <div key={r._id} className="flex gap-3 pb-4" style={{borderBottom:'1px solid var(--border)'}}>
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">{r.user?.name?.charAt(0)?.toUpperCase() || '?'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{r.user?.name}</span>
                        <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <FaStar key={i} className={`text-xs ${i < r.rating ? 'text-amber-400' : 'text-gray-200'}`} />)}</div>
                        <span className="badge text-[10px] bg-green-50 text-green-600">✓ Verified</span>
                      </div>
                      <p className="text-sm" style={{color:'var(--text-secondary)'}}>{r.comment}</p>
                      <span className="text-xs mt-1 block" style={{color:'var(--text-muted)'}}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-static p-5 sticky top-24">
              <div className="flex items-baseline gap-1 mb-1">
                {hotel.discount > 0 && hotel.originalPrice && <span className="text-sm line-through" style={{color:'var(--text-muted)'}}>{formatPrice(hotel.originalPrice)}</span>}
                <span className="text-2xl font-bold" style={{color:'var(--text-primary)'}}>{formatPrice(hotel.price)}</span>
                <span className="text-sm" style={{color:'var(--text-muted)'}}>/ night</span>
              </div>
              {hotel.discount > 0 && <span className="discount-badge mb-4 inline-block">{hotel.discount}% OFF</span>}

              <div className="space-y-3 mt-4 mb-5">
                <div><label className="block text-xs font-medium mb-1" style={{color:'var(--text-muted)'}}><FaCalendarAlt className="inline mr-1" /> Check-in</label><input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} className="input-field text-sm" /></div>
                <div><label className="block text-xs font-medium mb-1" style={{color:'var(--text-muted)'}}><FaCalendarAlt className="inline mr-1" /> Check-out</label><input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} className="input-field text-sm" /></div>

                {/* Guest Selector - Stepper Controls */}
                <div className="space-y-2.5">
                  {[
                    { label: 'Adults', icon: <FaUser style={{fontSize:'9px'}} />, value: adults, set: setAdults, min: 1, max: 10 },
                    { label: 'Children', icon: <FaChild style={{fontSize:'9px'}} />, value: children, set: setChildren, min: 0, max: 6 },
                    { label: 'Rooms', icon: <FaDoorOpen style={{fontSize:'9px'}} />, value: rooms, set: setRooms, min: 1, max: 5 },
                  ].map(g => (
                    <div key={g.label} className="flex items-center justify-between p-2.5 rounded-xl" style={{background:'var(--bg-secondary)'}}>
                      <span className="text-xs font-medium flex items-center gap-1.5" style={{color:'var(--text-secondary)'}}>{g.icon} {g.label}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => g.set(Math.max(g.min, g.value - 1))} disabled={g.value <= g.min}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all disabled:opacity-30"
                          style={{background:'var(--bg-card)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>−</button>
                        <input type="number" value={g.value} onChange={e => { const v = parseInt(e.target.value) || g.min; g.set(Math.max(g.min, Math.min(g.max, v))); }}
                          className="w-10 text-center text-sm font-semibold bg-transparent outline-none" style={{color:'var(--text-primary)'}} min={g.min} max={g.max} />
                        <button type="button" onClick={() => g.set(Math.min(g.max, g.value + 1))} disabled={g.value >= g.max}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all disabled:opacity-30"
                          style={{background:'var(--bg-card)', color:'var(--text-primary)', border:'1px solid var(--border)'}}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {nights > 0 && (
                <div className="space-y-2 mb-5 p-3 rounded-xl text-sm" style={{background:'var(--bg-secondary)'}}>
                  <div className="flex justify-between" style={{color:'var(--text-secondary)'}}><span>{formatPrice(hotel.price)} × {nights} × {rooms}</span><span>{formatPrice(roomPrice)}</span></div>
                  <div className="flex justify-between" style={{color:'var(--text-secondary)'}}><span>Taxes (18% GST)</span><span>{formatPrice(taxes)}</span></div>
                  <div className="flex justify-between font-bold pt-2" style={{borderTop:'1px solid var(--border)', color:'var(--text-primary)'}}><span>Total</span><span>{formatPrice(totalPrice)}</span></div>
                </div>
              )}

              <button onClick={handleBookNow} disabled={nights <= 0} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {nights > 0 ? `Book Now — ${formatPrice(totalPrice)}` : 'Select dates'}
              </button>
              <div className="flex items-center justify-center gap-2 text-[11px] mt-3" style={{color:'var(--text-muted)'}}><FaShieldAlt className="text-green-500" /> Secure payment · Free cancellation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
