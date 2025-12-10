
console.log("--- Env Var Debug ---");
console.log("ODOO_URL exists:", !!process.env.ODOO_URL);
console.log("ODOO_URL value length:", process.env.ODOO_URL ? process.env.ODOO_URL.length : 0);
console.log("ODOO_DB:", process.env.ODOO_DB);
console.log("keys in env:", Object.keys(process.env).filter(k => k.startsWith('ODOO')));
