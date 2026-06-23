import React, { useState, useEffect } from 'react';

export function SurroundingsManager({ address, value, onUpdate }: { address: string, value: string, onUpdate: (v: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    if (value) {
      try { setPlaces(JSON.parse(value)); } catch(e) {}
    }
  }, [value]);

  const handleSearch = async () => {
    if (!address || address.trim().length < 5) {
      setError('Preencha um endereço mais completo no mapa.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}&limit=1&email=marketing@maiscorporativo.tur.br`, {
        headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' }
      });
      const nomData = await nomRes.json();
      if (!nomData || nomData.length === 0) {
        throw new Error('Endereço não encontrado no OpenStreetMap.');
      }
      const lat = nomData[0].lat;
      const lon = nomData[0].lon;

      const query = `
        [out:json][timeout:25];
        (
          node["amenity"~"restaurant|cafe"](around:2000,${lat},${lon});
          node["aeroway"~"aerodrome"](around:50000,${lat},${lon});
          node["leisure"~"park"](around:5000,${lat},${lon});
          node["public_transport"~"station"](around:5000,${lat},${lon});
          node["railway"~"station"](around:5000,${lat},${lon});
          node["tourism"~"attraction|museum"](around:5000,${lat},${lon});
        );
        out body 30;
      `;
      const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });
      const overpassData = await overpassRes.json();

      const newPlaces = overpassData.elements.filter((e:any) => e.tags && e.tags.name).map((e: any) => {
        let category = 'Outros';
        if (e.tags.amenity === 'restaurant' || e.tags.amenity === 'cafe') category = 'Restaurantes e cafés';
        else if (e.tags.aeroway) category = 'Aeroportos mais próximos';
        else if (e.tags.leisure === 'park' || e.tags.tourism) category = 'Principais atrações';
        else if (e.tags.public_transport || e.tags.railway) category = 'Transporte público';

        const R = 6371e3;
        const φ1 = lat * Math.PI/180;
        const φ2 = e.lat * Math.PI/180;
        const Δφ = (e.lat-lat) * Math.PI/180;
        const Δλ = (e.lon-lon) * Math.PI/180;
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distMetres = R * c;
        const distanceStr = distMetres > 1000 ? (distMetres/1000).toFixed(1) + ' km' : Math.round(distMetres) + ' m';

        return { id: e.id, name: e.tags.name, category, distance: distanceStr, distMetres, selected: false };
      });

      const unique = Array.from(new Map(newPlaces.map((item:any) => [item.name, item])).values()) as any[];
      unique.sort((a,b) => a.distMetres - b.distMetres);

      setPlaces(unique);
      onUpdate(JSON.stringify(unique));

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    const np = places.map(p => p.id === id ? { ...p, selected: !p.selected } : p);
    setPlaces(np);
    onUpdate(JSON.stringify(np));
  };

  return (
    <div style={{ background: '#002042', padding: 16, borderRadius: 8, border: '1px solid #003366' }}>
      <button onClick={handleSearch} disabled={loading} style={{ background: '#F78A2D', color: '#001124', fontWeight: 800, padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 16 }}>
        {loading ? 'Buscando...' : 'Buscar Locais Próximos (API)'}
      </button>
      {error && <p style={{ color: '#f87171', fontSize: 12 }}>{error}</p>}
      
      {places.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto', paddingRight: 8 }}>
          {places.map((p, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: p.selected ? 'rgba(247,138,45,0.1)' : '#00152c', border: p.selected ? '1px solid #F78A2D' : '1px solid #003366', padding: 12, borderRadius: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={p.selected} onChange={() => toggleSelect(p.id)} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{p.category}</div>
              </div>
              <div style={{ fontSize: 12, color: '#F78A2D', fontWeight: 600 }}>{p.distance}</div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

