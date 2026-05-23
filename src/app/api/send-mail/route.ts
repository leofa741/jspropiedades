// app/api/send-mail/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ─────────────────────────────────────────────────────────────
// TIPOS PARA EL FORMULARIO DE REAL ESTATE
// ─────────────────────────────────────────────────────────────
interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  interest: 'buy' | 'sell' | 'rent' | 'valuation' | 'other';
  propertyType?: 'departamento' | 'casa' | 'ph' | 'local' | 'terreno' | 'otros';
  location?: string;
  budget?: '<100k' | '100k-250k' | '250k-500k' | '500k-1M' | '>1M';
  message: string;
  subject?: string;
}

// ─────────────────────────────────────────────────────────────
// MAPEOS LEGIBLES PARA EL EMAIL
// ─────────────────────────────────────────────────────────────
const interestLabels: Record<string, string> = {
  buy: 'Comprar una propiedad',
  sell: 'Vender mi propiedad',
  rent: 'Alquilar',
  valuation: 'Tasación gratuita',
  other: 'Otra consulta',
};

const propertyTypeLabels: Record<string, string> = {
  departamento: 'Departamento',
  casa: 'Casa',
  ph: 'PH',
  local: 'Local comercial',
  terreno: 'Terreno',
  otros: 'Otros',
};

const budgetLabels: Record<string, string> = {
  '<100k': 'Menos de USD 100.000',
  '100k-250k': 'USD 100.000 - 250.000',
  '250k-500k': 'USD 250.000 - 500.000',
  '500k-1M': 'USD 500.000 - 1.000.000',
  '>1M': 'Más de USD 1.000.000',
};

