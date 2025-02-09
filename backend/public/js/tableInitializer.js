export function initializeTable(config) {
    config.columns.forEach(column => {
        if (column.field === 'operate') {
            column.formatter = operateFormatter;
            column.events = createOperateEvents(config);
        }
    });

    $(document).ready(function() {
        const table = $('#table');
        table.bootstrapTable({
            columns: config.columns,
            classes: 'table table-bordered table-striped table-hover',
            clickToSelect: true,
            filterControl: true,
            idField: config.idField,
            locale: 'en-US',
            pageList: [10, 25, 50, 'all'],
            pagination: true,
            search: true,
            searchAlign: 'left',
            showColumns: true,
            showColumnsToggleAll: true,
            showExport: true,
            showFooter: true,
            showFullscreen: true,
            showPaginationSwitch: true,
            showToggle: true,
            sidePagination: 'server',
            sortable: true,
            theadClasses: 'table-primary',
            toggle: true,
            toolbar: '#toolbar',
            url: config.url,
        });

        // Add button click event #addButton
        $('#addButton').on('click', function() {
            openModal('Add', {}, config, 'sm');
        });
    });
}

export function operateFormatter(value, row, index) {
    return `
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
            <button class="btn btn-sm btn-warning edit" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger delete" title="Delete"><i class="bi bi-trash"></i></button>
        </div>
    `;
}

function createOperateEvents(config) {
    return {
        'click .edit': function (e, value, row, index) {
            openModal('Edit', row, config, 'lg');
        },
        'click .delete': function (e, value, row, index) {
            openModal('Delete', row, config, 'sm');
        }
    };
}

function openModal(action, row, config, size) {
    const modal = $('#universalModal');
    const modalDialog = $('#universalModalDialog');
    const modalTitle = $('#universalModalLabel');
    const modalBody = $('#universalModalBody');
    const modalSaveButton = $('#universalModalSave');

    modalDialog.removeClass('modal-sm modal-lg modal-xl').addClass(`modal-${size}`);
    modalTitle.text(`${action} ${config.title}`);
    modalBody.html(generateModalContent(action, row, config));

    if (action === 'Delete') {
        modalSaveButton.text('Delete').removeClass('btn-primary').addClass('btn-danger');
    } else if (action === 'Add') {
        modalSaveButton.text('Save').removeClass('btn-danger').addClass('btn-success');
    } 
    else {
        modalSaveButton.text('Save').removeClass('btn-danger').addClass('btn-primary');
    }

    modalSaveButton.off('click').on('click', function() {
        handleModalSave(action, row, config);
    });

    modal.modal('show');
}

function generateModalContent(action, row, config) {
    if (action === 'Delete') {
        return `<p>Are you sure you want to delete the ${config.title.toLowerCase()} <b>${row[config.nameField]}</b>?</p>`;
    } else {
        return config.columns.filter(column => column.field !== 'operate' && column.field !== 'checkbox').map(column => `
            <div class="mb-3">
                <label for="${column.field}" class="form-label">${column.title}</label>
                <input type="text" class="form-control" id="${column.field}" value="${row[column.field] || ''}">
            </div>
        `).join('');
    }
}

async function handleModalSave(action, row, config) {
    const modal = $('#universalModal');
    const updatedRow = {};
    config.columns.filter(column => column.field !== 'operate' && column.field !== 'checkbox').forEach(column => {
        updatedRow[column.field] = $(`#${column.field}`).val();
    });

    if (action === 'Delete') {
        try {
            const response = await fetch(`${config.url}/${row[config.idField]}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                $('#table').bootstrapTable('remove', {
                    field: config.idField,
                    values: [row[config.idField]]
                });
                modal.modal('hide');
            } else {
                throw new Error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete item');
        }
    } else if (action === 'Edit') {
        try {
            const response = await fetch(`${config.url}/${row[config.idField]}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRow)
            });

            if (response.ok) {
                $('#table').bootstrapTable('updateByUniqueId', {
                    id: row[config.idField],
                    row: updatedRow
                });
                modal.modal('hide');
            } else {
                throw new Error('Failed to update item');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update item');
        }
    } else if (action === 'Add') {
        try {
            const response = await fetch(config.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRow)
            });

            if (response.ok) {
                const newItem = await response.json();
                $('#table').bootstrapTable('append', newItem);
                modal.modal('hide');
            } else {
                throw new Error('Failed to add item');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add item');
        }
    }
}