import xmlrpc from 'xmlrpc';

console.log("--- Creating Test Users ---");

const url = process.env.ODOO_URL;
const db = process.env.ODOO_DB;
const username = process.env.ODOO_USERNAME;
const password = process.env.ODOO_PASSWORD;

if (!url || !db || !username || !password) {
    console.error("Missing environment variables. Make sure to run with --env-file=.env.local");
    process.exit(1);
}

const createClient = url.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;
const common = createClient({ url: `${url}/xmlrpc/2/common` });
const models = createClient({ url: `${url}/xmlrpc/2/object` });

common.methodCall('authenticate', [db, username, password, {}], async (error, uid) => {
    if (error) {
        console.error("Auth Failed:", error);
        return;
    }
    console.log(`Authenticated as Admin (UID: ${uid})`);

    const usersToCreate = [
        { name: 'User Sales', login: 'sales', password: '123', groupName: 'Sales / User' },
        { name: 'User Inventory', login: 'inventory', password: '123', groupName: 'Inventory / User' },
        { name: 'User Manufacturing', login: 'manufacturing', password: '123', groupName: 'Manufacturing / User' },
        { name: 'User Quality', login: 'quality', password: '123', groupName: 'Quality / User' }
    ];

    for (const u of usersToCreate) {
        // 1. Find Group ID
        // We search using 'ilike' to match variants like "Sales / User: All Documents"
        const groupIds = await new Promise((resolve) => {
            models.methodCall('execute_kw', [
                db, uid, password,
                'res.groups', 'search',
                [[['full_name', 'ilike', u.groupName]]]
            ], (err, ids) => {
                if (err) {
                    console.error(`Error searching group ${u.groupName}:`, err);
                    resolve([]);
                } else {
                    resolve(ids);
                }
            });
        });

        if (groupIds.length === 0) {
            console.log(`Skipping ${u.login}: Group '${u.groupName}' not found.`);
            continue;
        }

        // Use the first matching group (usually the most generic permission level)
        const groupId = groupIds[0];
        console.log(`Found Group '${u.groupName}' -> ID: ${groupId}`);

        // 2. Check if user exists
        const existingUserIds = await new Promise((resolve) => {
            models.methodCall('execute_kw', [
                db, uid, password,
                'res.users', 'search',
                [[['login', '=', u.login]]]
            ], (err, ids) => resolve(ids || []));
        });

        if (existingUserIds.length > 0) {
            console.log(`User ${u.login} already exists. Updating groups...`);
            // Update user groups (replace existing with the new one for isolation)
            // Note: 'groups_id' is a Many2many field. To replace we use command [(6, 0, [ids])]
            await new Promise((resolve) => {
                models.methodCall('execute_kw', [
                    db, uid, password,
                    'res.users', 'write',
                    [existingUserIds, { groups_id: [[6, 0, [groupId]]] }]
                ], (err) => {
                    if (err) console.error(`Error updating ${u.login}:`, err);
                    else console.log(`User ${u.login} updated.`);
                    resolve();
                });
            });

        } else {
            console.log(`Creating user ${u.login}...`);
            await new Promise((resolve) => {
                models.methodCall('execute_kw', [
                    db, uid, password,
                    'res.users', 'create',
                    [{
                        name: u.name,
                        login: u.login,
                        password: u.password,
                        groups_id: [[6, 0, [groupId]]]
                    }]
                ], (err, newId) => {
                    if (err) console.error(`Error creating ${u.login}:`, err);
                    else console.log(`User ${u.login} created (ID: ${newId}).`);
                    resolve();
                });
            });
        }
    }

    console.log("--- Done ---");
});
