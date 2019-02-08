

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

CREATE TABLE IF NOT EXISTS `hpapi_dba_column` (
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `table` varchar(64) CHARACTER SET ascii NOT NULL,
  `column` varchar(64) CHARACTER SET ascii NOT NULL,
  `describes_row` int(1) UNSIGNED NOT NULL,
  `empty_allowed` int(1) UNSIGNED NOT NULL,
  `heading` varchar(64) NOT NULL,
  `hint` varchar(255) NOT NULL,
  `pattern` varchar(64) CHARACTER SET ascii NOT NULL,
  PRIMARY KEY (`model`,`table`,`column`),
  KEY `pattern` (`pattern`),
  CONSTRAINT `hpapi_dba_column_ibfk_1` FOREIGN KEY (`model`, `table`) REFERENCES `hpapi_dba_table` (`model`, `table`),
  CONSTRAINT `hpapi_dba_column_ibfk_2` FOREIGN KEY (`pattern`) REFERENCES `hpapi_pattern` (`pattern`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `hpapi_dba_insert` (
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `table` varchar(64) CHARACTER SET ascii NOT NULL,
  `usergroup` varchar(64) CHARACTER SET ascii NOT NULL,
  PRIMARY KEY (`model`,`table`,`usergroup`),
  KEY `usergroup` (`usergroup`),
  KEY `model` (`model`),
  CONSTRAINT `hpapi_dba_insert_ibfk_1` FOREIGN KEY (`model`, `table`) REFERENCES `hpapi_dba_table` (`model`, `table`),
  CONSTRAINT `hpapi_dba_insert_ibfk_2` FOREIGN KEY (`usergroup`) REFERENCES `hpapi_usergroup` (`usergroup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `hpapi_dba_select` (
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `table` varchar(64) CHARACTER SET ascii NOT NULL,
  `column` varchar(64) CHARACTER SET ascii NOT NULL,
  `usergroup` varchar(64) CHARACTER SET ascii NOT NULL,
  PRIMARY KEY (`model`,`table`,`column`,`usergroup`),
  KEY `usergroup` (`usergroup`),
  KEY `model` (`model`),
  CONSTRAINT `hpapi_dba_select_ibfk_1` FOREIGN KEY (`model`, `table`, `column`) REFERENCES `hpapi_dba_column` (`model`, `table`, `column`),
  CONSTRAINT `hpapi_dba_select_ibfk_2` FOREIGN KEY (`usergroup`) REFERENCES `hpapi_usergroup` (`usergroup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `hpapi_dba_table` (
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `table` varchar(64) CHARACTER SET ascii NOT NULL,
  `title` varchar(64) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`model`,`table`),
  CONSTRAINT `hpapi_dba_table_ibfk_1` FOREIGN KEY (`model`) REFERENCES `hpapi_model` (`model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `hpapi_dba_update` (
  `model` varchar(64) CHARACTER SET ascii NOT NULL,
  `table` varchar(64) CHARACTER SET ascii NOT NULL,
  `column` varchar(64) CHARACTER SET ascii NOT NULL,
  `usergroup` varchar(64) CHARACTER SET ascii NOT NULL,
  PRIMARY KEY (`model`,`table`,`column`,`usergroup`),
  KEY `usergroup` (`usergroup`),
  KEY `model` (`model`),
  CONSTRAINT `hpapi_dba_update_ibfk_1` FOREIGN KEY (`model`, `table`, `column`) REFERENCES `hpapi_dba_column` (`model`, `table`, `column`),
  CONSTRAINT `hpapi_dba_update_ibfk_2` FOREIGN KEY (`usergroup`) REFERENCES `hpapi_usergroup` (`usergroup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

