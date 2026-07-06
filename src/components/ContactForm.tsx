import { useState, useId, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSelectedPackage } from '../hooks/useSelectedPackage';
import { useContentConfig } from '../hooks/useContentConfig';
import { GLOBAL_MAUTIC_FORM } from '../components/GlobalMauticForm';

const CRM_WEBHOOK = 'https://crm.maiscorporativo.tur.br/api/v1/webhook/464288c3-343a-442c-9541-0189a8bcdfe4';

/* ── floating label input ────────────────────────────────────── */
function FloatInput({
  id, label, type = 'text', autoComplete, value, onChange, required,
}: {
  id: string; label: string; type?: string;
  autoComplete?: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: '#002042',
          border: `1.5px solid ${focused ? '#F78A2D' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 12,
          color: '#fff',
          fontSize: 15,
          padding: '22px 18px 8px',
          outline: 'none',
          transition: 'border-color 0.2s, background 0.2s',
          fontFamily: 'inherit',
          letterSpacing: '0.01em',
        }}
      />
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: 18,
          top: raised ? 8 : '50%',
          transform: raised ? 'none' : 'translateY(-50%)',
          fontSize: raised ? 10 : 14,
          color: focused ? '#F78A2D' : 'rgba(255,255,255,0.38)',
          fontWeight: raised ? 700 : 400,
          letterSpacing: raised ? '0.08em' : '0.01em',
          textTransform: raised ? 'uppercase' : 'none',
          pointerEvents: 'none',
          transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
          userSelect: 'none',
        }}
      >
        {label}
      </label>
      {/* bottom accent line */}
      <span style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        height: 2, width: focused ? '92%' : 0,
        background: 'linear-gradient(90deg, #F78A2D, #E67A1F)',
        borderRadius: 2, transition: 'width 0.25s ease',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

function PhoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  const fmt = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  const raised = true;

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center',
          width: '100%', boxSizing: 'border-box',
          background: '#002042',
          border: `1.5px solid ${focused ? '#F78A2D' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 12,
          padding: '22px 18px 8px',
          transition: 'border-color 0.2s, background 0.2s',
          cursor: 'text',
          overflow: 'hidden',
        }}
        onClick={() => document.getElementById(id)?.focus()}
      >
        <span style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 15,
          fontWeight: 600,
          marginRight: 6,
          userSelect: 'none',
          flexShrink: 0,
          fontFamily: 'inherit',
        }}>+55</span>
        <input
          id={id}
          type="tel"
          autoComplete="tel"
          value={value}
          onChange={e => onChange(fmt(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            WebkitAppearance: 'none',
            color: '#fff',
            fontSize: 15,
            padding: 0,
            fontFamily: 'inherit',
            letterSpacing: '0.01em',
          }}
        />
      </div>
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: 18,
          top: raised ? 8 : '50%',
          transform: raised ? 'none' : 'translateY(-50%)',
          fontSize: raised ? 10 : 14,
          color: focused ? '#F78A2D' : 'rgba(255,255,255,0.38)',
          fontWeight: raised ? 700 : 400,
          letterSpacing: raised ? '0.08em' : '0.01em',
          textTransform: raised ? 'uppercase' : 'none',
          pointerEvents: 'none',
          transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
          userSelect: 'none',
        }}
      >
        Telefone / WhatsApp
      </label>
      <span style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        height: 2, width: focused ? '92%' : 0,
        background: 'linear-gradient(90deg, #F78A2D, #E67A1F)',
        borderRadius: 2, transition: 'width 0.25s ease',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ── Package dropdown select ─────────────────────────── */
