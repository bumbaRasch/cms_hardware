import dotenv from 'dotenv';
import prisma from './prisma.js';
import fastify from 'fastify';

dotenv.config();

export const getDatabaseSchema = async () => {
    try {
        const columns = await prisma.$queryRaw`
            SELECT
                TABLE_NAME, 
                COLUMN_NAME, 
                COLUMN_TYPE
            FROM 
                INFORMATION_SCHEMA.COLUMNS
            WHERE 
                TABLE_SCHEMA = ${process.env.DB_NAME || 'cms_hardware'}
        `;

        const tables = columns.reduce((acc, col) => {
            if (!acc[col.TABLE_NAME]) acc[col.TABLE_NAME] = [];
            acc[col.TABLE_NAME].push(`${col.COLUMN_NAME} (${col.COLUMN_TYPE})`);
            return acc;
        }, {});

        const schema = Object.entries(tables)
            .map(([table, cols]) => `TABLE: ${table}\nCOLUMNS: ${cols.join(', ')}\n`)
            .join('\n');

        return schema;
    } catch (error) {
        fastify.log.error("Error retrieving database schema:", error);
        return "";
    }
};