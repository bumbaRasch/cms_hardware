import { showAlert } from './index.js';
document.getElementById('ask-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const question = document.getElementById('question').value;
    try {
        const table = $('#table');
        table.bootstrapTable('showLoading');
        
        const response = await fetch('/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question })
        });
        
        const data = await response.json();
        if (data.result && data.result.length > 0) {
            if (table.bootstrapTable) {
                table.bootstrapTable('destroy');
            }
            
            const columns = Object.keys(data.result[0]).map(key => ({
                field: key,
                title: key,
                sortable: true,
                searchable: true,
                filterControl: 'input'
            }));
            
            table.bootstrapTable({
                columns: columns,
                data: data.result,
                classes: 'table table-bordered table-striped table-hover',
                locale: 'en-US',
                sortResetPage: true,
                search: true,
                searchAlign: 'left',
                pagination: true,
                pageSize: 10,
                pageList: [10, 25, 50, 100, 'all'],
                showColumns: true,
                showColumnsToggleAll: true,
                showToggle: true,
                showFullscreen: true,
                showExport: true,
                exportDataType: 'all',
                sortable: true,
                filterControl: true,
                showSearchClearButton: true,
                clickToSelect: true,
                singleSelect: false,
                checkboxHeader: true,
                toolbar: '#toolbar',
                toolbarAlign: 'right',
                showFooter: true,
                cardView: false,
                detailView: true,
                detailFormatter: function (index, row) {
                    return '<div class="p-3">' + 
                           Object.entries(row)
                               .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                               .join('') + 
                           '</div>';
                },
                icons: {
                    toggle: 'bi-list',
                    columns: 'bi-list-columns',
                    export: 'bi-download'
                }
            });

            showAlert('Results loaded successfully', 'success');
        } else {
            showAlert('No results found for your query', 'warning');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert(`Error processing your request: ${error.message}`, 'danger');
    } finally {
        $('#table').bootstrapTable('hideLoading');
    }
});