CREATE TABLE tbl_hardware_types (
    HT_ID INT AUTO_INCREMENT PRIMARY KEY,
    HT_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the hardware type'
) COMMENT 'Table for storing hardware types';

INSERT INTO tbl_hardware_types (HT_NAME) VALUES
('Computer'),
('Printer'),
('Router'),
('Switch');

CREATE TABLE tbl_locations (
    LOC_ID INT AUTO_INCREMENT PRIMARY KEY,
    LOC_NAME VARCHAR(255) NOT NULL UNIQUE COMMENT 'Name of the location'
) COMMENT 'Table for storing locations';

INSERT INTO tbl_locations (LOC_NAME) VALUES
('Office 101'),
('Office 102'),
('Warehouse'),
('Data Center');

CREATE TABLE tbl_statuses (
    ST_ID INT AUTO_INCREMENT PRIMARY KEY,
    ST_NAME VARCHAR(50) NOT NULL UNIQUE COMMENT 'Name of the status'
) COMMENT 'Table for storing statuses';

INSERT INTO tbl_statuses (ST_NAME) VALUES
('In Use'),
('In Storage'),
('Under Maintenance'),
('Retired');

CREATE TABLE tbl_users (
    USER_ID CHAR(36) PRIMARY KEY,
    USER_NAME VARCHAR(255) NOT NULL UNIQUE COMMENT 'Name of the user or department'
) COMMENT 'Table for storing users or departments';

INSERT INTO tbl_users (USER_ID, USER_NAME) VALUES
(UUID(), 'John Doe'),
(UUID(), 'Jane Smith'),
(UUID(), 'IT Department'),
(UUID(), 'Finance Department');

CREATE TABLE tbl_providers (
    PROVIDER_ID INT AUTO_INCREMENT PRIMARY KEY,
    PROVIDER_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the provider'
) COMMENT 'Table for storing providers';

INSERT INTO tbl_providers (PROVIDER_NAME) VALUES
('Provider A'),
('Provider B'),
('Provider C');

CREATE TABLE tbl_tariffs (
    TARIFF_ID INT AUTO_INCREMENT PRIMARY KEY,
    TARIFF_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the tariff',
    PROVIDER_ID INT NOT NULL COMMENT 'Provider ID, references tbl_providers',
    FOREIGN KEY (PROVIDER_ID) REFERENCES tbl_providers(PROVIDER_ID)
) COMMENT 'Table for storing tariffs';

INSERT INTO tbl_tariffs (TARIFF_NAME, PROVIDER_ID) VALUES
('Tariff 1', 1),
('Tariff 2', 2),
('Tariff 3', 3);

CREATE TABLE tbl_sim_cards (
    SIM_ID INT AUTO_INCREMENT PRIMARY KEY,
    SIM_NUMBER VARCHAR(20) NOT NULL UNIQUE COMMENT 'SIM card number',
    PROVIDER_ID INT NOT NULL COMMENT 'Provider ID, references tbl_providers',
    TARIFF_ID INT NOT NULL COMMENT 'Tariff ID, references tbl_tariffs',
    PIN VARCHAR(10) COMMENT 'PIN code for the SIM card',
    PUK VARCHAR(10) COMMENT 'PUK code for the SIM card',
    ACTIVATION_DATE DATE COMMENT 'Activation date of the SIM card',
    EXPIRATION_DATE DATE COMMENT 'Expiration date of the SIM card',
    FOREIGN KEY (PROVIDER_ID) REFERENCES tbl_providers(PROVIDER_ID),
    FOREIGN KEY (TARIFF_ID) REFERENCES tbl_tariffs(TARIFF_ID)
) COMMENT 'Table for storing SIM cards';

INSERT INTO tbl_sim_cards (SIM_NUMBER, PROVIDER_ID, TARIFF_ID, PIN, PUK, ACTIVATION_DATE, EXPIRATION_DATE) VALUES
('1234567890', 1, 1, '1234', '5678', '2022-01-01', '2023-01-01'),
('0987654321', 2, 2, '4321', '8765', '2022-02-01', '2023-02-01');

CREATE TABLE tbl_stores (
    STORE_ID INT AUTO_INCREMENT PRIMARY KEY,
    STORE_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the store',
    STORE_LOCATION VARCHAR(255) COMMENT 'Location of the store'
) COMMENT 'Table for storing stores';

INSERT INTO tbl_stores (STORE_NAME, STORE_LOCATION) VALUES
('Store A', 'Location A'),
('Store B', 'Location B');

CREATE TABLE tbl_suppliers (
    SUPPLIER_ID INT AUTO_INCREMENT PRIMARY KEY,
    SUPPLIER_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the supplier',
    SUPPLIER_CONTACT VARCHAR(255) COMMENT 'Contact information of the supplier'
) COMMENT 'Table for storing suppliers';

INSERT INTO tbl_suppliers (SUPPLIER_NAME, SUPPLIER_CONTACT) VALUES
('Supplier A', 'Contact A'),
('Supplier B', 'Contact B');

