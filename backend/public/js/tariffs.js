import { initializeTable } from './tableInitializer.js';

const config = {
    title: 'Tariff',
    nameField: 'TARIFF_NAME',
    columns: [{
        checkbox: true,
        visible: true
    }, {
        field: 'TARIFF_NAME',
        title: 'Name',
        sortable: true,
        type: 'text',
    }, {
        field: 'TARIFF_PRICE',
        title: 'Price',
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
        field: 'PROVIDER_NAME',
        title: 'Provider',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/providers',
        idField: 'PROVIDER_ID',
        valueField: 'PROVIDER_ID', 
        labelField: 'PROVIDER_NAME', 
    }, {
        field: 'TARIFF_DESCRIPTION',
        title: 'Description',
        sortable: true,
        type: 'textarea',
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'TARIFF_ID',
    url: '/api/tariffs',
    modalColumns: 2,

};

initializeTable(config);