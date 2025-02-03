window.operateEvents = window.operateEvents || {};

window.operateEvents['click .edit'] = function (e, value, row, index) {
    //edit
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
                    showAlert('Failed to delete user.', 'danger');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                showAlert('An error occurred while deleting the user.', 'danger');
            }
        }
    });
};

function operateFormatter(value, row, index) {
    return [
        '<button class="btn btn-sm btn-warning edit" title="Edit"><i class="bi bi-pencil"></i></button>',
        '<button class="btn btn-sm btn-danger delete" title="Delete"><i class="bi bi-trash"></i></button>'
    ].join(' ');
}