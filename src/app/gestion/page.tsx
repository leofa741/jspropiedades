// src/app/gestion/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FaBox,
    FaUsers,
    FaShoppingCart,
    FaFileInvoice,
    FaChartLine,
    FaShieldAlt,
    FaHome,
    FaKey,
    FaBuilding,
    FaHandshake,
} from 'react-icons/fa';

// 🎨 Paleta Premium Inmobiliaria
const theme = {
    bg: 'bg-slate-950',
    bgCard: 'bg-slate-900/80',
    bgCardHover: 'bg-slate-800/90',
    border: 'border-slate-700/50',
    borderHover: 'border-purple-500/40',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    textAccent: 'text-purple-400',
    gradient: 'from-purple-600/20 via-violet-600/20 to-indigo-600/20',
    gradientBorder: 'from-purple-500 via-violet-500 to-indigo-500',
    shadow: 'shadow-2xl shadow-purple-900/20',
    shadowHover: 'shadow-purple-900/40',
};

// 🏢 Módulos adaptados para Inmobiliaria
const modules = [
    {
        id: 'propiedades',
        title: 'Propiedades',
        description: 'Administrar inmuebles, características, fotos, estados y disponibilidad.',
        icon: <FaHome className="text-3xl text-purple-400" />,
        href: '/gestion/propiedades',
        accent: 'from-purple-500 to-violet-600',
    },
    {
        id: 'usuarios',
        title: 'Usuarios Adminstradores',
        description: 'Gestionar propietarios, inquilinos, compradores y sus preferencias.',
        icon: <FaUsers className="text-3xl text-violet-400" />,
        href: '/admin',
        accent: 'from-violet-500 to-indigo-600',
    },
    {
        id: 'clientes',
        title: 'Clientes',
        description: 'Gestionar propietarios, inquilinos, compradores y sus preferencias.',
        icon: <FaUsers className="text-3xl text-violet-400" />,
        href: '/gestion/clientes',
        accent: 'from-violet-500 to-indigo-600',
    },
    // {
    //   id: 'operaciones',
    // title: 'Operaciones',
    // description: 'Seguimiento de alquileres, ventas, reservas y contratos en proceso.',
    //icon: <FaHandshake className="text-3xl text-indigo-400" />,
    //href: '/gestion/operaciones',
    //accent: 'from-indigo-500 to-blue-600',
    //  },
    //  {
    //    id: 'documentos',
    //    title: 'Documentación',
    //    description: 'Contratos, escrituras, certificados y archivos digitales organizados.',
    //    icon: <FaFileInvoice className="text-3xl text-cyan-400" />,
    //    href: '/gestion/documentos',
    //    accent: 'from-cyan-500 to-teal-600',
    // },
    // {
    //    id: 'categorias',
    //    title: 'Tipologías',
    //    description: 'Administrar tipos de propiedad: departamentos, casas, locales, terrenos.',
    //    icon: <FaBuilding className="text-3xl text-emerald-400" />,
    //    href: '/gestion/categorias',
    //    accent: 'from-emerald-500 to-green-600',
    // },
    // {
    //    id: 'dashboard',
    //    title: 'Dashboard',
    //    description: 'Métricas clave: ocupación, ingresos, comisiones y rendimiento mensual.',
    //    icon: <FaChartLine className="text-3xl text-amber-400" />,
    //    href: '/gestion/dashboard',
    //    accent: 'from-amber-500 to-orange-600',
    // },
    {
        id: 'accesos',
        title: 'Accesos',
        description: 'Gestionar permisos de equipo: agentes, administradores y roles.',
        icon: <FaKey className="text-3xl text-rose-400" />,
        href: '/gestion/logs',
        accent: 'from-rose-500 to-pink-600',
    },

];

