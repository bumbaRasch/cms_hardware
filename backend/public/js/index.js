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

export function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
}