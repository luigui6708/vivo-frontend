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
    const decision = formData.get('decision') as string; // Aprobado/Rechazado

    if (!mo_id) return { success: false, message: "ID de Orden no válido" };

    const body = `
        <h3>📋 Inspección de Calidad</h3>
        <ul>
            <li><strong>Decision:</strong> ${decision}</li>
            <li><strong>Brix:</strong> ${brix}</li>
            <li><strong>pH:</strong> ${ph}</li>
            <li><strong>Defectos (%):</strong> ${defectos}%</li>
            <li><strong>Observaciones:</strong> ${observaciones}</li>
        </ul>
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
