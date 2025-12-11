'use server';

import { AI_SYSTEM_PROMPT } from '@/lib/ai_context';

export async function consultAI(query: string) {
    // Simple Keyword Matcher logic to simulate RAG (Retrieval Augmented Generation)
    // In a real production system, this would call OpenAI/Anthropic with the System Prompt.

    const lowerQ = query.toLowerCase();
    let response = "";

    if (lowerQ.includes('brix') || lowerQ.includes('ph') || lowerQ.includes('calidad')) {
        response += "🔍 **Regla Encontrada en MER (Calidad):**\n- Brix estándar: > 9.0\n- pH estándar: 2.5 - 4.5\n- Tabla Odoo: [mail.message] en mrp.production.";
    }

    if (lowerQ.includes('stock') || lowerQ.includes('caja') || lowerQ.includes('cera') || lowerQ.includes('inventario')) {
        response += "📦 **Regla de Negocio (Logística):**\n- ALERTA CRÍTICA si stock < 100 unidades.\n- Acción: Detener empaque y solicitar reabastecimiento.";
    }

    if (lowerQ.includes('recepcion') || lowerQ.includes('lote')) {
        response += "🚛 **Estructura Técnica (Recepción):**\n- Tabla Odoo: [stock.picking]\n- Tipo: 'incoming'\n- Clave principal: 'name' (Folio).";
    }

    if (lowerQ.includes('orden') || lowerQ.includes('maquila') || lowerQ.includes('produccion')) {
        response += "🏭 **Workflow de Producción:**\n- Estados: Draft -> Confirmed -> Progress -> To Close -> Done.\n- REGLA: No cerrar sin aprobación de Calidad.";
    }

    if (!response) {
        response = "🤖 **Asistente Maestro:** No tengo una regla específica para esa consulta en mi *Árbol de Prompts* actual. Intenta preguntar sobre 'Brix', 'Stock', 'Recepciones' o 'Producción'.";
    } else {
        response = "🤖 **Asistente Maestro:** He consultado el *Árbol de Conocimiento* (lib/ai_context.ts) y esto encontré:\n\n" + response;
    }

    await new Promise(r => setTimeout(r, 500)); // Simulate thinking
    return response;
}
