import BitacoraForm from '@/components/BitacoraForm';
import { searchRead } from '@/lib/odoo';

export default async function ProduccionPage() {
    let ordenes = [];
    try {
        // Fetch production orders
        ordenes = await searchRead('vivo.orden.produccion', [], ['id', 'folio', 'lote_id']) as any[];
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        // Mock data
        ordenes = [
            { id: 1, folio: 'OP-001', lote_id: [10, 'Lote A-2904'] },
            { id: 2, folio: 'OP-002', lote_id: [11, 'Lote B-3000'] },
        ];
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Producción y Bitácoras</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Registro de variables de proceso y actividades operativas.
                </p>
            </div>

            <BitacoraForm ordenes={ordenes} />
        </div>
    );
}
