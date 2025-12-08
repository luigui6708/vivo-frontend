import RecepcionForm from '@/components/RecepcionForm';
import { searchRead } from '@/lib/odoo';

export default async function RecepcionPage() {
    let proveedores = [];
    try {
        // Fetch providers from Odoo (res.partner where tipo_entidad is 'proveedor' or 'ambos')
        proveedores = await searchRead('res.partner', [['tipo_entidad', 'in', ['proveedor', 'ambos']]], ['id', 'name']) as any[];
    } catch (error) {
        console.error("Failed to fetch providers:", error);
        // Mock data for prototype
        proveedores = [
            { id: 1, name: 'FELIPE AVELAR' },
            { id: 2, name: 'JUAN PEREZ' },
            { id: 3, name: 'AGROCITRICOS SA' },
        ];
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Recepción de Cítricos</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Registre la entrada de nuevos lotes de fruta a la planta.
                </p>
            </div>

            <RecepcionForm proveedores={proveedores} />
        </div>
    );
}
