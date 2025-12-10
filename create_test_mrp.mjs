import xmlrpc from 'xmlrpc';

console.log("--- Creating Test Manufacturing Order ---");

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

    // 1. Get a Product (Jugo de Naranja?) or just use Naranja vals
    // Let's create a "Jugo Exprimidor" product to manufacture
    const productName = 'Jugo de Naranja 1L';

    let productId = await new Promise((resolve) => {
        models.methodCall('execute_kw', [
            db, uid, password,
            'product.product', 'search_read',
            [[['name', '=', productName]]],
            { fields: ['id'], limit: 1 }
        ], (err, res) => resolve(res && res.length ? res[0].id : null));
    });

    if (!productId) {
        console.log(`Creating product ${productName}...`);
        productId = await new Promise((resolve, reject) => {
            models.methodCall('execute_kw', [
                db, uid, password,
                'product.product', 'create',
                [{ name: productName, type: 'product' }]
            ], (err, id) => err ? reject(err) : resolve(id));
        });
    }
    console.log(`Product to Produce: ${productName} (ID: ${productId})`);

    // 2. Create Bill of Materials (BoM) - Simplified
    // Just create the MO directly, Odoo allows it sometimes without strict BoM if config allows,
    // but better to conform.

    // Creating MO
    console.log("Creating Manufacturing Order...");
    const moId = await new Promise((resolve, reject) => {
        models.methodCall('execute_kw', [
            db, uid, password,
            'mrp.production', 'create',
            [{
                product_id: productId,
                product_qty: 100, // 100 Liters
                product_uom_id: 1, // Unit
                date_start: new Date().toISOString().replace('T', ' ').split('.')[0]
            }]
        ], (err, id) => {
            if (err) reject(err);
            else resolve(id);
        });
    });

    console.log(`MO Created: ID ${moId}`);

    // Confirm it?
    /*
    await new Promise((resolve) => {
        models.methodCall('execute_kw', [
            db, uid, password,
            'mrp.production', 'action_confirm',
            [[moId]]
        ], (err) => {
           if(err) console.error("Confirm error (might need more data):", err);
           else console.log("MO Confirmed");
           resolve();
        });
    });
    */

    console.log("Done.");
});
