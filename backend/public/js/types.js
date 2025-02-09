$(document).ready(function() {
    const table = $('#table');

    table.bootstrapTable({
        columns: [{
            checkbox: true,
            visible: true
        }, {
            field: 'HT_NAME',
            title: 'Name',
            sortable: true
        }, {
            field: 'HT_CATEGORY',
            title: 'Category',
            sortable: true
        }, {
            field: 'HT_DESCRIPTION',
            title: 'Description',
            sortable: true
        }, {
            field: 'operate',
            title: 'Actions',
            align: 'center',
            clickToSelect: false,
            events: window.operateEvents,
            formatter: operateFormatter
        }],
        classes: 'table table-bordered table-striped table-hover',
        clickToSelect: true,
        filterControl: true,
        idField: 'HT_ID',
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
        url: '/api/types',
    });

    function operateFormatter(value, row, index) {
        return `
            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                <button class="btn btn-sm btn-warning edit" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-danger delete" title="Delete"><i class="bi bi-trash"></i></button>
            </div>
        `;
    } 
});


window.operateEvents = {
    'click .delete': async function (e, value, row, index) {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`/api/types/${row.HT_ID}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const table = $('#table');
                    table.bootstrapTable('remove', {
                        field: 'HT_ID',
                        values: [row.HT_ID]
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

