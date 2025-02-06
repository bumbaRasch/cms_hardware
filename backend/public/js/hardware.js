//backend/public/js/hardware.js

window.operateEvents = window.operateEvents || {};

const API_URLS = {
    STATUSES: '/api/statuses',
    LOCATIONS: '/api/locations',
    TYPES: '/api/types',
    CURRENCIES: '/api/currencies',
    SUPPLIERS: '/api/suppliers',
    STORES: '/api/stores',
    HARDWARE: '/api/hardware',
    SIMS: '/api/sim-cards',
};

const EXCLUDED_FIELDS = ['HA_ID', 'HT_NAME', 'HA_LOCATION', 'HA_STATUS', 'CURRENCY_CODE', 'HA_SUPPLIER', 'HA_STORE', 'HA_SIM_CARD', 'HA_CREATED_AT', 'HA_DELETED_AT', 'ST_ID', 'LOC_ID', 'PROVIDER_NAME', 'TARIFF_NAME'];

const LABEL_MAPPING = {
    HA_NAME: 'NAME',
    HA_TYPE: 'HARDWARE TYPE',
    HA_MANUFACTURER: 'MANUFACTURER',
    HA_MODEL: 'MODEL',
    HA_SERIAL_NUMBER: 'SERIAL NUMBER',
    HA_PURCHASE_DATE: 'PURCHASE DATE',
    HA_WARRANTY_EXPIRY_DATE: 'WARRANTY EXPIRY DATE',
    LOC_NAME: 'LOCATION',
    ST_NAME: 'STATUS',
    HA_LAST_MAINTENANCE_DATE: 'LAST MAINTENANCE DATE',
    HA_NOTES: 'NOTES',
    SIM_NUMBER: 'SIM NUMBER',
    STORE_NAME: 'STORE',
    SUPPLIER_NAME: 'SUPPLIER',
    HA_COST: 'COST',
    HA_CURRENCY: 'CURRENCY',
    HA_CONDITION: 'CONDITION',
    HA_DEPLOYMENT_DATE: 'DEPLOYMENT DATE',
    HA_RETIREMENT_DATE: 'RETIREMENT DATE',
    HA_IP_ADDRESS: 'IP ADDRESS',
    HA_MAC_ADDRESS: 'MAC ADDRESS'
};

const FIELD_MAPPINGS = {
    HA_TYPE: { id: 'HT_ID', name: 'HT_NAME' },
    HA_CURRENCY: { id: 'CURRENCY_ID', name: 'CURRENCY_CODE' }
};

function costFormatter(value) {
    return value ? parseFloat(value).toFixed(2).replace('.', ',') : '';
}

const apiRequest = async (url, method, data = null) => {
    const options = {
        method,
        headers: {}
    };

    if (method !== 'DELETE' && data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        if (method === 'DELETE' && response.status === 204) {
            return {};
        }
        return response.json();
    } catch (error) {
        console.error(`Error with ${method} request to ${url}:`, error);
        throw error;
    }
};

const fetchSelectOptions = async () => {
    const [statuses, locations, types, currencies, suppliers, stores, sims] = await Promise.all([
        apiRequest(API_URLS.STATUSES, 'GET'),
        apiRequest(API_URLS.LOCATIONS, 'GET'),
        apiRequest(API_URLS.TYPES, 'GET'),
        apiRequest(API_URLS.CURRENCIES, 'GET'),
        apiRequest(API_URLS.SUPPLIERS, 'GET'),
        apiRequest(API_URLS.STORES, 'GET'),
        apiRequest(API_URLS.SIMS, 'GET'),
    ]);

    return {
        ST_NAME: statuses.rows,
        LOC_NAME: locations.rows,
        HA_TYPE: types.rows,
        HA_CURRENCY: currencies.rows,
        SUPPLIER_NAME: suppliers.rows,
        STORE_NAME: stores.rows,
        SIM_NUMBER: sims.rows,
    };
};

const handleEditClick = async (e, value, row, index) => {
    const selectOptions = await fetchSelectOptions();

    showModal({
        title: 'Edit HARDWARE',
        body: generateEditForm(row, selectOptions),
        actionText: 'Update',
        actionClass: 'btn-success',
        size: 'modal-lg',
        onConfirm: async () => {
            const formData = new FormData(document.getElementById('editForm'));
            const updatedData = Object.fromEntries(formData.entries());

            if (updatedData.HA_COST) {
                updatedData.HA_COST = parseFloat(updatedData.HA_COST.replace(',', '.'));
            }

            const integerFields = ['HA_TYPE', 'LOC_NAME', 'ST_NAME', 'STORE_NAME', 'SUPPLIER_NAME', 'HA_CURRENCY'];
            integerFields.forEach(field => {
                if (updatedData[field]) {
                    updatedData[field] = parseInt(updatedData[field], 10);
                }
            });

            Object.keys(updatedData).forEach(key => {
                if (updatedData[key] === '') {
                    updatedData[key] = null;
                }
            });

            try {
                await apiRequest(`${API_URLS.HARDWARE}/${row.HA_ID}`, 'PUT', updatedData);
                updateTableRow(row.HA_ID, updatedData);
                showAlert(`Hardware <b>${row.HA_NAME}</b> was successfully updated!`, 'success');
            } catch (error) {
                console.error('Error updating hardware:', error);
                showAlert(`Failed to update hardware ${row.HA_NAME}: ${error.message}`, 'danger');
            }
        }
    });

    initializeDatePickers(row);
};

