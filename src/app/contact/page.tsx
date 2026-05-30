// app/contacto/page.tsx
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Iconos SVG premium (reemplazan react-icons para consistencia visual)
const Icons = {
  WhatsApp: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Location: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.25 6.75 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.5c0-.621-.336-1.197-.876-1.508a16.668 16.668 0 01-4.393-3.655 16.668 16.668 0 01-3.655-4.393c-.311-.54-.887-.876-1.508-.876H6.75A2.25 2.25 0 004.5 9.75v1.5z" />
    </svg>
  ),
  Email: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  Building: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  Key: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '', // buy/sell/rent/valuation
    propertyType: '',
    location: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const watsapp = 5491132538837
  const mensaje = 'Hola,%20me%20interesa%20consultar%20por%20una%20propiedad'

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Por favor, completa los campos obligatorios.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: `Consulta inmobiliaria - ${form.interest || 'General'}` }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: '¡Consulta enviada! Jimena te contactará a la brevedad.' });
        setForm({ name: '', email: '', phone: '', interest: '', propertyType: '', location: '', budget: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Hubo un error. Inténtalo nuevamente.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error de conexión. Verifica tu red e intentá de nuevo.' });
    } finally {
      setLoading(false);
    }
  }, [form]);

  // 🎨 Paleta Premium - Coherente con el resto del sitio
  const gradients = {
    primary: 'from-indigo-500 via-purple-500 to-pink-500',
    accent: 'from-cyan-400 via-blue-500 to-violet-500',
    glow: 'from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20',
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      
      {/* ✨ Background ambiental */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 opacity-40" style={{ filter: 'blur(150px)' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" aria-hidden="true" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        
        {/* ───────── HEADER ───────── */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fadeInUp">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gradient-to-r from-cyan-400 to-purple-500" />
            </span>
            <span className="text-[11px] tracking-[0.25em] uppercase text-slate-400 font-medium">
              Contacto
            </span>
          </span>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Comencemos tu próximo proyecto inmobiliario
          </h1>
          
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Ya sea que quieras comprar, vender o alquilar, estoy aquí para guiarte en cada paso con asesoramiento experto y resultados reales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ───────── COLUMNA IZQUIERDA: INFO + WHATSAPP ───────── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card: ¿En qué puedo ayudarte? */}
            <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
              <div className="absolute inset-[1px] rounded-2xl bg-slate-900/90 -z-10" />
              
              <h2 className="relative text-lg font-semibold text-white mb-4 flex items-center gap-2.5">
                <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradients.accent} flex items-center justify-center text-white`}>
                  <Icons.Building />
                </span>
                ¿En qué puedo ayudarte?
              </h2>
              
              <ul className="relative space-y-3">
                {[
                  { icon: <Icons.Key />, label: 'Comprar una propiedad', desc: 'Encontrá tu hogar ideal o inversión' },
                  { icon: <Icons.Building />, label: 'Vender tu propiedad', desc: 'Maximizá el valor de tu venta' },
                  { icon: <Icons.Shield />, label: 'Alquilar', desc: 'Gestión profesional para propietarios e inquilinos' },
                  { icon: <Icons.Location />, label: 'Tasación gratuita', desc: 'Conocé el valor real de tu propiedad' },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-purple-400 mt-0.5">{item.icon}</span>
                    <div>
                      <span className="block text-white font-medium text-sm">{item.label}</span>
                      <span className="block text-slate-500 text-xs">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card: Contacto directo */}
            <div className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
              <div className="absolute inset-[1px] rounded-2xl bg-slate-900/90 -z-10" />
              
              <h3 className="relative text-lg font-semibold text-white mb-4">Contacto directo</h3>
              
              <div className="relative space-y-4">
                {/* WhatsApp - CTA principal */}
                <a  
                  href={`https://wa.me/${watsapp}?text=${encodeURIComponent(`Hola, me interesa consultarte sobre una propiedad`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/whatsapp flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300"
                >
                  <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
                    <Icons.WhatsApp />
                  </span>
                  <div className="flex-1">
                    <span className="block text-white font-medium text-sm">WhatsApp</span>
                    <span className="block text-emerald-400 text-xs">Respuesta en minutos</span>
                  </div>
                  <svg className="w-5 h-5 text-slate-500 group-hover/whatsapp:text-emerald-400 group-hover/whatsapp:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                {/* Email */}
                <a href="mailto:contacto@jimenasanchezpropiedades.com" className="group/email flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-purple-400"><Icons.Email /></span>
                  <span className="text-slate-300 group-hover/email:text-white transition-colors text-sm">contacto@jimenasanchezpropiedades.com</span>
                </a>

                {/* Teléfono */}
                <a href="tel:+541112345678" className="group/phone flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-purple-400"><Icons.Phone /></span>
                  <span className="text-slate-300 group-hover/phone:text-white transition-colors text-sm">+54 9 11 3253 8837</span>
                </a>

                {/* Ubicación */}
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <span className="text-purple-400"><Icons.Location /></span>
                  <span className="text-slate-400 text-sm">San Vicente, Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>

            {/* Badge de confianza 
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-[10px] text-white font-medium">
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

          {/* ───────── COLUMNA DERECHA: FORMULARIO PREMIUM ───────── */}
          <div className="lg:col-span-8">
            <div className="group relative p-6 lg:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              {/* Glow exterior */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
              <div className="absolute inset-[1px] rounded-2xl bg-slate-900/90 -z-10" />
              
              <form onSubmit={handleSubmit} className="relative space-y-6">
                
                {/* Fila 1: Nombre + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    id="name"
                    label="Nombre completo *"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                  <FormField
                    id="email"
                    label="Correo electrónico *"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                {/* Fila 2: Teléfono + Interés */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    id="phone"
                    label="Teléfono"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+54 11 1234-5678"
                  />
                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-slate-300 mb-2">
                      Estoy interesado en *
                    </label>
                    <select
                      id="interest"
                      value={form.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none"
                      required
                    >
                      <option value="">Seleccioná una opción</option>
                      <option value="buy">Comprar una propiedad</option>
                      <option value="sell">Vender mi propiedad</option>
                      <option value="rent">Alquilar</option>
                      <option value="valuation">Tasación gratuita</option>
                      <option value="other">Otra consulta</option>
                    </select>
                  </div>
                </div>

                {/* Fila 3: Tipo de propiedad + Ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-slate-300 mb-2">
                      Tipo de propiedad
                    </label>
                    <select
                      id="propertyType"
                      value={form.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none"
                    >
                      <option value="">Cualquiera</option>
                      <option value="departamento">Departamento</option>
                      <option value="casa">Casa</option>
                      <option value="ph">PH</option>
                      <option value="local">Local comercial</option>
                      <option value="terreno">Terreno</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>
                  <FormField
                    id="location"
                    label="Zona de interés"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Ej: Palermo, Recoleta, Nordelta..."
                  />
                </div>

                {/* Fila 4: Presupuesto */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-2">
                    Presupuesto estimado (USD)
                  </label>
                  <select
                    id="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 appearance-none"
                  >
                    <option value="">Sin especificar</option>
                    <option value="<100k">Menos de USD 100.000</option>
                    <option value="100k-250k">USD 100.000 - 250.000</option>
                    <option value="250k-500k">USD 250.000 - 500.000</option>
                    <option value="500k-1M">USD 500.000 - 1.000.000</option>
                    <option value=">1M">Más de USD 1.000.000</option>
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Contame más sobre lo que estás buscando o la propiedad que querés vender..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none"
                    required
                  />
                </div>

                {/* Submit Button Premium */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-500 overflow-hidden ${
                    loading 
                      ? 'bg-slate-700 cursor-not-allowed' 
                      : `bg-gradient-to-r ${gradients.primary} hover:shadow-2xl hover:shadow-purple-900/40 hover:scale-[1.01] active:scale-[0.99]`
                  } text-white`}
                >
                  {/* Shine effect */}
                  {!loading && (
                    <>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <span className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors duration-300" />
                    </>
                  )}
                  
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Enviar Consulta</span>
                      <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Status Message */}
                {status.message && (
                  <div className={`p-4 rounded-xl border ${
                    status.type === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    <p className="text-sm font-medium text-center">{status.message}</p>
                  </div>
                )}

                {/* Privacy note */}
                <p className="text-center text-xs text-slate-500 pt-2">
                  Tus datos están protegidos. No compartimos tu información con terceros.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE DE CAMPO DE FORMULARIO REUTILIZABLE
// ─────────────────────────────────────────────────────────────
const FormField = ({ 
  id, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false 
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
    />
  </div>
);