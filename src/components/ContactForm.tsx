import HotelPreferenceCTA from './HotelPreferenceCTA';

/* ── Seção "Planeje sua experiência" da home.
      O card/modal "Não encontrou o hotel de sua preferência?" foi extraído
      para HotelPreferenceCTA, compartilhado com as LPs de pacote. ── */
export default function ContactForm() {
  return (
    <section
      id="contato-form"
      style={{
        background: 'linear-gradient(180deg, #001124 0%, #09090b 100%)',
        padding: '96px 24px',
        position: 'relative',
      }}
    >
      <style>{`
        @media (max-width: 639px) {
          .cf-outer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
      {/* decorative glow orbs */}
      <div style={{
        position: 'absolute', top: -120, left: -120, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(223,254,0,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, right: -80, width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(194,224,0,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div
          className="cf-outer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 64,
            alignItems: 'center',
          }}
        >

          {/* ── Left column ── */}
          <div>
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 800,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#F78A2D', marginBottom: 20,
            }}>
              Fale com a gente
            </span>

            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 800, lineHeight: 1.08,
              color: '#fff', margin: '0 0 20px',
              letterSpacing: '-0.03em',
            }}>
              Planeje sua<br />
              <span style={{
                background: 'linear-gradient(90deg, #F78A2D, #E67A1F)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                experiência
              </span>
            </h2>

            <p style={{
              fontSize: 15, lineHeight: 1.75,
              color: 'rgba(255,255,255,0.5)',
              margin: '0 0 40px', maxWidth: 380,
            }}>
              Nossa equipe especializada cria itinerários sob medida para o seu evento esportivo — ingressos, hospedagem, transfers e muito mais.
            </p>

            {/* feature chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Resposta em até 24 horas',
                'Pacotes 100% personalizados',
                'Atendimento em PT, EN e ES',
              ].map(text => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(223,254,0,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5L4.5 8L9 3" stroke="#F78A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: card CTA + modal ── */}
          <HotelPreferenceCTA />
        </div>
      </div>
    </section>
  );
}
