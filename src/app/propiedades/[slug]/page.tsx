// app/propiedades/[slug]/page.tsx
'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  FaArrowLeft, FaMapMarkerAlt, FaMoneyBillWave, FaHome, FaBuilding,
  FaStar, FaWhatsapp, FaEnvelope, FaBed, FaBath, FaRulerCombined,
  FaChevronLeft, FaChevronRight, FaShareAlt, FaCheck, FaImage,
  FaEye, FaVideo
} from 'react-icons/fa';
import { formatARS } from '@/app/lib/formatcurrenci';
import AlertButton from '@/app/components/ui/AlertButton';


// Agrega estos imports al inicio
import { getVisitorId } from '@/app/lib/visitorId';

import { trackConversion } from '@/app/lib/gtag';



// ─────────────────────────────────────────────────────────────
// 🔹 Tipos
// ─────────────────────────────────────────────────────────────

interface PublicProperty {
  _id: string;
  titulo: string;
  descripcion: string;
  tipoPropiedad: string;
  tipoOperacion: 'venta' | 'alquiler' | 'ambos';
  categoria: string;
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
  imagenes?: Array<{ url: string; descripcion?: string; principal: boolean }>;
  videoUrl?: string;
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
    terraza?: boolean;
    patio?: boolean;
    ascensor?: boolean;
    seguridad?: boolean;
  };
}

// ─────────────────────────────────────────────────────────────
// 🔹 Componente de Imagen Nativo con Lazy Loading
// ─────────────────────────────────────────────────────────────

interface NativeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

