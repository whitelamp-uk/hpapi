
-- Copyright 2018 Whitelamp http://www.whitelamp.com/

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;


CREATE TABLE IF NOT EXISTS `hpapi_man` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(64) CHARACTER SET ascii NOT NULL,
  `title` varchar(255) NOT NULL,
  `tagline` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference` (`reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Method dictionary';


CREATE TABLE IF NOT EXISTS `hpapi_mancommit` (
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `manual_id` int(11) unsigned NOT NULL,
  `vendor` varchar(64) CHARACTER SET ascii NOT NULL,
  `package` varchar(64) CHARACTER SET ascii NOT NULL,
  `class` varchar(64) CHARACTER SET ascii NOT NULL,
  `method` varchar(64) CHARACTER SET ascii NOT NULL,
  `head_id` int(11) unsigned NOT NULL,
  `reference` varchar(64) CHARACTER SET ascii DEFAULT NULL,
  `markdown` text,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`manual_id`,`vendor`,`package`,`class`,`method`,`head_id`),
  UNIQUE KEY `head_id` (`head_id`),
  UNIQUE KEY `reference` (`reference`),
  CONSTRAINT `hpapi_mancommit_ibfk_1` FOREIGN KEY (`manual_id`, `vendor`, `package`, `class`, `method`) REFERENCES `hpapi_manpage` (`manual_id`, `vendor`, `package`, `class`, `method`),
  CONSTRAINT `hpapi_mancommit_ibfk_2` FOREIGN KEY (`head_id`) REFERENCES `hpapi_manhead` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Method dictionary';


CREATE TABLE IF NOT EXISTS `hpapi_manhead` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(64) CHARACTER SET ascii DEFAULT NULL,
  `markdown` text,
  `manual_id` int(11) unsigned NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `manual_id_created` (`manual_id`,`created`),
  CONSTRAINT `hpapi_manhead_ibfk_1` FOREIGN KEY (`manual_id`) REFERENCES `hpapi_man` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `hpapi_manpage` (
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `manual_id` int(11) unsigned NOT NULL,
  `vendor` varchar(64) CHARACTER SET ascii NOT NULL,
  `package` varchar(64) CHARACTER SET ascii NOT NULL,
  `class` varchar(64) CHARACTER SET ascii NOT NULL,
  `method` varchar(64) CHARACTER SET ascii NOT NULL,
  `reference` varchar(64) CHARACTER SET ascii DEFAULT NULL,
  `api_usergroups` text CHARACTER SET ascii NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`manual_id`,`vendor`,`package`,`class`,`method`),
  UNIQUE KEY `reference` (`reference`),
  CONSTRAINT `hpapi_manpage_ibfk_1` FOREIGN KEY (`manual_id`) REFERENCES `hpapi_man` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Method dictionary';



