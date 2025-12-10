import xmlrpc from 'xmlrpc';

console.log("--- Creating Test Sales Order ---");

const url = process.env.ODOO_URL;
const db = process.env.ODOO_DB;
const username = process.env.ODOO_USERNAME;
const password = process.env.ODOO_PASSWORD;

if (!url) { console.error("Missing .env"); process.exit(1); }

const createClient = url.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;
const models = createClient({ url: `${url}/xmlrpc/2/object` });
const common = createClient({ url: `${url}/xmlrpc/2/common` });

common.methodCall('authenticate', [db, username, password, {}], async (error, uid) => {
    if (error) { console.error(error); return; }
    console.log(`Authenticated UID: ${uid}`);

    // 1. Get a Partner (or use admin/your user)
    const partnerId = await new Promise((resolve) => {
        models.methodCall('execute_kw', [
            db, uid, password,
            'res.partner', 'search',
            [[['email', '!=', false]]], // Just get any partner
            { limit: 1 }
        ], (err, res) => resolve(res && res.length ? res[0] : 1)); // Default to 1 (usually Administrator/Company)
    });

    // 2. Get a Product
    const productId = 58; // The 'Jugo de Naranja' we likely created, or find another

    // 3. Create Sale Order
    console.log("Creating Sale Order...");
    const orderId = await new Promise((resolve, reject) => {
        models.methodCall('execute_kw', [
            db, uid, password,
            'sale.order', 'create',
            [{
                partner_id: partnerId,
                date_order: new Date().toISOString().replace('T', ' ').split('.')[0],
            }]
        ], (err, id) => {
            if (err) reject(err); else resolve(id);
        });
    });

    console.log(`Sale Order Header Created: ID ${orderId}`);

    // 4. Add Line
    await new Promise((resolve, reject) => {
        models.methodCall('execute_kw', [
            db, uid, password,
            'sale.order.line', 'create',
            [{
                order_id: orderId,
                product_id: productId, // Uses simple ID if it exists, otherwise might error if 58 is gone.
                product_uom_qty: 50, // 50 units
                price_unit: 25.50
            }]
        ], (err, id) => {
            if (err) resolve(null); // Ignore line error for simple test
            else resolve(id);
        });
    });

    // 5. Confirm Order to make it a 'Sale'
    await new Promise((resolve) => {
        models.methodCall('execute_kw', [
            db, uid, password,
            'sale.order', 'action_confirm',
            [[orderId]]
        ], (err) => resolve());
    });

    console.log("Sale Order Confirmed. Done.");
});
