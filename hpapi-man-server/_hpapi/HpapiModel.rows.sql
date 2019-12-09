
-- Copyright 2018 Whitelamp http://www.whitelamp.com/

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';


-- USER GROUP

INSERT IGNORE INTO `hpapi_usergroup` (`usergroup`, `level`, `name`, `password_self_manage`, `remote_addr_pattern`, `notes`) VALUES
('manual',	100000,	'Manual',	0,	'^::1$',	'Access to read manuals.');


-- PACKAGE

INSERT IGNORE INTO `hpapi_package` (`vendor`, `package`, `requires_key`, `notes`) VALUES
('whitelamp-uk',	'hpapi-man-server',	0,	'Hpapi manual reader.');



-- LOGIC ACCESS --

INSERT IGNORE INTO `hpapi_method` (`vendor`, `package`, `class`, `method`, `label`, `notes`) VALUES
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'classes',	'Manual pages for classes',	''),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'manuals',	'Manual main pages',	''),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'methods',	'Manual pages for methods',	''),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'packages',	'Manual pages for packages',	''),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'page',	'Manual page by reference',	''),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'reflectSystemAsManual',	'Update manual for this system',	'Updates and adds pages of a given manual to reflect this system'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'vendors',	'Manual pages for vendors',	''),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'version',	'Manual page version by reference',	''),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionAdd',	'Add draft page version',	''),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionCommit',	'Commit draft page version',	'');


INSERT IGNORE INTO `hpapi_methodarg` (`vendor`, `package`, `class`, `method`, `argument`, `name`, `empty_allowed`, `pattern`) VALUES
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'classes',	1,	'Options',	0,	'object'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'classes',	2,	'Manual ID',	0,	'int-11-positive'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'classes',	3,	'Vendor',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'classes',	4,	'Package',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'classes',	5,	'Class',	1,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'manuals',	1,	'Manual ID',	1,	'int-11-positive'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'methods',	1,	'Options',	0,	'object'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'methods',	2,	'Manual ID',	0,	'int-11-positive'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'methods',	3,	'Vendor',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'methods',	4,	'Package',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'methods',	5,	'Class',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'methods',	6,	'Method',	1,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'packages',	1,	'Options',	0,	'object'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'packages',	2,	'Manual ID',	0,	'int-11-positive'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'packages',	3,	'Vendor',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'packages',	4,	'Package',	1,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'page',	1,	'Reference',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'page',	2,	'Commit ID',	1,	'int-11-positive'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'reflectSystemAsManual',	1,	'Manual ID',	0,	'int-11-positive'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'vendors',	1,	'Options',	0,	'object'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'vendors',	2,	'Manual ID',	0,	'int-11-positive'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'vendors',	3,	'Vendor',	1,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'version',	1,	'Version reference',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionAdd',	1,	'Page reference',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionCommit',	1,	'Version reference',	0,	'varchar-64'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionCommit',	2,	'Comments',	0,	'varchar-8192'),
('whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionCommit',	3,	'Label',	1,	'varchar-64');