const initializeDatePickers = (row) => {
    const dateFields = ['HA_LAST_MAINTENANCE_DATE', 'HA_RETIREMENT_DATE', 'HA_WARRANTY_EXPIRY_DATE', 'HA_DEPLOYMENT_DATE', 'HA_PURCHASE_DATE'];
    dateFields.forEach(field => {
        const datePicker = flatpickr(`#${field}`, { 
            dateFormat: "Y-m-d",
            defaultDate: row[field] || null
        });
        document.querySelector(`#${field} + .input-group-text`).addEventListener('click', () => {
            datePicker.open();
        });
    });
};

const generateEditForm = (row, selectOptions) => {
    const fields = Object.entries(row)
        .filter(([key]) => !EXCLUDED_FIELDS.includes(key))
        .map(([key, value]) => selectOptions[key] ? generateSelectField(key, value, selectOptions[key]) : generateInputField(key, value))
        .join('');

    return `<form id="editForm" class="row g-3">
        ${fields}
    </form>`;
};

const generateSelectField = (key, value, options) => {
    const label = LABEL_MAPPING[key] || key.replace('_', ' ');
    let fieldMapping = FIELD_MAPPINGS[key] || { id: key.replace('_NAME', '_ID'), name: key };
    const optionKey = fieldMapping.id;
    const optionText = fieldMapping.name;
    return `
        <div class="col-md-4">
            <label for="${key}" class="form-label">${label}</label>
            <select class="form-control" id="${key}" name="${key}">
                ${options.map(option => `
                    <option value="${option[optionKey]}" ${option[optionKey] === value ? 'selected' : ''}>${option[optionText]}</option>
                `).join('')}
            </select>
        </div>
    `;
};

const generateInputField = (key, value) => {
    if (['HA_LAST_MAINTENANCE_DATE', 'HA_RETIREMENT_DATE', 'HA_WARRANTY_EXPIRY_DATE', 'HA_DEPLOYMENT_DATE', 'HA_PURCHASE_DATE'].includes(key)) {
        return `
            <div class="col-md-4">
                <label for="${key}" class="form-label">${LABEL_MAPPING[key] || key.replace('_', ' ')}</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="${key}" name="${key}" value="${value || ''}">
                    <span class="input-group-text"><i class="bi bi-calendar2-date"></i></span>
                </div>
            </div>
        `;
    }
    if (key === 'HA_COST') {
        value = value ? parseFloat(value).toFixed(2).replace('.', ',') : '';
    }
    return `
        <div class="col-md-4">
            <label for="${key}" class="form-label">${LABEL_MAPPING[key] || key.replace('_', ' ')}</label>
            <input type="text" class="form-control" id="${key}" name="${key}" value="${value}">
        </div>
    `;
};

const showModal = ({ title, body, actionText, actionClass, onConfirm, size = '' }) => {
    const modalLabel = document.getElementById('universalModalLabel');
    const modalBody = document.getElementById('universalModalBody');
    const saveButton = document.getElementById('universalModalSave');
    const modalDialog = document.getElementById('universalModalDialog');

    modalLabel.textContent = title;
    modalBody.innerHTML = body;
    saveButton.textContent = actionText;
    saveButton.className = `btn ${actionClass}`;
    modalDialog.className = `modal-dialog ${size}`;

    const newSaveButton = saveButton.cloneNode(true);
    saveButton.replaceWith(newSaveButton);

    newSaveButton.addEventListener('click', async () => {
        try {
            if (onConfirm) await onConfirm();
            bootstrap.Modal.getInstance(document.getElementById('universalModal')).hide();
        } catch (error) {
            console.error('Error during confirmation:', error);
        }
    });

    new bootstrap.Modal(document.getElementById('universalModal')).show();
};

const showAlert = (message, type) => {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.role = 'alert';
    alert.innerHTML = message;
    alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
};

const updateTableRow = (id, updatedData) => {
    $('#table').bootstrapTable('updateByUniqueId', {
        id: id,
        row: updatedData
    });
    $('#table').bootstrapTable('refresh');
};

window.operateEvents['click .edit'] = handleEditClick;

window.operateEvents['click .delete'] = function (e, value, row, index) {
    const itemName = row.HA_NAME;

    showModal({
        title: 'Delete Hardware',
        body: `Are you sure you want to delete <strong>${itemName}</strong>?`,
        actionText: 'Delete',
        actionClass: 'btn-danger',
        onConfirm: async () => {
            try {
                await apiRequest(`${API_URLS.HARDWARE}/${row.HA_ID}`, 'DELETE');
                $('#table').bootstrapTable('remove', {
                    field: 'HA_ID',
                    values: [row.HA_ID]
                });
                showAlert(`${itemName} was successfully deleted!`, 'success');
            } catch (error) {
                console.error('Error deleting hardware:', error);
                showAlert(`Failed to delete hardware: ${error.message}`, 'danger');
            }
        }
    });
};

function operateFormatter(value, row, index) {
    return `
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
            <button class="btn btn-sm btn-warning edit" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger delete" title="Delete"><i class="bi bi-trash"></i></button>
        </div>
    `;
}