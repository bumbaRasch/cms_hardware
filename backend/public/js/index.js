document.addEventListener("DOMContentLoaded", () => {
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const elements = [toggleId, navId, bodyId, headerId].map(id => document.getElementById(id));
        if (elements.some(el => !el)) return;

        const [toggle, nav, bodypd, headerpd] = elements;
            toggle.addEventListener('click', () => {
                nav.classList.toggle('show-sidebar');
                toggle.classList.toggle('bx-x');
                bodypd.classList.toggle('body-pd');
                headerpd.classList.toggle('body-pd');
            });
    };

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');
    document.querySelector('.nav_list')?.addEventListener('click', event => {
        if (event.target.classList.contains('nav_link')) {
            document.querySelectorAll('.nav_link').forEach(link => link.classList.remove('active'));
            event.target.classList.add('active');
        }
    });
});

window.onload = function() {
    let deleteId = null;
    let deleteEndpoint = null;
    let itemName = '';
    const deleteModalElement = document.getElementById('deleteModal');
    const deleteModal = new bootstrap.Modal(deleteModalElement);
    const deleteModalTitle = document.getElementById('deleteModalLabel');
    const deleteModalBody = document.getElementById('deleteModalBody');
    const alertContainer = document.getElementById('alert-container');

    const showAlert = (message, type) => {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.role = 'alert';
        alert.innerHTML = message;
        alertContainer.appendChild(alert);
        setTimeout(() => {
            alert.remove();
            window.location.reload();
        }, 5000);
    };

    document.getElementById('table').addEventListener('click', function(event) {
        if (event.target.closest('.remove')) {
            const element = event.target.closest('.remove');
            deleteId = element.getAttribute('data-id');
            const pathname = window.location.pathname.split('/')[1];
            deleteEndpoint = `${window.location.origin}/${pathname}/${deleteId}`;
            
            if (pathname === 'sim-cards') {
                const simNumber = element.closest('tr').querySelector('td:nth-child(2)').textContent;
                itemName = `SIM card with number <b>${simNumber}</b>`;
                deleteModalTitle.innerHTML = 'Delete SIM Card';
            } else if (pathname === 'hardware') {
                const hardwareName = element.closest('tr').querySelector('td:nth-child(2)').textContent;
                const serialNumber = element.closest('tr').querySelector('td:nth-child(6)').textContent;
                itemName = `<b>${hardwareName}</b> with serial number <b>${serialNumber}</b>`;
                deleteModalTitle.innerHTML = 'Delete Hardware';
            } else if (pathname === 'users') {
                const username = element.closest('tr').querySelector('td:nth-child(2)').textContent;
                itemName = `user <b>${username}</b>`;
                deleteModalTitle.innerHTML = 'Delete User';
            }
            deleteModalBody.innerHTML = `Are you sure you want to delete the ${itemName}?`;

            deleteModal.show();
        }
    });

    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (deleteEndpoint) {
            fetch(deleteEndpoint, {
                method: 'DELETE'
            })
            .then(res => {
                if (res.ok) {
                    const row = document.querySelector(`.remove[data-id="${deleteId}"]`).closest('tr');
                    if (row) {
                        row.remove();
                    }
                    showAlert(`${itemName} was successfully deleted!`, 'success');
                } else {
                    showAlert(`Failed to delete the ${itemName}.`, 'danger');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert(`An error occurred while deleting the ${itemName}.`, 'danger');
            });
        }
        deleteModal.hide();
    });

    document.querySelectorAll('.modal .btn-close, .modal .btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            deleteModal.hide();
        });
    });
};