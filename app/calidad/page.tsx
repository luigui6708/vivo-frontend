import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getOrdenesProduccion } from '@/app/actions/produccion';
import CalidadForm from '@/components/CalidadForm';
import DynamicQualityForm from '@/components/DynamicQualityForm';
import { getNotionSchema } from '@/lib/notion';

export default async function CalidadPage() {
    const session = await getSession();
    if (!session.user?.isLoggedIn) {
        redirect('/login');
    }

    const ordenes = await getOrdenesProduccion();
    const ordenesActivas = ordenes.filter(o => o.state === 'progress');

    // LIVE FETCH: Get schema from Notion
    const dbId = process.env.NOTION_DATABASE_ID || '';
    const liveSchema = await getNotionSchema(dbId);

    async function handleDynamicSubmit(data: any) {
        'use server';
        console.log("Saving Dynamic Data to Odoo via Notion Rules:", data);
    }

    return (
        <main className="min-h-screen p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Control de Calidad (ISO 9000)</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Legacy Static Form */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-600">Formulario Estándar (Legacy)</h2>
                    <p className="mb-4 text-sm text-gray-500">
                        Selecciona una orden activa para registrar inspección.
                    </p>
                    {ordenesActivas.length > 0 ? (
                        <CalidadForm
                            ordenId={ordenesActivas[0].id}
                            productName={String(ordenesActivas[0].product_id ? ordenesActivas[0].product_id[1] : 'Desconocido')}
                        />
                    ) : (
                        <div className="bg-yellow-100 p-4 rounded text-yellow-800">
                            No hay órdenes en proceso para inspeccionar.
                        </div>
                    )}
                </section>

                {/* New Dynamic Docu-Code Form */}
                <section className="border-l pl-8 border-indigo-200">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
                        <h2 className="text-xl font-bold text-indigo-800">Inspección Dinámica (Notion)</h2>
                    </div>
                    <p className="mb-4 text-sm text-indigo-600">
                        Campos obtenidos en tiempo real de la base de datos de Notion.
                    </p>

                    {liveSchema.length > 0 ? (
                        <DynamicQualityForm
                            schema={liveSchema}
                            onSubmit={handleDynamicSubmit}
                        />
                    ) : (
                        <div className="text-red-500 text-sm">
                            No se pudo cargar el esquema de Notion. Verifica el ID: {dbId.slice(0, 5)}...
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
