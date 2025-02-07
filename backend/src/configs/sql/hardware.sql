CREATE DATABASE IF NOT EXISTS cms_hardware;

USE cms_hardware;

CREATE TABLE IF NOT EXISTS tbl_locations (
    LOC_ID INT AUTO_INCREMENT PRIMARY KEY,
    LOC_NAME VARCHAR(255) NOT NULL UNIQUE COMMENT 'Name of the location',
    LOC_ADDRESS VARCHAR(255) COMMENT 'Address of the location',
    LOC_CITY VARCHAR(100) COMMENT 'City where the location is situated',
    LOC_STATE VARCHAR(100) COMMENT 'State or province of the location',
    LOC_COUNTRY VARCHAR(100) COMMENT 'Country of the location',
    LOC_POSTAL_CODE VARCHAR(20) COMMENT 'Postal code of the location',
    LOC_CONTACT_PERSON VARCHAR(100) COMMENT 'Contact person at the location',
    LOC_CONTACT_PHONE VARCHAR(20) COMMENT 'Phone number of the contact person',
    LOC_CONTACT_EMAIL VARCHAR(100) COMMENT 'Email address of the contact person',
    LOC_DESCRIPTION TEXT COMMENT 'Additional information or notes about the location'
) COMMENT 'Table for storing locations';

INSERT INTO tbl_locations (LOC_NAME, LOC_ADDRESS, LOC_CITY, LOC_STATE, LOC_COUNTRY, LOC_POSTAL_CODE, LOC_CONTACT_PERSON, LOC_CONTACT_PHONE, LOC_CONTACT_EMAIL, LOC_DESCRIPTION) VALUES
('Office 101', '101 Office St', 'Business City', 'Business State', 'Business Country', '54321', 'Jane Smith', '987-654-3210', 'janesmith@office101.com', 'Main office for administrative tasks'),
('Office 102', '102 Office St', 'Business City', 'Business State', 'Business Country', '54321', 'Alice Johnson', '555-123-4567', 'alicejohnson@office102.com', 'Secondary office for administrative tasks'),
('Warehouse', '456 Warehouse Ave', 'Storage City', 'Storage State', 'Storage Country', '98765', 'Frank Green', '666-777-8888', 'frankgreen@warehouse.com', 'Main warehouse for storing equipment'),
('Data Center', '123 Data Center Blvd', 'Tech City', 'Tech State', 'Tech Country', '12345', 'John Doe', '123-456-7890', 'johndoe@datacenter.com', 'Main data center for all operations'),
('Remote Site A', 'A Remote Rd', 'Remote City', 'Remote State', 'Remote Country', '67890', 'Bob Brown', '444-555-6666', 'bobbrown@remotesitea.com', 'Remote site for field operations'),
('Remote Site B', 'B Remote Rd', 'Remote City', 'Remote State', 'Remote Country', '67890', 'Charlie Davis', '333-444-5555', 'charliedavis@remotesiteb.com', 'Remote site for field operations'),
('Remote Site C', 'C Remote Rd', 'Remote City', 'Remote State', 'Remote Country', '67890', 'Diana Evans', '222-333-4444', 'dianaevans@remotesitec.com', 'Remote site for field operations'),
('Remote Site D', 'D Remote Rd', 'Remote City', 'Remote State', 'Remote Country', '67890', 'Evan Foster', '111-222-3333', 'evanfoster@remotesited.com', 'Remote site for field operations');


CREATE TABLE IF NOT EXISTS tbl_hardware_types (
    HT_ID INT AUTO_INCREMENT PRIMARY KEY,
    HT_NAME VARCHAR(255) NOT NULL UNIQUE COMMENT 'Name of the hardware type',
    HT_DESCRIPTION TEXT COMMENT 'Description of the hardware type',
    HT_CATEGORY VARCHAR(100) COMMENT 'Category of the hardware type',
    HT_CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the hardware type was created',
    HT_UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the hardware type was last updated'
) COMMENT 'Table for storing hardware types';