function NativeImage({
  src,
  alt,
  fill = false,
  className = '',
  priority = false,
  sizes = "100vw"
}: NativeImageProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  if (imgError || !src) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-slate-800/50 ${className}`}>
        <div className="text-center text-slate-500">
          <FaImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={fill ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        inset: 0,
        objectFit: 'cover'
      } : undefined}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={() => setImgLoaded(true)}
      onError={() => {
        console.error('Error cargando imagen:', src);
        setImgError(true);
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// 🔹 Helpers
// ─────────────────────────────────────────────────────────────

const formatPrice = (monto?: number, moneda: 'ARS' | 'USD' = 'USD', tipo: 'venta' | 'alquiler' = 'venta') => {
  if (!monto) return 'Consultar';
  if (moneda === 'ARS') return formatARS(monto);
  const suffix = tipo === 'alquiler' ? '/mes' : '';
  return `$ ${monto.toLocaleString('es-AR')} ${moneda}${suffix}`;
};

// ─────────────────────────────────────────────────────────────
// 🔹 Componente Principal
// ─────────────────────────────────────────────────────────────

export default function PropiedadDetallePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PageContent />
    </Suspense>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-24">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-violet-500 border-r-purple-500 mx-auto mb-4" />
        <p className="text-slate-400">Cargando propiedad...</p>
      </div>
    </div>
  );
}

function PageContent() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [propiedad, setPropiedad] = useState<PublicProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [initialImageSet, setInitialImageSet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visitasCount, setVisitasCount] = useState<number | null>(null);

  const watsapp = 5491132538837;





  // Agrega este useEffect después del que carga la propiedad
  useEffect(() => {
    if (!propiedad?._id || !propiedad?.slug) return;

    const registrarVisita = async () => {
      try {
        const visitorId = getVisitorId();

        // Registrar visita única
        await fetch('/api/visitas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propiedadId: propiedad._id,
            slug: propiedad.slug,
            visitorId
          })
        });

        // Obtener conteo actualizado
        const res = await fetch(`/api/visitas?slug=${propiedad.slug}`);
        const data = await res.json();

        if (data.success) {
          setVisitasCount(data.count);
        }
      } catch (error) {
        console.error('Error registrando visita:', error);
      }
    };

    registrarVisita();
  }, [propiedad?._id, propiedad?.slug]);


  // 📥 Cargar propiedad por slug
  useEffect(() => {
    if (!slug) return;

    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/gestion/public/propiedades?slug=${encodeURIComponent(slug)}`);

        if (res.status === 404) {
          notFound();
          return;
        }

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();

        if (data.propiedades?.[0]) {
          setPropiedad(data.propiedades[0]);
        } else {
          notFound();
        }
      } catch (err) {
        console.error('Error loading property:', err);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  // 🔹 Establecer imagen principal SOLO UNA VEZ
  useEffect(() => {
    if (!propiedad || initialImageSet) return;

    const imagenes = propiedad.imagenes || [];
    const allImages = imagenes.length > 0
      ? imagenes
      : propiedad.imagen
        ? [{ url: propiedad.imagen, principal: true }]
        : [];

    const principalIndex = allImages.findIndex(img => img.principal);
    if (principalIndex !== -1) {
      setActiveImage(principalIndex);
    }
    setInitialImageSet(true);
  }, [propiedad, initialImageSet]);

  // 🔹 Handlers de navegación
  const goToPrevious = useCallback(() => {
    setActiveImage(prev => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setActiveImage(prev => {
      const imagenes = propiedad?.imagenes || [];
      const allImages = imagenes.length > 0
        ? imagenes
        : propiedad?.imagen
          ? [{ url: propiedad.imagen, principal: true }]
          : [];
      return Math.min(allImages.length - 1, prev + 1);
    });
  }, [propiedad]);

  // 🆕 Handler para 
  const handleShare = async () => {
 

    if (!propiedad?.slug) return;
    const url = `${window.location.origin}/propiedades/${propiedad.slug}`;
   // const text = `M propiedad: ${propiedad.ttPrice(propiedad.precio.monto, propiedad.precio.moneda, propiedad.precio.tipo)}`;

    let success = false;

    if (navigator.share) {
      try {
        await navigator.share({
          title: propiedad.titulo,         
          url: url
        });
        success = true;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(url);
          success = true;
        }
      }
    } else {
      copyToClipboard(url);
      success = true;
    }

    if (success) {
    // ✅ Redirigir a página de gracias (que dispara la conversión)
    router.push('/gracias');
  }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error al copiar:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  // 🔒 Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-violet-500 border-r-purple-500" />
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-24">
        <div className="text-center text-slate-400">
          <FaBuilding className="text-4xl mb-3 mx-auto opacity-50" />
          <p>Propiedad no encontrada</p>
          <Link href="/propiedades" className="text-violet-400 hover:text-violet-300 mt-4 inline-block">
            ← Volver a propiedades
          </Link>
        </div>
      </div>
    );
  }

  const {
    _id,
    titulo,
    descripcion,
    tipoPropiedad,
    ubicacion,
    precio,
    imagenes = [],
    destacado,
    urgente,
    caracteristicas = {},
  } = propiedad;

  const allImages = imagenes.length > 0
    ? imagenes
    : propiedad.imagen
      ? [{ url: propiedad.imagen, principal: true }]
      : [];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24">
      <br></br>
      <br></br>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/propiedades" className="text-slate-400 hover:text-violet-400 flex items-center gap-2 text-sm">
          <FaArrowLeft className="w-4 h-4" /> Volver a propiedades
        </Link>
      </div>

      {/* Galería de imágenes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Imagen principal */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800">
            {allImages[activeImage]?.url ? (
              <NativeImage
                src={allImages[activeImage].url}
                alt={`${titulo} - Imagen ${activeImage + 1}`}
                fill
                priority={activeImage === 0}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <FaBuilding className="w-16 h-16 opacity-50" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              {destacado && (
                <span className="px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-medium flex items-center gap-1">
                  <FaStar className="w-3 h-3" /> Destacada
                </span>
              )}
              {urgente && (
                <span className="px-3 py-1 rounded-full bg-rose-500/90 text-white text-xs font-medium">
                  Urgente
                </span>
              )}
            </div>

            {/* Navegación */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  disabled={activeImage === 0}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-10 ${activeImage === 0
                    ? 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-900/80 text-white hover:bg-slate-900 hover:scale-105'
                    }`}
                  aria-label="Imagen anterior"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={goToNext}
                  disabled={activeImage === allImages.length - 1}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-10 ${activeImage === allImages.length - 1
                    ? 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-900/80 text-white hover:bg-slate-900 hover:scale-105'
                    }`}
                  aria-label="Siguiente imagen"
                >
                  <FaChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {allImages.length > 1 && (
              <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 text-slate-300 z-10">
                {activeImage + 1} / {allImages.length}
              </span>
            )}
          </div>

          {/* Thumbnails - TODAS las imágenes */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === index
                    ? 'border-violet-500 ring-2 ring-violet-500/30'
                    : 'border-transparent hover:border-slate-500 opacity-70 hover:opacity-100'
                    }`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <NativeImage
                    src={img.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    priority={index === 0}
                  />

                  {img.principal && activeImage !== index && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                      <FaStar className="w-2 h-2 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 📹 Video de la propiedad */}
      {propiedad.videoUrl && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaVideo className="text-violet-400" /> Video de la propiedad
          </h2>
          <div className="rounded-2xl overflow-hidden bg-slate-800 aspect-video shadow-xl">
            <video
              src={propiedad.videoUrl}
              controls
              className="w-full h-full"
              poster={allImages[0]?.url}
            >
              Tu navegador no soporta la reproducción de videos.
            </video>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna izquierda: Detalles */}
          <div className="lg:col-span-2 space-y-8">

            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{titulo}</h1>
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <FaMapMarkerAlt className="w-4 h-4 text-violet-400" />
                <span>{ubicacion.barrio}, {ubicacion.ciudad}, {ubicacion.provincia}</span>
              </div>
              <p className="text-3xl font-bold text-emerald-400">
                {formatPrice(precio.monto, precio.moneda, precio.tipo)}
                {precio.tipo === 'alquiler' && <span className="text-lg text-slate-400">/mes</span>}
              </p>
            </div>

            {/* Después del título, agrega: */}
            {visitasCount !== null && (
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                <FaEye className="w-4 h-4" />
                <span>{visitasCount} {visitasCount === 1 ? 'visita' : 'visitas'}</span>
                <button 
            onClick={() => {
              // 🎯 EVENTO 1: Clic en WhatsApp desde detalle de propiedad
              trackConversion('AW-18201247782/KovnCO7-07scEKaAhOdD');
              
              window.open(`https://wa.me/${watsapp}?text=${encodeURIComponent(`Hola, me gustaría obtener más información sobre esta propiedad: ${propiedad.titulo} - ${window.location.origin}/propiedades/${propiedad.slug}`)}`, '_blank');
              
           
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-full transition-all text-white font-semibold shadow-lg hover:shadow-green-900/50"
          >
            <FaWhatsapp className="w-5 h-5" />
            Contactar por WhatsApp
          </button>
          <button
            onClick={() => handleShare()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-full transition-all text-white font-semibold shadow-lg"
          >
            <FaShareAlt className="w-5 h-5" />
            {copied ? 'Enlace copiado' : 'Compartir'}
          </button>
          </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Descripción</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {descripcion || 'Sin descripción disponible.'}
              </p>
            </div>

            {caracteristicas && Object.keys(caracteristicas).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Características</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {caracteristicas.ambientes && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <p className="text-2xl font-bold text-white">{caracteristicas.ambientes}</p>
                      <p className="text-slate-400 text-sm">Ambientes</p>
                    </div>
                  )}
                  {caracteristicas.dormitorios && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <p className="text-2xl font-bold text-white">{caracteristicas.dormitorios}</p>
                      <p className="text-slate-400 text-sm">Dormitorios</p>
                    </div>
                  )}
                  {caracteristicas.banios && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <p className="text-2xl font-bold text-white">{caracteristicas.banios}</p>
                      <p className="text-slate-400 text-sm">Baños</p>
                    </div>
                  )}
                  {caracteristicas.metrosCubiertos && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <p className="text-2xl font-bold text-white">{caracteristicas.metrosCubiertos}</p>
                      <p className="text-slate-400 text-sm">m² Cubiertos</p>
                    </div>
                  )}
                  {caracteristicas.cochera && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <p className="text-2xl font-bold text-white">✓</p>
                      <p className="text-slate-400 text-sm">Cochera</p>
                    </div>
                  )}
                  {caracteristicas.balcon && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <p className="text-2xl font-bold text-white">✓</p>
                      <p className="text-slate-400 text-sm">Balcón</p>
                    </div>
                  )}
                  {caracteristicas.pileta && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <p className="text-2xl font-bold text-white">✓</p>
                      <p className="text-slate-400 text-sm">Pileta</p>
                    </div>
                  )}
                  {caracteristicas.terraza && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <p className="text-2xl font-bold text-white">✓</p>
                      <p className="text-slate-400 text-sm">Terraza</p>
                    </div>
                  )}
                  {caracteristicas.ascensor && (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50">
                      <p className="text-2xl font-bold text-white">✓</p>
                      <p className="text-slate-400 text-sm">Ascensor</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: Contacto */}
          <div className="space-y-6">

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/50 sticky top-24 relative">
              <h3 className="text-lg font-semibold text-white mb-4">¿Te interesa esta propiedad?</h3>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${watsapp}?text=${encodeURIComponent(`Hola, me interesa la propiedad: ${titulo}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Consultar por WhatsApp
                </a>

                <a
                  href={`mailto:hola@jimenasanchezpropiedades.ar?subject=Consulta: ${encodeURIComponent(titulo)}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all border border-slate-700/50"
                >
                  <FaEnvelope className="w-5 h-5" />
                  Enviar email
                </a>

                <button
                  onClick={handleShare}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all border ${copied
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-violet-600/20 border-violet-500/50 text-violet-400 hover:bg-violet-600/30 hover:border-violet-500/70'
                    }`}
                >
                  {copied ? (
                    <>
                      <FaCheck className="w-5 h-5" />
                      ¡Link copiado!
                    </>
                  ) : (
                    <>
                      <FaShareAlt className="w-5 h-5" />
                      Compartir propiedad
                    </>
                  )}
                </button>
              </div>

              <div className="absolute top-4 right-4 z-10">
                <AlertButton
                  propiedadId={_id}
                  propiedadTitulo={titulo}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tipo:</span>
                  <span className="text-white capitalize">{tipoPropiedad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operación:</span>
                  <span className="text-white capitalize">{precio.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Moneda:</span>
                  <span className="text-white">{precio.moneda}</span>
                </div>
                {ubicacion.zona && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Zona:</span>
                    <span className="text-white">{ubicacion.zona}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br></br>    <br></br>
    </div>
  );
}