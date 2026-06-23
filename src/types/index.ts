export interface EventHighlight {
  title: string;
  location: string;
  date: string;
  img: string;
  status?: 'approved' | 'pending' | 'rejected';
  /* ── Audit trail ── */
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
}

export interface TrendingPackage {
  tag: string;
  title: string;
  loc: string;
  date: string;
  price: string;
  priceDouble?: string;
  currency?: string;
  img: string;
  badge: string;
  badgeImg?: string;
  description?: string;
  flightDetails?: string;
  hotelDetails?: string;
  ticketDetails?: string;
  status?: 'approved' | 'pending' | 'rejected';
  category?: string;
  isTrending?: boolean;
  /* ── Audit trail ── */
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  /* ── Marketing fields ── */
  videoUrl?: string;
  trackingScriptHead?: string;
  trackingScriptBody?: string;
  webhookClint?: string;
  webhookClintSegments?: string; // JSON string mapping segment names to webhook URLs
  mauticFormCode?: string;
  redirectUrl?: string;
  marketingUpdatedAt?: string;
  marketingUpdatedBy?: string;
  /* ── Enhanced Marketing fields ── */
  heroType?: 'video' | 'image';
  heroImage?: string;
  galleryImages?: string; // Semicolon separated URLs
  highlights?: string; // Semicolon separated features/highlights
  sectionBackground?: string;
  sportType?: string; // Ex: 'automobilismo', 'futebol', 'tenis', etc.
  /* ── New Pricing & Stays Sections ── */
  minNights?: string;
  validFrom?: string;
  validTo?: string;
  dailyRateOverride?: string;
  doublePerPersonOverride?: string;
  /* ── New Hotel LP Sections ── */
  heroSubtitle?: string; // Frase destaque no hero
  breakfast?: string; // Café da manhã
  distanceCenterNorte?: string; // Distância de carro Center Norte
  trainingRooms?: string; // Salas para treinamento
  parking?: string; // Estacionamento
  mapAddress?: string; // Endereço para o mapa
  hotelDescription?: string; // Descrição sobre o hotel
  accommodationsTitle?: string; // Título da seção de Acomodações
  accommodationsDescription?: string; // Descrição da seção de Acomodações
  accommodationsImages?: string; // Fotos das acomodações (separadas por ponto e vírgula)
  /* ── Legacy GP Experience LP Sections ── */
  cardsData?: string; // JSON string para Cards de Experiência
  programacaoData?: string; // JSON string para dias e programação
  pacotesOptionsData?: string; // JSON string para opções de pacotes
  experienciaSection?: string; // JSON string ou texto da seção Experiência
  /* ── Map and Media Extensions ── */
  surroundingsData?: string;
  packageMediaPool?: string[]; // Banco de fotos do pacote
  /* ── Soft-delete ── */
  deletedAt?: string;
  deletedBy?: string;
}