export default function GestiónPage() {
    const { status, data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [mounted, setMounted] = useState(false);

    // ✅ Montaje seguro para evitar hidratación
    useEffect(() => {
        setMounted(true);
    }, []);

    // 🔒 Validación de acceso
    useEffect(() => {
        const validateAccess = async () => {
            if (status === 'loading' || !mounted) return;

            if (status === 'unauthenticated') {
                router.push('/login');
                setIsAuthorized(false);
                return;
            }

            const token = session?.user?.token || localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                setIsAuthorized(false);
                return;
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const allowedRoles = ['superadmin', 'admin', 'vendedor', 'agente'];

                if (!allowedRoles.includes(payload.role)) {
                    router.push('/');
                    setIsAuthorized(false);
                    return;
                }

                setIsAuthorized(true);
            } catch (err) {
                console.error('Token inválido', err);
                router.push('/login');
                setIsAuthorized(false);
            }
        };

        validateAccess();
    }, [status, session, router, pathname, mounted]);

    // ✅ Loader elegante
    if (status === 'loading' || isAuthorized === null || !mounted) {
        return (
            <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-2 border-transparent border-t-purple-500 border-r-violet-500 mx-auto mb-6" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 blur-xl animate-pulse" />
                    </div>
                    <p className={`${theme.textSecondary} text-lg font-light`}>Validando acceso...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) return null;

    const userName = session?.user?.name || 'Equipo';
    const userRole = session?.user?.role || 'admin';

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.textPrimary} relative overflow-hidden`}>

            {/* ✨ Background decorativo sutil */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${theme.gradient} rounded-full blur-3xl opacity-40`} />
                <div className={`absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl opacity-30`} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
            </div>

            {/* 🚨 ESPACIO PARA NAVBAR FIJO - Solución al solapamiento */}
            <div className="pt-24 lg:pt-28" />

            <div className="relative z-10 px-4 md:px-8 pb-12">

                {/* 🏷️ Header Premium */}
                <header className="mb-12 text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/50 mb-6">
                        <FaShieldAlt className="text-purple-400 text-sm" />
                        <span className="text-xs tracking-[0.2em] uppercase text-slate-400">Panel Administrativo</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                            Gestión Inmobiliaria
                        </span>
                    </h1>

                    <p className={`${theme.textSecondary} text-lg md:text-xl font-light leading-relaxed mb-8`}>
                        Bienvenido, <span className={`${theme.textAccent} font-medium`}>{userName}</span>.
                        Administra tu cartera de propiedades con herramientas profesionales.
                    </p>

                    {/* 📊 Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <span className="px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            Rol: <span className="text-purple-400 font-medium capitalize">{userRole}</span>
                        </span>
                        <span className="px-4 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            Última sesión: <span className="text-slate-300">Hoy</span>
                        </span>
                    </div>
                </header>

                {/* 🧩 Grid de Módulos Premium */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {modules.map((module, index) => (
                            <Link
                                key={module.id}
                                href={module.href}
                                className="group block focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-xl"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <article className={`
                                    relative ${theme.bgCard} ${theme.border} rounded-2xl p-6 
                                    transition-all duration-500 ease-out
                                    hover:${theme.bgCardHover} hover:${theme.borderHover} hover:scale-[1.02] hover:${theme.shadowHover}
                                    backdrop-blur-sm overflow-hidden
                                `}>
                                    {/* ✨ Glow effect on hover */}
                                    <div className={`
                                        absolute inset-0 bg-gradient-to-br ${module.accent} 
                                        opacity-0 group-hover:opacity-10 transition-opacity duration-500
                                    `} />

                                    {/* ✨ Border gradient animado */}
                                    <div className={`
                                        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                                        transition-opacity duration-500 pointer-events-none
                                        bg-gradient-to-r ${theme.gradientBorder} 
                                        [mask-image:linear-gradient(to_bottom,white,transparent)] 
                                        blur-[1px]
                                    `} />

                                    <div className="relative z-10">
                                        {/* Icono con contenedor premium */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div className={`
                                                p-3.5 rounded-xl bg-gradient-to-br ${module.accent} 
                                                bg-opacity-10 shadow-lg shadow-purple-900/20
                                                group-hover:shadow-purple-900/40 transition-shadow duration-300
                                            `}>
                                                {module.icon}
                                            </div>
                                            <FaChartLine className="text-slate-600 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>

                                        {/* Contenido */}
                                        <h2 className={`text-lg font-semibold mb-2 group-hover:text-white transition-colors ${theme.textPrimary}`}>
                                            {module.title}
                                        </h2>
                                        <p className={`${theme.textSecondary} text-sm leading-relaxed group-hover:text-slate-300 transition-colors`}>
                                            {module.description}
                                        </p>

                                        {/* Indicator de navegación */}
                                        <div className="mt-4 flex items-center text-xs text-slate-500 group-hover:text-purple-400 transition-colors">
                                            <span>Acceder</span>
                                            <svg className="w-3 h-3 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* ✨ Corner decoration */}
                                    <div className={`
                                        absolute top-0 right-0 w-16 h-16 
                                        bg-gradient-to-bl ${module.accent} 
                                        opacity-0 group-hover:opacity-20 rounded-bl-full 
                                        transition-opacity duration-500 pointer-events-none
                                    `} />
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 📌 Footer informativo */}
                <footer className="mt-16 text-center">
                    <p className={`${theme.textSecondary} text-xs tracking-[0.2em] uppercase`}>
                        Panel de Gestión • By J.S.Propiedades
                    </p>
                </footer>
            </div>
        </div>
    );
}