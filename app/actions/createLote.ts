'use server';

import { odooClient, authenticate } from '@/lib/odoo';
import { revalidatePath } from 'next/cache';

// Product Mapping based on setup_products.mjs output
// In a real app, you might fetch this dynamically or use a config table
const PRODUCT_MAP: { [key: string]: number } = {
    'limon_persa': 54,
    'naranja_valencia': 55,
    'toronja': 56,
    'mandarina': 57
};

export async function createLote(formData: FormData) {
    const proveedor_id = parseInt(formData.get('proveedor_id') as string);
    const tipo_citrico = formData.get('tipo_citrico') as string;
    // const variedad = formData.get('variedad') as string; // Not used in standard product for now
    const cantidad_kg = parseFloat(formData.get('cantidad_kg') as string);
    const numero_cajas = parseInt(formData.get('numero_cajas') as string);
    const huerta_origen = formData.get('huerta_origen') as string;
    const calidad_estimada = formData.get('calidad_estimada') as string;

    const productId = PRODUCT_MAP[tipo_citrico];
    if (!productId) {
        return { success: false, message: 'Producto no válido o no configurado.' };
    }

    try {
        const uid = await authenticate();
        const db = process.env.ODOO_DB || 'vivo_db';
        const password = process.env.ODOO_PASSWORD || 'admin';

        // 1. Get Picking Type (incoming) and Supplier Location
        const pickingTypes = await new Promise<any[]>((resolve, reject) => {
            odooClient.object.methodCall('execute_kw', [
                db, uid, password,
                'stock.picking.type', 'search',
                [[['code', '=', 'incoming']]],
                { limit: 1 }
            ], (err, res) => err ? reject(err) : resolve(res));
        });

        if (!pickingTypes || pickingTypes.length === 0) {
            throw new Error('No se encontró un tipo de operación de recepción (incoming).');
        }
        const typeId = pickingTypes[0];

        // Find Supplier Location (Usage = supplier)
        const supplierLocIds = await new Promise<any[]>((resolve, reject) => {
            odooClient.object.methodCall('execute_kw', [
                db, uid, password,
                'stock.location', 'search',
                [[['usage', '=', 'supplier']]],
                { limit: 1 }
            ], (err, res) => err ? reject(err) : resolve(res));
        });

        const locationSrcId = supplierLocIds.length > 0 ? supplierLocIds[0] : 4; // Fallback to 4
        const locationDestId = 8; // WH/Stock standard

        // 2. Prepare Stock Picking Data
        // Store custom data in 'origin' or 'note'
        const originNote = `Huerta: ${huerta_origen} | Calidad: ${calidad_estimada} | Cajas: ${numero_cajas}`;

        const moveLines = [
            [0, 0, {
                product_id: productId,
                name: `Recepción ${tipo_citrico}`,
                product_uom_qty: cantidad_kg,
                product_uom: 1, // Unit (kg typically) - assume 1
                location_id: locationSrcId,
                location_dest_id: locationDestId
            }]
        ];

        const pickingVals = {
            picking_type_id: typeId,
            partner_id: proveedor_id,
            location_id: locationSrcId,
            location_dest_id: locationDestId,
            origin: originNote,
            move_ids_without_package: moveLines
        };

        // 3. Create
        const newPickingId = await new Promise((resolve, reject) => {
            odooClient.object.methodCall('execute_kw', [
                db, uid, password,
                'stock.picking', 'create',
                [pickingVals]
            ], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        console.log('Created Stock Picking ID:', newPickingId);
        revalidatePath('/recepcion');
        return { success: true, message: `Recepción creada exitosamente (ID: ${newPickingId})` };

    } catch (error: any) {
        console.error('Error creating reception:', error);
        return { success: false, message: 'Error al conectar con Odoo: ' + error.message };
    }
}
