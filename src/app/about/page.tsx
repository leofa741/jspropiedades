// app/about/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────
// ICONOS SVG PREMIUM
// ─────────────────────────────────────────────────────────────
const Icons = {
  Star: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
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
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [activeStat, setActiveStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Animación escalonada de stats
    const interval = setInterval(() => {
      setActiveStat(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // 🎨 Paleta Premium - Coherente con el resto del sitio
  const gradients = {
    primary: 'from-indigo-500 via-purple-500 to-pink-500',
    accent: 'from-cyan-400 via-blue-500 to-violet-500',
    glow: 'from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20',
  };

  // Datos de la sección "Mi Historia"
  const timeline = [
    { year: '2015', title: 'Inicio en el sector', desc: 'Comencé mi carrera en una inmobiliaria tradicional, aprendiendo los fundamentos del mercado.' },
    { year: '2018', title: 'Especialización en lujo', desc: 'Me enfoqué en propiedades premium y desarrollé mi metodología de asesoramiento personalizado.' },
    { year: '2021', title: 'Jimena Sánchez Propiedades', desc: 'Fundé mi propia marca con la visión de redefinir la experiencia inmobiliaria en Argentina.' },
    { year: '2024', title: '+150 operaciones', desc: 'Hoy acompaño a familias e inversores en sus proyectos más importantes con resultados comprobados.' },
  ];

  // Valores fundamentales
  const values = [
    {
      icon: <Icons.Heart />,
      title: 'Pasión por lo que hago',
      desc: 'Cada propiedad representa un sueño, una inversión, un nuevo comienzo. Me involucro personalmente en cada proceso.',
      color: 'from-pink-400 to-rose-500',
    },
    {
      icon: <Icons.Shield />,
      title: 'Transparencia absoluta',
      desc: 'Sin letras chicas, sin sorpresas. Te explico cada paso, cada costo y cada posibilidad con claridad total.',
      color: 'from-cyan-400 to-blue-500',
    },
    {
      icon: <Icons.Target />,
      title: 'Resultados comprobados',
      desc: 'Mi éxito se mide por el tuyo. +150 operaciones cerradas con satisfacción garantizada son mi mejor carta de presentación.',
      color: 'from-purple-400 to-indigo-500',
    },
    {
      icon: <Icons.Users />,
      title: 'Relaciones a largo plazo',
      desc: 'No busco una transacción, busco ser tu referente inmobiliario de confianza por años. Tu satisfacción es mi mejor marketing.',
      color: 'from-emerald-400 to-teal-500',
    },
  ];

  // Stats animados
  const stats = [
    { value: '150+', label: 'Operaciones exitosas', suffix: '' },
    { value: '98%', label: 'Clientes satisfechos', suffix: '' },
    { value: '12', label: 'Años de experiencia', suffix: '+' },
    { value: '25', label: 'Barrios de CABA', suffix: '+' },
  ];

  // Testimonios
  const testimonials = [
    {
      name: 'María L.',
      role: 'Compradora - Palermo',
      text: 'Jimena entendió exactamente lo que buscaba. En 3 semanas ya tenía las llaves de mi nuevo departamento. Profesional, cercana y eficiente.',
      avatar: 'ML',
    },
    {
      name: 'Carlos R.',
      role: 'Vendedor - Nordelta',
      text: 'Vendí mi propiedad por encima del precio de mercado gracias a su estrategia de marketing y negociación. 100% recomendada.',
      avatar: 'CR',
    },
    {
      name: 'Ana & Diego',
      role: 'Inversores',
      text: 'Nos asesoró en la compra de nuestra primera propiedad para alquiler. Hoy tenemos un ingreso pasivo gracias a su guía experta.',
      avatar: 'AD',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      
      {/* ✨ Background ambiental */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 opacity-40" style={{ filter: 'blur(150px)' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" aria-hidden="true" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION - MI HISTORIA
          ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Columna izquierda: Foto premium */}
            <div className={`relative order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Glow exterior */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${gradients.accent} rounded-3xl blur-2xl opacity-30 animate-pulse`} aria-hidden="true" />
              
              {/* Marco con gradiente */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${gradients.primary} rounded-2xl opacity-50 blur-sm`} aria-hidden="true" />
              
              {/* Contenedor principal */}
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-2xl">
                <div className="relative overflow-hidden rounded-xl aspect-[4/5] lg:aspect-square">
                  <Image
                    src="/img/about.png"
                    alt="Jimena Sánchez - Asesora Inmobiliaria"
                    fill
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  {/* Overlay gradiente sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" aria-hidden="true" />
                  
                  {/* Badge flotante 
                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 p-4 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-white/10">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradients.accent} flex items-center justify-center text-white font-bold shadow-lg`}>
                      JS
                    </div>
                    <div>
                      <p className="text-white font-semibold">Jimena Sánchez</p>
                      <p className="text-slate-400 text-sm">Asesora Inmobiliaria Premium</p>
                    </div>
                  </div>*/}
                </div>
              </div>
            </div>

            {/* Columna derecha: Contenido */}
            <div className={`order-1 lg:order-2 space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-cyan-400 to-purple-500" />
                </span>
                <span className="text-[11px] tracking-[0.25em] uppercase text-slate-400 font-medium">
                  Sobre Mí
                </span>
              </div>

              {/* Título con gradiente */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-white">Más que una inmobiliaria,</span>
                <br />
                <span className={`bg-gradient-to-r ${gradients.primary} bg-clip-text text-transparent`}>
                  tu aliada estratégica
                </span>
              </h1>

              {/* Descripción */}
              <p className="text-lg text-slate-400 leading-relaxed">
                Hola, soy <span className="text-white font-medium">Jimena Sánchez</span>. 
                Desde hace más de una década, ayudo a personas e inversores a concretar 
                sus proyectos inmobiliarios con <span className="text-white">asesoramiento experto, 
                transparencia y resultados reales</span>.
              </p>

              {/* Features */}
              <ul className="space-y-3 pt-2">
                {[
                  'Asesoramiento 100% personalizado',
                  'Conocimiento profundo del mercado porteño',
                  'Acompañamiento en cada etapa del proceso',
                  'Red de contactos premium para oportunidades exclusivas',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${gradients.accent} flex items-center justify-center text-white text-xs mt-0.5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icons.Check />
                    </span>
                    <span className="text-slate-300 group-hover:text-white transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/contacto"
                  className={`group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-500 overflow-hidden bg-gradient-to-r ${gradients.primary} text-white hover:shadow-2xl hover:shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10">Agendar Consulta Gratuita</span>
                  <Icons.ArrowRight />
                </Link>
                <Link
                  href="/propiedades"
                  className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-white backdrop-blur-sm"
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
          TIMELINE - MI TRAYECTORIA
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          {/* Header de sección */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Mi trayectoria
            </h2>
            <p className="text-lg text-slate-400">
              Cada etapa construida con dedicación, aprendizaje y el compromiso de ofrecer 
              un servicio inmobiliario diferente.
            </p>
          </div>

          {/* Timeline vertical */}
          <div className="relative">
            {/* Línea central */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" aria-hidden="true" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div 
                  key={index}
                  className={`relative flex flex-col lg:flex-row gap-6 lg:gap-12 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Punto de la línea */}
                  <div className="absolute left-4 lg:left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 border-4 border-slate-950 z-10" aria-hidden="true" />
                  
                  {/* Contenido */}
                  <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                    <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500 ml-12 lg:ml-0">
                      {/* Glow al hover */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
                      
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-3 bg-gradient-to-r ${gradients.accent} bg-clip-text text-transparent border border-purple-500/30`}>
                        {item.year}
                      </span>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  
                  {/* Espacio vacío para el otro lado en desktop */}
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          VALORES - POR QUÉ ELEGIRME
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <Icons.Star />
              <span className="text-[11px] tracking-[0.25em] uppercase text-slate-400 font-medium">
                Mis Valores
              </span>
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Lo que me diferencia
            </h2>
            <p className="text-lg text-slate-400">
              No solo vendo propiedades. Construyo relaciones de confianza basadas en 
              principios que guían cada decisión.
            </p>
          </div>

          {/* Grid de valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group relative p-6 lg:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow exterior */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
                
                {/* Icono con gradiente */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  {value.icon}
                </div>
                
                {/* Contenido */}
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
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
          STATS ANIMADOS
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm text-center transition-all duration-500 hover:border-purple-500/40 ${
                  activeStat === index ? 'scale-105 border-purple-500/60' : ''
                }`}
              >
                {/* Glow al activo */}
                {activeStat === index && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradients.accent} rounded-2xl opacity-20 blur-lg -z-10 animate-pulse`} aria-hidden="true" />
                )}
                
                <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${gradients.primary} bg-clip-text text-transparent mb-2 transition-all duration-500`}>
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
          TESTIMONIOS
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Lo que dicen mis clientes
            </h2>
            <p className="text-lg text-slate-400">
              Cada historia de éxito es mi mayor satisfacción. Estas son algunas voces 
              que confían en mi trabajo.
            </p>
          </div>

          {/* Grid de testimonios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500"
              >
                {/* Quote decorativo */}
                <div className="absolute top-6 right-6 text-purple-400/30">
                  <Icons.Quote />
                </div>
                
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradients.accent} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* Texto */}
                <p className="text-slate-300 leading-relaxed relative z-10">
                  "{testimonial.text}"
                </p>
                
                {/* Estrellas */}
                <div className="flex gap-1 mt-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA FINAL
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          
          {/* Card CTA premium */}
          <div className="group relative p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-900/70 border border-white/10 backdrop-blur-xl overflow-hidden">
            
            {/* Glow interior */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradients.glow} opacity-30`} style={{ filter: 'blur(100px)' }} aria-hidden="true" />
            
            {/* Contenido */}
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                ¿Listo para comenzar tu próximo proyecto?
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                Ya sea que quieras comprar, vender o invertir, estoy aquí para guiarte 
                con la experiencia y el compromiso que merecés.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contacto"
                  className={`group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-500 overflow-hidden bg-gradient-to-r ${gradients.primary} text-white hover:shadow-2xl hover:shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative z-10">Agendar Consulta Gratuita</span>
                  <Icons.ArrowRight />
                </Link>
                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 hover:border-emerald-500/50 text-white backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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