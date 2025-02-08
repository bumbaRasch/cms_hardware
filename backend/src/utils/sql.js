// backend/src/utils/sql.js
export const isSafeSQL = (sqlQuery) => {
    return /^SELECT\b[\s\S]*?\bFROM\b/i.test(sqlQuery) &&
        !/(DELETE|UPDATE|INSERT|DROP|ALTER|TRUNCATE|GRANT|REVOKE|CREATE|EXEC|MERGE|REPLACE|SET|CALL|SHOW)/i.test(sqlQuery);
};

export const extractValidSQL = (aiResponse) => {
    const match = aiResponse.match(/^\s*SELECT\s+[\s\S]*?\s+FROM\s+[\s\S]*?;/i);
    return match ? match[0].replace(/\n/g, ' ').trim() : null;
};

const forbiddenColumns = ["password", "PASSWORD", "password_hash", "token", "api_key", "secret"];
export const containsForbiddenColumns = (sqlQuery) => forbiddenColumns.some(col => new RegExp(`\\b${col.toUpperCase()}\\b`, "i").test(sqlQuery));