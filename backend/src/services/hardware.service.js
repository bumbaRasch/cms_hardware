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
    createHardware: async (body) => {
        const hardware = await prisma.tbl_hardware.create({
            data: {
                HA_NAME: body.HA_NAME,
                HA_TYPE: body.HA_TYPE,
                HA_MANUFACTURER: body.HA_MANUFACTURER,
                HA_MODEL: body.HA_MODEL,
                HA_SERIAL_NUMBER: body.HA_SERIAL_NUMBER,
                HA_PURCHASE_DATE: new Date(body.HA_PURCHASE_DATE).toISOString(),
                HA_WARRANTY_EXPIRY_DATE: new Date(body.HA_WARRANTY_EXPIRY_DATE).toISOString(),
                HA_LOCATION: body.HA_LOCATION,
                HA_STATUS: body.HA_STATUS,
                HA_ASSIGNED_TO: body.HA_ASSIGNED_TO,
                HA_LAST_MAINTENANCE_DATE: new Date(body.HA_LAST_MAINTENANCE_DATE).toISOString(),
                HA_NOTES: body.HA_NOTES,
                HA_SIM_CARD: body.HA_SIM_CARD,
                HA_STORE: body.HA_STORE,
                HA_SUPPLIER: body.HA_SUPPLIER,
                HA_COST: body.HA_COST,
                HA_CURRENCY: body.HA_CURRENCY,
                HA_CONDITION: body.HA_CONDITION,
                HA_DEPLOYMENT_DATE: new Date(body.HA_DEPLOYMENT_DATE).toISOString(),
                HA_RETIREMENT_DATE: body.HA_RETIREMENT_DATE ? new Date(body.HA_RETIREMENT_DATE).toISOString() : null,
                HA_IP_ADDRESS: body.HA_IP_ADDRESS,
                HA_MAC_ADDRESS: body.HA_MAC_ADDRESS
            },
            include: {
                tbl_hardware_types: { select: { HT_NAME: true } },
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
                tbl_users: { select: { USER_NAME: true } },
                tbl_sim_cards: { select: { SIM_NUMBER: true } },
                tbl_stores: { select: { STORE_NAME: true } },
                tbl_suppliers: { select: { SUPPLIER_NAME: true } },
                tbl_currencies: { select: { CURRENCY_CODE: true } }
            }
        });

        return {
            HA_ID: hardware.HA_ID,
            HA_NAME: hardware.HA_NAME,
            HA_TYPE: hardware.tbl_hardware_types.HT_NAME,
            HA_MANUFACTURER: hardware.HA_MANUFACTURER,
            HA_MODEL: hardware.HA_MODEL,
            HA_SERIAL_NUMBER: hardware.HA_SERIAL_NUMBER,
            HA_PURCHASE_DATE: hardware.HA_PURCHASE_DATE,
            HA_WARRANTY_EXPIRY_DATE: hardware.HA_WARRANTY_EXPIRY_DATE,
            HA_LOCATION: hardware.tbl_locations.LOC_NAME,
            HA_STATUS: hardware.tbl_statuses.ST_NAME,
            HA_ASSIGNED_TO: hardware.tbl_users.USER_NAME,
            HA_LAST_MAINTENANCE_DATE: hardware.HA_LAST_MAINTENANCE_DATE,
            HA_NOTES: hardware.HA_NOTES,
            HA_SIM_CARD: hardware.tbl_sim_cards.SIM_NUMBER,
            HA_STORE: hardware.tbl_stores.STORE_NAME,
            HA_SUPPLIER: hardware.tbl_suppliers.SUPPLIER_NAME,
            HA_COST: hardware.HA_COST,
            HA_CURRENCY: hardware.tbl_currencies.CURRENCY_CODE,
            HA_CONDITION: hardware.HA_CONDITION,
            HA_DEPLOYMENT_DATE: hardware.HA_DEPLOYMENT_DATE,
            HA_RETIREMENT_DATE: hardware.HA_RETIREMENT_DATE,
            HA_IP_ADDRESS: hardware.HA_IP_ADDRESS,
            HA_MAC_ADDRESS: hardware.HA_MAC_ADDRESS,
            HA_CREATED_AT: hardware.HA_CREATED_AT
        };
    },

    deleteHardware: async (id) => {
        try {
            const hardware = await prisma.tbl_hardware.delete({
                where: {
                    HA_ID: parseInt(id)
                }
            });
            return hardware;
        } 
        catch (error) {
            console.error(error);
            return null;
        }
    }
};