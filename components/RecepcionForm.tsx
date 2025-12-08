'use client';

import { createLote } from '@/app/actions/createLote';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
            {pending ? 'Registrando...' : 'Registrar Recepción'}
        </button>
    );
}

export default function RecepcionForm({ proveedores }: { proveedores: any[] }) {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function clientAction(formData: FormData) {
        const result = await createLote(formData);
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            // Optional: Reset form here
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
                {/* Proveedor */}
                <div className="sm:col-span-3">
                    <label htmlFor="proveedor_id" className="block text-sm font-medium text-gray-700">
                        Proveedor
                    </label>
                    <div className="mt-1">
                        <select
                            id="proveedor_id"
                            name="proveedor_id"
                            required
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Huerta */}
                <div className="sm:col-span-3">
                    <label htmlFor="huerta_origen" className="block text-sm font-medium text-gray-700">
                        Huerta de Origen
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="huerta_origen"
                            id="huerta_origen"
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                {/* Tipo Cítrico */}
                <div className="sm:col-span-3">
                    <label htmlFor="tipo_citrico" className="block text-sm font-medium text-gray-700">
                        Tipo de Cítrico
                    </label>
                    <div className="mt-1">
                        <select
                            id="tipo_citrico"
                            name="tipo_citrico"
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value="limon_persa">Limón Persa</option>
                            <option value="naranja_valencia">Naranja Valencia</option>
                            <option value="toronja">Toronja</option>
                            <option value="mandarina">Mandarina</option>
                        </select>
                    </div>
                </div>

                {/* Variedad */}
                <div className="sm:col-span-3">
                    <label htmlFor="variedad" className="block text-sm font-medium text-gray-700">
                        Variedad
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="variedad"
                            id="variedad"
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                {/* Cantidad KG */}
                <div className="sm:col-span-3">
                    <label htmlFor="cantidad_kg" className="block text-sm font-medium text-gray-700">
                        Cantidad (Kg)
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            step="0.01"
                            name="cantidad_kg"
                            id="cantidad_kg"
                            required
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                {/* Número de Cajas */}
                <div className="sm:col-span-3">
                    <label htmlFor="numero_cajas" className="block text-sm font-medium text-gray-700">
                        Número de Cajas
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            name="numero_cajas"
                            id="numero_cajas"
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                {/* Calidad Estimada */}
                <div className="sm:col-span-3">
                    <label htmlFor="calidad_estimada" className="block text-sm font-medium text-gray-700">
                        Calidad Estimada
                    </label>
                    <div className="mt-1">
                        <select
                            id="calidad_estimada"
                            name="calidad_estimada"
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            <option value="A">A - Exportación</option>
                            <option value="B">B - Mercado Nacional</option>
                            <option value="C">C - Industria</option>
                            <option value="descarte">Descarte</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <SubmitButton />
            </div>
        </form>
    );
}
