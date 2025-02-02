CREATE TABLE tbl_hardware_types (
    HT_ID INT AUTO_INCREMENT PRIMARY KEY,
    HT_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the hardware type'
) COMMENT 'Table for storing hardware types';

INSERT INTO tbl_hardware_types (HT_NAME) VALUES
('Computer'),
('Printer'),
('Router'),
('Switch'),
('Laptop'),
('Server'),
('Storage Device'),
('Network Device'),
('Peripheral Device'),
('Other');

CREATE TABLE tbl_locations (
    LOC_ID INT AUTO_INCREMENT PRIMARY KEY,
    LOC_NAME VARCHAR(255) NOT NULL UNIQUE COMMENT 'Name of the location'
) COMMENT 'Table for storing locations';

INSERT INTO tbl_locations (LOC_NAME) VALUES
('Office 101'),
('Office 102'),
('Warehouse'),
('Data Center'),
('Remote Site A'),
('Remote Site B'),
('Remote Site C'),
('Remote Site D');

CREATE TABLE tbl_statuses (
    ST_ID INT AUTO_INCREMENT PRIMARY KEY,
    ST_NAME VARCHAR(50) NOT NULL UNIQUE COMMENT 'Name of the status'
) COMMENT 'Table for storing statuses';

INSERT INTO tbl_statuses (ST_NAME) VALUES
('In Use'),
('In Storage'),
('Under Maintenance'),
('Retired'),
('Disposed'),
('Lost'),
('Stolen'),
('Damaged'),
('Other');

CREATE TABLE tbl_users (
    USER_ID CHAR(36) PRIMARY KEY,
    USER_NAME VARCHAR(255) NOT NULL UNIQUE COMMENT 'Name of the user or department'
) COMMENT 'Table for storing users or departments';

INSERT INTO tbl_users (USER_ID, USER_NAME) VALUES
(UUID(), 'John Doe'),
(UUID(), 'Jane Smith'),
(UUID(), 'IT Department'),
(UUID(), 'Finance Department'),
(UUID(), 'HR Department'),
(UUID(), 'Sales Department'),
(UUID(), 'Marketing Department');

CREATE TABLE tbl_providers (
    PROVIDER_ID INT AUTO_INCREMENT PRIMARY KEY,
    PROVIDER_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the provider'
) COMMENT 'Table for storing providers';

INSERT INTO tbl_providers (PROVIDER_NAME) VALUES
('Provider A'),
('Provider B'),
('Provider C'),
('Provider D'),
('Provider E');

CREATE TABLE tbl_tariffs (
    TARIFF_ID INT AUTO_INCREMENT PRIMARY KEY,
    TARIFF_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the tariff',
    PROVIDER_ID INT NOT NULL COMMENT 'Provider ID, references tbl_providers',
    PRICE DOUBLE COMMENT 'Price of the tariff',
    FOREIGN KEY (PROVIDER_ID) REFERENCES tbl_providers(PROVIDER_ID)
) COMMENT 'Table for storing tariffs';

INSERT INTO tbl_tariffs (TARIFF_NAME, PROVIDER_ID) VALUES
('Tariff 1', 1),
('Tariff 2', 2),
('Tariff 3', 3),
('Tariff 4', 1),
('Tariff 5', 2),
('Tariff 6', 3);

CREATE TABLE tbl_sim_cards (
    SIM_ID INT AUTO_INCREMENT PRIMARY KEY,
    SIM_NUMBER VARCHAR(20) NOT NULL UNIQUE COMMENT 'SIM card number',
    PROVIDER_ID INT NOT NULL COMMENT 'Provider ID, references tbl_providers',
    TARIFF_ID INT NOT NULL COMMENT 'Tariff ID, references tbl_tariffs',
    LOC_ID INT NOT NULL COMMENT 'Location ID, references tbl_locations',
    STATUS_ID INT NOT NULL COMMENT 'Status ID, references tbl_statuses',
    PIN1 VARCHAR(10) COMMENT 'PIN1 code for the SIM card',
    PUK1 VARCHAR(10) COMMENT 'PUK1 code for the SIM card',
    PIN2 VARCHAR(10) COMMENT 'PIN2 code for the SIM card',
    PUK2 VARCHAR(10) COMMENT 'PUK2 code for the SIM card',
    ACTIVATION_DATE DATE COMMENT 'Activation date of the SIM card',
    EXPIRATION_DATE DATE COMMENT 'Expiration date of the SIM card',
    COMMENTS TEXT COMMENT 'Additional comments about the SIM card',
    FOREIGN KEY (PROVIDER_ID) REFERENCES tbl_providers(PROVIDER_ID),
    FOREIGN KEY (TARIFF_ID) REFERENCES tbl_tariffs(TARIFF_ID),
    FOREIGN KEY (LOC_ID) REFERENCES tbl_locations(LOC_ID),
    FOREIGN KEY (STATUS_ID) REFERENCES tbl_statuses(ST_ID)
) COMMENT 'Table for storing SIM cards';

