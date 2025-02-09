window.operateEvents = {
    'click .delete': async function (e, value, row, index) {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`/api/types/${row.HT_ID}`, {
                    method: 'DELETE'
                });

                console.log(response);

                if (response.ok) {
                    $('#table').bootstrapTable('remove', {
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

function operateFormatter(value, row, index) {
    return `
        <div class="d-grid gap-2 d-md-flex justify-content-md-center">
            <button class="btn btn-sm btn-warning edit" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger delete" title="Delete"><i class="bi bi-trash"></i></button>
        </div>
    `;
}