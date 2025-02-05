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

window.operateEvents['click .edit'] = async function (e, value, row, index) {
    const roles = await apiRequest('/api/users/roles', 'GET');

    showModal({
        title: 'Edit User',
        body: generateEditForm(row, roles),
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
};

const excludedFields = ['SIM_ID', 'SIM_UPDATED_AT', 'SIM_CREATED_AT', 'SIM_DELETED_AT', 'PASSWORD', 'ROLE_ID'];

const generateEditForm = (row, roles) => {
    return `<form id="editForm">
        ${Object.entries(row)
            .filter(([key]) => !excludedFields.includes(key))
            .map(([key, value]) => {
                if (key === 'ROLE_NAME') {
                    return `
                        <div class="mb-3">
                            <label for="ROLE_ID" class="form-label">Role</label>
                            <select class="form-control" id="ROLE_ID" name="ROLE_ID">
                                ${roles.map(role => `
                                    <option value="${role.ROLE_ID}" ${role.ROLE_ID === row.ROLE_ID ? 'selected' : ''}>${role.ROLE_NAME}</option>
                                `).join('')}
                            </select>
                        </div>
                    `;
                } else {
                    return `
                        <div class="mb-3">
                            <label for="${key}" class="form-label">${key.replace('_', ' ')}</label>
                            <input type="text" class="form-control" id="${key}" name="${key}" value="${value}">
                        </div>
                    `;
                }
            })
            .join('')}
    </form>`;
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
        title: 'Delete User',
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
                console.error('Error deleting user:', error);
                showAlert(`Failed to delete user: ${error.message}`, 'danger');
            }
        }
    });
};

function operateFormatter(value, row, index) {
    return [
        `
            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                <button class="btn btn-sm btn-warning edit" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger delete" title="Delete"><i class="bi bi-trash"></i></button>
            </div>    
        `
    ].join('');
}