function PackageSelect({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const { packages: allPackages } = useContentConfig();

  const options = allPackages.filter(p => (!p.status || p.status === 'approved') && !p.deletedAt);
  const selectedPkg = options.find(p => p.title === value) ?? null;

  const filtered = query
    ? options.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openSearch = () => { setQuery(''); setOpen(true); };
  const active = focused || open;

  // ── ESTADO: pacote selecionado → mini-card compacto ────────────
  if (selectedPkg && !open) {
    const curr = selectedPkg.currency || 'BRL';
    const sym = curr === 'BRL' ? 'R$' : curr === 'USD' ? '$' : '€';
    const priceNum = selectedPkg.price ? parseInt(selectedPkg.price.replace(/\D/g, ''), 10) : null;
    const priceStr = priceNum ? `${sym} ${priceNum.toLocaleString('pt-BR')}` : null;

    return (
      <div ref={ref} style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, rgba(223,254,0,0.1) 0%, rgba(194,224,0,0.04) 100%)',
            border: '1.5px solid rgba(223,254,0,0.45)',
            borderRadius: 12,
            padding: '22px 12px 8px 14px',   /* mesma altura dos outros inputs */
            position: 'relative', overflow: 'hidden',
            minHeight: 56,
          }}
        >
          {/* Glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at left, rgba(223,254,0,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          {/* Floating label */}
          <span style={{
            position: 'absolute', left: 14, top: 8,
            fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#F78A2D',
            pointerEvents: 'none',
          }}>
            Pacote de interesse
          </span>

          {/* Thumbnail */}
          {selectedPkg.img && (
            <div style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: 7,
              overflow: 'hidden', border: '1.5px solid rgba(223,254,0,0.4)',
            }}>
              <img src={selectedPkg.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {/* Title — 1 linha */}
          <div style={{
            flex: 1, minWidth: 0,
            fontSize: 14, fontWeight: 700, color: '#fff',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {selectedPkg.title}
          </div>

          {/* Price */}
          {priceStr && (
            <span style={{
              flexShrink: 0,
              fontSize: 12, fontWeight: 800, color: '#F78A2D',
              background: 'rgba(223,254,0,0.12)',
              border: '1px solid rgba(223,254,0,0.25)',
              padding: '3px 8px', borderRadius: 7,
              whiteSpace: 'nowrap',
            }}>
              {priceStr}
            </span>
          )}

          {/* Trocar */}
          <button
            type="button" onClick={openSearch} title="Trocar pacote"
            style={{
              flexShrink: 0, background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 7, padding: '5px 7px',
              cursor: 'pointer', color: 'rgba(255,255,255,0.45)',
              display: 'flex', alignItems: 'center', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = '#F78A2D'; b.style.borderColor = 'rgba(223,254,0,0.4)'; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = 'rgba(255,255,255,0.45)'; b.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // ── ESTADO: input de busca / vazio ──────────────────────────────
  const raised = focused || value.length > 0;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={open ? query : value}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setFocused(true); setQuery(''); setOpen(true); }}
          onBlur={() => setFocused(false)}
          placeholder={open ? 'Buscar pacote...' : ' '}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: active ? '#002a5c' : '#002042',
            border: `1.5px solid ${active ? '#F78A2D' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: open ? '12px 12px 0 0' : 12,
            color: '#fff', fontSize: 15,
            padding: '22px 42px 8px 18px',
            outline: 'none',
            transition: 'border-color 0.2s, background 0.2s, border-radius 0.15s',
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        />
        <label
          htmlFor={id}
          style={{
            position: 'absolute', left: 18,
            top: raised ? 8 : '50%',
            transform: raised ? 'none' : 'translateY(-50%)',
            fontSize: raised ? 10 : 14,
            color: active ? '#F78A2D' : 'rgba(255,255,255,0.38)',
            fontWeight: raised ? 700 : 400,
            letterSpacing: raised ? '0.08em' : '0.01em',
            textTransform: raised ? 'uppercase' : 'none',
            pointerEvents: 'none',
            transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          Pacote de interesse
        </label>
        <span style={{
          position: 'absolute', right: 14, top: '50%',
          transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          transition: 'transform 0.2s ease',
          pointerEvents: 'none', color: active ? '#F78A2D' : 'rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          height: 2, width: active && !open ? '92%' : 0,
          background: 'linear-gradient(90deg, #F78A2D, #E67A1F)',
          borderRadius: 2, transition: 'width 0.25s ease', pointerEvents: 'none',
        }} />
      </div>

      {open && (
        <div style={{
          position: 'absolute', left: 0, right: 0,
          background: '#001a36',
          border: '1.5px solid #F78A2D',
          borderTop: '1px solid rgba(223,254,0,0.2)',
          borderRadius: '0 0 14px 14px',
          zIndex: 500, overflowY: 'auto', overflowX: 'hidden',
          maxHeight: 260,
          boxShadow: '0 20px 50px rgba(0,17,36,0.6)',
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '16px 18px', fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              Nenhum pacote encontrado
            </div>
          ) : (
            filtered.map((pkg, i) => {
              const selected = value === pkg.title;
              const curr = pkg.currency || 'BRL';
              const sym = curr === 'BRL' ? 'R$' : curr === 'USD' ? '$' : '€';
              const priceNum = pkg.price ? parseInt(pkg.price.replace(/\D/g, ''), 10) : null;
              const priceStr = priceNum ? `${sym} ${priceNum.toLocaleString('pt-BR')}` : null;

              return (
                <button
                  key={pkg.title}
                  type="button"
                  onMouseDown={e => { e.preventDefault(); onChange(pkg.title); setQuery(''); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    width: '100%', textAlign: 'left',
                    padding: '13px 16px',
                    background: selected ? 'rgba(223,254,0,0.1)' : 'none',
                    border: 'none',
                    borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background 0.12s', gap: 10,
                  }}
                  onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = selected ? 'rgba(223,254,0,0.1)' : 'none'; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: selected ? 700 : 500, color: selected ? '#F78A2D' : '#fff', lineHeight: 1.35, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      {pkg.title}
                    </div>
                    {pkg.loc && (
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                        📍 {pkg.loc}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {priceStr && (
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: selected ? '#F78A2D' : 'rgba(255,255,255,0.4)',
                        background: selected ? 'rgba(223,254,0,0.12)' : 'rgba(255,255,255,0.05)',
                        padding: '3px 8px', borderRadius: 6,
                      }}>{priceStr}</span>
                    )}
                    {selected && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3.5 3.5 5.5-6" stroke="#F78A2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ── main component ───────────────────────────────────────────── */
export default function ContactForm() {
  const uid = useId();
  const [hotelDesejado, setHotelDesejado] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [cargo, setCargo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [participanteComo, setParticipanteComo] = useState('');
  const [cidadeOrigem, setCidadeOrigem] = useState('');
  const [hotelChegada, setHotelChegada] = useState('');
  const [hotelSaida, setHotelSaida] = useState('');
  const [acomodacao, setAcomodacao] = useState('');
  const [receberWpp, setReceberWpp] = useState('1');
  const [outros, setOutros] = useState('');
  const [qtdPessoas, setQtdPessoas] = useState('');
  const [transfer, setTransfer] = useState('');
  const [aereo, setAereo] = useState('');

  const [pacote, setPacote] = useState('');
  void pacote;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const mauticContainerRef = useRef<HTMLDivElement>(null);
  const pendingCrmRef = useRef<URLSearchParams | null>(null);

  // We can lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setStatus('idle');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  // Sincroniza com o contexto (clique em "Reservar Pacote" no modal)
  const { selectedTitle, setSelectedTitle } = useSelectedPackage();
  useEffect(() => {
    if (selectedTitle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPacote(selectedTitle);
      setSelectedTitle('');
    }
  }, [selectedTitle, setSelectedTitle]);

  // --- Mautic Off-Screen Form Initialization ---
  useEffect(() => {
    if (mauticContainerRef.current) {
      mauticContainerRef.current.innerHTML = GLOBAL_MAUTIC_FORM;

      const pForm = mauticContainerRef.current.querySelector('form');
      if (pForm) {
        // O <script> dentro do HTML injetado via innerHTML não executa,
        // então as globais que o SDK exige precisam ser definidas aqui (igual ao PackageLP)
        (window as any).MauticDomain = 'https://mkt.maiscorporativo.tur.br';
        if (typeof (window as any).MauticLang === 'undefined') {
          (window as any).MauticLang = { submittingMessage: 'Por favor, aguarde...' };
        }

        // Dispara o webhook do CRM com o payload montado no submit (guardado por ref,
        // então mesmo se chamado 2x — callback + observer — envia apenas uma vez)
        const handleMauticSuccess = () => {
          if (pendingCrmRef.current) {
            fetch(CRM_WEBHOOK, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: pendingCrmRef.current.toString(),
            }).catch(err => console.error('Erro CRM:', err));
            pendingCrmRef.current = null;
          }
          setStatus('success');
        };

        // Intercepta Mautic Success
        (window as any).MauticFormCallback = (window as any).MauticFormCallback || {};
        (window as any).MauticFormCallback['portalpctshospedagemabradilanab2027lp1'] = {
          onResponse: function (response: any) {
            if (response.success) {
              handleMauticSuccess();
            } else {
              setStatus('error');
            }
          }
        };

        // Fallback: observa as mensagens que o SDK escreve no form oculto (igual ao PackageLP)
        const observer = new MutationObserver(() => {
          const errorMsg = mauticContainerRef.current?.querySelector('.mauticform-error');
          const successMsg = mauticContainerRef.current?.querySelector('.mauticform-message');
          if (errorMsg && errorMsg.innerHTML.trim().length > 0) setStatus('error');
          if (successMsg && successMsg.innerHTML.trim().length > 0) handleMauticSuccess();
        });
        observer.observe(mauticContainerRef.current, { childList: true, subtree: true, characterData: true });

        // Substitui as opções padrão de tipo_quarto ("Opção 1") pelas acomodações reais
        const roomRadioGrp = pForm.querySelector('div[data-validate="tipo_quarto"]');
        if (roomRadioGrp) {
          roomRadioGrp.querySelectorAll('.mauticform-radiogrp-row').forEach(row => row.remove());
          const errorMsg = roomRadioGrp.querySelector('.mauticform-errormsg');
          ['Quarto Individual', 'Quarto Duplo'].forEach((name, index) => {
            const safeName = name.replace(/[^a-zA-Z0-9]/g, '');
            const inputId = `mauticform_radiogrp_radio_tipo_quarto_cf_${safeName}${index}`;
            const row = document.createElement('div');
            row.className = 'mauticform-radiogrp-row';
            row.innerHTML = `<input name="mauticform[tipo_quarto]" class="mauticform-radiogrp-radio" id="${inputId}" type="radio" value="${name}">
                             <label id="mauticform_radiogrp_label_tipo_quarto_cf_${safeName}${index}" for="${inputId}" class="mauticform-radiogrp-label">${name}</label>`;
            if (errorMsg) roomRadioGrp.insertBefore(row, errorMsg);
            else roomRadioGrp.appendChild(row);
          });
        }

        let iframe = document.getElementById('mautic_hidden_iframe_cf') as HTMLIFrameElement;
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.id = 'mautic_hidden_iframe_cf';
          iframe.name = 'mautic_hidden_iframe_cf';
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
        }
        pForm.setAttribute('target', 'mautic_hidden_iframe_cf');
      }

      if (!document.getElementById('mautic-sdk-script')) {
        const sc = document.createElement('script');
        sc.id = 'mautic-sdk-script';
        sc.src = 'https://mkt.maiscorporativo.tur.br/media/js/mautic-form.js';
        sc.onload = () => { if ((window as any).MauticSDK) (window as any).MauticSDK.onLoad(); };
        document.head.appendChild(sc);
      } else {
        if ((window as any).MauticSDK) (window as any).MauticSDK.onLoad();
      }
    }
  }, []);
  // ---------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const utms = JSON.parse(sessionStorage.getItem('emais_utms') || '{}');
      const utmString = Object.entries(utms).map(([k, v]) => `${k}=${v}`).join(' | ');
      const origemBase = window.location.hostname;
      const origemFinal = utmString ? `${origemBase} | UTMs: ${utmString}` : origemBase;

      // Sincroniza dados com o form Mautic Off-Screen e Clica
      const mForm = mauticContainerRef.current?.querySelector('form');
      if (!mForm) {
        setStatus('error');
        return;
      }

      const setInput = (name: string, value: string) => {
        const input = mForm.querySelector(`input[name="mauticform[${name}]"]:not([type="radio"]):not([type="checkbox"]), select[name="mauticform[${name}]"], textarea[name="mauticform[${name}]"]`) as HTMLInputElement;
        if (input) input.value = value;
      };
      const setRadio = (name: string, value: string) => {
        mForm.querySelectorAll(`input[type="radio"][name="mauticform[${name}]"]`).forEach(r => {
          (r as HTMLInputElement).checked = (r as HTMLInputElement).value === value;
        });
      };

      setInput('nome', nome);
      setInput('ultimo_nome', sobrenome);
      setInput('cargo', cargo);
      setInput('empresa', empresa);
      setInput('email', email);
      // O +55 do PhoneInput é apenas visual; o Mautic valida exigindo o formato internacional
      setInput('whatsapp', telefone ? `+55 ${telefone}` : '');
      setRadio('pacote', participanteComo);
      setInput('outros', participanteComo === 'Outros' ? outros : '');
      setInput('cidade_origem', cidadeOrigem);
      setInput('hotel_chegada', hotelChegada);
      setInput('hotel_saida1', hotelSaida);
      setInput('qtd_pessoas', qtdPessoas);
      setRadio('precisara_de_transfer', transfer);
      setRadio('precisa_de_aereo_ate_sao', aereo);
      setRadio('deseja_receber_mensagens', receberWpp);
      setRadio('tipo_quarto', acomodacao);

      // Monta o payload do CRM espelhando o form Mautic (igual às LPs de pacote) + hotel_desejado.
      // O envio acontece no MauticFormCallback, após o Mautic confirmar sucesso.
      const crmData = new URLSearchParams();
      mForm.querySelectorAll('input, select, textarea').forEach(el => {
        const input = el as HTMLInputElement;
        const nameMatch = input.name ? input.name.match(/mauticform\[(.*?)\]/) : null;
        if (!nameMatch) return;
        const fieldName = nameMatch[1];
        if (['formId', 'return', 'formName'].includes(fieldName)) return;
        if (input.type === 'radio' || input.type === 'checkbox') {
          if (input.checked) crmData.append(fieldName, input.value);
        } else {
          crmData.append(fieldName, input.value || '');
        }
      });
      crmData.append('hotel_desejado', hotelDesejado);
      crmData.append('origem_lead', origemFinal);
      crmData.append('url_conversao', window.location.href);
      pendingCrmRef.current = crmData;

      // Dispara o clique nativo do Mautic
      const btn = mForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (btn) btn.click();
      else setStatus('error');
    } catch (err) {
      console.error('Falha ao acionar Mautic:', err);
      setStatus('error');
    }
  };

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
          .cf-card { padding: 24px 16px !important; border-radius: 16px !important; }
          .cf-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* Hidden Mautic Form */}
      <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}>
        <div ref={mauticContainerRef} className="mautic-premium-form" />
      </div>
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

          {/* ── Right column: button ── */}
          <div
            className="cf-card"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding: '40px 36px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 32px 64px rgba(0,17,36,0.35)',
              display: 'flex', flexDirection: 'column', gap: 20
            }}
          >
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, textAlign: 'center' }}>
              Não encontrou o hotel de sua <span style={{ color: '#F78A2D' }}>preferência?</span>
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0, textAlign: 'center', lineHeight: 1.6 }}>
              Clique no botão abaixo, nos conte mais detalhes e nossa equipe entrará em contato para montar o pacote perfeito para você.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', padding: '16px 32px', marginTop: 10,
                background: 'linear-gradient(135deg, #F78A2D 0%, #E67A1F 100%)',
                color: '#001124',
                fontWeight: 800, fontSize: 14,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                border: 'none', borderRadius: 100,
                cursor: 'pointer',
                transition: 'transform 0.15s',
                boxShadow: '0 8px 32px rgba(223,254,0,0.35)',
                textDecoration: 'none'
              }}
            >
              Indicar hotel de preferência
            </button>
          </div>
        </div>
      </div>

      {/* ── Popup Modal Glassmorphism ── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0, 17, 36, 0.7)', backdropFilter: 'blur(16px)',
          padding: '24px'
        }}>
          <div style={{
            position: 'relative', width: '100%', maxWidth: '600px',
            background: 'rgba(0, 21, 44, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 24, padding: '40px 36px',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
            overflowY: 'auto', maxHeight: '90vh'
          }}>
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute', top: 20, right: 20,
                background: 'rgba(255,255,255,0.1)', border: 'none',
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer', transition: 'background 0.2s', zIndex: 20
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 10px', textAlign: 'center' }}>
              Nos conte sua <span style={{ color: '#F78A2D' }}>preferência</span>
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 20px', textAlign: 'center' }}>
              Preencha os dados abaixo e entraremos em contato com a melhor opção para você.
            </p>
            {status === 'success' ? (
              /* ── success state ── */
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(223,254,0,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <CheckCircle2 size={36} color="#F78A2D" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                  Formulário enviado com sucesso!
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px', lineHeight: 1.6 }}>
                  Nossa equipe entrará em contato em breve para montar o pacote ideal para você.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    display: 'inline-flex', padding: '12px 24px',
                    background: 'rgba(255,255,255,0.1)', color: '#fff',
                    borderRadius: 100, border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: 13, textTransform: 'uppercase'
                  }}
                >
                  Fechar janela
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                <div className="cf-row">
                  <FloatInput id={`${uid}-hotelDesejado`} label="Nome do hotel desejado" value={hotelDesejado} onChange={setHotelDesejado} required />
                </div>

                {/* row: nome + sobrenome */}
                <div className="cf-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 14 }}>
                  <FloatInput id={`${uid}-nome`} label="Primeiro Nome" autoComplete="given-name" value={nome} onChange={setNome} required />
                  <FloatInput id={`${uid}-sobrenome`} label="Sobrenome" autoComplete="family-name" value={sobrenome} onChange={setSobrenome} required />
                </div>

                {/* row: cargo + empresa */}
                <div className="cf-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 14 }}>
                  <FloatInput id={`${uid}-cargo`} label="Cargo" value={cargo} onChange={setCargo} required />
                  <FloatInput id={`${uid}-empresa`} label="Empresa" value={empresa} onChange={setEmpresa} required />
                </div>

                {/* row: email + telefone */}
                <div className="cf-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 14, alignItems: 'start' }}>
                  <FloatInput id={`${uid}-email`} label="E-mail" type="email" autoComplete="email" value={email} onChange={setEmail} required />
                  <PhoneInput value={telefone} onChange={setTelefone} />
                </div>
                
                {/* Participante Como */}
                <div className="cf-row">
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Participará no evento como *</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {['Distribuidor Associado', 'Distribuidor Não Associado', 'Indústrias', 'Farmacistas', 'Visitantes', 'Outros'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#eee', cursor: 'pointer' }}>
                        <input type="radio" name="participanteComo" value={opt} checked={participanteComo === opt} onChange={(e) => setParticipanteComo(e.target.value)} required style={{ accentColor: '#F78A2D' }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Outros (condicional) */}
                {participanteComo === 'Outros' && (
                  <div className="cf-row">
                    <FloatInput id={`${uid}-outros`} label="Outros (especifique)" value={outros} onChange={setOutros} required />
                  </div>
                )}

                {/* Cidade de Origem */}
                <div className="cf-row">
                  <FloatInput id={`${uid}-cidade`} label="Cidade de origem" value={cidadeOrigem} onChange={setCidadeOrigem} required />
                </div>

                {/* row: Datas */}
                <div className="cf-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 14 }}>
                  <div style={{ position: 'relative' }}>
                    <label style={{ position: 'absolute', top: -8, left: 12, background: 'rgba(0, 21, 44, 1)', padding: '0 4px', fontSize: 10, color: '#F78A2D', zIndex: 1 }}>Hotel Chegada *</label>
                    <input type="date" value={hotelChegada} onChange={(e) => setHotelChegada(e.target.value)} required style={{ width: '100%', padding: '16px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <label style={{ position: 'absolute', top: -8, left: 12, background: 'rgba(0, 21, 44, 1)', padding: '0 4px', fontSize: 10, color: '#F78A2D', zIndex: 1 }}>Hotel Saída *</label>
                    <input type="date" value={hotelSaida} onChange={(e) => setHotelSaida(e.target.value)} required style={{ width: '100%', padding: '16px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: 'inherit' }} />
                  </div>
                </div>

                {/* Acomodação Desejada */}
                <div className="cf-row">
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Acomodação Desejada *</span>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {['Quarto Individual', 'Quarto Duplo'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#eee', cursor: 'pointer' }}>
                        <input type="radio" name="acomodacao" value={opt} checked={acomodacao === opt} onChange={(e) => setAcomodacao(e.target.value)} required style={{ accentColor: '#F78A2D' }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quantidade de Pessoas */}
                <div className="cf-row">
                  <FloatInput id={`${uid}-qtdPessoas`} label="Quantidade de Pessoas" type="number" value={qtdPessoas} onChange={setQtdPessoas} required />
                </div>

                {/* Precisará de Transfer */}
                <div className="cf-row">
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Precisará de Transfer? *</span>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {['Sim', 'Não'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#eee', cursor: 'pointer' }}>
                        <input type="radio" name="transfer" value={opt} checked={transfer === opt} onChange={(e) => setTransfer(e.target.value)} required style={{ accentColor: '#F78A2D' }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Interesse em passagem aérea */}
                <div className="cf-row">
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Tem interesse em passagem aérea? *</span>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {['Sim', 'Não'].map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#eee', cursor: 'pointer' }}>
                        <input type="radio" name="aereo" value={opt} checked={aereo === opt} onChange={(e) => setAereo(e.target.value)} required style={{ accentColor: '#F78A2D' }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Receber Wpp */}
                <div className="cf-row">
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'block', marginBottom: 8 }}>Deseja receber mensagens pelo WhatsApp? *</span>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#eee', cursor: 'pointer' }}>
                      <input type="radio" name="receberWpp" value="1" checked={receberWpp === '1'} onChange={(e) => setReceberWpp(e.target.value)} required style={{ accentColor: '#F78A2D' }} /> Sim
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#eee', cursor: 'pointer' }}>
                      <input type="radio" name="receberWpp" value="0" checked={receberWpp === '0'} onChange={(e) => setReceberWpp(e.target.value)} required style={{ accentColor: '#F78A2D' }} /> Não
                    </label>
                  </div>
                </div>

                {/* divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

                {/* error */}
                {status === 'error' && (
                  <p style={{
                    margin: 0, fontSize: 13, color: '#f87171',
                    background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    borderRadius: 10, padding: '10px 14px',
                  }}>
                    ⚠ Algo deu errado. Tente novamente ou nos contate diretamente.
                  </p>
                )}

                {/* submit */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    padding: '16px 32px',
                    background: status === 'sending'
                      ? 'rgba(223,254,0,0.5)'
                      : 'linear-gradient(135deg, #F78A2D 0%, #E67A1F 100%)',
                    color: '#001124',
                    fontWeight: 800, fontSize: 14,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    border: 'none', borderRadius: 100,
                    cursor: status === 'sending' ? 'wait' : 'pointer',
                    transition: 'opacity 0.2s, transform 0.15s',
                    boxShadow: '0 8px 32px rgba(223,254,0,0.35)',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { if (status !== 'sending') (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                >
                  {status === 'sending' ? 'Enviando…' : (
                    <>Enviar formulário <ArrowRight size={16} strokeWidth={2.5} /></>
                  )}
                </button>

                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                  Seus dados são tratados com total segurança e privacidade.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}


