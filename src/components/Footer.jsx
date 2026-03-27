import { Link } from 'react-router-dom';
import { FaHotel, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => (
  <footer className="mt-16" style={{background: 'var(--bg-card)', borderTop: '1px solid var(--border)'}}>
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20"><FaHotel className="text-white text-xs" /></div>
            <span className="font-display font-bold text-lg" style={{color:'var(--text-primary)'}}>Quick<span className="text-blue-600">stay</span></span>
          </Link>
          <p className="text-sm leading-relaxed" style={{color:'var(--text-muted)'}}>Discover the best hotels in Mumbai. Book your perfect stay at the best prices.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm" style={{color:'var(--text-primary)'}}>Quick Links</h4>
          <div className="space-y-2">
            {[{to:'/',l:'Home'},{to:'/hotels',l:'Hotels'},{to:'/my-bookings',l:'My Bookings'}].map(x => <Link key={x.to} to={x.to} className="block text-sm hover:text-blue-600 transition-colors" style={{color:'var(--text-muted)'}}>{x.l}</Link>)}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm" style={{color:'var(--text-primary)'}}>Popular Areas</h4>
          <div className="space-y-2">
            {['Colaba','Juhu','Bandra','Andheri','Nariman Point'].map(a => <Link key={a} to={`/hotels?location=${a}`} className="block text-sm hover:text-blue-600 transition-colors" style={{color:'var(--text-muted)'}}>{a}</Link>)}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm" style={{color:'var(--text-primary)'}}>Contact</h4>
          <div className="space-y-2 text-sm" style={{color:'var(--text-muted)'}}>
            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /> Mumbai, India</p>
            <p className="flex items-center gap-2"><FaEnvelope className="text-blue-500" /> hello@quickstay.in</p>
            <p className="flex items-center gap-2"><FaPhone className="text-blue-500" /> +91 98765 43210</p>
          </div>
          <div className="flex gap-3 mt-4">
            {[FaInstagram, FaTwitter, FaFacebook].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all text-sm hover:text-blue-600"
                style={{background:'var(--bg-secondary)', color:'var(--text-muted)'}}><Icon /></a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 text-center text-sm" style={{borderTop:'1px solid var(--border)', color:'var(--text-muted)'}}>© {new Date().getFullYear()} Quickstay. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer;
