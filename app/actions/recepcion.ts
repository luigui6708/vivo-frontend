'use server';

import { searchRead } from "@/lib/odoo";

export interface Recepcion {
    id: number;
    name: string;
    partner_id: [number, string] | boolean; // Odoo returns [id, name] for Many2one
    origin: string | boolean;
    state: string;
    scheduled_date: string | boolean;
}

export async function getRecepciones(): Promise<Recepcion[]> {
    console.log("Fetching Receptions (Incoming Pickings) from Odoo...");
    try {
        // picking_type_code = 'incoming' means Receipts
        const domain = [['picking_type_code', '=', 'incoming'], ['state', '!=', 'cancel']];
        const fields = ['name', 'partner_id', 'origin', 'state', 'scheduled_date'];

        // Order by ID desc (newest first)
        // Note: searchRead helper might need an 'order' param, but standard search_read supports it via kwargs if updated.
        // For now, simple fetch.

        const results = await searchRead('stock.picking', domain, fields) as any[];

        return results.map(r => ({
            id: r.id,
            name: r.name,
            partner_id: r.partner_id || false,
            origin: r.origin || '',
            state: r.state,
            scheduled_date: r.scheduled_date || ''
        }));
    } catch (error) {
        console.error("Error fetching receptions:", error);
        return [];
    }
}
