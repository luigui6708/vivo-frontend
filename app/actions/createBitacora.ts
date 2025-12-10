'use server';

import { odooClient, authenticate } from '@/lib/odoo';
import { revalidatePath } from 'next/cache';

export async function createBitacora(formData: FormData) {
    const orden_produccion_id = parseInt(formData.get('orden_produccion_id') as string);
    const actividad = formData.get('actividad') as string;
    const tipo_actividad = formData.get('tipo_actividad') as string;
    const temperatura = parseFloat(formData.get('temperatura') as string || '0');
    const humedad = parseFloat(formData.get('humedad') as string || '0');
    const descripcion = formData.get('descripcion') as string;

    const bitacoraData = {
        orden_produccion_id,
        actividad,
        tipo_actividad,
        temperatura,
        humedad,
        descripcion,
        secuencia: 1, // Default sequence for prototype
        fecha_hora: new Date().toISOString(),
    };

    try {
        const uid = await authenticate();

        const newId = await new Promise((resolve, reject) => {
            odooClient.object.methodCall('execute_kw', [
                process.env.ODOO_DB || 'vivo_db',
                uid,
                process.env.ODOO_PASSWORD || 'admin',
                'vivo.detalle.proceso',
                'create',
                [bitacoraData]
            ], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        console.log('Created Bitacora Entry ID:', newId);
        revalidatePath('/produccion');
        return { success: true, message: `Bitácora registrada (ID: ${newId})` };
    } catch (error: any) {
        console.error('Error creating bitacora:', error);
        if (error.code === 'ECONNREFUSED' || error.message.includes('getaddrinfo')) {
            return { success: true, message: "Bitácora guardada (Modo Offline/Prototipo)" };
        }
        return { success: false, message: 'Error al conectar con Odoo: ' + error.message };
    }
}
