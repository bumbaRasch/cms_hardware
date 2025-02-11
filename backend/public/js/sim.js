//backend/public/js/sim.js

import { initializeTable } from './tableInitializer.js';

const config = {
    title: 'Sim Card',
    nameField: 'SIM_NUMBER',
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
        field: 'SIM_NUMBER',
        title: 'Number',
        sortable: true,
        type: 'number',
    }, {
        field: 'PROVIDER_NAME',
        title: 'Provider',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/providers',
        idField: 'PROVIDER_ID',
        valueField: 'PROVIDER_ID',
        labelField: 'PROVIDER_NAME',
    }, {
        field: 'TARIFF_NAME',
        title: 'Tariff',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/tariffs',
        idField: 'TARIFF_ID',
        valueField: 'TARIFF_ID',
        labelField: 'TARIFF_NAME',
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
        field: 'PIN1',
        title: 'PIN 1',
        sortable: true,
        type: 'text',
    }, {
        field: 'PIN2',
        title: 'PIN 2',
        sortable: true,
        type: 'text',
    }, {
        field: 'PUK1',
        title: 'PUK 1',
        sortable: true,
        type: 'text',
    }, {
        field: 'PUK2',
        title: 'PUK 2',
        sortable: true,
        type: 'text',
    }, {
        field: 'ACTIVATION_DATE',
        title: 'Activation Date',
        sortable: true,
        type: 'date',
    }, {
        field: 'EXPIRATION_DATE',
        title: 'Expiration Date',
        sortable: true,
        type: 'date',
    }, {
        field: 'COMMENTS',
        title: 'DESCRIPTION',
        sortable: true,
        type: 'textarea',
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'SIM_ID',
    url: '/api/sim-cards',
    modalColumns: 2,
};

initializeTable(config);