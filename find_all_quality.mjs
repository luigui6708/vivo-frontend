import xmlrpc from 'xmlrpc';

console.log("--- Broad Search for Quality Modules ---");

const url = process.env.ODOO_URL;
const db = process.env.ODOO_DB;
const username = process.env.ODOO_USERNAME;
const password = process.env.ODOO_PASSWORD;

if (!url) { console.error("Missing .env"); process.exit(1); }

const createClient = url.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;
const models = createClient({ url: `${url}/xmlrpc/2/object` });
const common = createClient({ url: `${url}/xmlrpc/2/common` });

common.methodCall('authenticate', [db, username, password, {}], (err, uid) => {
    if (err) { console.error(err); return; }

    // Search for ANY module with 'quality' in name or description
    models.methodCall('execute_kw', [
        db, uid, password,
        'ir.module.module', 'search_read',
        [['|', ['name', 'ilike', 'quality'], ['shortdesc', 'ilike', 'quality']]],
        { fields: ['name', 'state', 'shortdesc'] }
    ], (err, modules) => {
        if (err) console.error(err);
        else {
            if (modules.length === 0) {
                console.log("No modules found with keyword 'quality'.");
            } else {
                console.log("Found Modules:");
                modules.forEach(m => console.log(`[${m.state}] ${m.name}: ${m.shortdesc}`));
            }
        }
    });
});
