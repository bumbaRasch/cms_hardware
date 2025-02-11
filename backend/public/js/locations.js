// bakend/public/js/locations.js
import { initializeTable } from './tableInitializer.js';

const config = {
    title: 'Location',
    nameField: 'LOC_NAME',
    columns: [{
        checkbox: true,
        visible: true
    }, {
        field: 'LOC_NAME',
        title: 'Name',
        sortable: true,
        type: 'text',
    }, {
        field: 'LOC_ADDRESS',
        title: 'Address',
        sortable: true,
        type: 'text',
    }, {
        field: 'LOC_CITY',
        title: 'City',
        sortable: true,
        type: 'text',
    }, {
        field: 'LOC_STATE',
        title: 'State',
        sortable: true,
        type: 'text',
    }, {
        field: 'LOC_COUNTRY',
        title: 'Country',
        sortable: true,
        type: 'text',
    }, {
        field: 'LOC_POSTAL_CODE',
        title: 'Postal Code',
        sortable: true,
        type: 'text',
    }, {
        field: 'LOC_CONTACT_PERSON',
        title: 'Contact Person',
        sortable: true,
        type: 'text',
    }, {
        field: 'LOC_CONTACT_PHONE',
        title: 'Contact Phone',
        sortable: true,
        type: 'tel',
    }, {
        field: 'LOC_CONTACT_EMAIL',
        title: 'Contact Email',
        sortable: true,
        type: 'email',
    }, {
        field: 'LOC_DESCRIPTION',
        title: 'Description',
        sortable: true,
        type: 'textarea',
    }, {
        field: 'operate',
        title: 'Actions',
        align: 'center',
        clickToSelect: false
    }],
    idField: 'LOC_ID',
    url: '/api/locations',
    modalColumns: 2,
};

initializeTable(config);