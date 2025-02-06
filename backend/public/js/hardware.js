//backend/public/js/hardware.js

window.operateEvents = window.operateEvents || {};

const apiRequest = async (url, method, data = null) => {
    const options = {
        method,
        headers: {}
    };

    if (method !== 'DELETE' && data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    if (method === 'DELETE' && response.status === 204) {
        return {};
    }
    return response.json();
};

const fetchSelectOptions = async () => {
    const [statuses, locations, types, currencies] = await Promise.all([
        apiRequest('/api/statuses', 'GET'),
        apiRequest('/api/locations', 'GET'),
        apiRequest('/api/types', 'GET'),
        apiRequest('/api/currencies', 'GET'),
        // apiRequest('/api/suppliers', 'GET'),
        // apiRequest('/api/stores', 'GET'),
    ]);
    return {
        ST_NAME: statuses.rows,
        LOC_NAME: locations.rows,
        HT_NAME: types.rows,
        CURRENCY_CODE: currencies.rows,
    };
};

window.operateEvents['click .edit'] = async function (e, value, row, index) {
    const selectOptions = await fetchSelectOptions();

    showModal({
        title: 'Edit HARDWARE',
        body: generateEditForm(row, selectOptions),
        actionText: 'Update',
        actionClass: 'btn-success',
        onConfirm: async () => {
            const formData = new FormData(document.getElementById('editForm'));
            const updatedData = Object.fromEntries(formData.entries());

            try {
                await apiRequest(`/api/hardware/${row.HA_ID}`, 'PUT', updatedData);
                updateTableRow(row.HA_ID, updatedData);
                showAlert(`Hardware <b>${row.HA_ID}</b> was successfully updated!`, 'success');
            } catch (error) {
                console.error('Error updating hardware:', error);
                showAlert(`Failed to update hardware ${row.HA_ID}: ${error.message}`, 'danger');
            }
        }
    });

    // Initialize Flatpickr on all date fields
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

const excludedFields = ['HA_ID', 'HA_TYPE', 'HA_LOCATION', 'HA_STATUS', 'HA_CURRENCY', 'HA_SIM_CARD', 'HA_CREATED_AT', 'HA_DELETED_AT', 'ST_ID', 'LOC_ID','PROVIDER_NAME', 'TARIFF_NAME', 'STORE_NAME', 'SUPPLIER_NAME', 'SUPPLIER_NAME', ];

const labelMapping = {
    LOC_NAME: 'LOCATION',
    ST_NAME: 'STATUS',
    HT_NAME: 'HARDWARE TYPE',
    CURRENCY_CODE: 'CURRENCY',
};

const generateEditForm = (row, selectOptions) => {
    const fields = Object.entries(row)
        .filter(([key]) => !excludedFields.includes(key))
        .map(([key, value]) => selectOptions[key] ? generateSelectField(key, value, selectOptions[key]) : generateInputField(key, value))
        .join('');

    return `<form id="editForm" class="row g-3">
        ${fields}
    </form>`;
};

const generateSelectField = (key, value, options) => {
    console.log(key, value, options);
    const label = labelMapping[key] || key.replace('_', ' ');
    return `
        <div class="col-md-4">
            <label for="${key}" class="form-label">${label}</label>
            <select class="form-control" id="${key}" name="${key}">
                ${options.map(option => `
                    <option value="${option[key]}" ${option[key] === value ? 'selected' : ''}>${option[key]}</option>
                `).join('')}
            </select>
        </div>
    `;
};

const generateInputField = (key, value) => {
    if (['HA_LAST_MAINTENANCE_DATE', 'HA_RETIREMENT_DATE', 'HA_WARRANTY_EXPIRY_DATE', 'HA_DEPLOYMENT_DATE', 'HA_PURCHASE_DATE'].includes(key)) {
        return `
            <div class="col-md-4">
                <label for="${key}" class="form-label">${key.replace('_', ' ')}</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="${key}" name="${key}" value="${value || ''}">
                    <span class="input-group-text"><i class="bi bi-calendar2-date"></i></span>
                </div>
            </div>
        `;
    }
    return `
        <div class="col-md-4">
            <label for="${key}" class="form-label">${key.replace('_', ' ')}</label>
            <input type="text" class="form-control" id="${key}" name="${key}" value="${value}">
        </div>
    `;
};

const showModal = ({ title, body, actionText, actionClass, onConfirm }) => {
    const modalLabel = document.getElementById('universalModalLabel');
    const modalBody = document.getElementById('universalModalBody');
    const saveButton = document.getElementById('universalModalSave');

    modalLabel.textContent = title;
    modalBody.innerHTML = body;
    saveButton.textContent = actionText;
    saveButton.className = `btn ${actionClass}`;

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

window.operateEvents['click .delete'] = function (e, value, row, index) {
    const itemName = row.HA_NAME;

    showModal({
        title: 'Delete Hardware',
        body: `Are you sure you want to delete <strong>${itemName}</strong>?`,
        actionText: 'Delete',
        actionClass: 'btn-danger',
        onConfirm: async () => {
            try {
                await apiRequest(`/api/hardware/${row.HA_ID}`, 'DELETE');
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