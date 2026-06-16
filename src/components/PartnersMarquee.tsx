export default function PartnersMarquee() {
  return (
    <section className="-mt-12 relative z-20 py-20 border-b border-white/5 overflow-hidden flex flex-col items-center" style={{ background: 'linear-gradient(to bottom, transparent 0%, #09090b 60%)' }}>
      <p className="text-[11px] text-white uppercase tracking-[0.2em] mb-10 font-bold z-10 px-6 text-center">
        Realização e Agência Oficial
      </p>

      <div className="w-full relative flex overflow-hidden py-4">
        {/* Gradient masks for smooth fade in/out on edges */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-marquee">
          {[1, 2, 3, 4].map((set) => (
            <div key={set} className="flex items-center justify-around gap-16 md:gap-32 px-8 md:px-16 w-max" aria-hidden={set !== 1 ? "true" : "false"}>
              <img src="/conexao_logo.png" alt="Conexão" className="h-8 md:h-26 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer" />
              <img src="/abradilan_logo.png" alt="Abradilan" className="-translate-y-4 h-8 md:h-16 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer" />
              <img src="/logo_mais_branco.png" alt="Mais" className="h-8 md:h-12 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer" />

              <img src="/conexao_logo.png" alt="Conexão" className="h-8 md:h-26 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer" />
              <img src="/abradilan_logo.png" alt="Abradilan" className="-translate-y-4 h-8 md:h-16 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer" />
              <img src="/logo_mais_branco.png" alt="Mais" className="h-8 md:h-12 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer" />

              <img src="/conexao_logo.png" alt="Conexão" className="h-8 md:h-26 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer" />
              <img src="/abradilan_logo.png" alt="Abradilan" className="-translate-y-4 h-8 md:h-16 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer" />
              <img src="/logo_mais_branco.png" alt="Mais" className="h-8 md:h-12 w-auto object-contain brightness-0 invert opacity-40 hover:opacity-100 transition-all duration-300 hover:scale-110 cursor-pointer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
