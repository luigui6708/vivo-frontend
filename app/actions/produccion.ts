'use server';

import { searchRead } from "@/lib/odoo";

export interface OrdenProduccion {
    id: number;
    name: string;
    product_id: [number, string] | boolean; // [ID, Name]
    product_qty: number;
    state: string; // draft, confirmed, progress, to_close, done, cancel
    date_start: string | boolean;
}

export async function getOrdenesProduccion(): Promise<OrdenProduccion[]> {
    console.log("Fetching Manufacturing Orders (mrp.production)...");
    try {
        const domain = [['state', '!=', 'cancel']]; // Show everything except cancelled
        const fields = ['name', 'product_id', 'product_qty', 'state', 'date_start'];

        const results = await searchRead('mrp.production', domain, fields) as any[];

        return results.map(r => ({
            id: r.id,
            name: r.name,
            product_id: r.product_id || false,
            product_qty: r.product_qty || 0,
            state: r.state,
            date_start: r.date_start || ''
        }));
    } catch (error) {
        console.error("Error fetching production orders:", error);
        return [];
    }
}
