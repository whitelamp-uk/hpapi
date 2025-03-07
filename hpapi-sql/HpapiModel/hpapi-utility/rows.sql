
-- Copyright 2018 Whitelamp http://www.whitelamp.com/

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';


-- LOGIC ACCESS --

INSERT IGNORE INTO `hpapi_method` (`vendor`, `package`, `class`, `method`, `label`, `notes`) VALUES
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	'Method description',	'Method, argument and validation details'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'insert',	'Insert row',	'Insert into multiple columns in a table. Enforce all primary keys but reject auto-incrementing keys. On success return last insert ID (auto-inc) or true (not auto-inc)'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'keyRelease',	'Release new key',	'Create new key, release it until an expiry time for a given user ID'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'myMethods',	'My methods',	'Methods available to the current user.'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'myUsergroups',	'My user groups',	'User groups for the current user.'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'keyRelease',	'Release new key',	'Create new key, release it until an expiry time for a given user ID'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'passwordClear',	'Clear user password',	'Set password hash to empty string for a given user.'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'ping',	'Ping the API',	'Ping the API for a return value of true'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'pong',	'Pong the API',	'Pong the API with auth status/denied for the return value you want'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'usergroups',	'User groups',	'Details of all user groups.'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'uuid',	'Get UUID',	'Hpapi default UUID generating method.');

INSERT IGNORE INTO `hpapi_methodarg` (`vendor`, `package`, `class`, `method`, `argument`, `name`, `empty_allowed`, `pattern`) VALUES
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	1,	'Vendor',	0,	'vendor'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	2,	'Package',	0,	'package'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	3,	'Class',	0,	'class'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	4,	'Method',	0,	'method'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'insert',	1,	'Table',	0,	'db-entity'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'insert',	2,	'Columns',	0,	'object'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'keyRelease',	1,	'User ID',	0,	'int-11-positive'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'passwordClear',	1,	'User ID',	0,	'int-11-positive'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'update',	1,	'Table',	0,	'db-entity'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'update',	2,	'Column',	0,	'db-entity'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'update',	3,	'Value',	1,	'varchar-8192'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'update',	4,	'Primary keys',	0,	'object');



-- MODEL ACCESS --

INSERT IGNORE INTO `hpapi_spr` (`model`, `spr`, `notes`) VALUES
('HpapiModel',	'hpapiKeyrelease',	'Change key and release until expiry time'),
('HpapiModel',	'hpapiList',	'Lists (paginated) a given table by reference and legend columns'),
('HpapiModel',	'hpapiMethodArgs',	'List of arguments for a given user and method.'),
('HpapiModel',	'hpapiMyMethods',	'List of methods for a user UUID (authenticated or not).'),
('HpapiModel',	'hpapiMyUsergroups',	'Usergroups for a given user ID.'),
('HpapiModel',	'hpapiPasswordEmpty',	'Remove password hash for a given user ID'),
('HpapiModel',	'hpapiUUIDGenerate',	'Return a new UUID v4');

INSERT IGNORE INTO `hpapi_sprarg` (`model`, `spr`, `argument`, `name`, `empty_allowed`, `pattern`) VALUES
('HpapiModel',	'hpapiKeyrelease',	1,	'User ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiKeyrelease',	2,	'Key',	0,	'varchar-64'),
('HpapiModel',	'hpapiKeyrelease',	3,	'Until timestamp',	0,	'int-11-positive'),
('HpapiModel',	'hpapiList',	1,	'Reference column',	0,	'varchar-64'),
('HpapiModel',	'hpapiList',	2,	'Legend column',	0,	'varchar-64'),
('HpapiModel',	'hpapiList',	3,	'Database name',	0,	'varchar-64'),
('HpapiModel',	'hpapiList',	4,	'Table name',	0,	'varchar-64'),
('HpapiModel',	'hpapiList',	5,	'Offset',	0,	'int-11-positive'),
('HpapiModel',	'hpapiList',	6,	'Limit',	0,	'int-11-positive'),
('HpapiModel',	'hpapiMethodArgs',	1,	'User ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiMethodArgs',	2,	'Vendor',	0,	'vendor'),
('HpapiModel',	'hpapiMethodArgs',	3,	'Package',	0,	'package'),
('HpapiModel',	'hpapiMethodArgs',	4,	'Class',	0,	'class'),
('HpapiModel',	'hpapiMethodArgs',	5,	'Method',	0,	'method'),
('HpapiModel',	'hpapiMyMethods',	1,	'User ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiMyMethods',	2,	'Fully authenticated?',	0,	'db-boolean'),
('HpapiModel',	'hpapiMyUsergroups',	1,	'User ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiMyUsergroups',	2,	'Fully authenticated?',	0,	'db-boolean'),
('HpapiModel',	'hpapiPasswordEmpty',	1,	'User ID',	0,	'int-11-positive');

INSERT IGNORE INTO `hpapi_call` (`model`, `spr`, `vendor`, `package`, `class`, `method`) VALUES
('HpapiModel',	'hpapiKeyrelease',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'keyRelease'),
('HpapiModel',	'hpapiMyMethods',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'methods'),
('HpapiModel',	'hpapiMyUsergroups',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'usergroups'),
('HpapiModel',	'hpapiPasswordEmpty',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'passwordClear'),
('HpapiModel',	'hpapiUUIDGenerate',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'keyRelease'),
('HpapiModel',	'hpapiUUIDGenerate',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'uuid');


