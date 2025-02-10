import { initializeTable } from './tableInitializer.js';

const config = {
    title: 'Supplier',
    nameField: 'SUPPLIER_NAME',
    columns: [{
        checkbox: true,
        visible: true
    }, {
        field: 'ST_NAME',
        title: 'Status',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/statuses',
        idField: 'ST_ID',
        valueField: 'ST_ID', 
        labelField: 'ST_NAME',
    },{
        field: 'SUPPLIER_NAME',
        title: 'Name',
        sortable: true,
        type: 'text',
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
        field: 'SUPPLIER_DESCRIPTION',
        title: 'Description',
        sortable: true,
        type: 'textarea',
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'SUPPLIER_ID',
    url: '/api/suppliers',
    modalColumns: 1,
};

initializeTable(config);