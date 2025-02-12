//backend/public/js/users.js

import { initializeTable } from './tableInitializer.js';

const config = {
    title: 'Users',
    nameField: 'USERNAME',
    columns: [{
        checkbox: true,
        visible: true
    }, {
        field: 'FIRST_NAME',
        title: 'First Name',
        sortable: true,
        type: 'text',
    }, {
        field: 'LAST_NAME',
        title: 'Last Name',
        sortable: true,
        type: 'text',
    }, {
        field: 'USERNAME',
        title: 'Username',
        sortable: true,
        type: 'text',
    }, {
        field: 'EMAIL',
        title: 'Email',
        sortable: true,
        type: 'email',
    },  {
        field: 'ROLE_NAME',
        title: 'Role',
        sortable: true,
        type: 'select',
        optionsEndpoint: '/api/roles',
        idField: 'ROLE_ID',
        valueField: 'ROLE_ID', 
        labelField: 'ROLE_NAME',
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'USER_ID',
    url: '/api/users',
    modalColumns: 1,
};

initializeTable(config);