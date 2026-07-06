import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Plane, BedDouble, Ticket,
  MapPin, Calendar, ChevronDown, Users,
  MessageCircle, AlertTriangle, Zap, Trophy, Headset, ChevronRight, Star,
  Waves, Utensils, Snowflake, Briefcase, Wifi, PawPrint, Coffee, Car, Accessibility, Shirt, Key, Dumbbell, Bell, TrendingUp, Shield, Lock
} from 'lucide-react';
import { useContentConfig } from '../hooks/useContentConfig';
import { GLOBAL_MAUTIC_FORM } from '../components/GlobalMauticForm';
import type { TrendingPackage } from '../types';
import { getLowestPriceAmount } from '../utils/currency';

// Helper to convert YouTube URL to Embed URL
const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return '';
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) return url;

  let videoId = '';
  if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('embed/')) {
    videoId = url.split('embed/')[1].split('?')[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&modestbranding=1&playlist=${videoId}&rel=0&iv_load_policy=3&disablekb=1` : url;
};

// Helper to fix relative image paths
const fixImgPath = (path: string | undefined) => {
  if (!path) return '';
  path = path.trim();
  if (path.startsWith('//')) return `https:${path}`;
  if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\//.test(path)) return `https://${path}`;
  return `/${path}`;
};

function HeroSlider({ images, title }: { images: string[], title: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {images.map((img, i) => (
        <img
          key={i}
          src={fixImgPath(img)}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out'
          }}
        />
      ))}
    </>
  );
}

const injectScript = (id: string, content: string, target: 'head' | 'body' = 'head') => {
  if (!content) return;
  try {
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.innerHTML = content;
    const scripts = wrapper.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      if (oldScript.innerHTML) newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      if (oldScript.parentNode) oldScript.parentNode.replaceChild(newScript, oldScript);
    });
    if (target === 'head') document.head.appendChild(wrapper);
    else document.body.prepend(wrapper);
  } catch (err) { console.error('Script injection failed:', err); }
};

/* --- Hodômetro (Speedometer) Component --- */
function Speedometer() {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      // Max speed = 350
      setSpeed(Math.min(350, Math.max(0, Math.floor(scrollPercent * 350))));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate rotation (-130deg to +130deg)
  const rotation = -130 + (speed / 350) * 260;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '120px',
      height: '120px',
      background: 'radial-gradient(circle, #002a5c 0%, #00152c 100%)',
      borderRadius: '50%',
      border: '2px solid #004080',
      boxShadow: '0 10px 30px rgba(0,17,36,0.8), inset 0 0 20px rgba(228,60,68,0.2)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    }}>
      {/* Ticks */}
      {[...Array(11)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: i % 2 === 0 ? '4px' : '2px',
          height: i % 2 === 0 ? '12px' : '8px',
          background: i > 7 ? '#F78A2D' : '#555',
          top: '4px',
          left: '50%',
          transformOrigin: '50% 56px',
          transform: `translateX(-50%) rotate(${-130 + (i * 26)}deg)`
        }} />
      ))}
      {/* Needle */}
      <div style={{
        position: 'absolute',
        width: '4px',
        height: '50px',
        background: 'linear-gradient(to top, transparent, #F78A2D)',
        bottom: '50%',
        left: 'calc(50% - 2px)',
        transformOrigin: 'bottom center',
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s ease-out'
      }} />
      {/* Center dot */}
      <div style={{
        position: 'absolute',
        width: '12px',
        height: '12px',
        background: '#F78A2D',
        borderRadius: '50%',
        top: 'calc(50% - 6px)',
        left: 'calc(50% - 6px)',
        boxShadow: '0 0 10px rgba(228,60,68,0.8)'
      }} />

      {/* Speed text */}
      <div style={{ position: 'absolute', bottom: '15px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#fff', lineHeight: '1' }}>{speed}</div>
        <div style={{ fontSize: '10px', fontWeight: 800, color: '#F78A2D', letterSpacing: '1px' }}>KM/H</div>
      </div>
    </div>
  );
}

/* --- Football Kick Animation Component --- */
/* --- Sport Ball Scroll Animation Component --- */
function SportBall({ sport }: { sport: string }) {
  const [rotation, setRotation] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollPercent(pct);
      // Rotaciona 1080 graus (3 voltas completas) ao longo da página
      setRotation(pct * 1080);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '0px' : '30px',
      right: isMobile ? '0px' : '30px',
      width: isMobile ? '300px' : '800px',
      height: isMobile ? '300px' : '800px',
      zIndex: 9999,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {sport === 'tenis' && (
        <img
          src={fixImgPath('raquete.png')}
          alt="Racket"
          style={{
            position: 'absolute',
            width: '60%',
            height: '60%',
            objectFit: 'contain',
            transform: isMobile
              ? 'rotate(0deg) translate(100px, 90px) scale(0.8)'
              : 'rotate(0deg) translate(320px, 270px) scale(0.8)',
            filter: 'drop-shadow(0 15px 35px rgba(0,17,36,0.4))',
            zIndex: -1
          }}
        />
      )}
      {sport === 'futebol' && (
        <img
          src={fixImgPath('jogador.png')}
          alt="Player"
          style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            objectFit: 'contain',
            transform: isMobile
              ? 'translate(110px, 75px) scale(1.0)'
              : 'translate(300px, 200px) scale(1.2)',
            filter: 'drop-shadow(0 15px 45px rgba(0,17,36,0.5))',
            zIndex: -1
          }}
        />
      )}
      {sport === 'basquete' && (
        <img
          src={fixImgPath('basquete_player.png')}
          alt="Basketball Player"
          style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            objectFit: 'contain',
            transform: isMobile
              ? 'translate(130px, 70px) scale(1.2)'
              : 'translate(400px, 170px) scale(1.5)',
            filter: 'drop-shadow(0 15px 45px rgba(0,17,36,0.5))',
            zIndex: -1
          }}
        />
      )}
      {sport === 'automobilismo' && (
        <img
          src={fixImgPath(`img_f1/f1_turnarround_000${Math.min(9, Math.max(0, Math.floor(scrollPercent * 10)))}_Camada-${Math.min(9, Math.max(0, Math.floor(scrollPercent * 10))) + 5}.png`)}
          alt="F1 Car"
          style={{
            position: 'absolute',
            width: '60%',
            height: '60%',
            objectFit: 'contain',
            transform: isMobile
              ? 'translate(70px, 100px) scale(0.8)'
              : 'translate(240px, 320px) scale(0.5)',
            filter: 'drop-shadow(0 15px 45px rgba(0,17,36,0.5))',
            zIndex: -1
          }}
        />
      )}
      {sport === 'lutas' && (
        <img
          src={fixImgPath(`img_lutador/fighter_${Math.min(7, Math.max(1, Math.floor(scrollPercent * 7) + 1))}.png`)}
          alt="Fighter"
          style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            objectFit: 'contain',
            transform: isMobile
              ? 'translate(80px, 80px) scale(0.5)'
              : 'translate(300px, 270px) scale(0.8)',
            filter: 'drop-shadow(0 15px 45px rgba(0,17,36,0.5))',
            zIndex: -1
          }}
        />
      )}
      {sport !== 'lutas' && sport !== 'automobilismo' && (
        <img
          src={fixImgPath(sport === 'tenis' ? 'tenis_ball.png' : sport === 'basquete' ? 'basquete_ball.png' : 'soccer_ball.png')}
          alt={sport === 'tenis' ? 'Tennis Ball' : sport === 'basquete' ? 'Basketball' : 'Soccer Ball'}
          style={{
            width: sport === 'futebol'
              ? (isMobile ? '30px' : '100px')
              : sport === 'tenis'
                ? (isMobile ? '15px' : '40px')
                : (isMobile ? '30px' : '100px'),
            height: sport === 'futebol'
              ? (isMobile ? '30px' : '100px')
              : sport === 'tenis'
                ? (isMobile ? '15px' : '40px')
                : (isMobile ? '30px' : '100px'),
            objectFit: 'contain',
            transform: isMobile
              ? `${sport === 'futebol' ? 'translate(80px, 35px)' : sport === 'tenis' ? 'translate(50px, 100px)' : sport === 'basquete' ? 'translate(65px, -65px)' : ''} rotate(${rotation}deg)`
              : `${sport === 'futebol' ? 'translate(180px, -10px)' : sport === 'tenis' ? 'translate(150px, 260px)' : sport === 'basquete' ? 'translate(160px, -230px)' : ''} rotate(${rotation}deg)`,
            filter: 'drop-shadow(0 10px 30px rgba(0,17,36,0.5))'
          }}
        />
      )}
    </div>
  );
}