INSERT INTO tbl_sim_cards (SIM_NUMBER, PROVIDER_ID, TARIFF_ID, LOC_ID, STATUS_ID, PIN1, PUK1, PIN2, PUK2, ACTIVATION_DATE, EXPIRATION_DATE, COMMENTS) VALUES
('1234567890', 1, 1, 1, 1, '1234', '5678', '4321', '8765', '2022-01-01', '2023-01-01', 'First SIM card'),
('0987654321', 2, 2, 2, 2, '4321', '1341', '1234', '4315', '2022-02-01', '2023-02-01', 'Second SIM card'),
('8381726362', 1, 1, 3, 3, '1421', '6474', '6798', '8642', '2022-01-01', '2023-01-01', 'Third SIM card'),
('0192837261', 2, 2, 1, 4, '6798', '8642', '1421', '6471', '2022-02-01', '2023-02-01', 'Fourth SIM card'),
('3847261928', 3, 3, 2, 5, '9071', '5678', '6798', '8642', '2022-03-01', '2023-03-01', 'Fifth SIM card'),
('9182736453', 1, 1, 3, 6, '4321', '4315', '1234', '5678', '2022-01-01', '2023-01-01', 'Sixth SIM card'),
('2736458192', 2, 2, 1, 7, '1421', '6471', '4321', '4315', '2022-02-01', '2023-02-01', 'Seventh SIM card'),
('6458192736', 3, 3, 2, 8, '6798', '8642', '1421', '6472', '2022-03-01', '2023-03-01', 'Eighth SIM card'),
('8192736458', 1, 1, 3, 9, '1234', '5678', '4321', '4315', '2022-01-01', '2023-01-01', 'Ninth SIM card'),
('1928374658', 2, 2, 1, 1, '4321', '4315', '1421', '6472', '2022-02-01', '2023-02-01', 'Tenth SIM card'),
('3746581928', 3, 3, 2, 2, '1421', '6472', '6798', '8642', '2022-03-01', '2023-03-01', 'Eleventh SIM card');

CREATE TABLE tbl_stores (
    STORE_ID INT AUTO_INCREMENT PRIMARY KEY,
    STORE_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the store',
    STORE_LOCATION VARCHAR(255) COMMENT 'Location of the store'
) COMMENT 'Table for storing stores';

INSERT INTO tbl_stores (STORE_NAME, STORE_LOCATION) VALUES
('Store A', 'Location A'),
('Store B', 'Location B'),
('Store C', 'Location C'),
('Store D', 'Location D'),
('Store E', 'Location E'),
('Store F', 'Location F'),
('Store G', 'Location G'),
('Store H', 'Location H'),
('Store I', 'Location I'),
('Store J', 'Location J');

CREATE TABLE tbl_suppliers (
    SUPPLIER_ID INT AUTO_INCREMENT PRIMARY KEY,
    SUPPLIER_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the supplier',
    SUPPLIER_CONTACT VARCHAR(255) COMMENT 'Contact information of the supplier'
) COMMENT 'Table for storing suppliers';

INSERT INTO tbl_suppliers (SUPPLIER_NAME, SUPPLIER_CONTACT) VALUES
('Supplier A', 'Contact A'),
('Supplier B', 'Contact B'),
('Supplier C', 'Contact C'),
('Supplier D', 'Contact D'),
('Supplier E', 'Contact E'),
('Supplier F', 'Contact F'),
('Supplier G', 'Contact G'),
('Supplier H', 'Contact H'),
('Supplier I', 'Contact I'),
('Supplier J', 'Contact J');

CREATE TABLE tbl_currencies (
    CURRENCY_ID INT AUTO_INCREMENT PRIMARY KEY,
    CURRENCY_CODE VARCHAR(10) NOT NULL UNIQUE COMMENT 'Currency code (e.g., USD, EUR)',
    CURRENCY_NAME VARCHAR(50) NOT NULL COMMENT 'Currency name (e.g., US Dollar, Euro)'
) COMMENT 'Table for storing currencies';

