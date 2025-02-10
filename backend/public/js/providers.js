import { initializeTable } from './tableInitializer.js';

const config = {
    title: 'Provider',
    nameField: 'PROVIDER_NAME',
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
    }, {
        field: 'PROVIDER_TYPE',
        title: 'Type',
        sortable: true,
        type: 'text',
    }, {
        field: 'PROVIDER_NAME',
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
        field: 'PROVIDER_CONTACT',
        title: 'Contact',
        sortable: true,
        type: 'text',
    }, {
        field: 'PROVIDER_DESCRIPTION',
        title: 'Description',
        sortable: true,
        type: 'textarea',
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'PROVIDER_ID',
    url: '/api/providers',
    modalColumns: 1,
};

initializeTable(config);