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

    document.getElementById('table').addEventListener('click', function(event) {
        if (event.target.closest('.remove')) {
            const element = event.target.closest('.remove');
            deleteId = element.getAttribute('data-id');
            const pathname = window.location.pathname.split('/')[1];
            deleteEndpoint = `${window.location.origin}/${pathname}/${deleteId}`;
            
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