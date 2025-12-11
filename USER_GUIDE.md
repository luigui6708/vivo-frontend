# 🍊 VIVO Frontend - Guía de Operador

Esta guía explica cómo utilizar el Sistema de Producción VIVO para la gestión de Cítricos.

## 1. Acceso y Seguridad
*   **URL:** [https://vivo-frontend-luigui6708s-projects.vercel.app](https://vivo-frontend-luigui6708s-projects.vercel.app) (o tu dominio final)
*   **Credenciales:** Usa tu usuario y contraseña de Odoo.
*   **Roles:**
    *   *Inventario:* Acceso a Recepción.
    *   *Fabricación:* Acceso a Producción y Calidad.
    *   *Ventas:* Acceso a Pedidos.

## 2. Recepción de Materia Prima (`/recepcion`)
**Objetivo:** Registrar la llegada de camiones y crear lotes.
1.  Ve a la pestaña **Recepción**.
2.  Haz clic en **"Nuevo Lote"**.
3.  Completa el formulario:
    *   **Huerta:** De donde viene la fruta.
    *   **Producto:** Tipo de limón/cítrico.
    *   **Cantidad:** Peso neto en Kg.
4.  Al guardar, el sistema crea un *Albarán de Entrada* (`stock.picking`) en Odoo automáticamente.

## 3. Producción y Manufactura (`/produccion`)
**Objetivo:** Controlar el proceso de selección y empaque.
1.  Ve a la pestaña **Producción**.
2.  Verás una tabla con las Órdenes de Fabricación (MO) asignadas.
    *   🔵 **Por Iniciar:** Órdenes planificadas pero no comenzadas.
    *   🟠 **En Proceso:** Órdenes activas en línea.
    *   🟢 **Terminado:** Órdenes cerradas.
3.  **Finalizar Orden:**
    *   Cuando se termine el trabajo, busca la orden en la tabla.
    *   Pulsa el botón verde **"Finalizar & Consumir"**.
    *   ⚠️ **Importante:** Esto descontará la materia prima del inventario y sumará el producto terminado. ¡Solo hazlo al final!

## 4. Control de Calidad (`/calidad`)
**Objetivo:** Registrar inspecciones Físico-Químicas y de Proceso.
1.  Ve a la pestaña **Calidad**.
2.  Selecciona la **Orden de Producción** activa.
3.  Llena el **Checklist de Calidad**:
    *   **⚗️ Laboratorio:** Grados Brix y pH.
    *   **🧼 Sanitizado:** ppm de Hipoclorito y Ácido Peracético (Valores meta: 200 / 85).
    *   **📦 Empaque:** Peso promedio de caja (Meta: 17.3 kg) y revisión de calibres (<46mm).
4.  El sistema genera un **Reporte de Auditoría (Tabla HTML)** y lo anexa a la historia de la orden en Odoo.

## 5. Ventas (`/ventas`)
**Objetivo:** Consultar pedidos de clientes.
*   Muestra un listado de los Pedidos de Venta (`sale.order`) y su estado de facturación.

## Soporte
Para problemas con el sistema, contactar al administrador de Odoo.
