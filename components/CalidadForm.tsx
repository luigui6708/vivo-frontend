'use client';

import { createCalidad } from '@/app/actions/createCalidad';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
            {pending ? 'Guardando...' : 'Guardar Inspección'}
        </button>
    );
}

export default function CalidadForm({ ordenes }: { ordenes: any[] }) {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function clientAction(formData: FormData) {
        const result = await createCalidad(formData);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    }

    return (
        <form action={clientAction} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Orden de Producción */}
                <div className="sm:col-span-3">
                    <label htmlFor="orden_produccion_id" className="block text-sm font-medium text-gray-700">
                        Orden de Producción
                    </label>
                    <div className="mt-1">
                        <select
                            id="orden_produccion_id"
                            name="orden_produccion_id"
                            required
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value="">Seleccione una orden</option>
                            {ordenes.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {o.folio} - {o.lote_id[1]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Etapa */}
                <div className="sm:col-span-3">
                    <label htmlFor="etapa_proceso" className="block text-sm font-medium text-gray-700">
                        Etapa del Proceso
                    </label>
                    <div className="mt-1">
                        <select
                            id="etapa_proceso"
                            name="etapa_proceso"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value="recepcion">Recepción</option>
                            <option value="lavado">Lavado</option>
                            <option value="encerado">Encerado</option>
                            <option value="clasificacion">Clasificación</option>
                            <option value="empacado">Empacado</option>
                        </select>
                    </div>
                </div>

                {/* Parámetro */}
                <div className="sm:col-span-3">
                    <label htmlFor="parametro_medido" className="block text-sm font-medium text-gray-700">
                        Parámetro Medido
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="parametro_medido"
                            id="parametro_medido"
                            placeholder="Ej. Grados Brix"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                {/* Valor */}
                <div className="sm:col-span-3">
                    <label htmlFor="valor_medido" className="block text-sm font-medium text-gray-700">
                        Valor Medido
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="valor_medido"
                            id="valor_medido"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                {/* Cumple */}
                <div className="sm:col-span-6">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="cumple_especificacion"
                                name="cumple_especificacion"
                                type="checkbox"
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="cumple_especificacion" className="font-medium text-gray-700">
                                Cumple Especificación
                            </label>
                        </div>
                    </div>
                </div>

                {/* Estado */}
                <div className="sm:col-span-3">
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                        Dictamen
                    </label>
                    <div className="mt-1">
                        <select
                            id="estado"
                            name="estado"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value="aprobado">Aprobado</option>
                            <option value="condicionado">Condicionado</option>
                            <option value="rechazado">Rechazado</option>
                        </select>
                    </div>
                </div>

                {/* Observaciones */}
                <div className="sm:col-span-6">
                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
                        Observaciones
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="observaciones"
                            name="observaciones"
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <SubmitButton />
            </div>
        </form>
    );
}
