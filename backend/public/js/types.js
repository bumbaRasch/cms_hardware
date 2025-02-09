import { initializeTable } from './tableInitializer.js';

const config = {
    columns: [{
        checkbox: true,
        visible: true
    }, {
        field: 'HT_NAME',
        title: 'Name',
        sortable: true
    }, {
        field: 'HT_CATEGORY',
        title: 'Category',
        sortable: true
    }, {
        field: 'HT_DESCRIPTION',
        title: 'Description',
        sortable: true
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'HT_ID',
    url: '/api/types'
};

initializeTable(config);

