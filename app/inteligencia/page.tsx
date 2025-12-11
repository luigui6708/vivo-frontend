'use client';

import { useState } from 'react';
import { consultAI } from '@/app/actions/ai';

export default function InteligenciaPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: 'Hola. Soy el Asistente Maestro del ERP VIVO. Conozco todas las reglas de negocio y la estructura de datos (MER). ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        const aiResponse = await consultAI(userMsg);

        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-100px)]">
            <h1 className="text-2xl font-bold mb-4 text-indigo-800 flex items-center gap-2">
                🧠 Sistema Maestro (Módulo IA)
            </h1>

            <div className="flex-1 bg-white border rounded-lg shadow-sm p-4 overflow-y-auto space-y-4 mb-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-800 border'
                            }`}>
                            <div className="whitespace-pre-line text-sm">
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-50 text-gray-500 rounded-lg p-3 text-sm italic">
                            Consultando Árbol de Prompts...
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Pregunta sobre Brix, Stock, Reglas de Calidad..."
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}
