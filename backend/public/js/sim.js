//backend/public/js/users.js

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
    const [providers, tariffs, statuses, locations] = await Promise.all([
        apiRequest('/api/providers', 'GET'),
        apiRequest('/api/tariffs', 'GET'),
        apiRequest('/api/statuses', 'GET'),
        apiRequest('/api/locations', 'GET')
    ]);

    return {
        PROVIDER_ID: providers.rows,
        TARIFF_ID: tariffs.rows,
        STATUS_ID: statuses.rows,
        LOC_ID: locations.rows
    };
};

window.operateEvents['click .edit'] = async function (e, value, row, index) {
    const selectOptions = await fetchSelectOptions();

    showModal({
        title: 'Edit SIM',
        body: generateEditForm(row, selectOptions),
        actionText: 'Update',
        actionClass: 'btn-success',
        onConfirm: async () => {
            const formData = new FormData(document.getElementById('editForm'));
            const updatedData = Object.fromEntries(formData.entries());

            try {
                await apiRequest(`/api/sim-cards/${row.SIM_ID}`, 'PUT', updatedData);
                updateTableRow(row.SIM_ID, updatedData);
                showAlert(`SIM <b>${row.SIM_NUMBER}</b> was successfully updated!`, 'success');
            } catch (error) {
                console.error('Error updating SIM:', error);
                showAlert(`Failed to update SIM ${row.SIM_NUMBER}: ${error.message}`, 'danger');
            }
        }
    });

    const activationDatePicker = flatpickr("#ACTIVATION_DATE", { 
        dateFormat: "Y-m-d",
        defaultDate: row.ACTIVATION_DATE || null
    });
    const expirationDatePicker = flatpickr("#EXPIRATION_DATE", { 
        dateFormat: "Y-m-d",
        defaultDate: row.EXPIRATION_DATE || null
    });

    document.querySelector("#ACTIVATION_DATE + .input-group-text").addEventListener('click', () => {
        activationDatePicker.open();
    });
    document.querySelector("#EXPIRATION_DATE + .input-group-text").addEventListener('click', () => {
        expirationDatePicker.open();
    });
};

const excludedFields = ['SIM_ID', 'SIM_UPDATED_AT', 'SIM_CREATED_AT', 'SIM_DELETED_AT', 'PROVIDER_NAME', 'TARIFF_NAME', 'LOC_NAME', 'ST_NAME'];

const labelMapping = {
    PROVIDER_ID: 'PROVIDER',
    TARIFF_ID: 'TARIFF',
    LOC_ID: 'LOCATION',
    STATUS_ID: 'STATUS'
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
    const label = labelMapping[key] || key.replace('_', ' ');
    const optionKey = key === 'STATUS_ID' ? 'ST_ID' : key;
    const optionName = key === 'STATUS_ID' ? 'ST_NAME' : key.replace('_ID', '_NAME');
    return `
        <div class="col-md-6">
            <label for="${key}" class="form-label">${label}</label>
            <select class="form-control" id="${key}" name="${key}">
                ${options.map(option => `
                    <option value="${option[optionKey]}" ${option[optionKey] === value ? 'selected' : ''}>${option[optionName]}</option>
                `).join('')}
            </select>
        </div>
    `;
};

const generateInputField = (key, value) => {
    if (key === 'ACTIVATION_DATE' || key === 'EXPIRATION_DATE') {
        return `
            <div class="col-md-6">
                <label for="${key}" class="form-label">${key.replace('_', ' ')}</label>
                <div class="input-group">
                    <input type="text" class="form-control" id="${key}" name="${key}" value="${value || ''}">
                    <span class="input-group-text"><i class="bi bi-calendar2-date"></i></span>
                </div>
            </div>
        `;
    }
    return `
        <div class="col-md-6">
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
    const itemName = row.SIM_NUMBER;

    showModal({
        title: 'Delete SIM',
        body: `Are you sure you want to delete <strong>${itemName}</strong>?`,
        actionText: 'Delete',
        actionClass: 'btn-danger',
        onConfirm: async () => {
            try {
                await apiRequest(`/api/sim-cards/${row.SIM_ID}`, 'DELETE');
                $('#table').bootstrapTable('remove', {
                    field: 'SIM_ID',
                    values: [row.SIM_ID]
                });
                showAlert(`${itemName} was successfully deleted!`, 'success');
            } catch (error) {
                console.error('Error deleting SIM:', error);
                showAlert(`Failed to delete SIM: ${error.message}`, 'danger');
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