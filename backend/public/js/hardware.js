//backend/public/js/hardware.js
import { initializeTable } from './tableInitializer.js';

const config = {
    title: 'Hardware',
    nameField: 'HA_NAME',
    columns: [{
        checkbox: true,
        visible: true
    }, {
        field: 'HA_CONDITION',
        title: 'Condition',
        sortable: true,
        type: 'text',
    }, {
        field: 'ST_NAME',
        title: 'Status',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/statuses',
        idField: 'ST_ID',
        valueField: 'ST_ID',
        labelField: 'ST_NAME',
    }, {
        field: 'HA_NAME',
        title: 'Name',
        sortable: true,
        type: 'text',
    }, {
        field: 'HT_NAME',
        title: 'Type',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/types',
        idField: 'HT_ID',
        valueField: 'HT_ID',
        labelField: 'HT_NAME',
    }, {
        field: 'STORE_NAME',
        title: 'Store',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/stores',
        idField: 'STORE_ID',
        valueField: 'STORE_ID',
        labelField: 'STORE_NAME',
    }, {
        field: 'LOC_NAME',
        title: 'Location',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/locations',
        idField: 'LOC_ID',
        valueField: 'LOC_ID',
        labelField: 'LOC_NAME',
    }, {
        field: 'HA_MANUFACTURER',
        title: 'Manufacturer',
        sortable: true,
        type: 'text',
    }, {
        field: 'HA_MODEL',
        title: 'Model',
        sortable: true,
        type: 'text',
    }, {
        field: 'HA_SERIAL_NUMBER',
        title: 'Serial Number',
        sortable: true,
        type: 'text',
    }, {
        field: 'SIM_NUMBER',
        title: 'SIM Card',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/sim-cards',
        idField: 'SIM_ID',
        valueField: 'SIM_ID',
        labelField: 'SIM_NUMBER',
    }, {
        field: 'HA_COST',
        title: 'Preis',
        sortable: true,
        type: 'number',
    }, {
        field: 'CURRENCY_CODE',
        title: 'Currency',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/currencies',
        idField: 'CURRENCY_ID',
        valueField: 'CURRENCY_ID', 
        labelField: 'CURRENCY_CODE',
    }, {
        field: 'SUPPLIER_NAME',
        title: 'Supplier',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/suppliers',
        idField: 'SUPPLIER_ID',
        valueField: 'SUPPLIER_ID',
        labelField: 'SUPPLIER_NAME',
    }, {
        field: 'HA_PURCHASE_DATE',
        title: 'Purchase Date',
        sortable: true,
        type: 'date',
    }, {
        field: 'HA_WARRANTY_EXPIRY_DATE',
        title: 'Warranty Expiry Date',
        sortable: true,
        type: 'date',
    }, {
        field: 'HA_IP_ADDRESS',
        title: 'IP Address',
        sortable: true,
        type: 'text',
    }, {
        field: 'HA_MAC_ADDRESS',
        title: 'MAC Address',
        sortable: true,
        type: 'text',
    }, {
        field: 'HA_DEPLOYMENT_DATE',
        title: 'Deployment Date',
        sortable: true,
        type: 'date',
    }, {
        field: 'HA_RETIREMENT_DATE',
        title: 'Retirement Date',
        sortable: true,
        type: 'date',
    }, {
        field: 'HA_NOTES',
        title: 'Notes',
        sortable: true,
        type: 'textarea',
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'HA_ID',
    url: '/api/hardware',
    modalColumns: 3,
};

initializeTable(config);