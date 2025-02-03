const getItemName = (row) => {
    const pathname = window.location.pathname.split('/')[1];
    if (pathname === 'hardware') return row.HA_NAME;
    if (pathname === 'sim-cards') return row.SIM_NUMBER;
    if (pathname === 'users') return row.USERNAME;
};