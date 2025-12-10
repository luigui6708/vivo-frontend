import xmlrpc from 'xmlrpc';

console.log("--- Setup Products ---");

const url = process.env.ODOO_URL;
const db = process.env.ODOO_DB;
const username = process.env.ODOO_USERNAME;
// Use Admin to create products
const password = process.env.ODOO_PASSWORD;

if (!url) { console.error("Missing .env"); process.exit(1); }

const createClient = url.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;
const models = createClient({ url: `${url}/xmlrpc/2/object` });
const common = createClient({ url: `${url}/xmlrpc/2/common` });

common.methodCall('authenticate', [db, username, password, {}], async (error, uid) => {
    if (error) { console.error(error); return; }

    const productsToCreate = [
        { name: 'Limón Persa', default_code: 'LIM-PER' },
        { name: 'Naranja Valencia', default_code: 'NAR-VAL' },
        { name: 'Toronja', default_code: 'TOR' },
        { name: 'Mandarina', default_code: 'MAN' }
    ];

    const productMap = {};

    for (const p of productsToCreate) {
        // Search if exists
        const existing = await new Promise((resolve) => {
            models.methodCall('execute_kw', [
                db, uid, password,
                'product.product', 'search_read',
                [[['name', '=', p.name]]],
                { fields: ['id'], limit: 1 }
            ], (err, res) => resolve(res && res.length ? res[0] : null));
        });

        if (existing) {
            console.log(`Product ${p.name} exists: ID ${existing.id}`);
            productMap[p.default_code] = existing.id;
        } else {
            console.log(`Creating ${p.name}...`);
            const newId = await new Promise((resolve, reject) => {
                models.methodCall('execute_kw', [
                    db, uid, password,
                    'product.product', 'create',
                    [{ name: p.name, default_code: p.default_code, type: 'product' }]
                ], (err, id) => err ? reject(err) : resolve(id));
            });
            console.log(`Created ${p.name}: ID ${newId}`);
            productMap[p.default_code] = newId;
        }
    }

    console.log("\n--- Product Map JSON ---");
    console.log(JSON.stringify(productMap));
});
