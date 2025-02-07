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