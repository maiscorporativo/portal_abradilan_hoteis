import React, { useState, useRef } from 'react';
import { Upload, X, Trash2, CheckCircle2, Image as ImageIcon, Download } from 'lucide-react';
import { useContentConfig } from '../../hooks/useContentConfig';

/* ── Media Pool Manager (Aba do Banco) ── */
export function MediaPoolManager({ pool, onUpdate }: { pool: string[]; onUpdate: (pool: string[]) => void }) {
  const { packages } = useContentConfig();
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const getToken = () => localStorage.getItem('emais_admin_token') ?? '';

  const addUrl = () => {
    if (!urlInput.trim()) return;
    if (!pool.includes(urlInput.trim())) {
      onUpdate([...pool, urlInput.trim()]);
    }
    setUrlInput('');
  };

  const removeUrl = (url: string) => {
    onUpdate(pool.filter(u => u !== url));
  };

  const uploadFile = async (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) { setError('Use JPEG, PNG, WebP ou GIF.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Máximo 5MB'); return; }

    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });
      if (!res.ok) throw new Error('Erro no upload');
      const { url } = await res.json();
      if (!pool.includes(url)) {
        onUpdate([...pool, url]);
      }
    } catch (e: any) {
      setError(e.message || 'Falha no upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: '#001a36', border: '1px solid #003366', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, background: 'rgba(247, 138, 45, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ImageIcon size={16} color="#F78A2D" />
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: '#fff', margin: 0 }}>Banco de Fotos do Pacote</h4>
          <p style={{ fontSize: 11, color: '#888', margin: 0 }}>Suba as fotos uma única vez e use livremente nas seções abaixo.</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <select 
            onChange={(e) => {
              if (!e.target.value) return;
              const pkgToCopy = packages[parseInt(e.target.value)];
              if (pkgToCopy && pkgToCopy.packageMediaPool) {
                const newItems = pkgToCopy.packageMediaPool.filter(url => !pool.includes(url));
                if (newItems.length > 0) {
                  onUpdate([...pool, ...newItems]);
                }
              }
              e.target.value = '';
            }}
            style={{ background: '#002042', color: '#F78A2D', border: '1px solid #004080', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            <option value="">📥 Importar de outro pacote...</option>
            {packages.map((p, idx) => {
              if (!p.packageMediaPool || p.packageMediaPool.length === 0) return null;
              return (
                <option key={idx} value={idx}>{p.title || `Pacote ${idx + 1}`} ({p.packageMediaPool.length} fotos)</option>
              );
            })}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input 
          type="url" 
          value={urlInput} 
          onChange={e => setUrlInput(e.target.value)} 
          placeholder="https://... (colar URL externa)"
          style={{ flex: 1, background: '#002042', border: '1px solid #004080', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 12 }}
        />
        <button onClick={addUrl} style={{ background: '#003366', color: '#fff', border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 600, cursor: 'pointer' }}>Adicionar</button>
        
        <div style={{ width: 1, background: '#004080' }} />
        
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => {
          if (e.target.files) Array.from(e.target.files).forEach(f => uploadFile(f));
          e.target.value = '';
        }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ background: '#F78A2D', color: '#001124', border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 800, cursor: uploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Upload size={14} /> {uploading ? 'Enviando...' : 'Fazer Upload'}
        </button>
      </div>
      {error && <p style={{ color: '#f87171', fontSize: 11, marginTop: -8, marginBottom: 12 }}>{error}</p>}

      {pool.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
          {pool.map((url, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: '1px solid #004080', group: 'hover' }}>
              <img src={url.startsWith('/') ? url : url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => removeUrl(url)}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,17,36,0.7)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f87171' }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: 32, textAlign: 'center', background: '#002042', borderRadius: 8, border: '1px dashed #004080' }}>
          <p style={{ color: '#666', fontSize: 12, margin: 0 }}>Nenhuma foto adicionada ao banco deste pacote ainda.</p>
        </div>
      )}
    </div>
  );
}

/* ── Media Pool Selector Modal ── */
export function MediaPoolSelectorModal({ pool, open, onClose, onSelect, multiple = false, currentSelection = [] }: { pool: string[], open: boolean, onClose: () => void, onSelect: (urls: string[]) => void, multiple?: boolean, currentSelection?: string[] }) {
  const [selected, setSelected] = useState<string[]>(currentSelection);

  // Sync when opening
  React.useEffect(() => { if (open) setSelected(currentSelection); }, [open, currentSelection]);

  if (!open) return null;

  const toggleSelect = (url: string) => {
    if (multiple) {
      if (selected.includes(url)) setSelected(selected.filter(u => u !== url));
      else setSelected([...selected, url]);
    } else {
      setSelected([url]);
    }
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,17,36,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#001a36', border: '1px solid #004080', borderRadius: 16, width: '100%', maxWidth: 800, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 20, borderBottom: '1px solid #003366', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 16, color: '#fff', fontWeight: 800 }}>Escolher do Banco de Fotos</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
          {pool.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: 40 }}>O banco de fotos deste pacote está vazio.<br/>Adicione fotos na seção superior do editor.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
              {pool.map((url, i) => {
                const isSelected = selected.includes(url);
                return (
                  <div 
                    key={i} 
                    onClick={() => toggleSelect(url)}
                    style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: isSelected ? '2px solid #F78A2D' : '2px solid transparent', cursor: 'pointer', opacity: isSelected ? 1 : 0.7 }}
                  >
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 8, right: 8, background: '#F78A2D', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={14} color="#001124" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding: 20, borderTop: '1px solid #003366', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onClose} style={{ background: '#002042', color: '#fff', border: '1px solid #004080', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleConfirm} style={{ background: '#F78A2D', color: '#001124', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 800, cursor: 'pointer' }}>
            Confirmar Seleção ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}


