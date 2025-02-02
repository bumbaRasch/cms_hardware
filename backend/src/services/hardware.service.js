import prisma from '../configs/database.js';
import { formatDate } from '../utils/date.js';

export const hardwareService = {
    getHardware: async ({ page = 1, limit = 10, sortBy = 'HA_CREATED_AT', sortOrder = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { HA_NAME: { contains: search } },
                { HA_MANUFACTURER: { contains: search } },
                { HA_MODEL: { contains: search } },
                { HA_SERIAL_NUMBER: { contains: search } },
                { HA_NOTES: { contains: search } },
                { HA_CONDITION: { contains: search } },
                { HA_IP_ADDRESS: { contains: search } },
                { HA_MAC_ADDRESS: { contains: search } },
                { tbl_hardware_types: { HT_NAME: { contains: search } } },
                { tbl_locations: { LOC_NAME: { contains: search } } },
                { tbl_statuses: { ST_NAME: { contains: search } } },
                { tbl_users: { USER_NAME: { contains: search } } },
                { tbl_sim_cards: { SIM_NUMBER: { contains: search } } },
                { tbl_stores: { STORE_NAME: { contains: search } } },
                { tbl_suppliers: { SUPPLIER_NAME: { contains: search } } },
                { tbl_currencies: { CURRENCY_CODE: { contains: search } } }
            ];
        }

        const hardware = await prisma.tbl_hardware.findMany({
            where: whereClauses,
            orderBy: { 
                [sortBy]: sortOrder 
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
            include: {
                tbl_hardware_types: { select: { HT_NAME: true } },
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
                tbl_users: { select: { USER_NAME: true } },
                tbl_sim_cards: { select: { SIM_NUMBER: true } },
                tbl_stores: { select: { STORE_NAME: true } },
                tbl_suppliers: { select: { SUPPLIER_NAME: true } },
                tbl_currencies: { select: { CURRENCY_CODE: true } }
            },
        });

        const total = await prisma.tbl_hardware.count({
            where: whereClauses
        });

        return {
            data: hardware.map(item => ({
                HA_ID: item.HA_ID,
                HA_NAME: item.HA_NAME,
                HA_TYPE: item.tbl_hardware_types.HT_NAME,
                HA_MANUFACTURER: item.HA_MANUFACTURER,
                HA_MODEL: item.HA_MODEL,
                HA_SERIAL_NUMBER: item.HA_SERIAL_NUMBER,
                HA_PURCHASE_DATE: formatDate(item.HA_PURCHASE_DATE),
                HA_WARRANTY_EXPIRY_DATE: formatDate(item.HA_WARRANTY_EXPIRY_DATE),
                HA_LOCATION: item.tbl_locations.LOC_NAME,
                HA_STATUS: item.tbl_statuses.ST_NAME,
                HA_ASSIGNED_TO: item.tbl_users ? item.tbl_users.USER_NAME : null,
                HA_LAST_MAINTENANCE_DATE: formatDate(item.HA_LAST_MAINTENANCE_DATE),
                HA_NOTES: item.HA_NOTES,
                HA_SIM_CARD: item.tbl_sim_cards ? item.tbl_sim_cards.SIM_NUMBER : null,
                HA_STORE: item.tbl_stores ? item.tbl_stores.STORE_NAME : null,
                HA_SUPPLIER: item.tbl_suppliers ? item.tbl_suppliers.SUPPLIER_NAME : null,
                HA_COST: item.HA_COST,
                HA_CURRENCY: item.tbl_currencies ? item.tbl_currencies.CURRENCY_CODE : null,
                HA_CONDITION: item.HA_CONDITION,
                HA_DEPLOYMENT_DATE: formatDate(item.HA_DEPLOYMENT_DATE),
                HA_RETIREMENT_DATE: formatDate(item.HA_RETIREMENT_DATE),
                HA_IP_ADDRESS: item.HA_IP_ADDRESS,
                HA_MAC_ADDRESS: item.HA_MAC_ADDRESS,
                HA_CREATED_AT: formatDate(item.HA_CREATED_AT)
            })),
            total: parseInt(total),
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
            HA_PURCHASE_DATE: formatDate(hardware.HA_PURCHASE_DATE),
            HA_WARRANTY_EXPIRY_DATE: formatDate(hardware.HA_WARRANTY_EXPIRY_DATE),
            HA_LOCATION: hardware.tbl_locations.LOC_NAME,
            HA_STATUS: hardware.tbl_statuses.ST_NAME,
            HA_ASSIGNED_TO: hardware.tbl_users.USER_NAME,
            HA_LAST_MAINTENANCE_DATE: formatDate(hardware.HA_LAST_MAINTENANCE_DATE),
            HA_NOTES: hardware.HA_NOTES,
            HA_SIM_CARD: hardware.tbl_sim_cards.SIM_NUMBER,
            HA_STORE: hardware.tbl_stores.STORE_NAME,
            HA_SUPPLIER: hardware.tbl_suppliers.SUPPLIER_NAME,
            HA_COST: hardware.HA_COST,
            HA_CURRENCY: hardware.tbl_currencies.CURRENCY_CODE,
            HA_CONDITION: hardware.HA_CONDITION,
            HA_DEPLOYMENT_DATE: formatDate(hardware.HA_DEPLOYMENT_DATE),
            HA_RETIREMENT_DATE: formatDate(hardware.HA_RETIREMENT_DATE),
            HA_IP_ADDRESS: hardware.HA_IP_ADDRESS,
            HA_MAC_ADDRESS: hardware.HA_MAC_ADDRESS,
            HA_CREATED_AT: formatDate(hardware.HA_CREATED_AT)
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