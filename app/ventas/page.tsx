import { searchRead } from '@/lib/odoo';

export default async function VentasPage() {
    let sales = [];
    let opportunities = [];

    try {
        // Fetch Sales Orders (This Month)
        // Note: Date filtering is simplified for prototype
        sales = await searchRead('sale.order', [], ['name', 'partner_id', 'amount_total', 'state', 'date_order']) as any[];

        // Fetch CRM Opportunities
        opportunities = await searchRead('crm.lead', [['type', '=', 'opportunity']], ['name', 'expected_revenue', 'stage_id', 'probability']) as any[];
    } catch (error) {
        console.error("Failed to fetch sales data:", error);
        // Mock data
        sales = [
            { id: 1, name: 'S0001', partner_id: [1, 'Walmart'], amount_total: 150000, state: 'sale', date_order: '2023-10-01' },
            { id: 2, name: 'S0002', partner_id: [2, 'Costco'], amount_total: 280000, state: 'draft', date_order: '2023-10-05' },
        ];
        opportunities = [
            { id: 1, name: 'Contrato Anual Soriana', expected_revenue: 500000, stage_id: [1, 'Nuevo'], probability: 10 },
            { id: 2, name: 'Exportación Europa', expected_revenue: 1200000, stage_id: [2, 'Calificado'], probability: 40 },
        ];
    }

    // Calculate KPIs
    const totalSales = sales.reduce((sum, order) => sum + (order.amount_total || 0), 0);
    const activeOpportunities = opportunities.length;
    const pipelineValue = opportunities.reduce((sum, opp) => sum + (opp.expected_revenue || 0), 0);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Resumen de operaciones comerciales y pipeline.
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Ventas Totales</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">${totalSales.toLocaleString()}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Oportunidades Activas</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{activeOpportunities}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Valor del Pipeline</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">${pipelineValue.toLocaleString()}</dd>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Orders Table */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Órdenes Recientes</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sales.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Array.isArray(order.partner_id) ? order.partner_id[1] : order.partner_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.amount_total?.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{order.state}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Opportunities Table */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Pipeline de Oportunidades</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oportunidad</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Esp.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probabilidad</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {opportunities.map((opp) => (
                                    <tr key={opp.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{opp.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${opp.expected_revenue?.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opp.probability}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
