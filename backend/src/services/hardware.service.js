// backend/src/services/hardware.service.js

import prisma from '../configs/database.js';

export const hardwareService = {
    getHardware: async ({ page = 1, limit = 10, sortBy = 'HA_CREATED_AT', sortOrder = 'asc', filter = {}, search = '' }) => {
        const offset = (page - 1) * limit;

        const whereClauses = [];
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses.push(`${key} LIKE '%${value}%'`);
            }
        }

        if (search) {
            const searchClause = `
                (h.HA_NAME LIKE '%${search}%' OR
                h.HA_MANUFACTURER LIKE '%${search}%' OR
                h.HA_MODEL LIKE '%${search}%' OR
                h.HA_SERIAL_NUMBER LIKE '%${search}%' OR
                h.HA_PURCHASE_DATE LIKE '%${search}%' OR
                h.HA_WARRANTY_EXPIRY_DATE LIKE '%${search}%' OR
                h.HA_LAST_MAINTENANCE_DATE LIKE '%${search}%' OR
                h.HA_NOTES LIKE '%${search}%' OR
                h.HA_COST LIKE '%${search}%' OR
                h.HA_CONDITION LIKE '%${search}%' OR
                h.HA_DEPLOYMENT_DATE LIKE '%${search}%' OR
                h.HA_RETIREMENT_DATE LIKE '%${search}%' OR
                h.HA_IP_ADDRESS LIKE '%${search}%' OR
                h.HA_MAC_ADDRESS LIKE '%${search}%' OR
                ht.HT_NAME LIKE '%${search}%' OR
                l.LOC_NAME LIKE '%${search}%' OR
                s.ST_NAME LIKE '%${search}%' OR
                u.USER_NAME LIKE '%${search}%' OR
                sc.SIM_NUMBER LIKE '%${search}%' OR
                st.STORE_NAME LIKE '%${search}%' OR
                sp.SUPPLIER_NAME LIKE '%${search}%' OR
                c.CURRENCY_CODE LIKE '%${search}%')`;
            whereClauses.push(searchClause);
        }

        const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const hardware = await prisma.$queryRawUnsafe(`
            SELECT
                h.HA_ID,
                h.HA_NAME,
                ht.HT_NAME AS HA_TYPE,
                h.HA_MANUFACTURER,
                h.HA_MODEL,
                h.HA_SERIAL_NUMBER,
                h.HA_PURCHASE_DATE,
                h.HA_WARRANTY_EXPIRY_DATE,
                l.LOC_NAME AS HA_LOCATION,
                s.ST_NAME AS HA_STATUS,
                u.USER_NAME AS HA_ASSIGNED_TO,
                h.HA_LAST_MAINTENANCE_DATE,
                h.HA_NOTES,
                sc.SIM_NUMBER AS HA_SIM_CARD,
                st.STORE_NAME AS HA_STORE,
                sp.SUPPLIER_NAME AS HA_SUPPLIER,
                h.HA_COST,
                c.CURRENCY_CODE AS HA_CURRENCY,
                h.HA_CONDITION,
                h.HA_DEPLOYMENT_DATE,
                h.HA_RETIREMENT_DATE,
                h.HA_IP_ADDRESS,
                h.HA_MAC_ADDRESS,
                h.HA_CREATED_AT
            FROM 
                tbl_hardware h
            LEFT JOIN 
                tbl_hardware_types ht ON h.HA_TYPE = ht.HT_ID
            LEFT JOIN 
                tbl_locations l ON h.HA_LOCATION = l.LOC_ID
            LEFT JOIN 
                tbl_statuses s ON h.HA_STATUS = s.ST_ID
            LEFT JOIN 
                tbl_users u ON h.HA_ASSIGNED_TO = u.USER_ID
            LEFT JOIN 
                tbl_sim_cards sc ON h.HA_SIM_CARD = sc.SIM_ID
            LEFT JOIN 
                tbl_stores st ON h.HA_STORE = st.STORE_ID
            LEFT JOIN 
                tbl_suppliers sp ON h.HA_SUPPLIER = sp.SUPPLIER_ID
            LEFT JOIN 
                tbl_currencies c ON h.HA_CURRENCY = c.CURRENCY_ID
            ${whereClause}
            ORDER BY 
                ${sortBy} ${sortOrder}
            LIMIT 
                ${limit} 
            OFFSET 
                ${offset}
        `);

        const total = await prisma.$queryRawUnsafe(`
            SELECT 
                COUNT(*) AS total
            FROM 
                tbl_hardware h
            LEFT JOIN 
                tbl_hardware_types ht ON h.HA_TYPE = ht.HT_ID
            LEFT JOIN 
                tbl_locations l ON h.HA_LOCATION = l.LOC_ID
            LEFT JOIN 
                tbl_statuses s ON h.HA_STATUS = s.ST_ID
            LEFT JOIN 
                tbl_users u ON h.HA_ASSIGNED_TO = u.USER_ID
            LEFT JOIN 
                tbl_sim_cards sc ON h.HA_SIM_CARD = sc.SIM_ID
            LEFT JOIN 
                tbl_stores st ON h.HA_STORE = st.STORE_ID
            LEFT JOIN 
                tbl_suppliers sp ON h.HA_SUPPLIER = sp.SUPPLIER_ID
            LEFT JOIN 
                tbl_currencies c ON h.HA_CURRENCY = c.CURRENCY_ID
            ${whereClause}
        `);

        return {
            data: hardware.map(item => ({
                ...item,
                HA_COST: item.HA_COST ? item.HA_COST : null,
                HA_ID: item.HA_ID,
                HA_TYPE: item.HA_TYPE,
                HA_LOCATION: item.HA_LOCATION,
                HA_STATUS: item.HA_STATUS,
                HA_ASSIGNED_TO: item.HA_ASSIGNED_TO ? item.HA_ASSIGNED_TO : null,
                HA_SIM_CARD: item.HA_SIM_CARD ? item.HA_SIM_CARD : null,
                HA_STORE: item.HA_STORE ? item.HA_STORE : null,
                HA_SUPPLIER: item.HA_SUPPLIER ? item.HA_SUPPLIER : null,
                HA_CURRENCY: item.HA_CURRENCY ? item.HA_CURRENCY : null
            })),
            total: parseInt(total[0].total),
            page: parseInt(page),
            limit: parseInt(limit),
        };
    },
    createHardware: async () => {
        return { hello: 'world' };
    }
};