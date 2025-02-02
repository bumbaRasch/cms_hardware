document.addEventListener("DOMContentLoaded", function(event) {
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId);

        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('show-sidebar');
                toggle.classList.toggle('bx-x');
                bodypd.classList.toggle('body-pd');
                headerpd.classList.toggle('body-pd');
            });
        }
    };

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');

    const linkColor = document.querySelectorAll('.nav_link');

    function colorLink() {
        if (linkColor) {
            linkColor.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink));
});

window.onload = function() {
    let deleteId = null;
    let deleteEndpoint = null;
    const deleteModalElement = document.getElementById('deleteModal');
    const deleteModal = new bootstrap.Modal(deleteModalElement);
    const deleteModalTitle = document.getElementById('deleteModalLabel');
    const deleteModalBody = document.getElementById('deleteModalBody');

    document.getElementById('table').addEventListener('click', function(event) {
        if (event.target.closest('.remove')) {
            const element = event.target.closest('.remove');
            deleteId = element.getAttribute('data-id');
            const pathname = window.location.pathname.split('/')[1];
            deleteEndpoint = `${window.location.origin}/${pathname}/${deleteId}`;
            
            let itemName = '';
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
                        const $table = $('#table');
                        $table.bootstrapTable('load', $table.bootstrapTable('getData'));
                    }
                    window.location.reload();
                } else {
                    alert('Failed to delete the record.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the record.');
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