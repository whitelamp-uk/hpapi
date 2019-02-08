
SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

INSERT IGNORE INTO `hpapi_package` (`vendor`, `package`, `requires_key`, `notes`) VALUES
('whitelamp-uk',	'hpapi-dba-server',	0,	'Hpapi Dba data model administration tools.');

INSERT IGNORE INTO `hpapi_method` (`vendor`, `package`, `class`, `method`, `label`, `notes`) VALUES
('whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'describeTable',	'Get table definition object',	''),
('whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowInsert',	'Add row to a given table',	''),
('whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowsSelect',	'Select rows from a given table',	''),
('whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowUpdate',	'Add row to a given table',	'');

INSERT IGNORE INTO `hpapi_run` (`usergroup`, `vendor`, `package`, `class`, `method`) VALUES
('admin',	'whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'describeTable'),
('admin',	'whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowInsert'),
('admin',	'whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowsSelect'),
('admin',	'whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowUpdate');

INSERT IGNORE INTO `hpapi_methodarg` (`vendor`, `package`, `class`, `method`, `argument`, `name`, `empty_allowed`, `pattern`) VALUES
('whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'describeTable',	1,	'Data object',	0,	'object'),
('whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowInsert',	1,	'Data object',	0,	'object'),
('whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowsSelect',	1,	'Data object',	0,	'object'),
('whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowUpdate',	1,	'Data object',	0,	'object');

INSERT IGNORE INTO `hpapi_spr` (`model`, `spr`, `notes`) VALUES
('HpapiModel',	'hpapiDbaColumns',	'');

INSERT IGNORE INTO `hpapi_sprarg` (`model`, `spr`, `argument`, `name`, `empty_allowed`, `pattern`) VALUES
('HpapiModel',	'hpapiDbaColumns',	1,	'Model handle',	0,	'varchar-64'),
('HpapiModel',	'hpapiDbaColumns',	2,	'Database name',	0,	'varchar-64');

INSERT IGNORE INTO `hpapi_call` (`model`, `spr`, `vendor`, `package`, `class`, `method`) VALUES
('HpapiModel',	'hpapiDbaColumns',	'whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'describeTable'),
('HpapiModel',	'hpapiDbaColumns',	'whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowInsert'),
('HpapiModel',	'hpapiDbaColumns',	'whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowsSelect'),
('HpapiModel',	'hpapiDbaColumns',	'whitelamp-uk',	'hpapi-dba-server',	'\\Hpapi\\Dba',	'rowUpdate');

