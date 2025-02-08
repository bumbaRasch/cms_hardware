const getItemName = (row) => {
    const pathname = window.location.pathname.split('/')[1];
    if (pathname === 'hardware') return row.HA_NAME;
    if (pathname === 'sim-cards') return row.SIM_NUMBER;
    if (pathname === 'users') return row.USERNAME;
};

document.addEventListener('DOMContentLoaded', () => {
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});

document.getElementById('ask-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const question = document.getElementById('question').value;
    const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
    });
    const data = await response.json();
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');

    if (!tableHeader || !tableBody) {
        console.error('Table header or body not found');
        return;
    }

    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    if (data.result && data.result.length > 0) {
        const headers = Object.keys(data.result[0]);
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            tableHeader.appendChild(th);
        });
        data.result.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header];
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } else {
        console.log('No results found');
    }
});