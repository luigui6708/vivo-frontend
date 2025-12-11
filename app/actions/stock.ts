'use server';

import { searchRead } from '@/lib/odoo';

export async function getLowStockProducts() {
    try {
        const domain = [
            ['type', 'in', ['product', 'consu']],
            ['qty_available', '<', 100] // Threshold
        ];
        const fields = ['name', 'qty_available'];
        const results = await searchRead('product.product', domain, fields) as any[];

        // Filter mainly for our relevant products to avoid noise from demo data if possible
        // For now return all low stock to show the feature works
        return results.map(r => ({
            name: r.name,
            qty: r.qty_available
        })).slice(0, 5); // Limit to top 5 critically low
    } catch (error) {
        console.error("Error checking stock:", error);
        return [];
    }
}
