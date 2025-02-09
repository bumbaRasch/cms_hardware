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
        'click .delete': async function (e, value, row, index) {
            if (confirm('Are you sure you want to delete this item?')) {
                try {
                    const response = await fetch(`${config.url}/${row[config.idField]}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        $('#table').bootstrapTable('remove', {
                            field: config.idField,
                            values: [row[config.idField]]
                        });
                    } else {
                        throw new Error('Failed to delete item');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to delete item');
                }
            }
        }
    };
}