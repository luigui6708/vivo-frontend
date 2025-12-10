import xmlrpc from 'xmlrpc';

const ODOO_URL = process.env.ODOO_URL || 'http://localhost:8069';
const ODOO_DB = process.env.ODOO_DB || 'vivo_db';
const ODOO_USERNAME = process.env.ODOO_USERNAME || 'admin';
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || 'admin';

const createClient = ODOO_URL.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;

export const odooClient = {
  common: createClient({ url: `${ODOO_URL}/xmlrpc/2/common` }),
  object: createClient({ url: `${ODOO_URL}/xmlrpc/2/object` }),
};

export const authenticate = async () => {
  return new Promise((resolve, reject) => {
    odooClient.common.methodCall('authenticate', [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}], (error, uid) => {
      if (error) {
        reject(error);
      } else {
        resolve(uid);
      }
    });
  });
};

export const searchRead = async (model: string, domain: any[] = [], fields: string[] = []) => {
  const uid = await authenticate();
  return new Promise((resolve, reject) => {
    odooClient.object.methodCall('execute_kw', [
      ODOO_DB,
      uid,
      ODOO_PASSWORD,
      model,
      'search_read',
      [domain],
      { fields: fields }
    ], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
