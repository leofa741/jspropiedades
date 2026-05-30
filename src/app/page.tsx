// app/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { FaHome, FaSearch, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaFilter, FaArrowRight } from 'react-icons/fa';
import { formatARS } from '@/app/lib/formatcurrenci';

import VideoHero from './components/ui/VideoHero';
import Image from 'next/image';
import PropertyCard from './components/public/PropertyCard';
import { useRouter } from 'next/navigation';
import router from 'next/router';
import RotatingCircle from './components/ui/RotatingCircle';
import { useRef } from 'react';



// ─────────────────────────────────────────────────────────────
// 🔹 Tipos (basados en tu JSON real)
// ─────────────────────────────────────────────────────────────

interface PublicProperty {
  _id: string;
  titulo: string;
  descripcion: string;
  tipoPropiedad: 'departamento' | 'casa' | 'local' | 'oficina' | 'terreno' | 'cochera' | 'galpon' | 'ph';
  tipoOperacion: 'venta' | 'alquiler' | 'ambos';
  categoria: 'residencial' | 'comercial' | 'industrial' | 'inversion';
  ubicacion: {
    barrio: string;
    ciudad: string;
    provincia: string;
    zona?: string;
    mostrarExacta: boolean;
    calle?: string;
    numero?: string;
  };
  precio: {
    monto?: number;
    moneda: 'ARS' | 'USD';
    tipo: 'venta' | 'alquiler';
  };
  imagen?: string;
  slug?: string;
  destacado: boolean;
  urgente: boolean;
  caracteristicas?: {
    ambientes?: number;
    dormitorios?: number;
    banios?: number;
    metrosCubiertos?: number;
    cochera?: boolean;
    balcon?: boolean;
    pileta?: boolean;
  };
}

interface CategoryCount {
  slug: string;
  name: string;
  count: number;
  tipos?: string[];
}

interface ApiResponse {
  propiedades: PublicProperty[];
  counts: { venta: number; alquiler: number; ambos: number };
  total: number;
}

interface CategoriesResponse {
  categorias: CategoryCount[];
  tiposPropiedad: CategoryCount[];
  barrios: Array<{ slug: string; name: string; count: number; ciudad: string }>;
  totals: { venta: number; alquiler: number; total: number };
}

// ─────────────────────────────────────────────────────────────
// 🔹 Helpers de formato (basados en tus datos reales)
// ─────────────────────────────────────────────────────────────

const formatPrice = (monto?: number, moneda: 'ARS' | 'USD' = 'USD', tipo: 'venta' | 'alquiler' = 'venta') => {
  if (!monto) return 'Consultar';
  if (moneda === 'ARS') return formatARS(monto);
  const suffix = tipo === 'alquiler' ? '/mes' : '';
  return `$ ${monto.toLocaleString('es-AR')} ${moneda}${suffix}`;
};

const getTipoIcon = (tipo: string) => {
  const icons: Record<string, string> = {
    departamento: '🏢', casa: '🏠', local: '🏪', oficina: '🏢',
    terreno: '🌳', cochera: '🚗', galpon: '🏭', ph: '🏘️',
  };
  return icons[tipo] || '🏠';
};

// ─────────────────────────────────────────────────────────────
// 🔹 Componente Principal con Suspense
// ─────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoader />}>
      <PageContent />
    </Suspense>
  );
}

function HomeLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-violet-500 border-r-purple-500 mx-auto mb-4" />
        <p className="text-slate-400">Cargando propiedades...</p>
      </div>
    </div>
  );
}

