import xmlrpc from 'xmlrpc';

console.log("--- Checking Installed Modules ---");

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

    const modulesToCheck = ['quality', 'quality_control', 'stock', 'mrp', 'sale', 'sale_management'];

    models.methodCall('execute_kw', [
        db, uid, password,
        'ir.module.module', 'search_read',
        [[['name', 'in', modulesToCheck], ['state', '=', 'installed']]],
        { fields: ['name', 'state', 'shortdesc'] }
    ], (err, modules) => {
        if (err) console.error(err);
        else {
            console.log("Installed Standard Modules:");
            modules.forEach(m => console.log(`- ${m.name}: ${m.shortdesc}`));

            if (!modules.some(m => m.name.includes('quality'))) {
                console.log("\nWARNING: Standard 'Quality' module NOT found or not installed.");
            }
        }
    });
});
