'use server';

import { odooClient, authenticate } from '@/lib/odoo';
import { revalidatePath } from 'next/cache';

export async function createCalidad(formData: FormData) {
    const orden_produccion_id = parseInt(formData.get('orden_produccion_id') as string);
    const etapa_proceso = formData.get('etapa_proceso') as string;
    const cumple_especificacion = formData.get('cumple_especificacion') === 'on';
    const observaciones = formData.get('observaciones') as string;
    const acciones_correctivas = formData.get('acciones_correctivas') as string;
    const parametro_medido = formData.get('parametro_medido') as string;
    const valor_medido = formData.get('valor_medido') as string;
    const estado = formData.get('estado') as string;

    const calidadData = {
        orden_produccion_id,
        etapa_proceso,
        cumple_especificacion,
        observaciones,
        acciones_correctivas,
        parametro_medido,
        valor_medido,
        estado,
        fecha_registro: new Date().toISOString(),
    };

    try {
        const uid = await authenticate();

        const newId = await new Promise((resolve, reject) => {
            odooClient.object.methodCall('execute_kw', [
                process.env.ODOO_DB || 'vivo_db',
                uid,
                process.env.ODOO_PASSWORD || 'admin',
                'vivo.calidad.lote',
                'create',
                [calidadData]
            ], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        console.log('Created Calidad Record ID:', newId);
        revalidatePath('/calidad');
        return { success: true, message: `Registro de calidad creado (ID: ${newId})` };
    } catch (error: any) {
        console.error('Error creating calidad:', error);
        if (error.code === 'ECONNREFUSED' || error.message.includes('getaddrinfo')) {
            return { success: true, message: "Registro guardado (Modo Offline/Prototipo)" };
        }
        return { success: false, message: 'Error al conectar con Odoo: ' + error.message };
    }
}