INSERT INTO tbl_hardware_types (HT_NAME, HT_DESCRIPTION, HT_CATEGORY) VALUES
('Computer', 'A general-purpose computing device', 'Computing'),
('Printer', 'A device that prints documents', 'Peripheral'),
('Router', 'A device that forwards data packets between computer networks', 'Networking'),
('Switch', 'A device that connects devices within a network', 'Networking'),
('Laptop', 'A portable personal computer', 'Computing'),
('Server', 'A computer that provides data to other computers', 'Computing'),
('Storage Device', 'A device used to store data', 'Storage'),
('Network Device', 'A device used to manage network traffic', 'Networking'),
('Peripheral Device', 'An external device that provides input and output for the computer', 'Peripheral'),
('Other', 'Any other type of hardware not listed', 'Miscellaneous');



CREATE TABLE IF NOT EXISTS tbl_statuses (
    ST_ID INT AUTO_INCREMENT PRIMARY KEY,
    ST_NAME VARCHAR(50) NOT NULL UNIQUE COMMENT 'Name of the status',
    ST_DESCRIPTION TEXT COMMENT 'Description of the status',
    ST_CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the status was created',
    ST_UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the status was last updated'
) COMMENT 'Table for storing statuses';

INSERT INTO tbl_statuses (ST_NAME, ST_DESCRIPTION) VALUES
('In Use', 'The item is currently in use'),
('In Storage', 'The item is stored and not in use'),
('Under Maintenance', 'The item is undergoing maintenance'),
('Retired', 'The item is no longer in active use but retained for records'),
('Disposed', 'The item has been disposed of'),
('Lost', 'The item is lost and cannot be located'),
('Stolen', 'The item has been stolen'),
('Damaged', 'The item is damaged and not functional'),
('Other', 'Any other status not listed');

CREATE TABLE IF NOT EXISTS tbl_roles (
    ROLE_ID INT AUTO_INCREMENT PRIMARY KEY,
    ROLE_NAME VARCHAR(255) NOT NULL UNIQUE COMMENT 'Name of the role',
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the role was created',
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the role was last updated'
) COMMENT 'Table for storing roles';

INSERT INTO tbl_roles (ROLE_NAME) VALUES
('Admin'),
('User'),
('Guest'),
('Manager'),
('Supervisor'),
('Technician'),
('Engineer'),
('Analyst'),
('Developer'),
('Designer');

CREATE TABLE IF NOT EXISTS tbl_users (
    USER_ID CHAR(36) PRIMARY KEY,
    FIRST_NAME VARCHAR(255) COMMENT 'First name of the user',
    LAST_NAME VARCHAR(255) COMMENT 'Last name of the user',
    USERNAME VARCHAR(255) NOT NULL UNIQUE COMMENT 'Username for login',
    EMAIL VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email of the user',
    PASSWORD VARCHAR(255) NOT NULL COMMENT 'Password for login',
    ROLE_ID INT NOT NULL COMMENT 'Role ID, references tbl_roles',
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the user was created',
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the user was last updated',
    DELETED_AT TIMESTAMP COMMENT 'Timestamp when the user was deleted',
    FOREIGN KEY (ROLE_ID) REFERENCES tbl_roles(ROLE_ID)
) COMMENT 'Table for storing users or departments';

INSERT INTO tbl_users (USER_ID, FIRST_NAME, LAST_NAME, USERNAME, EMAIL, PASSWORD, ROLE) VALUES
(UUID(), 'John', 'Doe', 'john.doe', 'john@gmail.com', 'password', (SELECT ROLE_ID FROM tbl_roles WHERE ROLE_NAME = 'Guest')),
(UUID(), 'Jane', 'Smith', 'jane.smith', 'jane@gmail.com','test123', (SELECT ROLE_ID FROM tbl_roles WHERE ROLE_NAME = 'Guest')),
(UUID(), 'IT Department', '', 'it.department', 'te@gmail.com', 'password', (SELECT ROLE_ID FROM tbl_roles WHERE ROLE_NAME = 'Guest')),
(UUID(), 'Finance Department', '', 'finance.department', 'f@gmail.com', 'password', (SELECT ROLE_ID FROM tbl_roles WHERE ROLE_NAME = 'Guest')),
(UUID(), 'HR Department', '', 'hr.department', 'hr@gmail.com', 'password', (SELECT ROLE_ID FROM tbl_roles WHERE ROLE_NAME = 'Guest')),
(UUID(), 'Sales Department', '', 'sales.department', 'sales@gmail.com', 'password', (SELECT ROLE_ID FROM tbl_roles WHERE ROLE_NAME = 'Guest')),
(UUID(), 'Marketing Department', '', 'marketing.department', 'marketing@gmail.com', 'password', (SELECT ROLE_ID FROM tbl_roles WHERE ROLE_NAME = 'Guest'));

