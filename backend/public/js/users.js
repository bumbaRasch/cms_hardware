window.operateEvents = window.operateEvents || {};

window.operateEvents['click .edit'] = function (e, value, row, index) {
    showModal({
        title: 'Edit User',
        body: generateEditForm(row),
        actionText: 'Update',
        actionClass: 'btn-success',
        onConfirm: async () => {
            const formData = new FormData(document.getElementById('editForm'));
            const updatedData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`/api/users/${row.USER_ID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    updateTableRow(row.USER_ID, updatedData);
                    showAlert(`User <b>${row.USERNAME}</b> was successfully updated!`, 'success');
                } else {
                    const errorText = await response.text();
                    showAlert(`Failed to update user ${row.USERNAME}: ${errorText}`, 'danger');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                showAlert(`An error occurred while updating the user: ${error.message}`, 'danger');
            }
        }
    });
};

const generateEditForm = (row) => {
    let formHtml = '<form id="editForm">';
    for (const key in row) {
        if (key !== 'USER_ID' && key !== 'UPDATED_AT' && key !== 'CREATED_AT' && key !== 'DELETED_AT') {
            formHtml += `
                <div class="mb-3">
                    <label for="${key}" class="form-label">${key.replace('_', ' ')}</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="${key}" name="${key}" value="${row[key]}">
                        ${key === 'PASSWORD' ? '<a class="input-group-text" href="#" onclick="generateRandomPassword()"><i class="bi bi-dice-5"></i></a>' : ''}
                    </div>
                </div>
            `;
        }
    }
    formHtml += '</form>';
    return formHtml;
};

const generateRandomPassword = () => {
    const passwordField = document.getElementById('PASSWORD');
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";

    password += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
    password += "0123456789".charAt(Math.floor(Math.random() * 10));
    password += "!@#$%^&*()_+~`|}{[]:;?><,./-=".charAt(Math.floor(Math.random() * 32));

    for (let i = 4; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    passwordField.value = password;
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
    const itemName = row.USERNAME;

    showModal({
        title: 'Delete User',
        body: `Are you sure you want to delete <strong>${itemName}</strong>?`,
        actionText: 'Delete',
        actionClass: 'btn-danger',
        onConfirm: async () => {
            try {
                const response = await fetch(`/api/users/${row.USER_ID}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    $('#table').bootstrapTable('remove', {
                        field: 'USER_ID',
                        values: [row.USER_ID]
                    });
                    showAlert(`${itemName} was successfully deleted!`, 'success');
                } else {
                    const errorText = await response.text();
                    showAlert(`Failed to delete user: ${errorText}`, 'danger');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                showAlert(`An error occurred while deleting the user: ${error.message}`, 'danger');
            }
        }
    });
};

function operateFormatter(value, row, index) {
    return [
        '<button class="btn btn-sm btn-warning edit" title="Edit"><i class="bi bi-pencil"></i></button>',
        '<button class="btn btn-sm btn-danger delete" title="Delete"><i class="bi bi-trash"></i></button>'
    ].join('');
}