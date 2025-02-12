// backend/src/configs/database.js
import dotenv from 'dotenv';
import prisma from './prisma.js';

dotenv.config();

export const getDatabaseSchema = async () => {
    const DB_NAME = process.env.DB_NAME || 'cms_hardware';
    try {
        const [columns, foreignKeys] = await Promise.all([
            prisma.$queryRaw`
                SELECT 
                    TABLE_NAME, 
                    COLUMN_NAME, 
                    COLUMN_TYPE
                FROM 
                    INFORMATION_SCHEMA.COLUMNS
                WHERE 
                    TABLE_SCHEMA = ${DB_NAME}
            `,

            prisma.$queryRaw`
                SELECT 
                    TABLE_NAME, 
                    COLUMN_NAME, 
                    REFERENCED_TABLE_NAME, 
                    REFERENCED_COLUMN_NAME
                FROM 
                    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                WHERE 
                    TABLE_SCHEMA = ${DB_NAME} 
                AND 
                    REFERENCED_TABLE_NAME IS NOT NULL
            `
        ]);

        const tables = columns.reduce((acc, { TABLE_NAME, COLUMN_NAME, COLUMN_TYPE }) => {
            if (!acc[TABLE_NAME]) {
                acc[TABLE_NAME] = { columns: [], foreignKeys: [] };
            }
            acc[TABLE_NAME].columns.push(`${COLUMN_NAME} (${COLUMN_TYPE})`);
            return acc;
        }, {});

        foreignKeys.forEach(({ TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME }) => {
            if (tables[TABLE_NAME]) {
                tables[TABLE_NAME].foreignKeys.push(`FOREIGN KEY (${COLUMN_NAME}) REFERENCES ${REFERENCED_TABLE_NAME}(${REFERENCED_COLUMN_NAME})`);
            }
        });

        const schema = Object.entries(tables)
            .map(([table, { columns, foreignKeys }]) => 
                `TABLE: ${table}\nCOLUMNS: ${columns.join(', ')}\n${foreignKeys.length ? 'FOREIGN KEYS: ' + foreignKeys.join(', ') : ''}\n`
            )
            .join('\n');

        return schema;
    } catch (error) {
        console.error("Error retrieving database schema:", error);
        return "";
    }
};