CREATE TABLE tbl_currencies (
    CURRENCY_ID INT AUTO_INCREMENT PRIMARY KEY,
    CURRENCY_CODE VARCHAR(10) NOT NULL UNIQUE COMMENT 'Currency code (e.g., USD, EUR)',
    CURRENCY_NAME VARCHAR(50) NOT NULL COMMENT 'Currency name (e.g., US Dollar, Euro)'
) COMMENT 'Table for storing currencies';

INSERT INTO tbl_currencies (CURRENCY_CODE, CURRENCY_NAME) VALUES
('USD', 'US Dollar'),
('EUR', 'Euro'),
('GBP', 'British Pound'),
('JPY', 'Japanese Yen');

CREATE TABLE tbl_hardware (
    HA_ID INT AUTO_INCREMENT PRIMARY KEY,
    HA_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the hardware',
    HA_TYPE INT NOT NULL COMMENT 'Type of the hardware, references tbl_hardware_types',
    HA_MANUFACTURER VARCHAR(255) COMMENT 'Manufacturer of the hardware',
    HA_MODEL VARCHAR(255) COMMENT 'Model of the hardware',
    HA_SERIAL_NUMBER VARCHAR(255) UNIQUE COMMENT 'Serial number of the hardware',
    HA_PURCHASE_DATE DATE COMMENT 'Purchase date of the hardware',
    HA_WARRANTY_EXPIRY_DATE DATE COMMENT 'Warranty expiry date of the hardware',
    HA_LOCATION INT NOT NULL COMMENT 'Location of the hardware, references tbl_locations',
    HA_STATUS INT NOT NULL COMMENT 'Status of the hardware, references tbl_statuses',
    HA_ASSIGNED_TO CHAR(36) COMMENT 'Assigned user or department, references tbl_users',
    HA_LAST_MAINTENANCE_DATE DATE COMMENT 'Last maintenance date of the hardware',
    HA_NOTES TEXT COMMENT 'Additional notes about the hardware',
    HA_SIM_CARD INT COMMENT 'SIM card associated with the hardware, references tbl_sim_cards',
    HA_STORE INT COMMENT 'Store where the hardware was purchased, references tbl_stores',
    HA_SUPPLIER INT COMMENT 'Supplier of the hardware, references tbl_suppliers',
    HA_COST DECIMAL(10, 2) COMMENT 'Cost of the hardware',
    HA_CURRENCY INT COMMENT 'Currency of the cost, references tbl_currencies',
    HA_CONDITION VARCHAR(50) COMMENT 'Condition of the hardware',
    HA_DEPLOYMENT_DATE DATE COMMENT 'Deployment date of the hardware',
    HA_RETIREMENT_DATE DATE COMMENT 'Retirement date of the hardware',
    HA_IP_ADDRESS VARCHAR(15) COMMENT 'IP address of the hardware',
    HA_MAC_ADDRESS VARCHAR(17) COMMENT 'MAC address of the hardware',
    FOREIGN KEY (HA_TYPE) REFERENCES tbl_hardware_types(HT_ID),
    FOREIGN KEY (HA_LOCATION) REFERENCES tbl_locations(LOC_ID),
    FOREIGN KEY (HA_STATUS) REFERENCES tbl_statuses(ST_ID),
    FOREIGN KEY (HA_ASSIGNED_TO) REFERENCES tbl_users(USER_ID),
    FOREIGN KEY (HA_SIM_CARD) REFERENCES tbl_sim_cards(SIM_ID),
    FOREIGN KEY (HA_STORE) REFERENCES tbl_stores(STORE_ID),
    FOREIGN KEY (HA_SUPPLIER) REFERENCES tbl_suppliers(SUPPLIER_ID),
    FOREIGN KEY (HA_CURRENCY) REFERENCES tbl_currencies(CURRENCY_ID)
) COMMENT 'Table for storing hardware information';

INSERT INTO tbl_hardware (HA_NAME, HA_TYPE, HA_MANUFACTURER, HA_MODEL, HA_SERIAL_NUMBER, HA_PURCHASE_DATE, HA_WARRANTY_EXPIRY_DATE, HA_LOCATION, HA_STATUS, HA_ASSIGNED_TO, HA_LAST_MAINTENANCE_DATE, HA_NOTES, HA_SIM_CARD, HA_STORE, HA_SUPPLIER, HA_COST, HA_CURRENCY, HA_CONDITION, HA_DEPLOYMENT_DATE, HA_RETIREMENT_DATE, HA_IP_ADDRESS, HA_MAC_ADDRESS) VALUES
('Laptop', 1, 'Dell', 'XPS 15', 'ABC123456', '2022-01-15', '2023-01-15', 1, 1, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'John Doe'), '2022-12-01', 'Needs battery replacement', 1, 1, 1, 1500.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2022-01-20', NULL, '192.168.1.10', '00:1A:2B:3C:4D:5E'),
('Printer', 2, 'HP', 'LaserJet Pro', 'DEF789012', '2022-02-20', '2023-02-20', 2, 2, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'Jane Smith'), '2022-11-15', 'Replace toner', 2, 2, 2, 300.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2022-02-25', NULL, '192.168.1.11', '00:1A:2B:3C:4D:5F');