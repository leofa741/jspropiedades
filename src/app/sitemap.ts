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

// Función para obtener URLs dinámicas (ej: propiedades individuales)
async function getDynamicPropertyUrls(): Promise<string[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://www.jimenasanchezpropiedades.ar'}/api/gestion/public/propiedades?limit=100`, {
      next: { revalidate: 3600 } // Cache por 1 hora
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.propiedades?.map((p: any) => `/propiedades/${p._id}`) || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.jimenasanchezpropiedades.ar';

  // Combinar URLs estáticas + dinámicas
  const dynamicUrls = await getDynamicPropertyUrls();
  const allPaths = [...staticPages, ...dynamicUrls];

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : path.includes('/propiedades/') ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.includes('/propiedades/') ? 0.8 : 0.5,
  }));
}