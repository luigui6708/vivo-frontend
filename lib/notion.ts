import { Client } from '@notionhq/client';
import { FieldDefinition } from '@/components/DynamicQualityForm';

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

export const getNotionSchema = async (databaseId: string): Promise<FieldDefinition[]> => {
    if (!process.env.NOTION_API_KEY) return [];

    try {
        const response = await notion.databases.retrieve({ database_id: databaseId }) as any;
        const properties = response.properties;

        const schema: FieldDefinition[] = [];

        for (const [key, value] of Object.entries(properties)) {
            let type: FieldDefinition['type'] = 'text';
            let required = false;

            // Map Notion Types to Form Types
            if (value.type === 'number') type = 'number';
            if (value.type === 'checkbox') type = 'boolean';
            if (value.type === 'select') type = 'select';

            // Heuristic for Required fields (if name contains *)
            if (key.includes('*')) required = true;

            schema.push({
                id: key, // Notion Property Name as ID
                label: key,
                type,
                required,
                // Add select options if applicable
                // options: value.select?.options.map(o => o.name)
            });
        }

        // Sort specifically to put "Name" or "Title" first if needed, or by created time
        return schema;
    } catch (error) {
        console.error("Error fetching Notion schema:", error);
        return [];
    }
};

export const syncNotionToConfig = async () => {
    // This function would be called by a webhook or cron
    // It fetches Notion DB -> writes to lib/iso_config.ts
    console.log("Syncing with Notion...");
};
