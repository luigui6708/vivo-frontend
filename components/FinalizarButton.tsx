'use client';

import { finalizarOrden } from '@/app/actions/produccion';
import { useState } from 'react';

export default function FinalizarButton({ id, state }: { id: number, state: string }) {
    const [loading, setLoading] = useState(false);

    if (state !== 'progress' && state !== 'to_close') return null;

    const nav = async () => {
        if (!confirm('¿Seguro que deseas finalizar esta orden? Esto consumirá el stock.')) return;

        setLoading(true);
        const res = await finalizarOrden(id);
        setLoading(false);

        if (res.success) {
            alert('✅ Oruen finalizada correctamente');
        } else {
            alert('❌ ' + res.message);
        }
    };

    return (
        <button
            onClick={nav}
            disabled={loading}
            className={`px-3 py-1 rounded text-white text-xs font-bold ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
            {loading ? 'Procesando...' : 'Finalizar & Consumir'}
        </button>
    );
}