CREATE TABLE IF NOT EXISTS tbl_companies (
    COMPANY_ID CHAR(36) PRIMARY KEY,
    COMPANY_NAME VARCHAR(255) NOT NULL UNIQUE COMMENT 'Name of the company',
    COMPANY_EMAIL VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email of the company',
    COMPANY_PHONE VARCHAR(20) COMMENT 'Phone number of the company',
    COMPANY_WEB VARCHAR(255) COMMENT 'Website of the company',
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the company was created',
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp when the company was last updated'
) COMMENT 'Table for storing companies';

INSERT INTO tbl_companies (COMPANY_ID, COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_WEB) VALUES
(UUID(), 'Tech Solutions', 'info@techsolutions.com', '123-456-7890', 'www.techsolutions.com'),
(UUID(), 'Innovative Systems', 'contact@innovativesystems.com', '234-567-8901', 'www.innovativesystems.com'),
(UUID(), 'Global Enterprises', 'support@globalenterprises.com', '345-678-9012', 'www.globalenterprises.com'),
(UUID(), 'NextGen Technologies', 'sales@nextgentechnologies.com', '456-789-0123', 'www.nextgentechnologies.com'),
(UUID(), 'Alpha Corp', 'info@alphacorp.com', '567-890-1234', 'www.alphacorp.com'),
(UUID(), 'Beta Innovations', 'contact@betainnovations.com', '678-901-2345', 'www.betainnovations.com'),
(UUID(), 'Gamma Solutions', 'support@gammasolutions.com', '789-012-3456', 'www.gammasolutions.com'),
(UUID(), 'Delta Enterprises', 'sales@deltaenterprises.com', '890-123-4567', 'www.deltaenterprises.com'),
(UUID(), 'Epsilon Tech', 'info@epsilontech.com', '901-234-5678', 'www.epsilontech.com'),
(UUID(), 'Zeta Systems', 'contact@zetasystems.com', '012-345-6789', 'www.zetasystems.com');

CREATE TABLE IF NOT EXISTS tbl_user_companies (
    USER_ID CHAR(36),
    COMPANY_ID CHAR(36),
    PRIMARY KEY (USER_ID, COMPANY_ID),
    FOREIGN KEY (USER_ID) REFERENCES tbl_users(USER_ID),
    FOREIGN KEY (COMPANY_ID) REFERENCES tbl_companies(COMPANY_ID)
) COMMENT 'Table for storing user-company relationships';

CREATE TABLE IF NOT EXISTS tbl_providers (
    PROVIDER_ID INT AUTO_INCREMENT PRIMARY KEY,
    PROVIDER_NAME VARCHAR(255) NOT NULL COMMENT 'Name of the provider'
) COMMENT 'Table for storing providers';

INSERT INTO tbl_providers (PROVIDER_NAME) VALUES
('Provider A'),
('Provider B'),
('Provider C'),
('Provider D'),
('Provider E');

