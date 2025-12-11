export default function AyudaPage() {
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">🍊 Documentación de Operador - VIVO</h1>

            <div className="space-y-8">

                {/* Sección 1 */}
                <section>
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-3">1. Acceso y Seguridad</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>URL:</strong> Accede desde cualquier dispositivo con internet.</li>
                        <li><strong>Credenciales:</strong> Usa tu mismo usuario y contraseña de Odoo.</li>
                        <li>
                            <strong>Roles:</strong>
                            <ul className="list-circle pl-5 mt-1 text-gray-600">
                                <li><em>Inventario:</em> Solo ve Recepción.</li>
                                <li><em>Fabricación:</em> Ve Producción y Calidad.</li>
                                <li><em>Ventas:</em> Ve Pedidos.</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                {/* Sección 2 */}
                <section>
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-3">2. Recepción de Materia Prima</h2>
                    <p className="text-gray-700 mb-2">Para registrar la llegada de camiones (Ruta: <code>/recepcion</code>):</p>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        <li>Ve a la pestaña <strong>Recepción</strong>.</li>
                        <li>Haz clic en el botón azul <strong>"Nuevo Lote"</strong>.</li>
                        <li>Completa: <strong>Huerta</strong> (Origen), <strong>Producto</strong> (Tipo) y <strong>Cantidad</strong> (Kg).</li>
                        <li>Al guardar, se genera automáticamente un Albarán de Entrada en Odoo.</li>
                    </ol>
                </section>

                {/* Sección 3 */}
                <section>
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-3">3. Producción y Manufactura</h2>
                    <p className="text-gray-700 mb-2">Control del proceso (Ruta: <code>/produccion</code>):</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded border border-blue-200 text-center">
                            <span className="block font-bold text-blue-800">🔵 Por Iniciar</span>
                            <span className="text-xs text-blue-600">Planificadas</span>
                        </div>
                        <div className="bg-amber-50 p-3 rounded border border-amber-200 text-center">
                            <span className="block font-bold text-amber-800">🟠 En Proceso</span>
                            <span className="text-xs text-amber-600">Activas en línea</span>
                        </div>
                        <div className="bg-green-50 p-3 rounded border border-green-200 text-center">
                            <span className="block font-bold text-green-800">🟢 Terminado</span>
                            <span className="text-xs text-green-600">Histórico</span>
                        </div>
                    </div>
                    <p className="text-gray-700">
                        <strong>Para finalizar una orden:</strong> Busca la orden en la tabla y pulsa <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">Finalizar & Consumir</span>.
                        <br /><span className="text-red-600 text-sm font-bold">⚠️ Esto descagará el stock de materia prima. ¡Úsalo solo al terminar!</span>
                    </p>
                </section>

                {/* Sección 4 */}
                <section>
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-3">4. Control de Calidad</h2>
                    <p className="text-gray-700 mb-2">Registro de inspecciones (Ruta: <code>/calidad</code>):</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Selecciona la orden activa.</li>
                        <li>Llena el <strong>Checklist</strong> con los valores de los instrumentos.</li>
                        <li>
                            Valores de Referencia:
                            <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                                <li>Hipoclorito: <strong>200 ppm</strong></li>
                                <li>Peracético: <strong>85 ppm</strong></li>
                                <li>Peso Caja: <strong>17.3 kg</strong></li>
                            </ul>
                        </li>
                        <li>El sistema guardará una tabla de auditoría en Odoo.</li>
                    </ul>
                </section>

                {/* Sección 5 */}
                <section>
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-3">5. Ventas</h2>
                    <p className="text-gray-700">
                        Consulta el estado de los pedidos en <code>/ventas</code>. Solo lectura para verificar qué se debe producir.
                    </p>
                </section>

            </div>
        </div>
    );
}