/* --- Package Navbar Component --- */
function PackageNavbar({ onBook, isMobile }: { onBook: () => void, isMobile: boolean }) {
  const navigate = useNavigate();
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      width: '100%', position: 'fixed', top: 0, zIndex: 1000,
      background: 'rgba(0, 17, 36, 0.8)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 24, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/conexao_2027_color.png" alt="Conexão Farma 2027" style={{ height: isMobile ? '75px' : '100px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* Links */}
        <div style={{ display: 'none', gap: 32, alignItems: 'center' }} className="md-flex">
          <a href="#comodidades" onClick={scrollTo('comodidades')} style={{ fontSize: 13, fontWeight: 700, color: '#e8edf2', textDecoration: 'none', textTransform: 'uppercase' }} className="nav-link">Comodidades & Serviços</a>
          <a href="#localizacao" onClick={scrollTo('localizacao')} style={{ fontSize: 13, fontWeight: 700, color: '#e8edf2', textDecoration: 'none', textTransform: 'uppercase' }} className="nav-link">Localização</a>
        </div>

        {/* CTA */}
        <button onClick={onBook} style={{
          background: 'linear-gradient(135deg, rgba(247, 138, 45, 0.9), rgba(228, 60, 68, 0.9))', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: isMobile ? '8px 12px' : '10px 20px', fontSize: isMobile ? 11 : 13, fontWeight: 800, cursor: 'pointer',
          textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(247, 138, 45, 0.2)'
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(247, 138, 45, 0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(247, 138, 45, 0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}>
          Reservar Pacote
        </button>
      </div>
      <style>{`
        @media (min-width: 768px) { .md-flex { display: flex !important; } }
        .nav-link:hover { color: #F78A2D !important; }
      `}</style>
    </nav>
  );
}

/* --- DYNAMIC GALLERIES --- */

function GalleryOption2({ images, isMobile, themeColor }: { images: string[], isMobile: boolean, themeColor: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Big Wide Image */}
      <div style={{ width: '100%', height: isMobile ? 300 : 500, borderRadius: 24, overflow: 'hidden', position: 'relative', border: '1px solid #003366' }}>
        {images.map((img, i) => (
          <img 
            key={i} 
            src={fixImgPath(img)} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: i === active ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }} 
            alt="Galeria Ampla" 
          />
        ))}
      </div>
      
      {/* Strip Thumbnails */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
        {images.map((img, i) => (
          <div 
            key={i} 
            onClick={() => setActive(i)}
            style={{ flexShrink: 0, width: isMobile ? 100 : 160, height: isMobile ? 60 : 100, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', border: active === i ? `2px solid ${themeColor}` : '2px solid transparent', transition: 'all 0.3s', opacity: active === i ? 1 : 0.5, transform: active === i ? 'scale(1.02)' : 'scale(1)' }}
          >
            <img src={fixImgPath(img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Strip Thumb ${i}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

const getIconForAmenity = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('piscina') || t.includes('spa') || t.includes('hidromassagem')) return <Waves size={18} color="#10b981" />;
  if (t.includes('restaurante') || t.includes('buffet') || t.includes('alimentação')) return <Utensils size={18} color="#10b981" />;
  if (t.includes('ar condicionado') || t.includes('climatização')) return <Snowflake size={18} color="#10b981" />;
  if (t.includes('reunião') || t.includes('eventos') || t.includes('business')) return <Briefcase size={18} color="#10b981" />;
  if (t.includes('wi-fi') || t.includes('internet') || t.includes('conexão')) return <Wifi size={18} color="#10b981" />;
  if (t.includes('animais') || t.includes('pet')) return <PawPrint size={18} color="#10b981" />;
  if (t.includes('café') || t.includes('cafe')) return <Coffee size={18} color="#10b981" />;
  if (t.includes('estacionamento') || t.includes('valet') || t.includes('manobrista')) return <Car size={18} color="#10b981" />;
  if (t.includes('acessibilidade') || t.includes('cadeirantes')) return <Accessibility size={18} color="#10b981" />;
  if (t.includes('lavanderia') || t.includes('roupa')) return <Shirt size={18} color="#10b981" />;
  if (t.includes('check-in') || t.includes('check-out') || t.includes('recepção') || t.includes('instalações para')) return <Key size={18} color="#10b981" />;
  if (t.includes('academia') || t.includes('fitness') || t.includes('ginástica')) return <Dumbbell size={18} color="#10b981" />;
  return <CheckCircle2 size={18} color="#10b981" />;
};

function ComodidadesDetailSection({ pkg, opcoes, isMobile }: { pkg: any, opcoes: any[], isMobile: boolean }) {
  if (!opcoes || opcoes.length === 0) return null;

  const currencyCode = pkg.currency || "BRL";
  const currencySymbols: Record<string, string> = {
    BRL: 'R$', USD: '$', EUR: '€', GBP: '£', ARS: '$', CLP: '$', COP: '$', MXN: '$',
    PYG: '₲', UYU: '$U', PEN: 'S/', BOB: 'Bs', VES: 'Bs.S', JPY: '¥', CNY: '¥', 
    AUD: 'A$', CAD: 'C$', CHF: 'Fr', AED: 'د.إ', QAR: '﷼', SAR: '﷼', ZAR: 'R', 
    INR: '₹', KRW: '₩', SGD: 'S$', HKD: 'HK$', NZD: 'NZ$', NOK: 'kr', SEK: 'kr', 
    DKK: 'kr', PLN: 'zł'
  };
  const moeda = currencySymbols[currencyCode] || currencyCode;

  const formatPriceVal = (val: string) => {
    if (!val) return '';
    const strVal = val.toString().trim();
    if (strVal.includes(',') || strVal.includes('.')) {
      return strVal;
    }
    const digits = strVal.replace(/\D/g, '');
    if (!digits) return strVal;
    const num = parseInt(digits, 10);
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  };

  let cats: any[] = [];
  try { cats = JSON.parse(pkg.roomCategories || '[]'); } catch {}
  if (!Array.isArray(cats)) cats = [];

  if (cats.length === 0 && (pkg.price || pkg.priceDouble)) {
     if (pkg.price) {
        const nights = parseInt(pkg.minNights || '0');
        const fallback = nights > 0 ? (parseFloat(pkg.price.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '')) / nights) : null;
        const finalDaily = pkg.dailyRateOverride || (fallback ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(fallback) : null);
        cats.push({ name: 'Valor Individual (Pacote)', price: pkg.price, overrideLabel: finalDaily ? 'equivale a' : '', overridePrice: finalDaily ? `${moeda} ${finalDaily} / diária` : '', tag: 'Alta Demanda' });
     }
     if (pkg.priceDouble) {
        const fallback = parseFloat(pkg.priceDouble.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '')) / 2;
        const finalPP = pkg.doublePerPersonOverride || (fallback ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(fallback) : null);
        cats.push({ name: 'Valor Duplo (Pacote)', price: pkg.priceDouble, overrideLabel: finalPP ? 'equivale a' : '', overridePrice: finalPP ? `${moeda} ${finalPP} / pessoa` : '', tag: 'Últimas Vagas' });
     }
  }

  const renderOpcao = (op: any, index: number) => {
    const nome = op.nome || "COMODIDADES & SERVIÇOS";
    const inclusos = op.inclusos || [];

    return (
      <div key={index} style={{ marginBottom: index < opcoes.length - 1 ? 60 : 0 }}>
        <h3 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontFamily: '"Outfit", sans-serif', fontWeight: 600, margin: '0 0 32px', color: '#fff', borderBottom: '1px solid #003366', paddingBottom: 24 }}>
          <span style={{ color: '#F78A2D' }}>{nome}</span>
        </h3>

        <div>
          {inclusos.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {inclusos.map((inc: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ marginTop: 2, flexShrink: 0 }}>
                    {getIconForAmenity(inc.titulo || '')}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#eee' }}>{inc.titulo}</div>
                    {inc.descricao && <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{inc.descricao}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 24, marginTop: 16, marginBottom: 16, alignItems: 'stretch' }}>
      
      <div style={{ flex: 1, background: '#001a36', padding: isMobile ? '40px 20px' : '60px 40px', borderRadius: 32, border: '1px solid #003366', display: 'flex', flexDirection: 'column' }}>
        {opcoes.map(renderOpcao)}
      </div>

      {cats.length > 0 && (
        <div style={{ width: isMobile ? '100%' : '360px', flexShrink: 0, background: '#00152c', borderRadius: 32, padding: isMobile ? '40px 20px' : '40px', border: '1px solid #003366', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888', margin: '0 0 32px', textAlign: 'center' }}>A partir de:</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {cats.map((cat, idx) => (
              <div key={idx} style={{ paddingBottom: idx < cats.length - 1 ? 32 : 0, borderBottom: idx < cats.length - 1 ? '1px solid #002a5c' : 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: '#aaa', marginBottom: 8, width: '100%', textAlign: 'center', fontWeight: 600 }}>{cat.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#F78A2D' }}>{moeda}</span>
                  <span style={{ fontSize: 32, fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#fff' }}>{formatPriceVal(cat.price)}</span>
                </div>
                {cat.overridePrice && (
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{cat.overrideLabel} <strong>{cat.overridePrice}</strong></div>
                )}
                {cat.tag && (
                  <div style={{ display: 'inline-block', background: 'rgba(247, 138, 45, 0.1)', color: '#F78A2D', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {cat.tag.toLowerCase().includes('vaga') ? '⏰' : '🔥'} {cat.tag}
                  </div>
                )}
              </div>
            ))}

            {(pkg.minNights || pkg.validFrom || pkg.validTo) && (
              <div style={{ marginTop: 8, padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
                  <AlertTriangle size={16} color="#F78A2D" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#F78A2D', textTransform: 'uppercase' }}>Regras da Tarifa</span>
                </div>
                <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5, textAlign: 'center' }}>
                  {pkg.minNights && <div style={{ marginBottom: 4 }}>Estadia mínima de {pkg.minNights} {parseInt(pkg.minNights) === 1 ? 'noite' : 'noites'}.</div>}
                  {(pkg.validFrom || pkg.validTo) && (
                    <div>
                      Válida {pkg.validFrom && `de ${pkg.validFrom.split('-').reverse().join('/')}`} {pkg.validTo && `até ${pkg.validTo.split('-').reverse().join('/')}`}.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function SurroundingsDisplaySection({ pkg, isMobile }: { pkg: any, isMobile: boolean }) {
  if (!pkg.surroundingsData) return null;
  let places = [];
  try { places = JSON.parse(pkg.surroundingsData).filter((p: any) => p.selected); } catch(e) { return null; }
  if (places.length === 0) return null;

  const categories = Array.from(new Set(places.map((p: any) => p.category)));

  const getCategoryIcon = (cat: string) => {
    if (cat === 'Restaurantes e cafés') return <Utensils size={18} color="#F78A2D" />;
    if (cat === 'Principais atrações') return <MapPin size={18} color="#F78A2D" />;
    if (cat === 'Aeroportos mais próximos') return <Plane size={18} color="#F78A2D" />;
    if (cat === 'Transporte público') return <Car size={18} color="#F78A2D" />;
    return <Star size={18} color="#F78A2D" />;
  };

  return (
    <div style={{ width: '100%', background: '#00152c', padding: isMobile ? '32px 20px' : '40px', borderRadius: 32, border: '1px solid #003366', marginTop: 40 }}>
      <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontFamily: '"Outfit", sans-serif', fontWeight: 600, margin: '0 0 32px', color: '#fff' }}>
        Proximidades do <span style={{ color: '#F78A2D' }}>hotel</span>
      </h3>
      
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 40, flexWrap: 'wrap' }}>
        {categories.map((cat, i) => (
          <div key={i} style={{ flex: '1 1 300px' }}>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#eee', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              {getCategoryIcon(cat as string)} {cat as string}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {places.filter((p: any) => p.category === cat).map((p: any, j: number) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #002a5c', paddingBottom: 8 }}>
                  <span style={{ fontSize: 14, color: '#aaa', paddingRight: 16 }}>{p.name}</span>
                  <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, flexShrink: 0 }}>{p.distance}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* Repertório de notificações. Mensagens com returningOnly só aparecem
   para visitantes identificados que retornam em uma nova sessão. */
const SCARCITY_MESSAGES: { id: number; text: string; icon: 'bell' | 'trending'; returningOnly?: boolean }[] = [
  { id: 1, text: 'Um pacote Duplo Premium acabou de ser reservado.', icon: 'bell' },
  { id: 2, text: 'Alta demanda: restam poucas vagas neste hotel.', icon: 'trending' },
  { id: 3, text: '4 pacotes vendidos nas últimas 2 horas.', icon: 'trending' },
  { id: 4, text: 'Um novo hóspede corporativo garantiu seu pacote.', icon: 'bell' },
  { id: 5, text: 'Uma empresa de São Paulo reservou 2 quartos agora há pouco.', icon: 'bell' },
  { id: 6, text: '12 pessoas estão vendo este pacote neste momento.', icon: 'trending' },
  { id: 7, text: 'Reserva confirmada: Quarto Individual para o Conexão Farma 2027.', icon: 'bell' },
  { id: 8, text: 'As reservas deste hotel aumentaram 30% esta semana.', icon: 'trending' },
  { id: 9, text: 'Um visitante acabou de solicitar cotação para este hotel.', icon: 'bell' },
  { id: 10, text: 'Quartos Duplos são os mais procurados neste momento.', icon: 'trending' },
  { id: 11, text: 'Nova reserva recebida há poucos minutos.', icon: 'bell' },
  { id: 12, text: 'Este hotel está entre os mais reservados do evento.', icon: 'trending' },
  { id: 13, text: 'Um grupo corporativo consultou disponibilidade agora mesmo.', icon: 'bell' },
  { id: 14, text: 'Últimas unidades na categoria mais econômica.', icon: 'trending' },
  { id: 15, text: 'Desde sua última visita, novas reservas foram confirmadas neste hotel.', icon: 'bell', returningOnly: true },
  { id: 16, text: 'Você voltou em boa hora: ainda há disponibilidade neste hotel.', icon: 'bell', returningOnly: true },
  { id: 17, text: 'A disponibilidade diminuiu desde seu último acesso.', icon: 'trending', returningOnly: true },
  { id: 18, text: 'Este hotel segue entre os mais procurados desde sua última visita.', icon: 'trending', returningOnly: true },
];

const VISITOR_KEY = 'emais_visitor';

function ScarcityToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [iconType, setIconType] = useState<'bell' | 'trending'>('bell');

  useEffect(() => {
    // ── Identificação do visitante entre sessões (localStorage) ──
    let profile: { id: string; visits: number; shown: number[] };
    try {
      profile = JSON.parse(localStorage.getItem(VISITOR_KEY) || 'null');
    } catch { profile = null as any; }
    if (!profile || !Array.isArray(profile.shown)) {
      profile = {
        id: (crypto as any).randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
        visits: 0,
        shown: [],
      };
    }
    // Cada nova sessão do navegador conta como uma nova visita
    if (!sessionStorage.getItem('emais_visit_counted')) {
      profile.visits += 1;
      sessionStorage.setItem('emais_visit_counted', '1');
    }
    localStorage.setItem(VISITOR_KEY, JSON.stringify(profile));

    const isReturning = profile.visits > 1;
    const pool = SCARCITY_MESSAGES.filter(m => !m.returningOnly || isReturning);

    let cancelled = false;
    let hideTimer: number | undefined;
    let nextTimer: number | undefined;

    // Sorteia sempre uma mensagem ainda não vista por esse visitante
    // (histórico persiste entre sessões; zera quando o repertório esgota)
    const pickMessage = () => {
      let unseen = pool.filter(m => !profile.shown.includes(m.id));
      if (unseen.length === 0) {
        profile.shown = profile.shown.filter(id => !pool.some(m => m.id === id));
        unseen = pool;
      }
      const msg = unseen[Math.floor(Math.random() * unseen.length)];
      profile.shown.push(msg.id);
      localStorage.setItem(VISITOR_KEY, JSON.stringify(profile));
      return msg;
    };

    const showToast = () => {
      if (cancelled) return;
      const msg = pickMessage();
      setMessage(msg.text);
      setIconType(msg.icon);
      setIsVisible(true);
      hideTimer = window.setTimeout(() => setIsVisible(false), 7000);
      // Intervalo randômico entre notificações: 50s a 100s
      nextTimer = window.setTimeout(showToast, 50000 + Math.random() * 50000);
    };

    // Primeira notificação: entre 8s e 15s após carregar
    nextTimer = window.setTimeout(showToast, 8000 + Math.random() * 7000);

    return () => {
      cancelled = true;
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: isVisible ? '30px' : '-100px',
      right: '30px',
      background: 'rgba(0, 17, 36, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(247, 138, 45, 0.3)',
      padding: '16px 24px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 15px 40px rgba(0,17,36,0.8), 0 0 20px rgba(247, 138, 45, 0.1)',
      transition: 'bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s',
      opacity: isVisible ? 1 : 0,
      zIndex: 99999,
      maxWidth: '350px'
    }}>
      <div style={{
        background: 'rgba(247, 138, 45, 0.1)',
        padding: '10px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {iconType === 'trending' ? <TrendingUp size={20} color="#F78A2D" /> : <Bell size={20} color="#F78A2D" />}
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#F78A2D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Atualização ao Vivo</div>
        <div style={{ fontSize: '14px', color: '#fff', lineHeight: '1.4', fontFamily: '"Outfit", sans-serif', fontWeight: 500 }}>{message}</div>
      </div>
    </div>
  );
}

export default function PackageLP() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { packages, loading } = useContentConfig();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [pkg, setPkg] = useState<TrendingPackage | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // Para a seção de Programação
  const mauticContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading && packages.length > 0) {
      const index = Number(id);
      const p = packages[index];
      if (!p) { setNotFound(true); return; }
      if (p.status !== 'approved' && !localStorage.getItem('emais_marketing_auth')) {
        navigate('/');
        return;
      }
      setPkg(p);
      setNotFound(false);
      if (p.title) document.title = `${p.title} | Conexão Farma 2027 - ABRADILAN`;
      if (p.trackingScriptHead) injectScript('lp-tracking-head', p.trackingScriptHead, 'head');
      if (p.trackingScriptBody) injectScript('lp-tracking-body', p.trackingScriptBody, 'body');
      return () => {
        document.getElementById('lp-tracking-head')?.remove();
        document.getElementById('lp-tracking-body')?.remove();
      };
    } else if (!loading && packages.length === 0) {
      setNotFound(true);
    }
  }, [id, packages, loading, navigate]);

  // --- MAUTIC LOGIC (Preserved) ---
  useEffect(() => {
    // Pacotes podem ter mauticFormCode salvo com a nomenclatura antiga — normaliza em runtime
    const formCode = (pkg?.mauticFormCode || GLOBAL_MAUTIC_FORM)
      .replaceAll('Distribuidor Não Autorizado', 'Distribuidor Não Associado')
      .replaceAll('Distribuidor Autorizado', 'Distribuidor Associado');
    if (formCode && mauticContainerRef.current) {
      mauticContainerRef.current.innerHTML = formCode;
      const form = mauticContainerRef.current.querySelector('form');
      if (!form) return;
      const formName = form.getAttribute('data-mautic-form') || '';

      // @ts-ignore
      window.MauticDomain = 'https://mkt.maiscorporativo.tur.br';
      // @ts-ignore
      if (typeof window.MauticLang === 'undefined') { window.MauticLang = { submittingMessage: 'Enviando...' }; }
      // @ts-ignore
      if (typeof window.MauticFormCallback === 'undefined') { window.MauticFormCallback = {}; }

      // @ts-ignore
      window.MauticFormCallback[formName] = {
        onResponse: function (response: any) {
          if (response.success) {
            handleFormSuccess();
          } else {
            setSubmitting(false);
          }
        }
      };

      const handleFormSuccess = () => {
        if (pkg.webhookClint || pkg.webhookClintSegments) {
          const clintData = new URLSearchParams();
          const inputs = form.querySelectorAll('input, select, textarea');
          inputs.forEach((input: any) => {
            const nameAttr = input.getAttribute('name');
            const nameMatch = nameAttr ? nameAttr.match(/mauticform\[(.*?)\]/) : null;

            if (nameMatch) {
              const fieldName = nameMatch[1];
              if (['formId', 'return', 'formName'].includes(fieldName)) return;

              if (input.type === 'radio') {
                if (input.checked) clintData.append(fieldName, input.value);
              } else if (input.type === 'checkbox') {
                if (input.checked) clintData.append(fieldName, input.value);
              } else {
                clintData.append(fieldName, input.value || '');
              }
            }
          });

          clintData.append('pacote_lp', pkg.title);
          const hotelStr = pkg.title + (pkg.tag ? ' - ' + pkg.tag : '');
          clintData.append('hotel', hotelStr);

          let targetWebhook = pkg.webhookClint;
          try {
            const segs = JSON.parse(pkg.webhookClintSegments || '{}');
            const selectedSegment = clintData.get('pacote'); // Extract the 'pacote' form field value
            // Configurações antigas podem ter as chaves com a nomenclatura anterior
            const legacyKeys: Record<string, string> = {
              'Distribuidor Associado': 'Distribuidor Autorizado',
              'Distribuidor Não Associado': 'Distribuidor Não Autorizado',
            };
            if (selectedSegment && typeof selectedSegment === 'string') {
              const segUrl = segs[selectedSegment] || segs[legacyKeys[selectedSegment] || ''];
              if (segUrl) targetWebhook = segUrl;
            }
          } catch (e) {
            console.error('Erro webhook segments', e);
          }

          const utms = JSON.parse(sessionStorage.getItem('emais_utms') || '{}');
          const utmString = Object.entries(utms).map(([k, v]) => `${k}=${v}`).join(' | ');
          const origemFinal = utmString ? `Landing Page Experiência | UTMs: ${utmString}` : 'Landing Page Experiência';
          clintData.append('origem_lead', origemFinal);
          clintData.append('url_conversao', window.location.href);

          if (targetWebhook) {
            fetch(targetWebhook, {
              method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: clintData.toString()
            }).catch(e => console.error('Erro Clint:', e));
          }
        }
        setShowSuccess(true);
        if (pkg.redirectUrl) {
          setTimeout(() => { window.location.href = pkg.redirectUrl!; }, 1500);
        }
      }

      const observer = new MutationObserver(() => {
        const errorMsg = mauticContainerRef.current?.querySelector('.mauticform-error');
        const successMsg = mauticContainerRef.current?.querySelector('.mauticform-message');
        if (errorMsg && errorMsg.innerHTML.trim().length > 0) setSubmitting(false);
        if (successMsg && successMsg.innerHTML.trim().length > 0 && !showSuccess) handleFormSuccess();
      });

      if (mauticContainerRef.current) observer.observe(mauticContainerRef.current, { childList: true, subtree: true, characterData: true });

      if (!document.getElementById('mautic-sdk-script')) {
        const sc = document.createElement('script');
        sc.id = 'mautic-sdk-script';
        sc.src = 'https://mkt.maiscorporativo.tur.br/media/js/mautic-form.js';
        sc.onload = () => { if ((window as any).MauticSDK) (window as any).MauticSDK.onLoad(); };
        document.head.appendChild(sc);
      } else { if ((window as any).MauticSDK) (window as any).MauticSDK.onLoad(); }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.addEventListener('click', () => {
          setTimeout(() => {
            const hasErrors = form.querySelectorAll('.mauticform-has-error').length > 0;
            if (form.checkValidity() && !hasErrors) setSubmitting(true);
          }, 100);
        });
      }

      let iframe = document.getElementById('mautic_hidden_iframe') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'mautic_hidden_iframe';
        iframe.name = 'mautic_hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }
      form.setAttribute('target', 'mautic_hidden_iframe');

      setTimeout(() => {
        const pForm = mauticContainerRef.current?.querySelector('form');
        const pageWrapper = mauticContainerRef.current?.querySelector('.mauticform-page-wrapper') || mauticContainerRef.current?.querySelector('.mauticform-innerform');
        if (pForm && pageWrapper) {
          const tipoQuartoField = pForm.querySelector('div[data-validate="tipo_quarto"]');
          const qtdPessoasField = pForm.querySelector('div[data-validate="qtd_pessoas"]');
          if (tipoQuartoField && qtdPessoasField) {
             qtdPessoasField.parentNode?.insertBefore(tipoQuartoField, qtdPessoasField);
          }

          const rows = Array.from(pageWrapper.querySelectorAll('.mauticform-row:not(.mauticform-button-wrapper):not(.mauticform-radiogrp)'));
          for (let i = 0; i < rows.length; i += 2) {
            if (rows[i] && rows[i + 1]) {
              const gridRow = document.createElement('div');
              gridRow.className = 'mauticform-grid-row';
              rows[i].parentNode?.insertBefore(gridRow, rows[i]);
              gridRow.appendChild(rows[i]);
              gridRow.appendChild(rows[i + 1]);
            }
          }
          const radioGroups = pForm.querySelectorAll('.mauticform-radiogrp');
          radioGroups.forEach(group => {
            const options = group.querySelector('.mauticform-radiogrp-options') || group;
            options.classList.add('horizontal');
          });

          // --- Dynamic Room Categories Injection ---
          const roomRadioGrp = pForm.querySelector('div[data-validate="tipo_quarto"]');
          if (roomRadioGrp) {
            let cats: any[] = [];
            try { cats = JSON.parse(pkg.roomCategories || '[]'); } catch {}
            if (!Array.isArray(cats)) cats = [];

            if (cats.length === 0 && (pkg.price || pkg.priceDouble)) {
               if (pkg.price) cats.push({ name: 'Quarto Individual' });
               if (pkg.priceDouble) cats.push({ name: 'Quarto Duplo' });
            }

            if (cats.length > 0) {
              const existingRows = roomRadioGrp.querySelectorAll('.mauticform-radiogrp-row');
              existingRows.forEach(row => row.remove());
              
              const errorMsg = roomRadioGrp.querySelector('.mauticform-errormsg');
              const wrapperToAppend = roomRadioGrp.querySelector('.mauticform-radiogrp-options') || roomRadioGrp;

              cats.forEach((cat, index) => {
                 const safeName = cat.name.replace(/[^a-zA-Z0-9]/g, '');
                 const inputId = `mauticform_radiogrp_radio_tipo_quarto_dyn_${safeName}${index}`;
                 
                 const row = document.createElement('div');
                 row.className = 'mauticform-radiogrp-row';
                 row.innerHTML = `<input name="mauticform[tipo_quarto]" class="mauticform-radiogrp-radio" id="${inputId}" type="radio" value="${cat.name}">
                                  <label id="mauticform_radiogrp_label_tipo_quarto_dyn_${safeName}${index}" for="${inputId}" class="mauticform-radiogrp-label">${cat.name}</label>`;
                 
                 if (errorMsg && wrapperToAppend === roomRadioGrp) {
                    wrapperToAppend.insertBefore(row, errorMsg);
                 } else {
                    wrapperToAppend.appendChild(row);
                 }
              });
            }
          }
        }
      }, 500);
    }
  }, [pkg]);
  // --- END MAUTIC LOGIC ---

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#00152c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ width: 48, height: 48, border: '4px solid #002042', borderTopColor: '#F78A2D', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (showSuccess) return <SuccessSection redirectUrl={pkg?.redirectUrl} />;

  if (notFound || !pkg) return (
    <div style={{ minHeight: '100vh', background: '#00152c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 20 }}>
      <AlertTriangle size={64} color="#F78A2D" style={{ marginBottom: 24 }} />
      <h1 style={{ fontSize: 32, fontFamily: '"Outfit", sans-serif', fontWeight: 600 }}>Pacote indisponível</h1>
      <button onClick={() => navigate('/')} style={{ background: '#F78A2D', color: '#001124', fontWeight: 800, padding: '12px 32px', borderRadius: 8, marginTop: 24, cursor: 'pointer', border: 'none' }}>Voltar para Home</button>
    </div>
  );

  // Parse JSON data safely
  const parseJSON = (data: any, fallback: any) => {
    if (!data) return fallback;
    try { return JSON.parse(data); } catch { return fallback; }
  };

  const programacao = parseJSON(pkg.programacaoData, [
    { dia: 'SEXTA', data: '22 de maio', descricao: 'Acesso VIP aos treinos livres e atividades no paddock.' },
    { dia: 'SÁBADO', data: '23 de maio', descricao: 'Acompanhe a qualificação com vista privilegiada.' },
    { dia: 'DOMINGO', data: '24 de maio', descricao: 'O grande dia da corrida. Acesso premium e hospitalidade.' }
  ]);



  const cards = parseJSON(pkg.cardsData, [
    { titulo: 'Experiência Completa', descricao: 'Ingressos, hospedagem e transporte tudo em um único pacote cuidadosamente planejado.', icone: 'Zap' },
    { titulo: 'Acesso Exclusivo', descricao: 'Áreas VIP, encontros com pilotos e experiências que não estão disponíveis ao público.', icone: 'Trophy' },
    { titulo: 'Suporte 24/7', descricao: 'Nossa equipe está disponível antes, durante e após o evento para garantir sua satisfação.', icone: 'Headset' }
  ]);

  let pacotesData: any[] = [];
  try {
    const parsed = JSON.parse(pkg.pacotesOptionsData || '{}');
    if (parsed.opcoes_hospedagem && Array.isArray(parsed.opcoes_hospedagem)) pacotesData = parsed.opcoes_hospedagem;
    else if (Array.isArray(parsed)) pacotesData = parsed;
  } catch (e) { }

  const sport = pkg.sportType || 'automobilismo';

  const theme = {
    primary: '#F78A2D',
    accent: sport === 'automobilismo' ? 'rgba(228,60,68,0.15)' :
      sport === 'futebol' ? 'rgba(34,197,94,0.15)' :
        sport === 'tenis' ? 'rgba(234,88,12,0.15)' :
          sport === 'lutas' ? 'rgba(220,38,38,0.2)' :
            'rgba(59,130,246,0.15)',
    heroTitle: sport === 'automobilismo' ? 'Seu lugar no grid' :
      sport === 'futebol' ? 'Viva a paixão do estádio' :
        sport === 'tenis' ? 'A emoção da quadra central' :
          sport === 'basquete' ? 'Sinta a energia da quadra' :
            sport === 'lutas' ? 'No coração do octógono' :
              'A melhor experiência esportiva',
    defaultTag: sport === 'automobilismo' ? '110ª EDIÇÃO' : 'EVENTO EXCLUSIVO'
  };

  return (
    <div style={{ background: '#00152c', color: '#fff', fontFamily: 'Montserrat, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>
      <ScarcityToast />
      <PackageNavbar onBook={() => document.getElementById('conversion-section')?.scrollIntoView({ behavior: 'smooth' })} isMobile={isMobile} />

      {/* --- HERO SECTION --- */}
      {/* --- HERO SECTION --- */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 100, paddingBottom: 40 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          {pkg.heroType === 'image' || (!pkg.videoUrl && pkg.heroImage) ? (
            <HeroSlider images={(pkg.heroImage || pkg.img)?.split(';').map(s => s.trim()).filter(Boolean) || []} title={pkg.title} />
          ) : pkg.videoUrl ? (
            <div style={{ width: '100%', height: '100%', position: 'relative', background: '#00152c' }}>
              <img src={fixImgPath(pkg.img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: -1, opacity: 0.5 }} />
              {pkg.videoUrl.includes('youtube.com') || pkg.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={getYoutubeEmbedUrl(pkg.videoUrl)}
                  style={{ width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
                  frameBorder="0" allow="autoplay; encrypted-media"
                />
              ) : (
                <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                  <source src={pkg.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          ) : (
            <HeroSlider images={(pkg.heroImage || pkg.img)?.split(';').map(s => s.trim()).filter(Boolean) || []} title={pkg.title} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,17,36,0.4) 0%, rgba(0,21,44,1) 100%)' }} />
        </div>

        <div className="container animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: 1000, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: theme.primary, letterSpacing: '0.15em' }}>{pkg.tag || theme.defaultTag}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontFamily: '"Outfit", sans-serif', fontWeight: 600, lineHeight: 1.1, margin: '0 0 24px', textShadow: '0 10px 40px rgba(0,17,36,0.5)' }}>
            {pkg.title || theme.heroTitle}
          </h1>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', lineHeight: 1.6, color: '#ccc', maxWidth: 650, margin: '0 auto', fontWeight: 400 }}>
            {pkg.heroSubtitle || pkg.description || 'Uma experiência inesquecível com todo o conforto, segurança e serviços premium que você merece.'}
          </p>
        </div>

        <div style={{ width: '100%', padding: '0 20px', zIndex: 10, marginTop: 50 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px 20px' }}>
            {[
              { titulo: 'PACOTES DE HOSPEDAGEM', valor: `A partir de ${getLowestPriceAmount(pkg)}`, icone: <Ticket size={24} color="#F78A2D" />, badgeImg: pkg.badgeImg },
              { titulo: 'Café da Manhã', valor: pkg.breakfast, icone: <Coffee size={24} color="#F78A2D" /> },
              { titulo: 'Deslocamento', valor: pkg.distanceCenterNorte, icone: <MapPin size={24} color="#F78A2D" /> },
              { titulo: 'Salas', valor: pkg.trainingRooms, icone: <Briefcase size={24} color="#F78A2D" /> },
              { titulo: 'Estacionamento', valor: pkg.parking, icone: <Car size={24} color="#F78A2D" /> }
            ].filter(c => c.valor).map((c: any, i: number) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'flex-start', gap: 12, textShadow: '0 2px 10px rgba(0,17,36,0.8)',
                flex: '1 1 0', minWidth: 160, maxWidth: 220
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 2px 4px rgba(0,17,36,0.8))', marginTop: 2, flexShrink: 0 }}>
                  {c.icone}
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, margin: 0, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>{c.titulo}</h3>
                  <p style={{ color: '#eee', margin: '4px 0 0 0', fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{c.valor}</p>
                  {c.badgeImg && (
                    <img
                      src={c.badgeImg}
                      alt={pkg.badge || 'Selo do pacote'}
                      style={{ width: 100, height: 'auto', marginTop: 8, borderRadius: 4, filter: 'drop-shadow(0 2px 6px rgba(0,17,36,0.6))' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', zIndex: 10, position: 'relative' }}>
          <div 
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
            style={{ 
              width: 32, height: 50, border: '2px solid rgba(255, 255, 255, 0.4)', borderRadius: 20, 
              display: 'flex', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 0.3s'
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
          >
            <div style={{
              width: 4, height: 8, background: '#fff', borderRadius: 4, marginTop: 8,
              animation: 'mouseScroll 1.5s infinite cubic-bezier(0.15, 0.41, 0.69, 0.94)'
            }} />
          </div>
          <style>{`
            @keyframes mouseScroll {
              0% { opacity: 1; transform: translateY(0); }
              100% { opacity: 0; transform: translateY(16px); }
            }
          `}</style>
        </div>
      </section>

      {/* --- SOBRE O HOTEL --- */}
      <section id="comodidades" style={{ padding: '0 20px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 20, marginTop: '30px', marginBottom: '30px' }}>
        {pkg.hotelDescription && (
          <div style={{ padding: '40px', background: '#001a36', borderRadius: 16, border: '1px solid #003366' }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Star size={24} color="#F78A2D" /> Sobre o Hotel
            </h3>
            <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>{pkg.hotelDescription}</p>
          </div>
        )}
      </section>



      {/* --- COMODIDADES & SERVIÇOS DETALHADOS --- */}
      <section style={{ padding: '0 20px', maxWidth: 1200, margin: '0 auto', marginBottom: '16px' }}>
        <ComodidadesDetailSection pkg={pkg} opcoes={pacotesData} isMobile={isMobile} />
      </section>

      {/* --- GALERIA DE FOTOS --- */}
      {pkg.galleryImages && pkg.galleryImages.trim() !== '' && (
        <section id="galeria" style={{ padding: isMobile ? '30px 20px' : '40px 20px', background: '#00152c', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: '"Outfit", sans-serif', fontWeight: 600, margin: '0 0 8px' }}>
              <span style={{ color: '#F78A2D' }}>Estrutura</span>
            </h2>
            <p style={{ fontSize: 16, color: '#aaa', margin: '0 0 40px' }}>Conheça os detalhes das acomodações e áreas comuns.</p>

            <GalleryOption2 images={pkg.galleryImages.split(';').filter(Boolean).map(s => s.trim())} isMobile={isMobile} themeColor="#F78A2D" />

          </div>
        </section>
      )}



      {/* --- PARCERIA --- */}
      <section style={{ padding: isMobile ? '30px 20px' : '40px 20px', background: '#002042', borderTop: '1px solid #003366', borderBottom: '1px solid #003366', textAlign: 'center' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#F78A2D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Realizado por:</p>
          <h2 style={{ fontSize: isMobile ? '2rem' : 'clamp(2.5rem, 4vw, 3.5rem)', fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: '#fff', margin: '0 0 16px' }}>Uma Parceria de Referência</h2>
          <p style={{ fontSize: isMobile ? 15 : 18, color: '#aaa', maxWidth: 700, margin: '0 auto 40px', lineHeight: 1.6 }}>
            Duas instituições unidas para garantir a sua melhor experiência na maior feira de saúde e bem-estar do Brasil.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30, textAlign: 'left' }}>

            {/* Card Mais Corporativo */}
            <div style={{ background: '#00152c', border: '1px solid #003366', borderRadius: 24, padding: '40px', display: 'flex', flexDirection: 'column', transition: 'border-color 0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#F78A2D'} onMouseOut={e => e.currentTarget.style.borderColor = '#003366'}>
              <img src="/logo_mais.png" alt="Mais Corporativo" style={{ height: 65, objectFit: 'contain', marginBottom: 24, alignSelf: 'flex-start' }} />
              <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.6, flex: 1, marginBottom: 32 }}>
                Especialistas em viagens e experiências corporativas de alto padrão. Do planejamento ao retorno, cuidamos de cada detalhe para que você viva momentos inesquecíveis com segurança e conforto.
              </p>
              <div style={{ alignSelf: 'flex-start', background: 'rgba(247,138,45,0.1)', border: '1px solid rgba(247,138,45,0.2)', color: '#F78A2D', padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Agência Oficial
              </div>
            </div>

            {/* Card Abradilan */}
            <div style={{ background: '#00152c', border: '1px solid #003366', borderRadius: 24, padding: '40px', display: 'flex', flexDirection: 'column', transition: 'border-color 0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#F78A2D'} onMouseOut={e => e.currentTarget.style.borderColor = '#003366'}>
              <img src="/abradilan_logo_color.png" alt="Abradilan" style={{ height: 50, objectFit: 'contain', marginBottom: 24, alignSelf: 'flex-start' }} />
              <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.6, flex: 1, marginBottom: 32 }}>
                A Abradilan reúne distribuidoras de medicamentos e produtos para a saúde. Tem como missão fortalecer o mercado, promovendo a melhoria contínua e eficaz de seus serviços.
              </p>
              <div style={{ alignSelf: 'flex-start', background: 'rgba(247,138,45,0.1)', border: '1px solid rgba(247,138,45,0.2)', color: '#F78A2D', padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Organização
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- MAPA DE LOCALIZAÇÃO --- */}
      {pkg.mapAddress && pkg.mapAddress.trim() !== '' && (
        <section id="localizacao" style={{ padding: isMobile ? '30px 20px' : '40px 20px', background: '#001a36', borderTop: '1px solid #003366' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: '"Outfit", sans-serif', fontWeight: 600, margin: '0 0 8px' }}>
              <span style={{ color: '#F78A2D' }}>Localização</span>
            </h2>
            <p style={{ fontSize: 16, color: '#aaa', margin: '0 auto 40px', maxWidth: 600 }}>Confira no mapa todas as comodidades no entorno do hotel.</p>
            
            <div style={{ width: '100%', height: 400, borderRadius: 24, overflow: 'hidden', border: '1px solid #003366', background: '#002042' }}>
              {pkg.mapAddress.includes('<iframe') ? (
                <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: pkg.mapAddress }} />
              ) : (
                <iframe
                  title="Localização"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(pkg.mapAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                />
              )}
            </div>

            <div style={{ textAlign: 'left', marginTop: 40 }}>
              <SurroundingsDisplaySection pkg={pkg} isMobile={isMobile} />
            </div>

          </div>
        </section>
      )}

      {/* --- CONVERSION / FORM SECTION --- */}
      <section id="conversion-section" style={{ padding: '60px 20px', background: '#001a36', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: 1, background: 'linear-gradient(to right, transparent, #F78A2D, transparent)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: isMobile ? 40 : 80, alignItems: 'flex-start' }}>
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h2 style={{ fontSize: isMobile ? '2.5rem' : 'clamp(2.5rem, 5vw, 4rem)', fontFamily: '"Outfit", sans-serif', fontWeight: 600, lineHeight: 1.1, marginBottom: isMobile ? 16 : 32 }}>Garanta sua <span style={{ color: '#F78A2D' }}>Hospedagem.</span></h2>
            <p style={{ fontSize: isMobile ? 16 : 20, color: '#888', lineHeight: 1.6, marginBottom: isMobile ? 32 : 48 }}>Preencha os dados ao lado e receba um atendimento personalizado de nossos especialistas em turismo corporativo.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                'Atendimento corporativo dedicado e ágil',
                'Negociação direta com os melhores hotéis',
                'Agência Oficial com 20 anos de mercado'
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 24, height: 24, background: '#F78A2D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={14} color="#001124" />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="glass-form" style={{ background: '#001a36', border: '1px solid #003366', borderRadius: 32, padding: isMobile ? '24px' : '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h3 style={{ fontSize: 24, fontFamily: '"Outfit", sans-serif', fontWeight: 600, margin: 0 }}>Reserva de Pacote</h3>
                <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>Mantenha seus dados atualizados para contato.</p>
              </div>

              <div ref={mauticContainerRef} className="mautic-premium-form" />

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
                  <Lock size={14} color="#888" /> Compra Segura
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
                  <Shield size={14} color="#888" /> Dados Protegidos
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
                  <CheckCircle2 size={14} color="#888" /> Agência Oficial
                </div>
              </div>

              {submitting && !showSuccess && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,17,36,0.85)', borderRadius: 32, zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 44, height: 44, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#F78A2D', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <p style={{ marginTop: 20, fontSize: 12, fontWeight: 800, color: '#F78A2D' }}>Processando...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: isMobile ? '40px 20px' : '80px 40px', textAlign: 'center', borderTop: '1px solid #002042' }}>
        <div className="text-2xl font-black uppercase tracking-tighter text-white" style={{ marginBottom: 16, opacity: 0.5, fontSize: isMobile ? 18 : 24 }}>
          CONEXÃO <span style={{ color: '#F78A2D' }}>FARMA</span>
        </div>
        <p style={{ fontSize: isMobile ? 11 : 13, color: '#444', maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}>
          © Todos os direitos reservados Mais Corporativo - 2026. Somos uma agência de turismo corporativo especializada em pacotes para eventos e feiras de negócios.
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap');
        
        .animate-fade-in { animation: fadeIn 1.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .mautic-premium-form .mauticform_wrapper { width: 100% !important; }
        .mautic-premium-form .mauticform-innerform { display: flex; flex-direction: column; gap: 8px; }
        .mauticform-grid-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px 16px !important; width: 100% !important; }
        .mautic-premium-form .mauticform-row { margin-bottom: 0 !important; width: 100% !important; margin-top: 0 !important; }
        .mautic-premium-form label { display: block; font-size: 10px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 24px !important; margin-bottom: 4px !important; }
        .mautic-premium-form label span.mauticform-required { color: #F78A2D; }
        .mautic-premium-form input:not([type="radio"]), .mautic-premium-form select, .mautic-premium-form textarea { width: 100% !important; height: 45px !important; background: rgba(255, 255, 255, 0.03) !important; border: 1px solid rgba(255, 255, 255, 0.08) !important; border-radius: 10px !important; padding: 0 16px !important; color: #fff !important; font-size: 14px !important; outline: none; transition: all 0.2s; }
        .mautic-premium-form input:focus { border-color: #F78A2D; background: rgba(228, 60, 68, 0.04); }
        .mautic-premium-form .mauticform-radiogrp-options { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; width: 100%; }
        @media (max-width: 600px) { .mauticform-grid-row { grid-template-columns: 1fr !important; } }
        .mautic-premium-form input[type="radio"] { appearance: none; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.15); border-radius: 50%; cursor: pointer; position: relative; flex-shrink: 0; }
        .mautic-premium-form input[type="radio"]:checked { border-color: #F78A2D; }
        .mautic-premium-form input[type="radio"]:checked::after { content: ""; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: #F78A2D; border-radius: 50%; }
        .mautic-premium-form .mauticform-radiogrp-row { display: flex; align-items: center; gap: 8px; margin: 4px 0; cursor: pointer; }
        .mautic-premium-form label.mauticform-radiogrp-label { font-size: 13px; color: #999; cursor: pointer; margin: 0 !important; text-transform: none !important; letter-spacing: normal !important; font-weight: 500 !important; }
        .mautic-premium-form input[type="radio"]:checked + .mauticform-radiogrp-label { color: #fff; }
        .mautic-premium-form .mauticform-button { width: 100% !important; height: 54px !important; background: linear-gradient(135deg, rgba(247, 138, 45, 0.9), rgba(228, 60, 68, 0.9)) !important; border: 1px solid rgba(255,255,255,0.2) !important; border-radius: 12px !important; color: #fff !important; font-size: 16px !important; font-weight: 900 !important; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s; margin-top: 12px; box-shadow: 0 4px 15px rgba(247, 138, 45, 0.3); }
        .mautic-premium-form .mauticform-button:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(247, 138, 45, 0.5); border-color: rgba(255,255,255,0.5) !important; }
        .mautic-premium-form .mauticform-description, .mautic-premium-form .mauticform-helpmessage { display: none !important; }

        @media (max-width: 768px) {
          .mauticform-grid-row { display: flex !important; flex-direction: column !important; gap: 0 !important; }
          .mautic-premium-form .mauticform-button { height: 50px !important; font-size: 14px !important; }
          section { padding-left: 15px !important; padding-right: 15px !important; }
        }
      `}</style>
    </div>
  );
}

function SuccessSection({ redirectUrl }: { redirectUrl?: string }) {
  return (
    <div style={{ minHeight: '100vh', background: '#00152c', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
      <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(228,60,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
        <CheckCircle2 size={60} color="#F78A2D" />
      </div>
      <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontFamily: '"Outfit", sans-serif', fontWeight: 600, marginBottom: 16, color: '#fff' }}>SOLICITAÇÃO RECEBIDA</h1>
      <p style={{ fontSize: 20, color: '#888', maxWidth: 600, lineHeight: 1.6 }}>Obrigado pelo seu interesse. Um de nossos especialistas entrará em contato via WhatsApp ou E-mail em breve.</p>
      {redirectUrl && <p style={{ fontSize: 14, color: '#F78A2D', marginTop: 32, fontWeight: 700 }}>Redirecionando você...</p>}
    </div>
  );
}


