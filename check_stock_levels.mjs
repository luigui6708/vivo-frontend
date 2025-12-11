
import pkg from 'xmlrpc';
const { createSecureClient } = pkg;

const DB = 'citricos';
const USER = 'admin';
const PASS = 'admin';

const client = createSecureClient({ url: 'https://citricos.atmanme.com/xmlrpc/2/object' });
const common = createSecureClient({ url: 'https://citricos.atmanme.com/xmlrpc/2/common' });

async function checkStock() {
    console.log("Checking products...");
    const uid = await new Promise((resolve, reject) => {
        common.methodCall('login', [DB, USER, PASS], (err, res) => err ? reject(err) : resolve(res));
    });

    const products = await new Promise((resolve, reject) => {
        client.methodCall('execute_kw', [
            DB, uid, PASS,
            'product.product', 'search_read',
            [[['type', 'in', ['consu', 'product']]]],
            { fields: ['name', 'qty_available', 'uom_id', 'list_price'] } // Corrected Kwargs
        ], (err, res) => err ? reject(err) : resolve(res));
    });

    console.log("📦 Current Stock (Products found: " + products.length + "):");
    if (products.length === 0) console.log("No products found.");
    products.forEach(p => console.log(`- ${p.name}: ${p.qty_available} units ($${p.list_price})`));
}

checkStock().catch(console.error);
