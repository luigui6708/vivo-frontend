// This file simulates the response we would get from querying the Notion Database.
// In the final "Part 6" implementation, this will be replaced by a live API call.

import { FieldDefinition } from '@/components/DynamicQualityForm';

export const NOTION_QUALITY_SCHEMA: FieldDefinition[] = [
    { id: 'brix_val', label: 'Grados Brix (Ref: 9.0)', type: 'number', required: true, min: 0, max: 20 },
    { id: 'ph_val', label: 'Nivel pH (Ref: 3.5)', type: 'number', required: true, min: 0, max: 14 },
    { id: 'temp_tunel', label: 'Temperatura Túnel (°C) [Nuevo Requisito ISO]', type: 'number', required: true },
    { id: 'apariencia', label: 'Apariencia Visual', type: 'text', required: false },
    { id: 'cumple_norma', label: '¿Cumple NOM-001?', type: 'boolean', required: true }
];
