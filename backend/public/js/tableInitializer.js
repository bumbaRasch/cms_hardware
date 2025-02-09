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
            openModal('Add', {}, config, 'lg');
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

    switch (action) {
        case 'Add':
            modalSaveButton.text('Save').removeClass().addClass('btn btn-success');
            break;
        case 'Edit':
            modalSaveButton.text('Update').removeClass().addClass('btn btn-warning');
            break;
        case 'Delete':
            modalSaveButton.text('Delete').removeClass().addClass('btn btn-danger');
            break;
        default:
            modalSaveButton.text('Save').removeClass().addClass('btn btn-primary');
            break;
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
        const fields = config.columns.filter(column => column.field !== 'operate' && column.field !== 'checkbox');
        const columns = config.modalColumns || 1;
        const rows = Math.ceil(fields.length / columns);
        let content = '<div class="row">';

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const fieldIndex = i * columns + j;
                if (fieldIndex < fields.length) {
                    const field = fields[fieldIndex];
                    content += `
                        <div class="col-md-${12 / columns}">
                            <div class="mb-3">
                                <label for="${field.field}" class="form-label">${field.title}</label>
                                <input type="text" class="form-control" id="${field.field}" value="${row[field.field] || ''}">
                            </div>
                        </div>
                    `;
                }
            }
        }

        content += '</div>';
        return content;
    }
}

async function handleModalSave(action, row, config) {
    const modal = $('#universalModal');
    const modalSaveButton = $('#universalModalSave');
    const updatedRow = {};

    // Collect form data
    config.columns.filter(column => column.field !== 'operate' && column.field !== 'checkbox').forEach(column => {
        updatedRow[column.field] = $(`#${column.field}`).val();
    });

    // Disable save button and show loading state
    modalSaveButton.prop('disabled', true).text('Saving...');

    try {
        const actionConfig = {
            'Delete': {
                method: 'DELETE',
                url: `${config.url}/${row[config.idField]}`,
                successMessage: 'Item deleted successfully',
                errorMessage: 'Failed to delete item'
            },
            'Edit': {
                method: 'PUT',
                url: `${config.url}/${row[config.idField]}`,
                body: JSON.stringify(updatedRow),
                successMessage: 'Item updated successfully',
                errorMessage: 'Failed to update item'
            },
            'Add': {
                method: 'POST',
                url: config.url,
                body: JSON.stringify(updatedRow),
                successMessage: 'Item added successfully',
                errorMessage: 'Failed to add item'
            }
        };

        const { method, url, body, successMessage, errorMessage } = actionConfig[action];
        const fetchOptions = { method };

        if (method !== 'DELETE') {
            fetchOptions.headers = { 'Content-Type': 'application/json' };
            fetchOptions.body = body;
        }

        const response = await fetch(url, fetchOptions);

        if (response.ok) {
            if (action === 'Delete') {
                $('#table').bootstrapTable('remove', {
                    field: config.idField,
                    values: [row[config.idField]]
                });
            } else if (action === 'Edit') {
                $('#table').bootstrapTable('updateByUniqueId', {
                    id: row[config.idField],
                    row: updatedRow
                });
            } else if (action === 'Add') {
                const newItem = await response.json();
                $('#table').bootstrapTable('append', newItem);
            }
            alert(successMessage);
            modal.modal('hide');
        } else {
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    } finally {
        modalSaveButton.prop('disabled', false).text(action === 'Delete' ? 'Delete' : 'Save');
    }
}