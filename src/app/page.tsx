// app/page.tsx

import { Metadata } from "next";
import Image from "next/image";
import CategoryResumenCard from "./components/categoryresumencard/CategoryResumenCard";
import VideoHero from "./components/ui/VideoHero";



export const metadata: Metadata = {
  title: "Jimena Sanchez Propiedades | Desarrollo e Inversiones Inmobiliarias",
  description:
    "Jimena Sanchez Propiedades, desarrollo e inversiones inmobiliarias. Lotes y propiedades en venta en San Vicente, Buenos Aires. Asesoramiento profesional y atención personalizada.",
  keywords:
    "Jimena Sanchez Propiedades, inversiones inmobiliarias, lotes en venta, propiedades San Vicente, desarrollo inmobiliario, Real Estate Buenos Aires",
};


const BenefitCard = ({
  icon,
  title,
  description,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => (
  <div
    className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500 animate-fadeInUp"
    style={{ animationDelay: `${delay + 200}ms` }}
  >
    {/* Glow exterior al hover */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />

    {/* Marco interno */}
    <div className="absolute inset-[1px] rounded-2xl bg-slate-900/90 -z-10" />

    {/* Icono con fondo degradado */}
    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/10 to-purple-500/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:from-cyan-400/20 group-hover:to-purple-500/20 transition-all duration-300">
      <span className="text-purple-400 group-hover:text-white transition-colors duration-300">
        {icon}
      </span>
    </div>

    {/* Contenido */}
    <h3 className="relative text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
      {title}
    </h3>
    <p className="relative text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
      {description}
    </p>
  </div>
);
// Datos de categorías destacadas (de base de datos)

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/gestion/public/categorias/resumen`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Error al cargar categorías");
  }

  const categorias: {
    _id: string;
    totalProductos: number;
    precioDesde: number;
  }[] = await res.json();



  return (
    <>
      {/* Hero Banner (ya lo tienes en Banner.tsx) */}
      <div className="relative w-full top-0 left-0 right-0 ">

        <VideoHero
          videoSrc="/videos/videoblocks-od13382-hd_1.mp4"
          overlayOpacity={0.4}
        >
          <div className="w-full max-w-7xl mx-auto px-6 pt-60">

            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 items-center">

              {/* Texto vertical izquierdo */}
              <div className="hidden lg:flex justify-center">
                <div className="rotate-180 writing-mode-vertical text-white font-black uppercase leading-none tracking-tight text-5xl opacity-90 mr-10 mt-2">
                  JIMENA SANCHEZ
                </div>
              </div>

              {/* Contenido principal */}
              <div className="text-left">

                <div className="space-y-2">
                  {/* <p className="text-sm md:text-lg uppercase tracking-[0.3em] text-purple-300 font-semibold">
                Congreso de 
                </p> */}

                  <h1 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight">
                    Desarrollo <br />
                    e Inversiones <br />
                    Inmobiliarias
                  </h1>

                  <p className="text-lg md:text-2xl uppercase tracking-[0.25em] text-gray-200">
                    Argentina
                  </p>
                </div>

                {/* Fecha */}
                <div className="mt-10 border-t border-white/30 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase">
                      Bienvenidos a<br />Jimena Sanchez Propiedades
                    </h2>

                    <p className="mt-2 text-sm md:text-lg uppercase tracking-wider text-gray-300">
                      San Vicente, Buenos Aires · 9 a 20hs
                    </p>
                  </div>

                  <a
                    href="#tickets"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold uppercase tracking-wide hover:bg-purple-300 transition-all duration-300"
                  >
                    Reservar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </VideoHero>

      </div>


      {/* ═══════════════════════════════════════════════════════
    SECCIÓN VALOR PRINCIPAL - JIMENA SÁNCHEZ PROPIEDADES
    ═══════════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-950">

        {/* ✨ Background ambiental con gradientes */}
        <div className="absolute inset-0">
          {/* Gradiente base */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />

          {/* Glow superior conectado con el VideoHero */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 opacity-40" style={{ filter: 'blur(150px)' }} />

          {/* Orbes decorativos animados */}
          <div className="absolute top-1/4 left-10 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-pink-600/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.8s' }} />
        </div>

        {/* Grid decorativo sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* ───────── COLUMNA IZQUIERDA: CONTENIDO ───────── */}
            <div className="lg:w-1/2 space-y-8 animate-fadeInUp" style={{ animationDelay: '100ms' }}>

              {/* Badge premium */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-cyan-400 to-purple-500" />
                </span>
                <span className="text-[11px] tracking-[0.25em] uppercase text-slate-400 font-medium">
                  Real Estate Premium
                </span>
              </div>

              {/* Título con gradiente en texto */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="text-white">Encontrá tu</span>
                <br />
                <span className={`bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                  Propiedad de Ensueño
                </span>
              </h2>

              {/* Descripción elegante */}
              <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                Asesoramiento <span className="text-white font-medium">personalizado</span>,
                <span className="text-white font-medium"> propiedades exclusivas</span> y oportunidades de inversión.
                Acompañamiento integral para comprar, vender o alquilar en las
                <span className="text-white"> zonas más prestigiosas de Buenos Aires</span>.
              </p>

              {/* Features list premium */}
              <ul className="space-y-4">
                {[
                  { icon: '★', label: 'Propiedades exclusivas en barrios premium', color: 'from-amber-400 to-orange-500' },
                  { icon: '★', label: 'Asesoramiento legal y financiero incluido', color: 'from-cyan-400 to-blue-500' },
                  { icon: '★', label: 'visitas personalizadas', color: 'from-purple-400 to-pink-500' },
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="group flex items-start gap-4 animate-fadeInUp"
                    style={{ animationDelay: `${200 + index * 100}ms` }}
                  >
                    {/* Icono con gradiente animado */}
                    <span className={`relative flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-900/30 group-hover:shadow-purple-900/50 transition-shadow duration-300`}>
                      {feature.icon}
                      <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </span>
                    <span className="text-slate-300 group-hover:text-white transition-colors duration-300">
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTAs Premium */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">

                {/* CTA Principal - Gradiente animado */}
                <a
                  href="/propiedades"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-500 overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  {/* Border glow */}
                  <span className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors duration-300" />

                  <span className="relative z-10">Ver Propiedades Destacadas</span>
                  <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                {/* CTA Secundario - Glassmorphism */}
                <a
                  href="/contacto"
                  className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-white backdrop-blur-sm"
                >
                  <span>Agendar Consulta Gratuita</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Trust indicators 
              <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-slate-950 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[10px] text-white font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-white font-semibold">+150</span>
                  <span className="text-slate-500"> operaciones exitosas</span>
                </div>
              </div>*/}
            </div>

            {/* ───────── COLUMNA DERECHA: IMAGEN PREMIUM ───────── */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end animate-fadeInUp" style={{ animationDelay: '300ms' }}>

              {/* Contenedor de imagen con efectos premium */}
              <div className="relative group">

                {/* Glow exterior animado */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />

                {/* Marco con gradiente animado */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 blur-sm" aria-hidden="true" />

                {/* Card principal con glassmorphism */}
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-2xl shadow-purple-900/30 group-hover:shadow-purple-900/50 transition-all duration-500 group-hover:scale-[1.01]">

                  {/* Header decorativo de la card */}
                  <div className="flex items-center gap-2 px-3 py-2 mb-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-[10px] text-slate-500 tracking-wider ml-2">propiedades-destacadas</span>
                  </div>

                  {/* Imagen principal - Propiedad de lujo */}
                  <div className="relative overflow-hidden rounded-xl">
                    {/* Overlay gradiente sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10" aria-hidden="true" />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <Image
                      src="/img/Logo-Image_removebg.png"
                      alt="Propiedad exclusiva - Jimena Sánchez Propiedades"
                      className="w-full h-auto object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                      width={480}
                      height={980}
                      priority
                    />

                    <br />
                    <br />
                    <br />
                    <br />
                    <br />

                    {/* Badge flotante premium */}
                    <div className="absolute top-4 right-4 z-20 animate-float">
                      <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-sm border border-white/20 shadow-lg">
                        <span className="text-xs font-semibold text-white tracking-wide">Exclusiva</span>
                      </div>
                    </div>

                    {/* Precio badge */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <div className="px-4 py-2 rounded-lg bg-slate-900/90 backdrop-blur-sm border border-white/10">
                        <span className="text-sm font-bold text-white">USD 450.000</span>
                        <span className="text-xs text-slate-400 block">Palermo Soho</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer de la card con stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
                    {[
                      { label: 'Dormitorios', value: '3' },
                      { label: 'Baños', value: '2' },
                      { label: 'm²', value: '120' },
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-[10px] tracking-wide text-slate-500 uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Elementos decorativos flotantes */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl blur-xl animate-pulse" aria-hidden="true" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-xl blur-lg animate-pulse" style={{ animationDelay: '1s' }} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>







  {/* ═══════════════════════════════════════════════════════
    SECCIÓN BENEFICIOS - JIMENA SÁNCHEZ PROPIEDADES
    ═══════════════════════════════════════════════════════ */}
<section className="relative py-20 lg:py-28 overflow-hidden bg-slate-950">
  
  {/* ✨ Background ambiental coherente */}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/15 to-cyan-500/15 opacity-40" style={{ filter: 'blur(150px)' }} />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" aria-hidden="true" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
    
    {/* ───────── HEADER ───────── */}
    <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeInUp">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gradient-to-r from-cyan-400 to-purple-500" />
        </span>
        <span className="text-[11px] tracking-[0.25em] uppercase text-slate-400 font-medium">
          Nuestra Diferencia
        </span>
      </span>
      
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        ¿Por qué confiar en Jimena Sánchez?
      </h2>
      
      <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
        Una experiencia inmobiliaria transparente, personalizada y orientada a resultados reales para tu inversión.
      </p>
    </div>

    {/* ───────── GRID DE BENEFICIOS ───────── */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <BenefitCard
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        }
        title="Asesoramiento Experto"
        description="Guía profesional en cada paso: desde la búsqueda hasta la firma. Conocimiento profundo del mercado inmobiliario."
        delay={0}
      />
      <BenefitCard
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        }
        title="Negociación Estratégica"
        description="Maximizo el valor de tu operación con técnicas de negociación probadas y conocimiento del mercado local."
        delay={100}
      />
      <BenefitCard
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        }
        title="Transacciones Seguras"
        description="Verificación legal completa de cada propiedad. Acompañamiento en documentación, escrituración y trámites."
        delay={200}
      />
      <BenefitCard
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        }
        title="Atención Personalizada"
        description="Un asesor comercial dedicado a tu negocio. Sin chatbots, sin demoras, solo soluciones."
        delay={300}
      />
    </div>

    {/* ───────── CTA INFERIOR ───────── */}
    <div className="text-center mt-16 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
      <a
        href="/contacto"
        className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-500 overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl hover:shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98]"
      >
        {/* Shine effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <span className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors duration-300" />
        
        <span className="relative z-10">Agendar una Consulta Gratuita</span>
        <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </div>
  </div>
</section>



      {/* Categorías destacadas */}
      <section className="py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold dark:text-white">
              Nuestras Categorías
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Explorá lo que tenemos disponible hoy
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorias.map((cat: any) => (
              <CategoryResumenCard
                key={cat._id}
                categoria={cat._id}
                total={cat.totalProductos}
                desde={cat.precioDesde}
              />
            ))}
          </div>
        </div>
      </section>


   
    </>
  );
}