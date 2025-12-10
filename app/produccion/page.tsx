import Link from 'next/link';
import { getOrdenesProduccion, OrdenProduccion } from '@/app/actions/produccion';

// Helper to calculate KPIs
function calculateKPIs(ordenes: OrdenProduccion[]) {
    return {
        total: ordenes.length,
        progress: ordenes.filter(o => o.state === 'progress').length,
        confirmed: ordenes.filter(o => o.state === 'confirmed').length,
        done: ordenes.filter(o => o.state === 'done').length,
    };
}

export default async function ProduccionPage() {
    const ordenes = await getOrdenesProduccion();
    const kpis = calculateKPIs(ordenes);

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Producción y Bitácoras</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Monitoreo en tiempo real de Órdenes de Producción.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Órdenes</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{kpis.total}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-blue-500 truncate">Por Iniciar</dt>
                        <dd className="mt-1 text-3xl font-semibold text-blue-600">{kpis.confirmed}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-amber-500 truncate">En Progreso</dt>
                        <dd className="mt-1 text-3xl font-semibold text-amber-600">{kpis.progress}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-green-500 truncate">Terminadas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">{kpis.done}</dd>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50 border-b">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Ordenes Activas</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Planificada</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ordenes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No hay órdenes de producción activas.
                                </td>
                            </tr>
                        ) : (
                            ordenes.map((op) => (
                                <tr key={op.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                        {op.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {Array.isArray(op.product_id) ? op.product_id[1] : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {op.product_qty}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {op.date_start as string || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${op.state === 'done' ? 'bg-green-100 text-green-800' :
                                            op.state === 'progress' ? 'bg-amber-100 text-amber-800' :
                                                op.state === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {op.state === 'progress' ? 'En Proceso' :
                                                op.state === 'confirmed' ? 'Por Iniciar' :
                                                    op.state === 'done' ? 'Terminado' : op.state}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
