// app/api/gestion/propiedades/route.ts
import { authOptions } from "@/app/lib/auth";
import connectDB from "@/app/lib/mongoose";
import Property from "@/app/models/Property";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { notifyProperties, normalizeProperty } from './events/propertiesNotifier';
import '@/app/models/Cliente'; // Para populate de propietario

connectDB();

// 🔒 Helper: verificar roles autorizados
const isAuthorized = (role: string) => ['admin', 'superadmin', 'agente'].includes(role);

// 🔍 GET: Listar propiedades con paginación y filtros básicos
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAuthorized(session.user.role)) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);

    // ✅ Soporte para ?all=true (sin paginación)
    const all = searchParams.get('all') === 'true';

    // ✅ Filtros básicos desde query params
    const tipoPropiedad = searchParams.get('tipoPropiedad');
    const tipoOperacion = searchParams.get('tipoOperacion');
    const estado = searchParams.get('estado');
    const barrio = searchParams.get('barrio');
    const destacado = searchParams.get('destacado');

    // Construir query base
    const query: any = { activo: true };
    
    if (tipoPropiedad) query.tipoPropiedad = tipoPropiedad;
    if (tipoOperacion) query.tipoOperacion = tipoOperacion;
    if (estado) query.estado = estado;
    if (barrio) query['direccion.barrio'] = { $regex: barrio, $options: 'i' };
    if (destacado !== null) query.destacado = destacado === 'true';

    // Si es agente, solo ver sus propiedades
    if (session.user.role === 'agente') {
      query.agente = session.user.id;
    }

    if (all) {
      // Devuelve TODAS las propiedades sin paginación
      const propiedades = await Property.find(query)
        .populate('propietario', 'razonSocial nombre apellido telefono email')
        .populate('agente', 'name email')
        .sort({ fechaPublicacion: -1, titulo: 1 });

      return NextResponse.json(
        { propiedades },
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        }
      );
    }

    // Comportamiento original con paginación
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const total = await Property.countDocuments(query);
    const propiedades = await Property.find(query)
      .populate('propietario', 'razonSocial nombre apellido telefono email')
      .populate('agente', 'name email')
      .sort({ fechaPublicacion: -1, titulo: 1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      { propiedades, total, page, totalPages: Math.ceil(total / limit) },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// ➕ POST: Crear nueva propiedad
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAuthorized(session.user.role)) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  try {
    const data = await req.json();

    // ✅ Validaciones de campos obligatorios básicos
    if (!data.titulo || !data.descripcion || !data.tipoPropiedad || !data.tipoOperacion) {
      return NextResponse.json({ 
        error: 'Título, descripción, tipoPropiedad y tipoOperación son obligatorios' 
      }, { status: 400 });
    }

    // ✅ Validar dirección (campos requeridos)
    if (!data.direccion) {
      return NextResponse.json({ error: 'La dirección es requerida' }, { status: 400 });
    }
    const dir = data.direccion;
    if (!dir.calle || !dir.numero || !dir.barrio || !dir.ciudad || !dir.provincia) {
      return NextResponse.json({ 
        error: 'Dirección incompleta: calle, número, barrio, ciudad y provincia son requeridos' 
      }, { status: 400 });
    }

    // ✅ Validar precios: al menos uno de venta o alquiler debe tener monto
    if (!data.precios) {
      return NextResponse.json({ error: 'Los precios son requeridos' }, { status: 400 });
    }
    const ventaMonto = data.precios.venta?.monto;
    const alquilerMonto = data.precios.alquiler?.monto;
    if (!ventaMonto && !alquilerMonto) {
      return NextResponse.json({ 
        error: 'Debe especificar al menos un precio de venta o alquiler' 
      }, { status: 400 });
    }
    // Validar montos positivos si existen
    if (ventaMonto != null && (typeof ventaMonto !== 'number' || ventaMonto < 0)) {
      return NextResponse.json({ error: 'Precio de venta inválido (debe ser número ≥ 0)' }, { status: 400 });
    }
    if (alquilerMonto != null && (typeof alquilerMonto !== 'number' || alquilerMonto < 0)) {
      return NextResponse.json({ error: 'Precio de alquiler inválido (debe ser número ≥ 0)' }, { status: 400 });
    }

    // ✅ Validar imágenes: mínimo 1, máximo 10
    if (!Array.isArray(data.imagenes) || data.imagenes.length === 0) {
      return NextResponse.json({ error: 'Se requiere al menos una imagen' }, { status: 400 });
    }
    if (data.imagenes.length > 10) {
      return NextResponse.json({ error: 'Máximo 10 imágenes por propiedad' }, { status: 400 });
    }
    // Validar cada imagen
    for (const img of data.imagenes) {
      if (!img.url || typeof img.url !== 'string') {
        return NextResponse.json({ error: 'Cada imagen debe tener una URL válida' }, { status: 400 });
      }
      if (img.orden != null && (typeof img.orden !== 'number' || img.orden < 0)) {
        return NextResponse.json({ error: 'El orden de imagen debe ser un número ≥ 0' }, { status: 400 });
      }
    }
    // Asegurar que haya una imagen principal
    const hasPrincipal = data.imagenes.some((img: any) => img.principal === true);
    if (!hasPrincipal) {
      data.imagenes[0].principal = true; // Marcar la primera como principal
    }

    // ✅ Validar propietario y agente
    if (!data.propietario) {
      return NextResponse.json({ error: 'El propietario es requerido' }, { status: 400 });
    }
    // El agente se asigna automáticamente si es 'agente', sino se usa el del body o session
    const agenteId = data.agente || (session.user.role === 'agente' ? session.user.id : null);
    if (!agenteId) {
      return NextResponse.json({ error: 'El agente responsable es requerido' }, { status: 400 });
    }

    // ✅ Validar enums
    const validTiposPropiedad = ['departamento', 'casa', 'local', 'oficina', 'terreno', 'cochera', 'galpon', 'ph'];
    const validTiposOperacion = ['venta', 'alquiler', 'ambos'];
    const validCategorias = ['residencial', 'comercial', 'industrial', 'inversion'];
    const validEstados = ['borrador', 'publicado', 'reservado', 'alquilado', 'vendido', 'baja'];
    
    if (!validTiposPropiedad.includes(data.tipoPropiedad)) {
      return NextResponse.json({ error: 'tipoPropiedad inválido' }, { status: 400 });
    }
    if (!validTiposOperacion.includes(data.tipoOperacion)) {
      return NextResponse.json({ error: 'tipoOperacion inválido' }, { status: 400 });
    }
    if (data.categoria && !validCategorias.includes(data.categoria)) {
      return NextResponse.json({ error: 'categoria inválida' }, { status: 400 });
    }
    if (data.estado && !validEstados.includes(data.estado)) {
      return NextResponse.json({ error: 'estado inválido' }, { status: 400 });
    }

    // ✅ Preparar datos para guardar
    const propertyData: any = {
      titulo: String(data.titulo).trim(),
      descripcion: String(data.descripcion).trim(),
      codigoInterno: data.codigoInterno?.trim() || null,
      tipoPropiedad: data.tipoPropiedad,
      tipoOperacion: data.tipoOperacion,
      categoria: data.categoria || 'residencial',
      direccion: {
        calle: String(dir.calle).trim(),
        numero: String(dir.numero).trim(),
        piso: dir.piso?.trim() || null,
        depto: dir.depto?.trim() || null,
        barrio: String(dir.barrio).trim(),
        ciudad: String(dir.ciudad).trim(),
        provincia: String(dir.provincia).trim(),
        codigoPostal: dir.codigoPostal?.trim() || null,
        coordenadas: dir.coordenadas || null,
        mostrarDireccionExacta: Boolean(dir.mostrarDireccionExacta),
      },
      zona: data.zona?.trim() || null,
      caracteristicas: data.caracteristicas || {},
      precios: {
        venta: data.precios.venta ? {
          moneda: data.precios.venta.moneda || 'USD',
          monto: data.precios.venta.monto,
          comision: data.precios.venta.comision ?? 3,
          gastosEscrituracion: data.precios.venta.gastosEscrituracion ?? true,
        } : undefined,
        alquiler: data.precios.alquiler ? {
          moneda: data.precios.alquiler.moneda || 'USD',
          monto: data.precios.alquiler.monto,
          comision: data.precios.alquiler.comision ?? 4.5,
          ajuste: data.precios.alquiler.ajuste || 'anual',
          garantiaRequerida: data.precios.alquiler.garantiaRequerida || 'propiedad',
        } : undefined,
        expensas: data.precios.expensas ?? null,
        impuestos: data.precios.impuestos ?? null,
      },
      imagenes: data.imagenes.map((img: any, index: number) => ({
        url: String(img.url).trim(),
        descripcion: img.descripcion?.trim() || null,
        principal: Boolean(img.principal),
        orden: typeof img.orden === 'number' ? img.orden : index,
        tipo: img.tipo || 'foto',
      })),
      videoUrl: data.videoUrl?.trim() || null,
      tourVirtualUrl: data.tourVirtualUrl?.trim() || null,
      planoUrl: data.planoUrl?.trim() || null,
      estado: data.estado || 'borrador',
      fechaPublicacion: data.fechaPublicacion ? new Date(data.fechaPublicacion) : null,
      fechaDisponibilidad: data.fechaDisponibilidad ? new Date(data.fechaDisponibilidad) : null,
      destacado: Boolean(data.destacado),
      urgente: Boolean(data.urgente),
      propietario: data.propietario,
      agente: agenteId,
      notasInternas: data.notasInternas?.trim() || null,
      seo: data.seo ? {
        slug: data.seo.slug?.trim() || null,
        metaTitle: data.seo.metaTitle?.trim() || null,
        metaDescription: data.seo.metaDescription?.trim() || null,
      } : undefined,
    };

    // ✅ Generar slug automático si no se proporciona
    if (!propertyData.seo?.slug) {
      const base = propertyData.titulo
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      propertyData.seo = { ...propertyData.seo, slug: base };
    }

    const property = new Property(propertyData);
    await property.save();

    // ⬅️ **ENVIAR EVENTO SSE**
    notifyProperties({
      type: 'propiedad_creada',
      data: normalizeProperty(property),
    });

    // Poblar para la respuesta
    const populated = await Property.findById(property._id)
      .populate('propietario', 'razonSocial nombre apellido')
      .populate('agente', 'name email');

    return NextResponse.json(populated, { status: 201 });

  } catch (error: any) {
    console.error('Error al crear propiedad:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return NextResponse.json(
        { error: `Ya existe una propiedad con este ${field === 'seo.slug' ? 'slug' : 'código interno'}.` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Error inesperado al crear la propiedad' },
      { status: 500 }
    );
  }
}