import xmlrpc from 'xmlrpc';

const url = process.env.ODOO_URL;
const db = process.env.ODOO_DB;
const username = process.env.ODOO_USERNAME;
const password = process.env.ODOO_PASSWORD;
const createClient = url.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;
const models = createClient({ url: `${url}/xmlrpc/2/object` });
const common = createClient({ url: `${url}/xmlrpc/2/common` });

common.methodCall('authenticate', [db, username, password, {}], (err, uid) => {
    if (err) return;
    models.methodCall('execute_kw', [
        db, uid, password,
        'mrp.production', 'fields_get',
        [],
        { attributes: ['string', 'type'] }
    ], (err, fields) => {
        if (err) console.error(err);
        else {
            // Filter keys containing 'date'
            const dateFields = Object.keys(fields).filter(k => k.includes('date'));
            console.log("Date Fields in mrp.production:", dateFields);
            // Also check 'state' just in case
            console.log("State field exists:", 'state' in fields);
        }
    });
});