INSERT INTO tbl_currencies (CURRENCY_CODE, CURRENCY_NAME) VALUES
('USD', 'US Dollar'),
('EUR', 'Euro'),
('GBP', 'British Pound'),
('JPY', 'Japanese Yen'),
('CNY', 'Chinese Yuan'),
('AUD', 'Australian Dollar'),
('CAD', 'Canadian Dollar'),
('CHF', 'Swiss Franc'),
('SEK', 'Swedish Krona'),
('NZD', 'New Zealand Dollar');

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
    HA_COST DOUBLE(10, 3) COMMENT 'Cost of the hardware',
    HA_CURRENCY INT COMMENT 'Currency of the cost, references tbl_currencies',
    HA_CONDITION VARCHAR(50) COMMENT 'Condition of the hardware',
    HA_DEPLOYMENT_DATE DATE COMMENT 'Deployment date of the hardware',
    HA_RETIREMENT_DATE DATE COMMENT 'Retirement date of the hardware',
    HA_IP_ADDRESS VARCHAR(15) COMMENT 'IP address of the hardware',
    HA_MAC_ADDRESS VARCHAR(17) COMMENT 'MAC address of the hardware',
    HA_CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time of the record',
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
('Desktop', 1, 'HP', 'EliteDesk 800', 'GHI123456', '2021-05-10', '2022-05-10', 3, 1, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'IT Department'), '2021-11-01', 'Upgrade RAM', NULL, 2, 2, 1200.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2021-05-15', NULL, '192.168.1.12', '00:1A:2B:3C:4D:60'),
('Router', 3, 'Cisco', 'RV340', 'JKL789012', '2020-08-20', '2021-08-20', 4, 1, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'IT Department'), '2020-12-15', 'Firmware update', NULL, 2, 3, 500.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2020-08-25', NULL, '192.168.1.13', '00:1A:2B:3C:4D:61'),
('Switch', 4, 'Netgear', 'GS108', 'MNO345678', '2019-03-15', '2020-03-15', 1, 2, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'IT Department'), '2019-09-01', 'Replace power supply', NULL, 1, 1, 200.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2019-03-20', NULL, '192.168.1.14', '00:1A:2B:3C:4D:62'),
('Laptop', 1, 'Lenovo', 'ThinkPad X1', 'PQR567890', '2021-07-25', '2022-07-25', 2, 1, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'Jane Smith'), '2021-12-01', 'Battery replacement', NULL, 1, 2, 1800.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2021-07-30', NULL, '192.168.1.15', '00:1A:2B:3C:4D:63'),
('Printer', 2, 'Canon', 'PIXMA G6020', 'STU901234', '2020-11-10', '2021-11-10', 3, 2, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'Finance Department'), '2020-11-15', 'Replace ink', NULL, 2, 2, 250.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2020-11-15', NULL, '192.168.1.16', '00:1A:2B:3C:4D:64'),
('Desktop', 1, 'Apple', 'iMac', 'VWX345678', '2022-02-20', '2023-02-20', 4, 1, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'John Doe'), '2022-08-01', 'Upgrade SSD', NULL, 1, 1, 2500.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2022-02-25', NULL, '192.168.1.17', '00:1A:2B:3C:4D:65'),
('Router', 3, 'TP-Link', 'Archer C7', 'YZA567890', '2019-06-15', '2020-06-15', 1, 2, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'IT Department'), '2019-12-01', 'Firmware update', NULL, 1, 2, 150.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2019-06-20', NULL, '192.168.1.18', '00:1A:2B:3C:4D:66'),
('Switch', 4, 'D-Link', 'DGS-1210', 'BCD789012', '2021-09-10', '2022-09-10', 2, 1, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'IT Department'), '2021-12-15', 'Replace fan', NULL, 1, 1, 300.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2021-09-15', NULL, '192.168.1.19', '00:1A:2B:3C:4D:67'),
('Laptop', 1, 'Acer', 'Aspire 5', 'EFG123456', '2020-04-20', '2021-04-20', 3, 2, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'Jane Smith'), '2020-10-01', 'Replace keyboard', NULL, 1, 1, 700.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2020-04-25', NULL, '192.168.1.20', '00:1A:2B:3C:4D:68'),
('Printer', 2, 'Brother', 'HL-L2350DW', 'HIJ345678', '2018-12-15', '2019-12-15', 4, 2, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'Finance Department'), '2019-06-01', 'Replace toner', NULL, 2, 2, 150.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2018-12-20', NULL, '192.168.1.21', '00:1A:2B:3C:4D:69'),
('Desktop', 1, 'Asus', 'VivoPC', 'KLM567890', '2021-03-10', '2022-03-10', 1, 1, (SELECT USER_ID FROM tbl_users WHERE USER_NAME = 'John Doe'), '2021-09-01', 'Upgrade RAM', NULL, 1, 1, 900.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2021-03-15', NULL, '192.168.1.22', '00:1A:2B:3C:4D:70');