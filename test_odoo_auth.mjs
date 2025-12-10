import xmlrpc from 'xmlrpc';

console.log("Raw ODOO_URL:", process.env.ODOO_URL);
const url = process.env.ODOO_URL || 'http://localhost:8069';
const db = process.env.ODOO_DB || 'vivo_db';
const username = process.env.ODOO_USERNAME || process.env.ODOO_USER || 'admin';
const password = process.env.ODOO_PASSWORD || 'admin';

const createClient = url.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;
const common = createClient({ url: `${url}/xmlrpc/2/common` });
const models = createClient({ url: `${url}/xmlrpc/2/object` });

console.log(`Connecting to ${url} (Client Type: ${url.startsWith('https') ? 'Secure' : 'Insecure'})`);
console.log(`DB: ${db} User: ${username}`);

common.methodCall('authenticate', [db, username, password, {}], (error, uid) => {
    if (error) {
        console.error('Auth Error:', error);
        return;
    }
    console.log('Authenticated UID:', uid);

    if (uid) {
        // Try to read user groups
        // Fields to read: "name", "groups_id" (many2many)
        models.methodCall('execute_kw', [
            db, uid, password,
            'res.users', 'read',
            [[uid]], // Read current user
            { fields: ['name', 'login', 'groups_id'] }
        ], (err, userResult) => {
            if (err) {
                console.error('Read User Error:', err);
            } else {
                console.log('User Data:', userResult);

                if (userResult && userResult[0] && userResult[0].groups_id) {
                    // Fetch group names
                    models.methodCall('execute_kw', [
                        db, uid, password,
                        'res.groups', 'read',
                        [userResult[0].groups_id],
                        { fields: ['name', 'full_name'] }
                    ], (errGroups, groupsResult) => {
                        if (errGroups) console.error('Read Groups Error:', errGroups);
                        else {
                            console.log('Groups:', groupsResult.map(g => g.full_name));
                        }
                    });
                }
            }
        });
    }
});
