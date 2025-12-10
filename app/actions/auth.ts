'use server';

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { redirect } from "next/navigation";
import xmlrpc from 'xmlrpc';

export async function login(formData: FormData) {
    const db = formData.get("db") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    console.log("--- Server Action Login ---");
    console.log("DB:", db);
    console.log("User:", username);
    console.log("URL Odoo:", process.env.ODOO_URL || 'http://localhost:8069');


    // Odoo Authentication via XML-RPC
    const url = process.env.ODOO_URL || 'http://localhost:8069';
    const createClient = url.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;
    const common = createClient({ url: `${url}/xmlrpc/2/common` });

    return new Promise((resolve) => {
        common.methodCall('authenticate', [db, username, password, {}], async (error: any, uid: any) => {
            if (error) {
                console.error("Odoo Auth Error:", error);
                resolve({ success: false, message: "Error de conexión con Odoo" });
                return;
            }

            if (uid) {
                try {
                    // Fetch User Data (specifically groups_id)
                    const createClient = url.startsWith('https') ? xmlrpc.createSecureClient : xmlrpc.createClient;
                    const models = createClient({ url: `${url}/xmlrpc/2/object` });

                    const userFields = await new Promise<any[]>((resolve, reject) => {
                        models.methodCall('execute_kw', [
                            db, uid, password,
                            'res.users', 'read',
                            [[uid]],
                            { fields: ['groups_id'] }
                        ], (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    });

                    let groupNames: string[] = [];
                    if (userFields && userFields.length > 0 && userFields[0].groups_id) {
                        const groupIds = userFields[0].groups_id;

                        // Fetch Group Names
                        const groups = await new Promise<any[]>((resolve, reject) => {
                            models.methodCall('execute_kw', [
                                db, uid, password,
                                'res.groups', 'read',
                                [groupIds],
                                { fields: ['full_name'] } // 'full_name' usually contains "Category / Name"
                            ], (err, result) => {
                                if (err) reject(err);
                                else resolve(result);
                            });
                        });

                        // Extract just the full names or specific identifiers
                        // We might want to use XML IDs if possible, but reading names is easier for now.
                        // Standard Odoo groups often look like "Inventory / User"
                        groupNames = groups.map((g: any) => g.full_name);
                    }

                    // Successful Login with Groups
                    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
                    session.user = {
                        uid: Number(uid),
                        username: username,
                        db: db,
                        isLoggedIn: true,
                        groups: groupNames,
                    };
                    await session.save();
                    resolve({ success: true });

                } catch (dataError) {
                    console.error("Error fetching user data:", dataError);
                    // Fallback: login without groups or fail? 
                    // Let's log in but with empty groups to avoid blocking entry if just that fails
                    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
                    session.user = {
                        uid: Number(uid),
                        username: username,
                        db: db,
                        isLoggedIn: true,
                        groups: [],
                    };
                    await session.save();
                    resolve({ success: true });
                }
            } else {
                // Failed Login
                resolve({ success: false, message: "Credenciales inválidas" });
            }
        });
    });
}

export async function logout() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.destroy();
    redirect("/login");
}