function PageContent() {
  const [propiedades, setPropiedades] = useState<PublicProperty[]>([]);
  const [destacadas, setDestacadas] = useState<PublicProperty[]>([]);
  const [counts, setCounts] = useState({ venta: 0, alquiler: 0, ambos: 0 });
  const [categorias, setCategorias] = useState<CategoryCount[]>([]);
  const [barrios, setBarrios] = useState<Array<{ slug: string; name: string; count: number; ciudad: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const move = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty('--x', `${x}px`);
      container.style.setProperty('--y', `${y}px`);
    };

    container.addEventListener('mousemove', move);

    return () => {
      container.removeEventListener('mousemove', move);
    };
  }, []);




  // 📥 Cargar datos desde tus endpoints públicos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Propiedades destacadas
        const resDestacadas = await fetch('/api/gestion/public/propiedades?destacado=true&limit=6');
        if (resDestacadas.ok) {
          const data: ApiResponse = await resDestacadas.json();
          setDestacadas(data.propiedades);
          setCounts(data.counts);
        }

        // 2. Todas las propiedades para listado general
        const resTodas = await fetch('/api/gestion/public/propiedades?limit=12');
        if (resTodas.ok) {
          const data: ApiResponse = await resTodas.json();
          setPropiedades(data.propiedades);
        }

        // 3. Categorías con counts (para navbar y home)
        const resCats = await fetch('/api/gestion/public/categorias');
        if (resCats.ok) {
          const cats: CategoriesResponse = await resCats.json();
          setCategorias(cats.categorias);
          setBarrios(cats.barrios);
        }
      } catch (err) {
        console.error('Error loading public data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔍 Búsqueda simple en frontend
  const filteredProperties = propiedades.filter(prop =>
    searchQuery === '' ||
    prop.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.ubicacion.barrio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.ubicacion.ciudad.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.tipoPropiedad.toLowerCase().includes(searchQuery.toLowerCase())
  );


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

  if (loading) return <HomeLoader />;

  return (



    <div className="min-h-screen bg-slate-950 text-white">


      {/* Hero Banner (ya lo tienes en Banner.tsx) */}
      <div className="relative w-full  left-0 right-0 ">

        <VideoHero
          videoSrc="/videos/videoblocks-od13382-hd_1.mp4"
          overlayOpacity={0.4}
         

        >


          <div className=" max-w-7xl mx-auto px-6 pt-50">
            <RotatingCircle
              text="✦ ANEMIJ ✦ SEDADEIPORP  "
              size={200}
              duration={10}

            />

            <div className="absolute bottom-0 left-0 right-0 pb-120 px-4 opacity-80">
              <div className="max-w-4xl mx-auto">

                {/* Search Container con glassmorphism optimizado para móvil */}
                <div className="relative w-full max-w-2xl mx-auto group">
                  {/* Glow exterior */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-cyan-500/30 rounded-2xl blur opacity-30 group-hover:opacity-60 group-focus-within:opacity-60 transition-opacity duration-500 pointer-events-none" />

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const query = searchQuery.trim();
                      if (query) router.push(`/propiedades?search=${encodeURIComponent(query)}`);
                    }}
                    className="relative flex items-center w-full p-2 sm:p-2.5 gap-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl focus-within:border-white/20 transition-all duration-300"
                  >
                    {/* Icono */}
                    <div className="pl-2 sm:pl-3 text-slate-400 flex-shrink-0">
                      <FaSearch className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    {/* Input principal */}
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Palermo, departamento, inversión..."
                      className="flex-1 min-w-0 bg-transparent text-white placeholder-slate-500 focus:outline-none py-2 sm:py-3 text-sm sm:text-base"
                    />

                    {/* Botón de búsqueda */}
                    <button
                      type="submit"
                      className="flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm sm:text-base font-medium rounded-xl transition-all duration-300 shadow-lg shadow-violet-900/30 hover:shadow-violet-900/50 active:scale-95 whitespace-nowrap"
                    >
                      Buscar
                    </button>
                  </form>

                  {/* Helper text con pills interactivos */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                    <span>Ej:</span>
                    {['Palermo', 'departamento', 'venta'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-violet-400 hover:text-violet-300 transition-all duration-200 active:scale-95"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>


              </div>
            </div>

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

                  <div className="group relative inline-block overflow-hidden rounded-2xl">
                    {/* 1. Gradiente base sutil */}
                    <span className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03] transition-opacity duration-500 " />

                    {/* 2. Shine effect (luz que atraviesa al hover) */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-2xl" />

                    {/* 3. Borde/Glow que se intensifica 
                    <span className="absolute inset-0 border border-white/10 group-hover:border-white/30 transition-colors duration-300 rounded-2xl" />
*/}
                    {/* 4. Texto con transparencia base que se ilumina */}
                    <h1 className="relative z-10 text-4xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight text-white/60 group-hover:text-white/90 group-hover:[text-shadow:0_0_30px_rgba(255,255,255,0.15)] transition-all duration-500 ease-out selection:bg-white/20 rounded-2xl">
                      Desarrollo <br />
                      e Inversiones <br />
                      Inmobiliarias
                    </h1>
                  </div>

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

                  <br />
                  <br />

                  <a
                    href="https://wa.me/+5491161959365"
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
              href="/contact"
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


   {/* ═══════════════════════════════════════════════════════
    SECCIÓN VALOR PRINCIPAL - JIMENA SÁNCHEZ PROPIEDADES
    ═══════════════════════════════════════════════════════ */}
      <section className="relative -mt-20 py-25 lg:py-28 overflow-hidden bg-slate-950">

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
                  Jimena Sanchez Propiedades
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
                  href="/contact"
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

                    <Image
                      src={destacadas[0]?.imagen || '/img/logo-dorado-removebg.png'}
                      alt={destacadas[0]?.titulo || 'Propiedad exclusiva - Jimena Sánchez Propiedades'}
                      className="w-full h-auto object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                      width={780}
                      height={780}
                      priority
                    />
                    <br /> <br />

                    {/* Badge flotante premium */}
                    <div className="absolute top-4 right-4 z-20 animate-float">
                      <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-sm border border-white/20 shadow-lg">
                        <span className="text-xs font-semibold text-white tracking-wide">Exclusiva</span>
                      </div>
                    </div>

                    {/* Precio badge */}
                    {/* Badge de precio - dentro del div de la imagen */}
                    {destacadas[0] && (
                      <div className="absolute bottom-4 left-4 z-20">
                        <div className="px-4 py-2 rounded-lg bg-slate-900/90 backdrop-blur-sm border border-white/10">
                          <span className="text-sm font-bold text-white">
                            {formatPrice(destacadas[0].precio.monto, destacadas[0].precio.moneda, destacadas[0].precio.tipo)}
                          </span>
                          <span className="text-xs text-slate-400 block">
                            {destacadas[0].ubicacion.barrio}
                          </span>
                        </div>
                      </div>
                    )}
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


      <br />

      {/* 🏆 Propiedades Destacadas - USANDO TU CAMPO `destacado: true` */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <FaStar className="text-amber-400" />
                Propiedades Destacadas
              </h2>
              <p className="text-slate-400 mt-2">Las mejores oportunidades seleccionadas para vos</p>
            </div>
            <Link
              href="/propiedades?destacado=true"
              className="text-violet-400 hover:text-violet-300 font-medium flex items-center gap-2"
            >
              Ver todas <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {destacadas.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FaBuilding className="text-4xl mb-3 mx-auto opacity-50" />
              <p>No hay propiedades destacadas en este momento</p>
              <Link href="/propiedades" className="text-violet-400 hover:text-violet-300 mt-4 inline-block">
                Ver todas las  propiedades →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destacadas.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 📂 Explorar por Categoría - USANDO TU CAMPO `categoria` */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Explorar por Categoría
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Encontrá exactamente lo que buscás filtrando por tipo de propiedad o ubicación
            </p>
          </div>

          {/* Grid de categorías - BASADO EN TU ENDPOINT `/api/gestion/public/categorias` */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/propiedades?categoria=${cat.slug}`}
                className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-700/50 hover:border-violet-500/40 hover:bg-slate-800/90 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{getTipoIcon(cat.slug)}</span>
                  <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-white font-semibold group-hover:text-violet-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  {cat.tipos?.slice(0, 2).join(', ')}{cat.tipos && cat.tipos.length > 2 ? '...' : ''}
                </p>
              </Link>
            ))}
          </div>

          {/* Barrios populares - BASADO EN TU CAMPO `direccion.barrio` */}
          {barrios.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-violet-400" />
                Barrios Populares
              </h3>
              <div className="flex flex-wrap gap-2">
                {barrios.map((barrio) => (
                  <Link
                    key={barrio.slug}
                    href={`/propiedades?barrio=${barrio.slug}`}
                    className="px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-violet-500/20 hover:border-violet-500/40 hover:text-violet-400 transition-all text-sm flex items-center gap-2"
                  >
                    {barrio.name}
                    <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-xs">
                      {barrio.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 🏠 Listado General - USANDO TU CAMPO `estado: 'publicado'` */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Todas las Propiedades
              </h2>
              <p className="text-slate-400 mt-2">
                {filteredProperties.length} propiedad{filteredProperties.length !== 1 ? 'es' : ''} disponible{filteredProperties.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition-all shadow-lg shadow-violet-900/30"
            >
              <FaFilter className="w-4 h-4" />
              Ver todos los filtros
            </Link>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FaSearch className="text-4xl mb-3 mx-auto opacity-50" />
              <p>No se encontraron propiedades para "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-violet-400 hover:text-violet-300 font-medium"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.slice(0, 6).map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}

          {/* Ver más */}
          <div className="text-center mt-10">
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-700/60 hover:border-violet-500/40 hover:text-white transition-all font-medium"
            >
              Ver más propiedades
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 📞 CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Necesitás ayuda para encontrar tu propiedad?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Nuestro equipo de expertos está listo para asesorarte y encontrar la opción perfecta para tus necesidades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5491132538837?text=Hola,%20me%20interesa%20consultar%20por%20una%20propiedad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-lg shadow-emerald-900/30"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Contactar por WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-700/60 hover:border-violet-500/40 hover:text-white transition-all font-semibold"
            >
              Enviar consulta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

