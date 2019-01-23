
-- Copyright 2018 Whitelamp http://www.whitelamp.com/

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

INSERT IGNORE INTO `hpapi_call` (`model`, `spr`, `vendor`, `package`, `class`, `method`) VALUES
('HpapiModel',	'hpapiMyMethods',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'methods'),
('HpapiModel',	'hpapiMyUsergroups',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'usergroups'),
('HpapiModel',	'hpapiUUID',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'uuid');

INSERT IGNORE INTO `hpapi_method` (`vendor`, `package`, `class`, `method`, `label`, `notes`) VALUES
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	'Method description',	'Method, argument and validation details'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'myMethods',	'My methods',	'Methods available to the current user.'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'myUsergroups',	'My user groups',	'User groups for the current user.'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'usergroups',	'User groups',	'Details of all user groups.'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'uuid',	'Get UUID',	'Hpapi default UUID generating method.');

INSERT IGNORE INTO `hpapi_methodarg` (`vendor`, `package`, `class`, `method`, `argument`, `name`, `empty_allowed`, `pattern`) VALUES
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	1,	'Vendor',	0,	'vendor'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	2,	'Package',	0,	'package'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	3,	'Class',	0,	'class'),
('whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod',	4,	'Method',	0,	'method');

INSERT IGNORE INTO `hpapi_run` (`usergroup`, `vendor`, `package`, `class`, `method`) VALUES
('admin',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'usergroups'),
('anon',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'describeMethod'),
('anon',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'myMethods'),
('anon',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'myUsergroups'),
('anon',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'uuid'),
('sysadmin',	'whitelamp-uk',	'hpapi-utility',	'\\Hpapi\\Utility',	'usergroups');

INSERT IGNORE INTO `hpapi_spr` (`model`, `spr`, `notes`) VALUES
('HpapiModel',	'hpapiMyMethods',	'List of methods for a user UUID (authenticated or not).'),
('HpapiModel',	'hpapiMyUsergroups',	'Usergroups for a user UUID.'),
('HpapiModel',	'hpapiUUID',	'Return UUID');

INSERT IGNORE INTO `hpapi_sprarg` (`model`, `spr`, `argument`, `name`, `empty_allowed`, `pattern`) VALUES
('HpapiModel',	'hpapiMyMethods',	1,	'User ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiMyMethods',	2,	'Fully authenticated?',	0,	'db-boolean'),
('HpapiModel',	'hpapiMyUsergroups',	1,	'User ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiMyUsergroups',	2,	'Fully authenticated?',	0,	'db-boolean');


