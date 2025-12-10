import { getVentas, Venta } from '@/app/actions/ventas';

function calculateKPIs(ventas: Venta[]) {
    const totalVendido = ventas
        .filter(v => v.state === 'sale' || v.state === 'done')
        .reduce((sum, v) => sum + v.amount_total, 0);

    return {
        totalOrders: ventas.length,
        totalAmount: totalVendido,
        pending: ventas.filter(v => v.state === 'draft' || v.state === 'sent').length,
    };
}

export default async function VentasPage() {
    const ventas = await getVentas();
    const kpis = calculateKPIs(ventas);

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Gestión de Pedidos y Cotizaciones.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Ventas Totales (Confirmadas)</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">${kpis.totalAmount.toLocaleString('es-MX')}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Pedidos</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{kpis.totalOrders}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-amber-500 truncate">Cotizaciones Pendientes</dt>
                        <dd className="mt-1 text-3xl font-semibold text-amber-600">{kpis.pending}</dd>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ventas.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No hay ventas registradas.
                                </td>
                            </tr>
                        ) : (
                            ventas.map((v) => (
                                <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                        {v.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {Array.isArray(v.partner_id) ? v.partner_id[1] : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {v.date_order as string || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        ${v.amount_total.toLocaleString('es-MX')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${v.state === 'sale' || v.state === 'done' ? 'bg-green-100 text-green-800' :
                                                v.state === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {v.state === 'sale' ? 'Orden de Venta' :
                                                v.state === 'done' ? 'Bloqueado' :
                                                    v.state === 'draft' ? 'Presupuesto' : v.state}
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
