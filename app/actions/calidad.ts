'use server';

import { odooClient, authenticate, searchRead } from '@/lib/odoo';
import { revalidatePath } from 'next/cache';

export async function getOrdenesParaCalidad() {
    // Reusing standard search but maybe we filter by state 'progress' or 'to_close'
    const domain = [['state', 'in', ['confirmed', 'progress', 'to_close']]];
    const fields = ['name', 'product_id', 'state'];
    return await searchRead('mrp.production', domain, fields) as any[];
}

export async function registrarCalidad(formData: FormData) {
    const mo_id = parseInt(formData.get('mo_id') as string);
    const brix = formData.get('open_brix') as string;
    const ph = formData.get('ph') as string;
    const defectos = formData.get('defectos') as string;
    const observaciones = formData.get('observaciones') as string;
    const decision = formData.get('decision') as string;

    // Campos Avanzados (Checklist)
    const ppm_hipoclorito = formData.get('ppm_hipoclorito') || 'N/A';
    const ppm_peracetico = formData.get('ppm_peracetico') || 'N/A';
    const peso_caja = formData.get('peso_caja') || 'N/A';
    const eliminacion_menor_46mm = formData.get('eliminacion_menor_46mm') || 'N/A';

    if (!mo_id) return { success: false, message: "ID de Orden no válido" };

    // Format Body as Rich HTML Table matching documentation style
    const body = `
        <div style="font-family: Arial, sans-serif;">
            <h2 style="color: #2e3b4e; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">📋 Inspección de Calidad (Checklist Operativo)</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="background-color: #f3f4f6;">
                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Punto de Control</th>
                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Valor Registrado</th>
                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Meta / Referencia</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Dictamen Final</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: ${decision === 'Aprobado' ? 'green' : 'red'};">${decision}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">-</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Grados Brix</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${brix}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Min 9.0</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">pH</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${ph}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">2.5 - 4.5</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Hipoclorito (ppm)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${ppm_hipoclorito} ppm</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">200 ppm</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Ácido Peracético (ppm)</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${ppm_peracetico} ppm</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">85 ppm</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Peso Caja Promedio</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${peso_caja} kg</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">17.30 kg</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">Eliminación &lt; 46mm</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${eliminacion_menor_46mm}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Requerido</td>
                </tr>
            </table>

            <p style="margin-top: 15px;"><strong>Observaciones:</strong> <br/> ${observaciones}</p>
            <p style="font-size: 0.8em; color: #666;">Registrado desde VIVO Frontend</p>
        </div>
    `;

    try {
        const uid = await authenticate();
        const db = process.env.ODOO_DB || 'vivo_db';
        const password = process.env.ODOO_PASSWORD || 'admin';

        await new Promise((resolve, reject) => {
            odooClient.object.methodCall('execute_kw', [
                db, uid, password,
                'mrp.production', 'message_post',
                [[mo_id]],
                {
                    body: body,
                    message_type: 'comment',
                    subtype_xmlid: 'mail.mt_note'
                }
            ], (err, res) => err ? reject(err) : resolve(res));
        });

        revalidatePath('/calidad');
        return { success: true, message: "Inspección registrada en la Orden." };
    } catch (error: any) {
        console.error("Error logging quality:", error);
        return { success: false, message: "Error al guardar inspección: " + error.message };
    }
}
