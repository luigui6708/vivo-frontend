
import pkg from 'xmlrpc';
const { createSecureClient } = pkg;
import fs from 'fs';
import path from 'path';

// Config
const ODOO_URL = process.env.ODOO_URL || 'https://citricos.atmanme.com';
const ODOO_DB = process.env.ODOO_DB || 'citricos';
const ODOO_USERNAME = process.env.ODOO_USERNAME || 'admin';
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || 'admin';

const clientOptions = { url: `${ODOO_URL}/xmlrpc/2/object` };
const commonOptions = { url: `${ODOO_URL}/xmlrpc/2/common` };
const client = createSecureClient(clientOptions);
const common = createSecureClient(commonOptions);

// CSV Data (Embedded from Part 6 to avoid path issues)
const processes = [
    { name: "Recepción de Cítricos", code: "PROC-01-REC" },
    { name: "Lavado", code: "PROC-10-LAV" },
    { name: "Sanitizado", code: "PROC-11-SAN" },
    { name: "Pre-secado", code: "PROC-12-SEC0" },
    { name: "Encerado", code: "PROC-13-ENC" },
    { name: "Secado", code: "PROC-14-SEC1" },
    { name: "Primera selección", code: "PROC-07-SEL1" },
    { name: "Descanicado", code: "PROC-08-DES" },
    { name: "Segunda seleccion", code: "PROC-09-SEL2" },
    { name: "Clasificacion computarizada", code: "PROC-17-CCO" },
    { name: "Pesado y empacado", code: "PROC-18-EMP" },
    { name: "Entarimado", code: "PROC-19-TAR" },
    { name: "Embarque", code: "PROC-20-EMB" }
];

async function main() {
    console.log(`Connecting to Odoo at ${ODOO_URL}...`);

    // 1. Authenticate
    const uid = await new Promise((resolve, reject) => {
        common.methodCall('login', [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD], (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });

    if (!uid) {
        console.error("Auth failed");
        return;
    }
    console.log(`Authenticated with UID: ${uid}`);

    // 2. Import Work Centers
    for (const proc of processes) {
        // Check if exists
        const exists = await new Promise((resolve, reject) => {
            client.methodCall('execute_kw', [
                ODOO_DB, uid, ODOO_PASSWORD,
                'mrp.workcenter', 'search_count',
                [[['code', '=', proc.code]]]
            ], (err, res) => err ? reject(err) : resolve(res));
        });

        if (exists > 0) {
            console.log(`⚠️ Skiping ${proc.name} (Already exists)`);
            continue;
        }

        // Create
        await new Promise((resolve, reject) => {
            client.methodCall('execute_kw', [
                ODOO_DB, uid, ODOO_PASSWORD,
                'mrp.workcenter', 'create',
                [{
                    name: proc.name,
                    code: proc.code,
                    resource_calendar_id: 1 // Standard 40h week usually ID 1
                }]
            ], (err, res) => err ? reject(err) : resolve(res));
        });
        console.log(`✅ Created Work Center: ${proc.name}`);
    }
    console.log("Done!");
}

main().catch(console.error);
