// app/about/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────
// ICONOS SVG PREMIUM
// ─────────────────────────────────────────────────────────────
const Icons = {
  Star: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  Target: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  Quote: () => (
    <svg className="w-8 h-8 opacity-30" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE DE IMAGEN PREMIUM CON EFECTOS
// ─────────────────────────────────────────────────────────────
const PremiumImageFrame = ({ src, alt, isVisible }: { src: string; alt: string; isVisible: boolean }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!frameRef.current) return;
      const rect = frameRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={frameRef}
      className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {/* ✨ Orbes de luz flotantes */}
      <div className="absolute -top-8 -left-8 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0s' }} />
      <div className="absolute -bottom-6 -right-6 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      {/* 🖼️ Marco principal con efecto cristal premium */}
      <div className="relative group">
        {/* Glow dinámico que sigue el mouse (desktop) */}
        <div 
          className="hidden lg:block absolute -inset-1 bg-gradient-to-r from-violet-500/40 via-fuchsia-500/40 to-cyan-500/40 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.4), transparent 40%)`,
          }}
        />

        {/* Borde animado con gradiente */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm animate-gradient-xy" />
        
        {/* Contenedor de cristal */}
        <div className="relative bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-1.5 sm:p-2 border border-white/10 shadow-2xl shadow-violet-900/20">
          
          {/* Imagen principal con parallax sutil */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-800/50 aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[520px] xl:h-[580px]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            />
            
            {/* Overlay gradiente elegante */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none" />
            
            {/* Badge flotante premium */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 animate-float">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                <Icons.Sparkles />
                <span className="text-xs sm:text-sm font-medium text-white">Asesora Premium</span>
              </div>
            </div>

            {/* Decoración de esquina */}
            <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 border border-white/10 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-12 h-12 sm:w-16 sm:h-16 border border-white/10 rounded-bl-2xl pointer-events-none" />
          </div>

          {/* Footer decorativo con nombre */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10">
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                JS
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm sm:text-base truncate">Jimena Sánchez</p>
                <p className="text-slate-400 text-xs">Asesora Inmobiliaria</p>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Icons.Star key={i} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Partículas decorativas flotantes */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-violet-400 rounded-full animate-ping opacity-70" />
        <div className="absolute top-1/4 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 -right-1 w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [activeStat, setActiveStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => setActiveStat(prev => (prev + 1) % 4), 3000);
    return () => clearInterval(interval);
  }, []);

  const gradients = {
    primary: 'from-indigo-500 via-purple-500 to-pink-500',
    accent: 'from-cyan-400 via-blue-500 to-violet-500',
    glow: 'from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20',
  };

  const timeline = [
    { year: '2015', title: 'Inicio en el sector', desc: 'Comencé mi carrera en una inmobiliaria tradicional, aprendiendo los fundamentos del mercado.' },
    { year: '2018', title: 'Especialización en lujo', desc: 'Me enfoqué en propiedades premium y desarrollé mi metodología de asesoramiento personalizado.' },
    { year: '2021', title: 'Jimena Sánchez Propiedades', desc: 'Fundé mi propia marca con la visión de redefinir la experiencia inmobiliaria en Argentina.' },
    { year: '2024', title: '+150 operaciones', desc: 'Hoy acompaño a familias e inversores en sus proyectos más importantes con resultados comprobados.' },
  ];

  const values = [
    { icon: <Icons.Heart />, title: 'Pasión por lo que hago', desc: 'Cada propiedad representa un sueño, una inversión, un nuevo comienzo. Me involucro personalmente en cada proceso.', color: 'from-pink-400 to-rose-500' },
    { icon: <Icons.Shield />, title: 'Transparencia absoluta', desc: 'Sin letras chicas, sin sorpresas. Te explico cada paso, cada costo y cada posibilidad con claridad total.', color: 'from-cyan-400 to-blue-500' },
    { icon: <Icons.Target />, title: 'Resultados comprobados', desc: 'Mi éxito se mide por el tuyo. +150 operaciones cerradas con satisfacción garantizada son mi mejor carta de presentación.', color: 'from-purple-400 to-indigo-500' },
    { icon: <Icons.Users />, title: 'Relaciones a largo plazo', desc: 'No busco una transacción, busco ser tu referente inmobiliario de confianza por años. Tu satisfacción es mi mejor marketing.', color: 'from-emerald-400 to-teal-500' },
  ];

  const stats = [
    { value: '150+', label: 'Operaciones exitosas', suffix: '' },
    { value: '98%', label: 'Clientes satisfechos', suffix: '' },
    { value: '12', label: 'Años de experiencia', suffix: '+' },
    { value: '25', label: 'Barrios de CABA', suffix: '+' },
  ];

  const testimonials = [
    { name: 'María L.', role: 'Compradora - Palermo', text: 'Jimena entendió exactamente lo que buscaba. En 3 semanas ya tenía las llaves de mi nuevo departamento. Profesional, cercana y eficiente.', avatar: 'ML' },
    { name: 'Carlos R.', role: 'Vendedor - Nordelta', text: 'Vendí mi propiedad por encima del precio de mercado gracias a su estrategia de marketing y negociación. 100% recomendada.', avatar: 'CR' },
    { name: 'Ana & Diego', role: 'Inversores', text: 'Nos asesoró en la compra de nuestra primera propiedad para alquiler. Hoy tenemos un ingreso pasivo gracias a su guía experta.', avatar: 'AD' },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-x-hidden">
      
      {/* ✨ Background ambiental premium */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 opacity-40" style={{ filter: 'blur(180px)' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)]" aria-hidden="true" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION - DISEÑO SUPER PREMIUM
          ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-8 sm:pt-16 lg:pt-24 pb-12 sm:pb-20 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">

            {/* Columna izquierda: Imagen Premium Rediseñada */}
            <PremiumImageFrame 
              src="/img/about-2.png" 
              alt="Jimena Sánchez - Asesora Inmobiliaria Premium" 
              isVisible={isVisible} 
            />

            {/* Columna derecha: Contenido Premium */}
            <div className={`order-1 lg:order-2 space-y-6 sm:space-y-8 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              {/* Badge animado */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-cyan-400 to-violet-500" />
                </span>
                <span className="text-[11px] tracking-[0.3em] uppercase text-violet-300 font-semibold">
                  Sobre Mí
                </span>
              </div>

              {/* Título con efecto gradiente animado */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight">
                <span className="text-white block">Más que una</span>
                <span className={`block bg-gradient-to-r ${gradients.primary} bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient`}>
                  inmobiliaria,
                </span>
                <span className="text-white block mt-1">tu aliada</span>
                <span className={`block bg-gradient-to-r ${gradients.accent} bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient`} style={{ animationDelay: '0.2s' }}>
                  estratégica
                </span>
              </h1>

              {/* Descripción elegante */}
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
                Hola, soy <span className="text-white font-semibold">Jimena Sánchez</span>. 
                Desde hace más de una década, ayudo a personas e inversores a concretar 
                sus proyectos inmobiliarios con <span className="text-white font-medium">asesoramiento experto</span>, 
                transparencia y resultados reales.
              </p>

              {/* Features con iconos animados */}
              <ul className="space-y-4 pt-2">
                {[
                  'Asesoramiento 100% personalizado',
                  'Conocimiento profundo del mercado porteño',
                  'Acompañamiento en cada etapa del proceso',
                  'Red de contactos premium para oportunidades exclusivas',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${gradients.accent} flex items-center justify-center text-white text-xs shadow-lg shadow-violet-900/30 group-hover:shadow-violet-900/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icons.Check />
                    </span>
                    <span className="text-slate-300 group-hover:text-white transition-colors duration-300 text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTAs Premium con efectos */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/contact"
                  className={`group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-500 overflow-hidden bg-gradient-to-r ${gradients.primary} text-white hover:shadow-2xl hover:shadow-violet-900/50 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="absolute inset-0 rounded-2xl border border-white/30 group-hover:border-white/50 transition-colors duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    Agendar Consulta Gratuita
                    <Icons.ArrowRight />
                  </span>
                </Link>
                <Link
                  href="/propiedades"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 text-white backdrop-blur-sm active:scale-[0.98]"
                >
                  <span>Ver Propiedades</span>
                  <Icons.ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TIMELINE - MI TRAYECTORIA (Estilo Premium)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <Icons.Star />
              <span className="text-[11px] tracking-[0.25em] uppercase text-slate-400 font-medium">Mi Trayectoria</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Construyendo excelencia
            </h2>
            <p className="text-lg text-slate-400">
              Cada etapa construida con dedicación, aprendizaje y el compromiso de ofrecer 
              un servicio inmobiliario diferente.
            </p>
          </div>

          <div className="relative">
            {/* Línea central con gradiente animado */}
            <div className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/50 to-transparent" aria-hidden="true" />
            
            <div className="space-y-10 lg:space-y-16">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex flex-col lg:flex-row gap-6 lg:gap-16 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Punto de la línea animado */}
                  <div className="absolute left-5 lg:left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 border-4 border-slate-950 z-10 shadow-lg shadow-violet-900/30" aria-hidden="true" />
                  
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-20 lg:text-right' : 'lg:pl-20'}`}>
                    <div className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-violet-500/30 transition-all duration-500 ml-14 lg:ml-0">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
                      
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-4 bg-gradient-to-r ${gradients.accent} bg-clip-text text-transparent border border-violet-500/30`}>
                        <Icons.Sparkles />
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          VALORES - GRID PREMIUM
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <Icons.Heart />
              <span className="text-[11px] tracking-[0.25em] uppercase text-slate-400 font-medium">Mis Valores</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Lo que me define
            </h2>
            <p className="text-lg text-slate-400">
              No solo vendo propiedades. Construyo relaciones de confianza basadas en 
              principios que guían cada decisión.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-violet-500/30 transition-all duration-500"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
                
                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 shadow-lg shadow-violet-900/30`}>
                  {value.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS ANIMADOS - DISEÑO PREMIUM
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/10 backdrop-blur-sm text-center transition-all duration-500 hover:border-violet-500/40 ${activeStat === index ? 'scale-105 border-violet-500/60 shadow-lg shadow-violet-900/20' : ''}`}
              >
                {activeStat === index && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradients.accent} rounded-3xl opacity-20 blur-lg -z-10 animate-pulse`} aria-hidden="true" />
                )}
                
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r ${gradients.primary} bg-clip-text text-transparent mb-2 transition-all duration-500`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TESTIMONIOS - CARDS PREMIUM
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Lo que dicen mis clientes
            </h2>
            <p className="text-lg text-slate-400">
              Cada historia de éxito es mi mayor satisfacción. Estas son algunas voces 
              que confían en mi trabajo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm hover:border-violet-500/30 transition-all duration-500"
              >
                <div className="absolute top-6 right-6 text-violet-400/30 pointer-events-none">
                  <Icons.Quote />
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients.accent} flex items-center justify-center text-white font-bold shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed relative z-10 mb-6">
                  "{testimonial.text}"
                </p>

                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => <Icons.Star key={i} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA FINAL - CARD PREMIUM
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="group relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90 border border-white/10 backdrop-blur-2xl overflow-hidden">
            
            {/* Glow interior animado */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradients.glow} opacity-40`} style={{ filter: 'blur(120px)' }} aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)]" aria-hidden="true" />

            {/* Contenido */}
            <div className="relative z-10 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                ¿Listo para comenzar tu próximo proyecto?
              </h2>
              <p className="text-lg sm:text-xl text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
                Ya sea que quieras comprar, vender o invertir, estoy aquí para guiarte 
                con la experiencia y el compromiso que merecés.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-500 overflow-hidden bg-gradient-to-r ${gradients.primary} text-white hover:shadow-2xl hover:shadow-violet-900/50 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center gap-2">
                    Agendar Consulta Gratuita
                    <Icons.ArrowRight />
                  </span>
                </Link>
                <a
                  href="https://wa.me/5491132538837?text=Hola,%20me%20interesa%20consultar%20por%20una%20propiedad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 hover:border-emerald-500/50 text-white backdrop-blur-sm active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp Directo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}