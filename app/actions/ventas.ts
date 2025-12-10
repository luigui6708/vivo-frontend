'use server';

import { searchRead } from "@/lib/odoo";

export interface Venta {
    id: number;
    name: string;
    partner_id: [number, string] | boolean; // [ID, Name]
    amount_total: number;
    state: string; // draft, sent, sale, done, cancel
    date_order: string | boolean;
}

export async function getVentas(): Promise<Venta[]> {
    console.log("Fetching Sales Orders (sale.order)...");
    try {
        const domain = [['state', '!=', 'cancel']];
        const fields = ['name', 'partner_id', 'amount_total', 'state', 'date_order'];

        const results = await searchRead('sale.order', domain, fields) as any[];

        return results.map(r => ({
            id: r.id,
            name: r.name,
            partner_id: r.partner_id || false,
            amount_total: r.amount_total || 0,
            state: r.state,
            date_order: r.date_order || ''
        }));
    } catch (error) {
        console.error("Error fetching sales orders:", error);
        return [];
    }
}
