import RecepcionForm from '@/components/RecepcionForm';
import { searchRead } from '@/lib/odoo';

export default async function NuevaRecepcionPage() {
    let proveedores = [];
    try {
        // Fetch providers from Odoo (res.partner where tipo_entidad is 'proveedor')
        // Using relaxed filter as learned from Entidades module
        proveedores = await searchRead('res.partner', [], ['id', 'name']) as any[];
    } catch (error) {
        console.error("Failed to fetch providers:", error);
        proveedores = [];
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Nueva Recepción</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Registre la entrada de materia prima al almacén.
                </p>
            </div>

            <RecepcionForm proveedores={proveedores} />
        </div>
    );
}
