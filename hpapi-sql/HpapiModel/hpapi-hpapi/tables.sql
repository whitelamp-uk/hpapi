
-- Copyright 2018 Whitelamp http://www.whitelamp.com/

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;


CREATE TABLE IF NOT EXISTS `_readme` (
  `project` char(64),
  `location` varchar(255) NOT NULL,
  PRIMARY KEY (`project`)
) ENGINE=InnoDB DEFAULT CHARSET=ascii;

CREATE TABLE IF NOT EXISTS `hpapi_call` (
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `spr` varchar(64) CHARACTER SET ascii NOT NULL,
  `vendor` varchar(64) CHARACTER SET ascii NOT NULL,
  `package` varchar(64) CHARACTER SET ascii NOT NULL,
  `class` varchar(64) CHARACTER SET ascii NOT NULL,
  `method` varchar(64) CHARACTER SET ascii NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`model`,`spr`,`vendor`,`package`,`class`,`method`),
  KEY `call_vendor` (`vendor`,`package`,`class`,`method`),
  CONSTRAINT `hpapi_call_ibfk_2` FOREIGN KEY (`model`, `spr`) REFERENCES `hpapi_spr` (`model`, `spr`),
  CONSTRAINT `hpapi_call_ibfk_4` FOREIGN KEY (`vendor`, `package`, `class`, `method`) REFERENCES `hpapi_method` (`vendor`, `package`, `class`, `method`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Permits method to call a stored procedure';


CREATE TABLE IF NOT EXISTS `hpapi_column` (
  `table` varchar(64) CHARACTER SET ascii NOT NULL,
  `column` varchar(64) CHARACTER SET ascii NOT NULL,
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `pattern` varchar(64) CHARACTER SET ascii NOT NULL,
  `empty_allowed` int(1) unsigned NOT NULL,
  `empty_is_null` int(1) unsigned NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`table`,`column`),
  KEY `model` (`model`),
  KEY `pattern` (`pattern`),
  CONSTRAINT `hpapi_column_ibfk_1` FOREIGN KEY (`model`) REFERENCES `hpapi_model` (`model`),
  CONSTRAINT `hpapi_column_ibfk_2` FOREIGN KEY (`pattern`) REFERENCES `hpapi_pattern` (`pattern`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `hpapi_insert` (
  `usergroup` varchar(64) CHARACTER SET ascii NOT NULL,
  `table` varchar(64) CHARACTER SET ascii NOT NULL,
  `column` varchar(64) CHARACTER SET ascii NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usergroup`,`table`,`column`),
  KEY `table` (`table`,`column`),
  CONSTRAINT `hpapi_insert_ibfk_1` FOREIGN KEY (`usergroup`) REFERENCES `hpapi_usergroup` (`usergroup`),
  CONSTRAINT `hpapi_insert_ibfk_2` FOREIGN KEY (`table`, `column`) REFERENCES `hpapi_column` (`table`, `column`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `hpapi_level` (
  `level` int(11) unsigned NOT NULL,
  `name` varchar(64) NOT NULL,
  `notes` text NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Security levels for user groups';


CREATE TABLE IF NOT EXISTS `hpapi_log` (
  `datetime` datetime NOT NULL,
  `microtime` decimal(9,8) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `key` varchar(64) CHARACTER SET ascii NOT NULL,
  `email` varchar(254) CHARACTER SET ascii NOT NULL,
  `remote_addr` varbinary(16) NOT NULL,
  `user_agent` varchar(255) CHARACTER SET ascii DEFAULT NULL,
  `vendor` varchar(64) CHARACTER SET ascii NOT NULL,
  `package` varchar(64) CHARACTER SET ascii NOT NULL,
  `class` varchar(64) CHARACTER SET ascii NOT NULL,
  `method` varchar(64) CHARACTER SET ascii NOT NULL,
  `status` varchar(64) CHARACTER SET ascii NOT NULL,
  `error` varchar(64) NOT NULL,
  `diagnostic` text NOT NULL,
  PRIMARY KEY (`datetime`,`microtime`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Logs each request';


CREATE TABLE IF NOT EXISTS `hpapi_membership` (
  `user_id` int(11) unsigned NOT NULL,
  `usergroup` varchar(64) CHARACTER SET ascii NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`usergroup`),
  KEY `membership_usergroup` (`usergroup`),
  CONSTRAINT `hpapi_membership_ibfk_1` FOREIGN KEY (`usergroup`) REFERENCES `hpapi_usergroup` (`usergroup`),
  CONSTRAINT `hpapi_membership_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `hpapi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Associates users with user groups';


CREATE TABLE IF NOT EXISTS `hpapi_method` (
  `vendor` varchar(64) CHARACTER SET ascii NOT NULL,
  `package` varchar(64) CHARACTER SET ascii NOT NULL,
  `class` varchar(64) CHARACTER SET ascii NOT NULL,
  `method` varchar(64) CHARACTER SET ascii NOT NULL,
  `label` varchar(64) NOT NULL,
  `notes` text NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vendor`,`package`,`class`,`method`),
  CONSTRAINT `hpapi_method_ibfk_1` FOREIGN KEY (`vendor`, `package`) REFERENCES `hpapi_package` (`vendor`, `package`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Program methods available to the API';


CREATE TABLE IF NOT EXISTS `hpapi_methodarg` (
  `vendor` varchar(64) CHARACTER SET ascii NOT NULL,
  `package` varchar(64) CHARACTER SET ascii NOT NULL,
  `class` varchar(64) CHARACTER SET ascii NOT NULL,
  `method` varchar(64) CHARACTER SET ascii NOT NULL,
  `argument` int(4) unsigned NOT NULL DEFAULT '1',
  `name` varchar(64) NOT NULL,
  `empty_allowed` int(1) unsigned NOT NULL DEFAULT '0',
  `pattern` varchar(64) CHARACTER SET ascii NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vendor`,`package`,`class`,`method`,`argument`),
  KEY `methodarg_pattern` (`pattern`),
  CONSTRAINT `hpapi_methodarg_ibfk_1` FOREIGN KEY (`pattern`) REFERENCES `hpapi_pattern` (`pattern`),
  CONSTRAINT `hpapi_methodarg_ibfk_4` FOREIGN KEY (`vendor`, `package`, `class`, `method`) REFERENCES `hpapi_method` (`vendor`, `package`, `class`, `method`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Arguments to program methods';


CREATE TABLE IF NOT EXISTS `hpapi_model` (
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `notes` text NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Scoping of data structures known as models';


CREATE TABLE IF NOT EXISTS `hpapi_package` (
  `vendor` varchar(64) CHARACTER SET ascii NOT NULL,
  `package` varchar(64) CHARACTER SET ascii NOT NULL,
  `requires_key` int(1) UNSIGNED,
  `remote_addr_pattern` varchar(255) CHARACTER SET ascii NOT NULL DEFAULT '^.*$',
  `notes` text NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vendor`,`package`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Program vendor/packages available to the API';


CREATE TABLE IF NOT EXISTS `hpapi_pattern` (
  `pattern` varchar(64) CHARACTER SET ascii NOT NULL,
  `constraints` varchar(255) NOT NULL,
  `expression` varchar(255) NOT NULL,
  `input` varchar(64) CHARACTER SET ascii NOT NULL DEFAULT 'text',
  `php_filter` varchar(64) CHARACTER SET ascii NOT NULL,
  `length_minimum` int(11) unsigned NOT NULL DEFAULT '0',
  `length_maximum` int(11) unsigned NOT NULL DEFAULT '0',
  `value_minimum` varchar(255) NOT NULL,
  `value_maximum` varchar(255) NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`pattern`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Patterns for constraining input values';


CREATE TABLE IF NOT EXISTS `hpapi_run` (
  `usergroup` varchar(64) CHARACTER SET ascii NOT NULL,
  `vendor` varchar(64) CHARACTER SET ascii NOT NULL,
  `package` varchar(64) CHARACTER SET ascii NOT NULL,
  `class` varchar(64) CHARACTER SET ascii NOT NULL,
  `method` varchar(64) CHARACTER SET ascii NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vendor`,`package`,`class`,`method`,`usergroup`),
  KEY `run_usergroup` (`usergroup`),
  CONSTRAINT `hpapi_run_ibfk_1` FOREIGN KEY (`usergroup`) REFERENCES `hpapi_usergroup` (`usergroup`),
  CONSTRAINT `hpapi_run_ibfk_3` FOREIGN KEY (`vendor`, `package`, `class`, `method`) REFERENCES `hpapi_method` (`vendor`, `package`, `class`, `method`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Permits a user group to run a program method';


CREATE TABLE IF NOT EXISTS `hpapi_spr` (
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `spr` varchar(64) CHARACTER SET ascii NOT NULL,
  `notes` text NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`model`,`spr`),
  CONSTRAINT `hpapi_spr_ibfk_1` FOREIGN KEY (`model`) REFERENCES `hpapi_model` (`model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stored procedures accessed by the API';


CREATE TABLE IF NOT EXISTS `hpapi_sprarg` (
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `spr` varchar(64) CHARACTER SET ascii NOT NULL,
  `argument` int(1) unsigned NOT NULL DEFAULT '1',
  `name` varchar(64) NOT NULL,
  `empty_allowed` int(1) unsigned NOT NULL DEFAULT '0',
  `pattern` varchar(255) CHARACTER SET ascii NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`model`,`spr`,`argument`),
  KEY `sprarg_pattern` (`pattern`),
  CONSTRAINT `hpapi_sprarg_ibfk_2` FOREIGN KEY (`pattern`) REFERENCES `hpapi_pattern` (`pattern`),
  CONSTRAINT `hpapi_sprarg_ibfk_3` FOREIGN KEY (`model`, `spr`) REFERENCES `hpapi_spr` (`model`, `spr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='SQL stored procedure argument constraints';


CREATE TABLE IF NOT EXISTS `hpapi_update` (
  `usergroup` varchar(64) CHARACTER SET ascii NOT NULL,
  `table` varchar(64) CHARACTER SET ascii NOT NULL,
  `column` varchar(64) CHARACTER SET ascii NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usergroup`,`table`,`column`),
  KEY `table` (`table`,`column`),
  CONSTRAINT `hpapi_update_ibfk_1` FOREIGN KEY (`usergroup`) REFERENCES `hpapi_usergroup` (`usergroup`),
  CONSTRAINT `hpapi_update_ibfk_2` FOREIGN KEY (`table`, `column`) REFERENCES `hpapi_column` (`table`, `column`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `hpapi_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `active` int(1) unsigned NOT NULL DEFAULT '1',
  `verified` int(1) unsigned NOT NULL DEFAULT '0',
  `uuid` binary(16) DEFAULT NULL,
  `key` varchar(64) CHARACTER SET ascii DEFAULT NULL,
  `key_expired` int(1) unsigned NOT NULL DEFAULT '0',
  `key_release` int(1) unsigned NOT NULL DEFAULT '0',
  `key_release_until` datetime DEFAULT NULL,
  `remote_addr_pattern` varchar(255) NOT NULL DEFAULT '^.*$',
  `name` varchar(64) NOT NULL,
  `notes` text,
  `email` varchar(254) CHARACTER SET ascii NOT NULL,
  `password_hash` varchar(255) CHARACTER SET ascii DEFAULT NULL,
  `password_expires` datetime DEFAULT NULL,
  `password_self_manage_until` datetime DEFAULT NULL,
  `token` varchar(255) CHARACTER SET ascii DEFAULT NULL,
  `token_expires` datetime DEFAULT NULL,
  `token_remote_addr` varbinary(16) DEFAULT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `user_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='API users';


CREATE TABLE IF NOT EXISTS `hpapi_usergroup` (
  `usergroup` varchar(64) CHARACTER SET ascii NOT NULL,
  `level` int(11) unsigned NOT NULL,
  `name` varchar(64) NOT NULL,
  `password_self_manage` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `password_score_minimum` tinyint(3) unsigned NOT NULL DEFAULT 50,
  `token_duration_minutes` int(11) unsigned NOT NULL DEFAULT 60,
  `remote_addr_pattern` varchar(255) CHARACTER SET ascii NOT NULL DEFAULT '^.*$',
  `notes` text NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usergroup`),
  KEY `usergroup_level` (`level`),
  CONSTRAINT `hpapi_usergroup_ibfk_1` FOREIGN KEY (`level`) REFERENCES `hpapi_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='API user groups';

