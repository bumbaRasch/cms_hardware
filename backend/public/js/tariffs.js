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
        sortable: true
    }, {
        field: 'TARIFF_PRICE',
        title: 'Price',
        sortable: true
    }, {
        field: 'CURRENCY_CODE',
        title: 'Currency',
        sortable: true
    }, {
        field: 'PROVIDER_NAME',
        title: 'Provider',
        sortable: true
    }, {
        field: 'TARIFF_DESCRIPTION',
        title: 'Description',
        sortable: true
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'TARIFF_ID',
    url: '/api/tariffs'
};

initializeTable(config);