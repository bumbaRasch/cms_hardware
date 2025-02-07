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
                await apiRequest(`/api/users/${row.USER_ID}`, 'PUT', updatedData);
                updateTableRow(row.USER_ID, updatedData);
                showAlert(`User <b>${row.USERNAME}</b> was successfully updated!`, 'success');
            } catch (error) {
                console.error('Error updating user:', error);
                showAlert(`Failed to update user ${row.USERNAME}: ${error.message}`, 'danger');
            }
        }
    });
};

window.operateEvents['click .reset-password'] = function (e, value, row, index) {
    showModal({
        title: 'Reset Password',
        body: generateResetPasswordForm(row),
        actionText: 'Reset',
        actionClass: 'btn-warning',
        onConfirm: async () => {
            const formData = new FormData(document.getElementById('resetPasswordForm'));
            const updatedData = Object.fromEntries(formData.entries());
            updatedData.PASSWORD = updatedData.newPassword;
            delete updatedData.newPassword;

            try {
                await apiRequest(`/api/users/${row.USER_ID}/reset-password`, 'POST', updatedData);
                updateTableRow(row.USER_ID, { ...row, PASSWORD: updatedData.PASSWORD });
                showAlert(`Password for user <b>${row.USERNAME}</b> was successfully reset!`, 'success');
            } catch (error) {
                console.error('Error resetting password:', error);
                showAlert(`Failed to reset password for user ${row.USERNAME}: ${error.message}`, 'danger');
            }
        }
    });
};

const excludedFields = ['USER_ID', 'UPDATED_AT', 'CREATED_AT', 'DELETED_AT', 'PASSWORD', 'ROLE_ID'];

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

const generateResetPasswordForm = (row) => {
    const formHtml = `
        <form id="resetPasswordForm">
            <div class="mb-3">
                <label for="newPassword" class="form-label">New Password</label>
                <div class="input-group">
                    <input type="password" class="form-control" id="newPassword" name="newPassword">
                    <a class="input-group-text" href="#" id="generatePassword"><i class="bi bi-dice-5"></i></a>
                    <a class="input-group-text" href="#" id="togglePasswordVisibility"><i class="bi bi-eye-fill"></i></a>
                </div>
            </div>
            <div class="mb-3">
                <label for="passwordLength" class="form-label">Password Length <span id="passwordLengthLabel"><b>12</b></span></label>
                <input type="range" class="form-range" min="8" max="32" id="passwordLength" value="12">
            </div>
        </form>
    `;
    setTimeout(generateRandomPassword, 0);
    return formHtml;
};

const generateRandomPassword = () => {
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const specialChars = "!@#$%^&*()_+";
    const allChars = lowerCase + upperCase + digits + specialChars;

    const getRandomChar = (charset) => charset[Math.floor(Math.random() * charset.length)];

    const length = document.getElementById('passwordLength').value;

    let password = [
        getRandomChar(lowerCase),
        getRandomChar(upperCase),
        getRandomChar(digits),
        getRandomChar(specialChars)
    ];

    for (let i = 4; i < length; i++) {
        password.push(getRandomChar(allChars));
    }

    password = password.sort(() => Math.random() - 0.5).join('');

    document.getElementById('newPassword').value = password;
};

const updatePasswordLengthLabel = (value) => {
    document.getElementById('passwordLengthLabel').textContent = value;
};

const togglePasswordVisibility = (passwordFieldId, iconElement) => {
    const passwordField = document.getElementById(passwordFieldId);
    const passwordIcon = iconElement.querySelector('i');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordIcon.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    } else {
        passwordField.type = 'password';
        passwordIcon.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
    }
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

    document.getElementById('generatePassword').addEventListener('click', (e) => {
        e.preventDefault();
        generateRandomPassword();
    });

    document.getElementById('togglePasswordVisibility').addEventListener('click', (e) => {
        e.preventDefault();
        togglePasswordVisibility('newPassword', e.currentTarget);
    });

    document.getElementById('passwordLength').addEventListener('input', (e) => {
        updatePasswordLengthLabel(e.target.value);
        generateRandomPassword();
    });
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
                await apiRequest(`/api/users/${row.USER_ID}`, 'DELETE');
                $('#table').bootstrapTable('remove', {
                    field: 'USER_ID',
                    values: [row.USER_ID]
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
                <button class="btn btn-sm btn-info reset-password" title="Reset Password"><i class="bi bi-key"></i></button>
                <button class="btn btn-sm btn-warning edit" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger delete" title="Delete"><i class="bi bi-trash"></i></button>
            </div>    
        `
    ].join('');
}