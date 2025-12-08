import { searchRead } from '@/lib/odoo';

export default async function EntidadesPage() {
    let entidades = [];
    try {
        entidades = await searchRead('res.partner', [], ['name', 'tipo_entidad', 'rfc', 'mobile']) as any[];
    } catch (error) {
        console.error("Failed to fetch from Odoo:", error);
        // Mock data for demonstration if Odoo is offline
        entidades = [
            { id: 1, name: 'FELIPE AVELAR', tipo_entidad: 'proveedor', rfc: 'XAXX010101000', mobile: '555-123-4567' },
            { id: 2, name: 'COLIMEX', tipo_entidad: 'cliente', rfc: 'XAXX010101001', mobile: '555-987-6543' },
        ];
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Entidades (Clientes y Proveedores)</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">Nombre</th>
                            <th className="py-2 px-4 border-b text-left">Tipo</th>
                            <th className="py-2 px-4 border-b text-left">RFC</th>
                            <th className="py-2 px-4 border-b text-left">Celular</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entidades.map((entidad) => (
                            <tr key={entidad.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{entidad.name}</td>
                                <td className="py-2 px-4 border-b capitalize">{entidad.tipo_entidad}</td>
                                <td className="py-2 px-4 border-b">{entidad.rfc}</td>
                                <td className="py-2 px-4 border-b">{entidad.mobile}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