INSERT IGNORE INTO `hpapi_run` (`usergroup`, `vendor`, `package`, `class`, `method`) VALUES
('manual',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'classes'),
('manual',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'manuals'),
('manual',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'methods'),
('manual',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'packages'),
('manual',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'page'),
('manual',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'vendors'),
('manual',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'version'),
('sysadmin',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'reflectSystemAsManual'),
('sysadmin',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionAdd'),
('sysadmin',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionCommit');



-- MODEL ACCESS --

INSERT IGNORE INTO `hpapi_spr` (`model`, `spr`, `notes`) VALUES
('HpapiModel',	'hpapiManBrowse',	'Browse manual by optional vendor, package, class, method'),
('HpapiModel',	'hpapiManManuals',	'List manuals, manual ID optional'),
('HpapiModel',	'hpapiManPage',	'Get page for a given page reference'),
('HpapiModel',	'hpapiManPageInsertIgnore',	'Insert manual page'),
('HpapiModel',	'hpapiManVersion',	'Get page version for a given version reference'),
('HpapiModel',	'hpapiManVersionInsert',	'Insert a page draft version'),
('HpapiModel',	'hpapiManVersionCommit',	'Add page version to version control');



INSERT IGNORE INTO `hpapi_sprarg` (`model`, `spr`, `argument`, `name`, `empty_allowed`, `pattern`) VALUES
('HpapiModel',	'hpapiManBrowse',	1,	'Offset',	0,	'int-11-positive'),
('HpapiModel',	'hpapiManBrowse',	2,	'Limit',	0,	'int-11-positive'),
('HpapiModel',	'hpapiManBrowse',	3,	'API only',	0,	'int-1-positive'),
('HpapiModel',	'hpapiManBrowse',	4,	'Include deleted',	0,	'int-1-positive'),
('HpapiModel',	'hpapiManBrowse',	5,	'Include drafts',	0,	'int-1-positive'),
('HpapiModel',	'hpapiManBrowse',	6,	'Commit ID',	1,	'int-11-positive'),
('HpapiModel',	'hpapiManBrowse',	7,	'Manual ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiManBrowse',	8,	'Vendor',	1,	'varchar-64'),
('HpapiModel',	'hpapiManBrowse',	9,	'Package',	1,	'varchar-64'),
('HpapiModel',	'hpapiManBrowse',	10,	'Class',	1,	'varchar-64'),
('HpapiModel',	'hpapiManBrowse',	11,	'Method',	1,	'varchar-64'),
('HpapiModel',	'hpapiManManuals',	1,	'Manual ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiManPage',	1,	'Page reference',	0,	'varchar-64'),
('HpapiModel',	'hpapiManPage',	2,	'Commit ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiManPageInsertIgnore',	1,	'Manual ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiManPageInsertIgnore',	2,	'Vendor',	1,	'varchar-64'),
('HpapiModel',	'hpapiManPageInsertIgnore',	3,	'Package',	1,	'varchar-64'),
('HpapiModel',	'hpapiManPageInsertIgnore',	4,	'Class',	1,	'varchar-64'),
('HpapiModel',	'hpapiManPageInsertIgnore',	5,	'Method',	1,	'varchar-64'),
('HpapiModel',	'hpapiManPageInsertIgnore',	6,	'Overrides base class',	0,	'int-1-positive'),
('HpapiModel',	'hpapiManPageInsertIgnore',	7,	'User groups',	1,	'varchar-4096'),
('HpapiModel',	'hpapiManVersion',	1,	'Version reference',	0,	'varchar-64'),
('HpapiModel',	'hpapiManVersionInsert',	1,	'Manual ID',	0,	'int-11-positive'),
('HpapiModel',	'hpapiManVersionInsert',	2,	'Vendor',	0,	'varchar-64'),
('HpapiModel',	'hpapiManVersionInsert',	3,	'Package',	0,	'varchar-64'),
('HpapiModel',	'hpapiManVersionInsert',	4,	'Class',	0,	'varchar-64'),
('HpapiModel',	'hpapiManVersionInsert',	5,	'Method',	0,	'varchar-64'),
('HpapiModel',	'hpapiManVersionInsert',	6,	'Markdown',	0,	'varchar-8192'),
('HpapiModel',	'hpapiManVersionCommit',	1,	'Version reference',	0,	'varchar-64'),
('HpapiModel',	'hpapiManVersionCommit',	2,	'Comments',	0,	'varchar-8192'),
('HpapiModel',	'hpapiManVersionCommit',	3,	'Label',	0,	'varchar-64');


INSERT IGNORE INTO `hpapi_call` (`model`, `spr`, `vendor`, `package`, `class`, `method`) VALUES
('HpapiModel',	'hpapiManBrowse',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'classes'),
('HpapiModel',	'hpapiManManuals',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'manuals'),
('HpapiModel',	'hpapiManBrowse',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'methods'),
('HpapiModel',	'hpapiManBrowse',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'packages'),
('HpapiModel',	'hpapiManPage',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'page'),
('HpapiModel',	'hpapiManPageInsertIgnore',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'reflectSystemAsManual'),
('HpapiModel',	'hpapiManBrowse',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'vendors'),
('HpapiModel',	'hpapiManVersion',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'version'),
('HpapiModel',	'hpapiManVersionInsert',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionAdd'),
('HpapiModel',	'hpapiManVersionCommit',	'whitelamp-uk',	'hpapi-man-server',	'\\Hpapi\\Man',	'versionCommit');


