
const { Client } = require('@notionhq/client');

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

async function findDatabase() {
    const query = 'altos-erp';
    console.log(`Searching for database: "${query}"...`);

    try {
        const response = await notion.search({
            query: query,
        });

        if (response.results.length > 0) {
            const db = response.results[0];
            console.log(`✅ FOUND DATABASE!`);
            console.log(`Name: ${db.title[0]?.plain_text || 'Untitled'}`);
            console.log(`ID: ${db.id}`);
            console.log(`URL: ${db.url}`);
        } else {
            console.log("❌ No database found with that name. Please share the database with the integration connection.");
        }
    } catch (error) {
        console.error("Error searching Notion:", error.message);
    }
}

findDatabase();
