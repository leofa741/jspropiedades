// app/sitemap.ts
import { MetadataRoute } from 'next';

// URLs estáticas que siempre existen
const staticPages = [
  '',
  '/about',
  '/contact',
  '/propiedades',
  '/gestion',
];

// Función para obtener propiedades publicadas dinámicamente
async function getDynamicPropertyUrls(): Promise<string[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jimenasanchezpropiedades.ar';
    const res = await fetch(`${baseUrl}/api/gestion/public/propiedades?limit=100&estado=publicado`, {
      next: { revalidate: 3600 } // Cache por 1 hora
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    return data.propiedades?.map((prop: any) => `/propiedades/${prop._id}`) || [];
  } catch (error) {
    console.error('Error al obtener propiedades para sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jimenasanchezpropiedades.ar';
  
  // Combinar URLs estáticas + dinámicas
  const dynamicUrls = await getDynamicPropertyUrls();
  const allPaths = [...staticPages, ...dynamicUrls];

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: getPathFrequency(path),
    priority: getPathPriority(path),
  }));
}

// Helper para determinar frecuencia de cambio
function getPathFrequency(path: string): MetadataRoute.Sitemap[0]['changeFrequency'] {
  if (path === '') return 'daily'; // Home
  if (path === '/propiedades') return 'daily'; // Listado de propiedades
  if (path.includes('/propiedades/')) return 'weekly'; // Propiedades individuales
  if (path === '/about') return 'monthly';
  if (path === '/contact') return 'monthly';
  return 'monthly';
}

// Helper para determinar prioridad
function getPathPriority(path: string): number {
  if (path === '') return 1.0; // Home
  if (path === '/propiedades') return 0.9; // Listado
  if (path.includes('/propiedades/')) return 0.8; // Propiedades individuales
  if (path === '/about') return 0.7;
  if (path === '/contact') return 0.6;
  return 0.5;
}