import xmlrpc from 'xmlrpc';

console.log("--- Inspecting Odoo Configuration ---");

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

    // 1. Get Picking Types (Incoming)
    // We look for code='incoming'
    models.methodCall('execute_kw', [
        db, uid, password,
        'stock.picking.type', 'search_read',
        [[['code', '=', 'incoming']]],
        { fields: ['id', 'name', 'default_location_src_id', 'default_location_dest_id'] }
    ], (err, types) => {
        if (err) console.error(err);
        else console.log("Picking Types (Incoming):", types);
    });

    // 2. Check for Products (Citrus)
    // We search for products that might match our form options
    const citrusNames = ['limon', 'naranja', 'toronja', 'mandarina'];
    const domain = [['name', 'ilike', '']]; // Just list first 10 products to see

    models.methodCall('execute_kw', [
        db, uid, password,
        'product.product', 'search_read',
        [[]], // Empty domain to get some products
        { fields: ['id', 'name', 'default_code'], limit: 10 }
    ], (err, products) => {
        if (err) console.error(err);
        else console.log("Products Found:", products);
    });
});
