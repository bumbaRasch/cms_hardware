//backend/src/services/hardware.service.js

import prisma from '../configs/prisma.js';
import { formatDate, isValidDate, parseDate } from '../utils/date.js';

export const hardwareService = {
    getHardware: async ({ offset = 0, limit = 10, sort = 'HA_CREATED_AT', order = 'desc', filter = {}, search = '' }) => {
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
                { tbl_sim_cards: { SIM_NUMBER: { contains: search } } },
                { tbl_stores: { STORE_NAME: { contains: search } } },
                { tbl_suppliers: { SUPPLIER_NAME: { contains: search } } },
                { tbl_currencies: { CURRENCY_CODE: { contains: search } } }
            ];
        }

        const orderBy = [];
        if (sort === 'HT_NAME') {
            orderBy.push({ tbl_hardware_types: { HT_NAME: order } });
        } 
        else if (sort === 'LOC_NAME') {
            orderBy.push({ tbl_locations: { LOC_NAME: order } });
        } 
        else if (sort === 'ST_NAME') {
            orderBy.push({ tbl_statuses: { ST_NAME: order } });
        } 
        else if (sort === 'SIM_NUMBER') {
            orderBy.push({ tbl_sim_cards: { SIM_NUMBER: order } });
        } 
        else if (sort === 'STORE_NAME') {
            orderBy.push({ tbl_stores: { STORE_NAME: order } });
        } 
        else if (sort === 'SUPPLIER_NAME') {
            orderBy.push({ tbl_suppliers: { SUPPLIER_NAME: order } });
        } 
        else if (sort === 'CURRENCY_CODE') {
            orderBy.push({ tbl_currencies: { CURRENCY_CODE: order } });
        } 
        else {
            orderBy.push({ [sort]: order });
        }

        const hardware = await prisma.tbl_hardware.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            include: {
                tbl_hardware_types: { select: { HT_NAME: true } },
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
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
                HA_TYPE: item.HA_TYPE,
                HT_NAME: item.tbl_hardware_types.HT_NAME,
                HA_MANUFACTURER: item.HA_MANUFACTURER,
                HA_MODEL: item.HA_MODEL,
                HA_SERIAL_NUMBER: item.HA_SERIAL_NUMBER,
                HA_PURCHASE_DATE: formatDate(item.HA_PURCHASE_DATE),
                HA_WARRANTY_EXPIRY_DATE: formatDate(item.HA_WARRANTY_EXPIRY_DATE),
                HA_LOCATION: item.HA_LOCATION,
                LOC_NAME: item.tbl_locations.LOC_NAME,
                HA_STATUS: item.HA_STATUS,
                ST_NAME: item.tbl_statuses.ST_NAME,
                HA_LAST_MAINTENANCE_DATE: formatDate(item.HA_LAST_MAINTENANCE_DATE),
                HA_NOTES: item.HA_NOTES,
                HA_SIM_CARD: item.HA_SIM_CARD,
                SIM_NUMBER: item.tbl_sim_cards ? item.tbl_sim_cards.SIM_NUMBER : null,
                HA_STORE: item.HA_STORE,
                STORE_NAME: item.tbl_stores ? item.tbl_stores.STORE_NAME : null,
                HA_SUPPLIER: item.HA_SUPPLIER,
                SUPPLIER_NAME: item.tbl_suppliers ? item.tbl_suppliers.SUPPLIER_NAME : null,
                HA_COST: item.HA_COST,
                HA_CURRENCY: item.HA_CURRENCY ? item.HA_CURRENCY : null,
                CURRENCY_CODE: item.tbl_currencies ? item.tbl_currencies.CURRENCY_CODE : null,
                HA_CONDITION: item.HA_CONDITION,
                HA_DEPLOYMENT_DATE: formatDate(item.HA_DEPLOYMENT_DATE),
                HA_RETIREMENT_DATE: formatDate(item.HA_RETIREMENT_DATE),
                HA_IP_ADDRESS: item.HA_IP_ADDRESS,
                HA_MAC_ADDRESS: item.HA_MAC_ADDRESS,
                HA_CREATED_AT: formatDate(item.HA_CREATED_AT),
                HA_DELETED_AT: formatDate(item.HA_DELETED_AT)
            })),
            total: parseInt(total),
            offset: parseInt(offset),
            limit: parseInt(limit),
        };
    },
    createHardware: async (body) => {
        const hardware = await prisma.tbl_hardware.create({
            data: { 
                HA_NAME: body.HA_NAME,
                HA_TYPE: parseInt(body.HT_NAME),
                HA_MANUFACTURER: body.HA_MANUFACTURER,
                HA_MODEL: body.HA_MODEL,
                HA_SERIAL_NUMBER: body.HA_SERIAL_NUMBER,
                HA_PURCHASE_DATE: isValidDate(body.HA_PURCHASE_DATE) ? parseDate(body.HA_PURCHASE_DATE).toISOString() : null,
                HA_WARRANTY_EXPIRY_DATE: isValidDate(body.HA_WARRANTY_EXPIRY_DATE) ? parseDate(body.HA_WARRANTY_EXPIRY_DATE).toISOString() : null,
                HA_LOCATION: parseInt(body.LOC_NAME),
                HA_STATUS: parseInt(body.ST_NAME),
                HA_LAST_MAINTENANCE_DATE: isValidDate(body.HA_LAST_MAINTENANCE_DATE) ? parseDate(body.HA_LAST_MAINTENANCE_DATE).toISOString() : null,
                HA_NOTES: body.HA_NOTES,
                HA_SIM_CARD: parseInt(body.SIM_NUMBER),
                HA_STORE: parseInt(body.STORE_NAME),
                HA_SUPPLIER: parseInt(body.SUPPLIER_NAME),
                HA_COST: parseFloat(body.HA_COST),
                HA_CURRENCY: parseInt(body.CURRENCY_CODE),
                HA_CONDITION: body.HA_CONDITION,
                HA_DEPLOYMENT_DATE: isValidDate(body.HA_DEPLOYMENT_DATE) ? parseDate(body.HA_DEPLOYMENT_DATE).toISOString() : null,
                HA_RETIREMENT_DATE: isValidDate(body.HA_RETIREMENT_DATE) ? parseDate(body.HA_RETIREMENT_DATE).toISOString() : null,
                HA_IP_ADDRESS: body.HA_IP_ADDRESS,
                HA_MAC_ADDRESS: body.HA_MAC_ADDRESS,
            },
            include: {
                tbl_hardware_types: { select: { HT_NAME: true } },
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
                tbl_sim_cards: { select: { SIM_NUMBER: true } },
                tbl_stores: { select: { STORE_NAME: true } },
                tbl_suppliers: { select: { SUPPLIER_NAME: true } },
                tbl_currencies: { select: { CURRENCY_CODE: true } }
            }
        });

        return {
            HA_ID: hardware.HA_ID,
            HA_NAME: hardware.HA_NAME,
            HA_TYPE: hardware.HA_TYPE,
            HT_NAME: hardware.tbl_hardware_types.HT_NAME,
            HA_MANUFACTURER: hardware.HA_MANUFACTURER,
            HA_MODEL: hardware.HA_MODEL,
            HA_SERIAL_NUMBER: hardware.HA_SERIAL_NUMBER,
            HA_PURCHASE_DATE: formatDate(hardware.HA_PURCHASE_DATE),
            HA_WARRANTY_EXPIRY_DATE: formatDate(hardware.HA_WARRANTY_EXPIRY_DATE),
            HA_LOCATION: hardware.HA_LOCATION,
            LOC_NAME: hardware.tbl_locations.LOC_NAME,
            HA_STATUS: hardware.HA_STATUS,
            ST_NAME: hardware.tbl_statuses.ST_NAME,
            HA_LAST_MAINTENANCE_DATE: formatDate(hardware.HA_LAST_MAINTENANCE_DATE),
            HA_NOTES: hardware.HA_NOTES,
            HA_SIM_CARD: hardware.HA_SIM_CARD,
            SIM_NUMBER: hardware.tbl_sim_cards.SIM_NUMBER,
            HA_STORE: hardware.HA_STORE,
            STORE_NAME: hardware.tbl_stores.STORE_NAME,
            HA_SUPPLIER: hardware.HA_SUPPLIER,
            SUPPLIER_NAME: hardware.tbl_suppliers.SUPPLIER_NAME,
            HA_COST: hardware.HA_COST,
            HA_CURRENCY: hardware.HA_CURRENCY,
            CURRENCY_CODE: hardware.tbl_currencies.CURRENCY_CODE,
            HA_CONDITION: hardware.HA_CONDITION,
            HA_DEPLOYMENT_DATE: formatDate(hardware.HA_DEPLOYMENT_DATE),
            HA_RETIREMENT_DATE: formatDate(hardware.HA_RETIREMENT_DATE),
            HA_IP_ADDRESS: hardware.HA_IP_ADDRESS,
            HA_MAC_ADDRESS: hardware.HA_MAC_ADDRESS,
            HA_CREATED_AT: formatDate(hardware.HA_CREATED_AT)
        };
    },

    updateHardware: async (id, body) => {
        const updateData = {
            HA_NAME: body.HA_NAME,
            HA_TYPE: parseInt(body.HT_NAME),
            HA_MANUFACTURER: body.HA_MANUFACTURER,
            HA_MODEL: body.HA_MODEL,
            HA_SERIAL_NUMBER: body.HA_SERIAL_NUMBER,
            HA_PURCHASE_DATE: isValidDate(body.HA_PURCHASE_DATE) ? parseDate(body.HA_PURCHASE_DATE).toISOString() : null,
            HA_WARRANTY_EXPIRY_DATE: isValidDate(body.HA_WARRANTY_EXPIRY_DATE) ? parseDate(body.HA_WARRANTY_EXPIRY_DATE).toISOString() : null,
            HA_LOCATION: parseInt(body.LOC_NAME),
            HA_STATUS: parseInt(body.ST_NAME),
            HA_LAST_MAINTENANCE_DATE: isValidDate(body.HA_LAST_MAINTENANCE_DATE) ? parseDate(body.HA_LAST_MAINTENANCE_DATE).toISOString() : null,
            HA_NOTES: body.HA_NOTES,
            HA_SIM_CARD: body.HA_SIM_CARD,
            HA_STORE: parseInt(body.STORE_NAME),
            HA_SUPPLIER: parseInt(body.SUPPLIER_NAME),
            HA_COST: body.HA_COST,
            HA_CURRENCY: parseInt(body.CURRENCY_CODE),
            HA_CONDITION: body.HA_CONDITION,
            HA_DEPLOYMENT_DATE: isValidDate(body.HA_DEPLOYMENT_DATE) ? parseDate(body.HA_DEPLOYMENT_DATE).toISOString() : null,
            HA_RETIREMENT_DATE: isValidDate(body.HA_RETIREMENT_DATE) ? parseDate(body.HA_RETIREMENT_DATE).toISOString() : null,
            HA_IP_ADDRESS: body.HA_IP_ADDRESS,
            HA_MAC_ADDRESS: body.HA_MAC_ADDRESS,
        };

        return await prisma.tbl_hardware.update({
            where: {
                HA_ID: parseInt(id)
            },
            data: updateData,
        });
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