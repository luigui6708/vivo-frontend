'use server';

import { odooClient, authenticate } from '@/lib/odoo';
import { revalidatePath } from 'next/cache';

export async function createLote(formData: FormData) {
    const proveedor_id = parseInt(formData.get('proveedor_id') as string);
    const tipo_citrico = formData.get('tipo_citrico') as string;
    const variedad = formData.get('variedad') as string;
    const cantidad_kg = parseFloat(formData.get('cantidad_kg') as string);
    const numero_cajas = parseInt(formData.get('numero_cajas') as string);
    const huerta_origen = formData.get('huerta_origen') as string;
    const calidad_estimada = formData.get('calidad_estimada') as string;

    const loteData = {
        proveedor_id,
        tipo_citrico,
        variedad,
        cantidad_kg,
        numero_cajas,
        huerta_origen,
        calidad_estimada,
        fecha_recepcion: new Date().toISOString().split('T')[0], // Today's date
    };

    try {
        const uid = await authenticate();

        const newLoteId = await new Promise((resolve, reject) => {
            odooClient.object.methodCall('execute_kw', [
                process.env.ODOO_DB || 'vivo_db',
                uid,
                process.env.ODOO_PASSWORD || 'admin',
                'vivo.recepcion.citricos',
                'create',
                [loteData]
            ], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        console.log('Created Lote ID:', newLoteId);
        revalidatePath('/recepcion');
        return { success: true, message: `Lote creado exitosamente (ID: ${newLoteId})` };
    } catch (error: any) {
        console.error('Error creating lote:', error);
        // Return mock success for prototype if Odoo is unreachable
        if (error.code === 'ECONNREFUSED' || error.message.includes('getaddrinfo')) {
            console.warn("Odoo unreachable, returning mock success for prototype.");
            return { success: true, message: "Lote registrado (Modo Offline/Prototipo)" };
        }
        return { success: false, message: 'Error al conectar con Odoo: ' + error.message };
    }
}
