'use client';

import { useState } from 'react';

// This interface assumes what we get from Notion's "Documentation"
export interface FieldDefinition {
    id: string;
    label: string; // From Notion "Property Name"
    type: 'number' | 'text' | 'select' | 'boolean';
    required: boolean;
    options?: string[]; // For select
    min?: number;
    max?: number;
}

interface DynamicQualityFormProps {
    schema: FieldDefinition[];
    onSubmit: (data: any) => void;
}

export default function DynamicQualityForm({ schema, onSubmit }: DynamicQualityFormProps) {
    const [formData, setFormData] = useState<any>({});

    const handleChange = (id: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
                📋 Protocolo Dinámico (ISO 9000 Verified)
            </h2>

            {schema.map((field) => (
                <div key={field.id} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === 'number' && (
                        <input
                            type="number"
                            step="0.01"
                            required={field.required}
                            min={field.min}
                            max={field.max}
                            className="border rounded p-2 focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => handleChange(field.id, parseFloat(e.target.value))}
                        />
                    )}

                    {field.type === 'text' && (
                        <input
                            type="text"
                            required={field.required}
                            className="border rounded p-2 focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => handleChange(field.id, e.target.value)}
                        />
                    )}

                    {field.type === 'boolean' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600"
                                onChange={(e) => handleChange(field.id, e.target.checked)}
                            />
                            <span className="text-sm text-gray-500">Cumple criterio</span>
                        </div>
                    )}
                </div>
            ))}

            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 transition"
            >
                Registrar Inspección
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
                * Este formulario se genera automáticamente desde la documentación en Notion.
            </p>
        </form>
    );
}
