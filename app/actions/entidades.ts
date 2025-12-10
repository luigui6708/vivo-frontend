'use server';

import { searchRead } from "@/lib/odoo";

export interface Entidad {
    id: number;
    name: string;
    email: string | boolean;
    phone: string | boolean;
    city: string | boolean;
    vat: string | boolean; // RFC
    commercial_company_name: string | boolean;
}

export async function getEntidades(): Promise<Entidad[]> {
    console.log("Fetching Entities from Odoo...");
    try {
        // Domain to fetch customers and suppliers
        // Relaxed filter: Fetch all partners (you might want to filter by type='contact' or similar later)
        // Empty domain [] fetches everything. Let's try fetching companies or people.
        const domain: any[] = [];
        const fields = ['name', 'email', 'phone', 'city', 'vat', 'commercial_company_name'];

        const results = await searchRead('res.partner', domain, fields) as any[];

        // Map and clean data (Odoo returns false for empty fields)
        return results.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email || '',
            phone: r.phone || '',
            city: r.city || '',
            vat: r.vat || '',
            commercial_company_name: r.commercial_company_name || ''
        }));
    } catch (error) {
        console.error("Error fetching entities:", error);
        return [];
    }
}
