// backend/src/configs/database.js
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

        const foreignKeys = await prisma.$queryRaw`
            SELECT
                TABLE_NAME,
                COLUMN_NAME,
                REFERENCED_TABLE_NAME,
                REFERENCED_COLUMN_NAME
            FROM
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE
                TABLE_SCHEMA = ${process.env.DB_NAME || 'cms_hardware'}
                AND REFERENCED_TABLE_NAME IS NOT NULL
        `;

        const tables = columns.reduce((acc, col) => {
            if (!acc[col.TABLE_NAME]) acc[col.TABLE_NAME] = { columns: [], foreignKeys: [] };
            acc[col.TABLE_NAME].columns.push(`${col.COLUMN_NAME} (${col.COLUMN_TYPE})`);
            return acc;
        }, {});

        foreignKeys.forEach(fk => {
            if (tables[fk.TABLE_NAME]) {
                tables[fk.TABLE_NAME].foreignKeys.push(`FOREIGN KEY (${fk.COLUMN_NAME}) REFERENCES ${fk.REFERENCED_TABLE_NAME}(${fk.REFERENCED_COLUMN_NAME})`);
            }
        });

        const schema = Object.entries(tables)
            .map(([table, { columns, foreignKeys }]) => 
                `TABLE: ${table}\nCOLUMNS: ${columns.join(', ')}\n${foreignKeys.length ? 'FOREIGN KEYS: ' + foreignKeys.join(', ') : ''}\n`
            )
            .join('\n');

        return schema;
    } catch (error) {
        fastify.log.error("Error retrieving database schema:", error);
        return "";
    }
};