import { getOrdenesParaCalidad } from '@/app/actions/calidad';
import CalidadForm from '@/components/CalidadForm';

export default async function CalidadPage() {
    const ordenes = await getOrdenesParaCalidad();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Control de Calidad</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Inspección de lotes en proceso de producción.
                </p>
            </div>

            <div className="bg-white shadow sm:rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Nueva Inspección</h3>
                <CalidadForm ordenes={ordenes} />
            </div>
        </div>
    );
}