// ─────────────────────────────────────────────────────────────
// HANDLER PRINCIPAL
// ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body: ContactForm = await req.json();
    const { name, email, phone, interest, propertyType, location, budget, message } = body;

    // Validación de campos obligatorios
    if (!name?.trim() || !email?.trim() || !message?.trim() || !interest) {
      return NextResponse.json(
        { success: false, message: 'Por favor, completá los campos obligatorios.' },
        { status: 400 }
      );
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Por favor, ingresá un email válido.' },
        { status: 400 }
      );
    }

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE || 'gmail',
      host: process.env.MAILER_HOST,
      port: parseInt(process.env.MAILER_PORT || '587'),
      secure: process.env.MAILER_SECURE === 'true',
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY,
      },
    });

    // Verificar conexión (opcional pero recomendado en producción)
    await transporter.verify();

    // Construir contenido del email
    const emailContent = buildEmailContent(body);

    const mailOptions = {
      from: `"Jimena Sánchez Propiedades" <${process.env.MAILER_EMAIL}>`,
      to: process.env.MAILER_EMAIL,
      cc: process.env.MAILER_CC?.split(',').map((e: string) => e.trim()),
      subject: `🏡 Nueva consulta: ${interestLabels[interest]} - ${name}`,
      html: emailContent,
      text: buildTextContent(body), // Fallback para clientes que no soportan HTML
    };

    await transporter.sendMail(mailOptions);

    // Log opcional para tracking (sin datos sensibles)
    console.log(`✅ Email enviado: ${interest} - ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: '¡Consulta enviada! Jimena te contactará a la brevedad.' 
    });

  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    
    // No exponer detalles del error al cliente
    return NextResponse.json(
      { 
        success: false, 
        message: 'Ocurrió un error al enviar tu consulta. Por favor, intentá de nuevo o contactanos por WhatsApp.' 
      },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// PLANTILLA HTML PREMIUM PARA EL EMAIL
// ─────────────────────────────────────────────────────────────
function buildEmailContent(data: ContactForm): string {
  const { name, email, phone, interest, propertyType, location, budget, message } = data;
  
  // Estilos inline para compatibilidad con clientes de email
  const styles = {
    container: 'font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 0;',
    header: 'background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;',
    headerTitle: 'color: white; font-size: 24px; font-weight: bold; margin: 0 0 8px 0;',
    headerSubtitle: 'color: rgba(255,255,255,0.9); font-size: 14px; margin: 0;',
    body: 'background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;',
    card: 'background: white; padding: 20px; border-radius: 10px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);',
    label: 'color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;',
    value: 'color: #1e293b; font-size: 15px; font-weight: 500; margin: 0 0 12px 0;',
    messageBox: 'background: #f1f5f9; padding: 16px; border-radius: 8px; border-left: 4px solid #8b5cf6; margin: 16px 0;',
    messageText: 'color: #334155; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;',
    footer: 'text-align: center; padding: 24px; color: #94a3b8; font-size: 12px;',
    badge: 'display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;',
    divider: 'height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 20px 0;',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva consulta inmobiliaria</title>
    </head>
    <body style="${styles.container}">
      
      <!-- Header con gradiente -->
      <div style="${styles.header}">
        <h1 style="${styles.headerTitle}">🏡 Nueva Consulta Inmobiliaria</h1>
        <p style="${styles.headerSubtitle}">Jimena Sánchez Propiedades</p>
      </div>

      <!-- Cuerpo del email -->
      <div style="${styles.body}">
        
        <!-- Badge de interés principal -->
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="${styles.badge}">${interestLabels[interest]}</span>
        </div>

        <!-- Datos del contacto -->
        <div style="${styles.card}">
          <p style="${styles.label}">Nombre completo</p>
          <p style="${styles.value}">${name}</p>
          
          <p style="${styles.label}">Email</p>
          <p style="${styles.value}"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none;">${email}</a></p>
          
          ${phone ? `
            <p style="${styles.label}">Teléfono</p>
            <p style="${styles.value}"><a href="tel:${phone}" style="color: #6366f1; text-decoration: none;">${phone}</a></p>
          ` : ''}
        </div>

        <!-- Detalles de la consulta -->
        <div style="${styles.card}">
          ${propertyType ? `
            <p style="${styles.label}">Tipo de propiedad</p>
            <p style="${styles.value}">${propertyTypeLabels[propertyType]}</p>
          ` : ''}
          
          ${location ? `
            <p style="${styles.label}">Zona de interés</p>
            <p style="${styles.value}">${location}</p>
          ` : ''}
          
          ${budget ? `
            <p style="${styles.label}">Presupuesto estimado</p>
            <p style="${styles.value}">${budgetLabels[budget]}</p>
          ` : ''}
        </div>

        <!-- Mensaje -->
        <div style="${styles.card}">
          <p style="${styles.label}">Mensaje</p>
          <div style="${styles.messageBox}">
            <p style="${styles.messageText}">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>

        <!-- Divider decorativo -->
        <div style="${styles.divider}"></div>

        <!-- CTA rápido para responder -->
        <div style="text-align: center; margin-top: 24px;">
          <a href="mailto:${email}?subject=Re: Consulta inmobiliaria" 
             style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Responder a ${name}
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="${styles.footer}">
        <p style="margin: 0 0 8px 0;">
          <strong>Jimena Sánchez Propiedades</strong>
        </p>
        <p style="margin: 0 0 4px 0;">📧 ${process.env.MAILER_EMAIL}</p>
        <p style="margin: 0;">
          Este mensaje fue enviado desde el formulario de contacto de 
          <strong>Jimena Sánchez Propiedades</strong>.
        </p>
        <p style="margin: 12px 0 0 0; font-size: 11px; color: #64748b;">
          Si no reconocés esta consulta, por favor ignorá este email.
        </p>
      </div>

    </body>
    </html>
  `;
}

// ─────────────────────────────────────────────────────────────
// VERSIÓN TEXTO PLANO (FALLBACK)
// ─────────────────────────────────────────────────────────────
function buildTextContent(data: ContactForm): string {
  const { name, email, phone, interest, propertyType, location, budget, message } = data;
  
  return `
NUEVA CONSULTA INMOBILIARIA - Jimena Sánchez Propiedades
========================================================

INTERÉS: ${interestLabels[interest]}

CONTACTO:
• Nombre: ${name}
• Email: ${email}
${phone ? `• Teléfono: ${phone}` : ''}

DETALLES:
${propertyType ? `• Tipo de propiedad: ${propertyTypeLabels[propertyType]}` : ''}
${location ? `• Zona: ${location}` : ''}
${budget ? `• Presupuesto: ${budgetLabels[budget]}` : ''}

MENSAJE:
${message}

---
Responder a: ${email}
Enviado desde: Formulario web Jimena Sánchez Propiedades
  `.trim();
}