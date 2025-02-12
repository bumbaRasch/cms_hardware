export const formatDate = (date) => {
    if (!date) return null;
    return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit'
    }).format(new Date(date));
};

export const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = parseDate(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};

export const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day + 1);
};