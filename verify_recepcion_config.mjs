import xmlrpc from 'xmlrpc';
import fs from 'fs';
import path from 'path';

// Manual .env.local parsing
try {
    const envPath = path.resolve('.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }
} catch (e) { console.log('Could not read .env.local', e); }

const ODOO_URL = process.env.ODOO_URL || 'http://localhost:8069';
const ODOO_DB = process.env.ODOO_DB || 'vivo_db';
const ODOO_USERNAME = process.env.ODOO_USERNAME || 'admin';
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || 'admin';


const createClient = ODOO_URL.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;
const common = createClient({ url: `${ODOO_URL}/xmlrpc/2/common` });
const object = createClient({ url: `${ODOO_URL}/xmlrpc/2/object` });

async function searchRead(model, domain, fields) {
    return new Promise((resolve, reject) => {
        common.methodCall('authenticate', [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}], (err, uid) => {
            if (err) return reject(err);
            object.methodCall('execute_kw', [
                ODOO_DB, uid, ODOO_PASSWORD,
                model, 'search_read',
                [domain],
                { fields: fields }
            ], (err, res) => err ? reject(err) : resolve(res));
        });
    });
}

async function verifyConfig() {
    try {
        console.log('--- Verifying Products ---');
        const products = await searchRead('product.product', [['name', 'ilike', 'Lim']], ['id', 'name']);
        console.log('Products found:', products);

        console.log('\n--- Verifying Picking Types (Incoming) ---');
        const pickingTypes = await searchRead('stock.picking.type', [['code', '=', 'incoming']], ['id', 'name', 'warehouse_id']);
        console.log('Picking Types found:', pickingTypes);

        console.log('\n--- Verifying Locations ---');
        const locations = await searchRead('stock.location', [['name', 'ilike', 'Stock']], ['id', 'name', 'usage']);
        console.log('Stock Locations found:', locations);

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verifyConfig();
