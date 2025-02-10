import { initializeTable } from './tableInitializer.js';

const config = {
    title: 'Status',
    nameField: 'ST_NAME',
    columns: [{
        checkbox: true,
        visible: true
    }, {
        field: 'ST_NAME',
        title: 'Name',
        sortable: true,
        type: 'text',
    }, {
        field: 'ST_DESCRIPTION',
        title: 'Desciption',
        sortable: true,
        type: 'textarea',
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'ST_ID',
    url: '/api/statuses',
    modalColumns: 1,
};

initializeTable(config);