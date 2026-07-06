import { useState, useId, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { GLOBAL_MAUTIC_FORM } from './GlobalMauticForm';

const CRM_WEBHOOK = 'https://crm.maiscorporativo.tur.br/api/v1/webhook/464288c3-343a-442c-9541-0189a8bcdfe4';

/* Nome próprio para o form oculto deste CTA. O Mautic ecoa o formName enviado
   no POST, então usar um nome exclusivo isola o callback deste modal do
   formulário principal das LPs de pacote (que usa o mesmo form 31). */
const CTA_FORM_NAME = 'portalhotelpreferenciacta';
const CTA_IFRAME_ID = 'mautic_hidden_iframe_hotel_cta';

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

/* ── Card "Não encontrou o hotel de sua preferência?" + modal com o
      formulário completo do Mautic + campo hotel desejado.
      Usado na home (ContactForm) e nas LPs de pacote (PackageLP). ── */
export default function HotelPreferenceCTA() {
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

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mauticContainerRef = useRef<HTMLDivElement>(null);
  const pendingCrmRef = useRef<URLSearchParams | null>(null);

  // Trava o scroll do body enquanto o modal está aberto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setStatus('idle');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  // --- Mautic Off-Screen Form Initialization ---
  useEffect(() => {
    if (mauticContainerRef.current) {
      // Renomeia o form (atributo, ids e input formName) para o nome exclusivo do CTA
      mauticContainerRef.current.innerHTML = GLOBAL_MAUTIC_FORM
        .replaceAll('portalpctshospedagemabradilanab2027lp1', CTA_FORM_NAME);

      const pForm = mauticContainerRef.current.querySelector('form');
      if (pForm) {
        // O <script> dentro do HTML injetado via innerHTML não executa,
        // então as globais que o SDK exige precisam ser definidas aqui
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
        (window as any).MauticFormCallback[CTA_FORM_NAME] = {
          onResponse: function (response: any) {
            if (response.success) {
              handleMauticSuccess();
            } else {
              setStatus('error');
            }
          }
        };

        // Fallback: observa as mensagens que o SDK escreve no form oculto
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
            const inputId = `mauticform_radiogrp_radio_tipo_quarto_cta_${safeName}${index}`;
            const row = document.createElement('div');
            row.className = 'mauticform-radiogrp-row';
            row.innerHTML = `<input name="mauticform[tipo_quarto]" class="mauticform-radiogrp-radio" id="${inputId}" type="radio" value="${name}">
                             <label id="mauticform_radiogrp_label_tipo_quarto_cta_${safeName}${index}" for="${inputId}" class="mauticform-radiogrp-label">${name}</label>`;
            if (errorMsg) roomRadioGrp.insertBefore(row, errorMsg);
            else roomRadioGrp.appendChild(row);
          });
        }

        let iframe = document.getElementById(CTA_IFRAME_ID) as HTMLIFrameElement;
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.id = CTA_IFRAME_ID;
          iframe.name = CTA_IFRAME_ID;
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
        }
        pForm.setAttribute('target', CTA_IFRAME_ID);
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
    <>
      <style>{`
        @media (max-width: 639px) {
          .cf-card { padding: 24px 16px !important; border-radius: 16px !important; }
          .cf-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* Hidden Mautic Form */}
      <div style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}>
        <div ref={mauticContainerRef} className="mautic-premium-form" />
      </div>

      {/* ── Card CTA ── */}
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
                        <input type="radio" name={`${uid}-participanteComo`} value={opt} checked={participanteComo === opt} onChange={(e) => setParticipanteComo(e.target.value)} required style={{ accentColor: '#F78A2D' }} />
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
                        <input type="radio" name={`${uid}-acomodacao`} value={opt} checked={acomodacao === opt} onChange={(e) => setAcomodacao(e.target.value)} required style={{ accentColor: '#F78A2D' }} />
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
                        <input type="radio" name={`${uid}-transfer`} value={opt} checked={transfer === opt} onChange={(e) => setTransfer(e.target.value)} required style={{ accentColor: '#F78A2D' }} />
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
                        <input type="radio" name={`${uid}-aereo`} value={opt} checked={aereo === opt} onChange={(e) => setAereo(e.target.value)} required style={{ accentColor: '#F78A2D' }} />
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
                      <input type="radio" name={`${uid}-receberWpp`} value="1" checked={receberWpp === '1'} onChange={(e) => setReceberWpp(e.target.value)} required style={{ accentColor: '#F78A2D' }} /> Sim
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#eee', cursor: 'pointer' }}>
                      <input type="radio" name={`${uid}-receberWpp`} value="0" checked={receberWpp === '0'} onChange={(e) => setReceberWpp(e.target.value)} required style={{ accentColor: '#F78A2D' }} /> Não
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
    </>
  );
}
