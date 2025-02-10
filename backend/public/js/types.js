import { initializeTable } from './tableInitializer.js';

const config = {
    title: 'Hardware Type',
    nameField: 'HT_NAME',
    columns: [{
        checkbox: true,
        visible: true
    }, {
        field: 'HT_NAME',
        title: 'Name',
        sortable: true,
        type: 'text',
    }, {
        field: 'HC_NAME',
        title: 'Category',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/categories',
        idField: 'HC_ID',
        valueField: 'HC_ID',
        labelField: 'HC_NAME',
    }, {
        field: 'HT_DESCRIPTION',
        title: 'Description',
        sortable: true,
        type: 'textarea',
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'HT_ID',
    url: '/api/types',
    modalColumns: 2,
};

initializeTable(config);