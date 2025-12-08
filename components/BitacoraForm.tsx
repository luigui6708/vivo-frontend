'use client';

import { createBitacora } from '@/app/actions/createBitacora';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
            {pending ? 'Registrando...' : 'Registrar Actividad'}
        </button>
    );
}

export default function BitacoraForm({ ordenes }: { ordenes: any[] }) {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function clientAction(formData: FormData) {
        const result = await createBitacora(formData);
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
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
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

                {/* Tipo Actividad */}
                <div className="sm:col-span-3">
                    <label htmlFor="tipo_actividad" className="block text-sm font-medium text-gray-700">
                        Tipo de Actividad
                    </label>
                    <div className="mt-1">
                        <select
                            id="tipo_actividad"
                            name="tipo_actividad"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value="seleccion">Selección</option>
                            <option value="lavado">Lavado</option>
                            <option value="secado">Secado</option>
                            <option value="clasificacion">Clasificación</option>
                            <option value="empaque">Empaque</option>
                        </select>
                    </div>
                </div>

                {/* Actividad */}
                <div className="sm:col-span-6">
                    <label htmlFor="actividad" className="block text-sm font-medium text-gray-700">
                        Nombre de la Actividad
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="actividad"
                            id="actividad"
                            required
                            placeholder="Ej. Inicio de lavado"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                {/* Temperatura */}
                <div className="sm:col-span-3">
                    <label htmlFor="temperatura" className="block text-sm font-medium text-gray-700">
                        Temperatura (°C)
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            step="0.1"
                            name="temperatura"
                            id="temperatura"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                {/* Humedad */}
                <div className="sm:col-span-3">
                    <label htmlFor="humedad" className="block text-sm font-medium text-gray-700">
                        Humedad (%)
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            step="0.1"
                            name="humedad"
                            id="humedad"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                {/* Descripción */}
                <div className="sm:col-span-6">
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                        Descripción / Notas
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
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
