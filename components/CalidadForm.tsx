'use client';

import { registrarCalidad } from '@/app/actions/calidad';
import { useState } from 'react';

export default function CalidadForm({ ordenes }: { ordenes: any[] }) {
    const [message, setMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        const res = await registrarCalidad(formData);
        if (res.success) {
            setMessage('✅ ' + res.message);
            // Optional: reset form
        } else {
            setMessage('❌ ' + res.message);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-2xl">
            {message && <div className="p-3 bg-blue-50 text-blue-700 rounded">{message}</div>}

            <div>
                <label className="block text-sm font-medium text-gray-700">Orden de Producción</label>
                <select name="mo_id" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                    {ordenes.map((o) => (
                        <option key={o.id} value={o.id}>
                            {o.name} - {Array.isArray(o.product_id) ? o.product_id[1] : 'Producto'} ({o.state})
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Grados Brix</label>
                    <input type="number" step="0.1" name="open_brix" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Ej. 11.5" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">pH</label>
                    <input type="number" step="0.1" name="ph" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Ej. 3.5" required />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">% Defectos</label>
                <input type="number" name="defectos" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="0-100" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Dictamen</label>
                <select name="decision" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                    <option value="Aprobado">Aprobado</option>
                    <option value="Condicionado">Condicionado</option>
                    <option value="Rechazado">Rechazado</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea name="observaciones" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"></textarea>
            </div>

            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Registrar Inspección
            </button>
        </form>
    );
}