CREATE TABLE IF NOT EXISTS tbl_tariffs (
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

CREATE TABLE IF NOT EXISTS tbl_sim_cards (
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
    SIM_CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time of the SIM card',
    SIM_UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time of the SIM card',
    SIM_DELETED_AT TIMESTAMP COMMENT 'Deletion time of the SIM card',
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

CREATE TABLE IF NOT EXISTS tbl_stores (
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

CREATE TABLE IF NOT EXISTS tbl_suppliers (
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

CREATE TABLE IF NOT EXISTS tbl_currencies (
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

CREATE TABLE IF NOT EXISTS tbl_hardware (
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
    HA_UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time of the record',
    HA_DELETED_AT TIMESTAMP COMMENT 'Deletion time of the record',
    FOREIGN KEY (HA_TYPE) REFERENCES tbl_hardware_types(HT_ID),
    FOREIGN KEY (HA_LOCATION) REFERENCES tbl_locations(LOC_ID),
    FOREIGN KEY (HA_STATUS) REFERENCES tbl_statuses(ST_ID),
    FOREIGN KEY (HA_SIM_CARD) REFERENCES tbl_sim_cards(SIM_ID),
    FOREIGN KEY (HA_STORE) REFERENCES tbl_stores(STORE_ID),
    FOREIGN KEY (HA_SUPPLIER) REFERENCES tbl_suppliers(SUPPLIER_ID),
    FOREIGN KEY (HA_CURRENCY) REFERENCES tbl_currencies(CURRENCY_ID)
) COMMENT 'Table for storing hardware information';

INSERT INTO tbl_hardware (HA_NAME, HA_TYPE, HA_MANUFACTURER, HA_MODEL, HA_SERIAL_NUMBER, HA_PURCHASE_DATE, HA_WARRANTY_EXPIRY_DATE, HA_LOCATION, HA_STATUS, HA_LAST_MAINTENANCE_DATE, HA_NOTES, HA_SIM_CARD, HA_STORE, HA_SUPPLIER, HA_COST, HA_CURRENCY, HA_CONDITION, HA_DEPLOYMENT_DATE, HA_RETIREMENT_DATE, HA_IP_ADDRESS, HA_MAC_ADDRESS) VALUES
('Desktop', 1, 'HP', 'EliteDesk 800', 'GHI123456', '2021-05-10', '2022-05-10', 3, 1, '2021-11-01', 'Upgrade RAM', NULL, 2, 2, 1200.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2021-05-15', NULL, '192.168.1.12', '00:1A:2B:3C:4D:60'),
('Router', 3, 'Cisco', 'RV340', 'JKL789012', '2020-08-20', '2021-08-20', 4, 1, '2020-12-15', 'Firmware update', NULL, 2, 3, 500.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2020-08-25', NULL, '192.168.1.13', '00:1A:2B:3C:4D:61'),
('Switch', 4, 'Netgear', 'GS108', 'MNO345678', '2019-03-15', '2020-03-15', 1, 2, '2019-09-01', 'Replace power supply', NULL, 1, 1, 200.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2019-03-20', NULL, '192.168.1.14', '00:1A:2B:3C:4D:62'),
('Laptop', 1, 'Lenovo', 'ThinkPad X1', 'PQR567890', '2021-07-25', '2022-07-25', 2, 1, '2021-12-01', 'Battery replacement', NULL, 1, 2, 1800.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2021-07-30', NULL, '192.168.1.15', '00:1A:2B:3C:4D:63'),
('Printer', 2, 'Canon', 'PIXMA G6020', 'STU901234', '2020-11-10', '2021-11-10', 3, 2, '2020-11-15', 'Replace ink', NULL, 2, 2, 250.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2020-11-15', NULL, '192.168.1.16', '00:1A:2B:3C:4D:64'),
('Desktop', 1, 'Apple', 'iMac', 'VWX345678', '2022-02-20', '2023-02-20', 4, 1, '2022-08-01', 'Upgrade SSD', NULL, 1, 1, 2500.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2022-02-25', NULL, '192.168.1.17', '00:1A:2B:3C:4D:65'),
('Router', 3, 'TP-Link', 'Archer C7', 'YZA567890', '2019-06-15', '2020-06-15', 1, 2, '2019-12-01', 'Firmware update', NULL, 1, 2, 150.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2019-06-20', NULL, '192.168.1.18', '00:1A:2B:3C:4D:66'),
('Switch', 4, 'D-Link', 'DGS-1210', 'BCD789012', '2021-09-10', '2022-09-10', 2, 1, '2021-12-15', 'Replace fan', NULL, 1, 1, 300.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2021-09-15', NULL, '192.168.1.19', '00:1A:2B:3C:4D:67'),
('Laptop', 1, 'Acer', 'Aspire 5', 'EFG123456', '2020-04-20', '2021-04-20', 3, 2, '2020-10-01', 'Replace keyboard', NULL, 1, 1, 700.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2020-04-25', NULL, '192.168.1.20', '00:1A:2B:3C:4D:68'),
('Printer', 2, 'Brother', 'HL-L2350DW', 'HIJ345678', '2018-12-15', '2019-12-15', 4, 2, '2019-06-01', 'Replace toner', NULL, 2, 2, 150.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'Used', '2018-12-20', NULL, '192.168.1.21', '00:1A:2B:3C:4D:69'),
('Desktop', 1, 'Asus', 'VivoPC', 'KLM567890', '2021-03-10', '2022-03-10', 1, 1, '2021-09-01', 'Upgrade RAM', NULL, 1, 1, 900.00, (SELECT CURRENCY_ID FROM tbl_currencies WHERE CURRENCY_CODE = 'USD'), 'New', '2021-03-15', NULL, '192.168.1.22', '00:1A:2B:3C:4D:70');