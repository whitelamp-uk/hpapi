

SET NAMES utf8;
SET time_zone = '+00:00';


DELIMITER $$


-- GENERATE PROVISIONAL MODEL SQL

DROP PROCEDURE IF EXISTS `hpapiDbaModelSql`$$
CREATE PROCEDURE `hpapiDbaModelSql`(
  IN        `modelName` VARCHAR(64) CHARSET ascii
 ,IN        `dbName` VARCHAR(64) CHARSET ascii
)
BEGIN
  SELECT
    CONCAT(
      'INSERT '
     ,'IGNORE INTO `hpapi_dba_table` SET `model`="'
     ,modelName
     ,'",`table`="'
     ,`TABLE_NAME`
     ,'",`title`="'
     ,`TABLE_NAME`
     ,'",`description`="'
     ,`TABLE_NAME`
     ,'";'
    ) AS `sql`
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA`=dbName
  GROUP BY `TABLE_NAME`
  ORDER BY `TABLE_NAME`,`ORDINAL_POSITION`
  ;
  SELECT
    CONCAT(
      'INSERT '
     ,'IGNORE INTO `hpapi_dba_column` SET `model`="'
     ,modelName
     ,'",`table`="'
     ,`TABLE_NAME`
     ,'",`column`="'
     ,`COLUMN_NAME`
     ,'",`heading`="'
     ,`COLUMN_NAME`
     ,'",`hint`="'
     ,`COLUMN_NAME`
     ,'",`pattern`="'
     ,`COLUMN_TYPE`
     ,'";'
    ) AS `sql`
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA`=dbName
  ORDER BY `TABLE_NAME`,`ORDINAL_POSITION`
  ;
END$$



-- ADMINISTRATE ACCESS TO USERGROUPS

DROP PROCEDURE IF EXISTS `hpapiDbaMembershipInsert`$$
CREATE PROCEDURE `hpapiDbaMembershipInsert`(
  IN        `userId` INT(11) UNSIGNED
 ,IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  INSERT IGNORE INTO `hpapi_membership`
  SET
    `user_id`=userId
   ,`usergroup`=usergroup
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaMembershipDelete`$$
CREATE PROCEDURE `hpapiDbaMembershipDelete`(
  IN        `userId` INT(11) UNSIGNED
 ,IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  DELETE FROM `hpapi_membership`
  WHERE `userId`=userUUID
    AND `usergroup`=usergroup
    AND `userId`>0
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaMembershipsForUser`$$
CREATE PROCEDURE `hpapiDbaMembershipsForUser`(
  IN        `userId` INT(11) UNSIGNED
)
BEGIN
  SELECT
    `hpapi_usergroup`.`usergroup` AS `usergroup`
   ,`hpapi_usergroup`.`name` AS `usergroupName`
   ,`hpapi_usergroup`.`unotes` AS `usergroupNotes`
   ,`hpapi_usergroup`.`level` AS `usergroupLevel`
   ,`hpapi_level`.`name` AS `levelName`
   ,`hpapi_level`.`notes` AS `levelNotes`
  FROM `hpapi_membership`
  LEFT JOIN `hpapi_usergroup` USING (`usergroup`)
  LEFT JOIN `hpapi_level` USING (`level`)
  WHERE `hpapi_membership`.`userId`=userId
  ORDER BY `hpapi_usergroup`.`level`
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaMembershipsForUsergroup`$$
CREATE PROCEDURE `hpapiDbaMembershipsForUsergroup`(
  IN        `usergroup` VARCHAR(64) CHARSET ascii
)
BEGIN
  SELECT
    `hpapi_user`.`id`
   ,`hpapi_user`.`active`
   ,`hpapi_user`.`key`
   ,`hpapi_user`.`name`
   ,`hpapi_user`.`notes`
   ,`hpapi_user`.`email`
  FROM `hpapi_membership`
  LEFT JOIN `hpapi_user`
         ON `hpapi_user`.`id`=`hpapi_membership`.`user_id`
  WHERE `hpapi_membership`.`usergroup`=usergroup
  ORDER BY
        `hpapi_user`.`active` DESC
       ,`hpapi_user`.`name`
  ;
END$$





-- ADMINISTRATE ACCESS TO METHODS

DROP PROCEDURE IF EXISTS `hpapiDbaRunInsert`$$
CREATE PROCEDURE `hpapiDbaRunInsert`(
  IN        `usergroup` varchar(64) CHARSET ascii
 ,IN        `vendor` varchar(64) CHARSET ascii
 ,IN        `package` varchar(64) CHARSET ascii
 ,IN        `class` varchar(64) CHARSET ascii
 ,IN        `method` varchar(64) CHARSET ascii
)
BEGIN
  INSERT IGNORE INTO `hpapi_run`
  SET
    `usergroup`=usergroup
   ,`vendor`=vendor
   ,`package`=package
   ,`class`=class
   ,`method`=method
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaRunDelete`$$
CREATE PROCEDURE `hpapiDbaRunDelete`(
  IN        `usergroup` varchar(64) CHARSET ascii
 ,IN        `vendor` varchar(64) CHARSET ascii
 ,IN        `package` varchar(64) CHARSET ascii
 ,IN        `class` varchar(64) CHARSET ascii
 ,IN        `method` varchar(64) CHARSET ascii
)
BEGIN
  DELETE FROM `hpapi_run`
  WHERE `usergroup`=usergroup
    AND `vendor`=vendor
    AND `package`=package
    AND `class`=class
    AND `method`=method
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaRunsForUsergroup`$$
CREATE PROCEDURE `hpapiDbaRunsForUsergroup`(
  IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  SELECT
    `vendor`
   ,`package`
   ,`class`
   ,`method`
   ,`usergroup`
  FROM `hpapi_run`
  WHERE `usergroup`=usergroup
  ORDER BY
    `usergroup`
   ,`vendor`
   ,`package`
   ,`class`
   ,`method`
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaRunsForMethod`$$
CREATE PROCEDURE `hpapiDbaRunsForMethod`(
  IN        `vendor` varchar(64) CHARSET ascii
 ,IN        `package` varchar(64) CHARSET ascii
 ,IN        `class` varchar(64) CHARSET ascii
 ,IN        `method` varchar(64) CHARSET ascii
)
BEGIN
  SELECT
    `vendor`
   ,`package`
   ,`class`
   ,`method`
   ,`usergroup`
  FROM `hpapi_run`
  WHERE `vendor`=vendor
    AND`package`=package
    AND `class`=class
    AND `method`=method
  ORDER BY
    `vendor`
   ,`package`
   ,`class`
   ,`method`
   ,`usergroup`
  ;
END$$





-- ADMINISTRATE ACCESS TO STORED PROCEDURES

DROP PROCEDURE IF EXISTS `hpapiDbaCallInsert`$$
CREATE PROCEDURE `hpapiDbaCallInsert`(
  IN        `model` varchar(64) CHARSET ascii
 ,IN        `spr` varchar(64) CHARSET ascii
 ,IN        `vendor` varchar(64) CHARSET ascii
 ,IN        `package` varchar(64) CHARSET ascii
 ,IN        `class` varchar(64) CHARSET ascii
 ,IN        `method` varchar(64) CHARSET ascii
)
BEGIN
  INSERT IGNORE INTO `hpapi_call`
  SET
    `model`=model
   ,`spr`=spr
   ,`vendor`=vendor
   ,`package`=package
   ,`class`=class
   ,`method`=method
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaCallDelete`$$
CREATE PROCEDURE `hpapiDbaCallDelete`(
  IN        `model` varchar(64) CHARSET ascii
 ,IN        `spr` varchar(64) CHARSET ascii
 ,IN        `vendor` varchar(64) CHARSET ascii
 ,IN        `package` varchar(64) CHARSET ascii
 ,IN        `class` varchar(64) CHARSET ascii
 ,IN        `method` varchar(64) CHARSET ascii
)
BEGIN
  DELETE FROM `hpapi_call`
  WHERE `model`=model
    AND `spr`=spr
    AND `vendor`=vendor
    AND `package`=package
    AND `class`=class
    AND `method`=method
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaCallsForSpr`$$
CREATE PROCEDURE `hpapiDbaCallsForSpr`(
  IN        `model` varchar(64) CHARSET ascii
 ,IN        `spr` varchar(64) CHARSET ascii
)
BEGIN
  SELECT
    `vendor`
   ,`package`
   ,`class`
   ,`method`
   ,`model`
   ,`spr`
  FROM `hpapi_call`
  WHERE `model`=model
    AND `spr`=spr
  ORDER BY
    `model`
   ,`spr`
   ,`vendor`
   ,`package`
   ,`class`
   ,`method`
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaCallsForMethod`$$
CREATE PROCEDURE `hpapiDbaCallsForMethod`(
  IN        `vendor` varchar(64) CHARSET ascii
 ,IN        `package` varchar(64) CHARSET ascii
 ,IN        `class` varchar(64) CHARSET ascii
 ,IN        `method` varchar(64) CHARSET ascii
)
BEGIN
  SELECT
    `vendor`
   ,`package`
   ,`class`
   ,`method`
   ,`model`
   ,`spr`
  FROM `hpapi_call`
  WHERE `call`=vendor
    AND `package`=package
    AND `class`=class
    AND `method`=method
  ORDER BY
    `vendor`
   ,`package`
   ,`class`
   ,`method`
   ,`model`
   ,`spr`
  ;
END$$





-- ADMINISTRATE INSERT PERMISSION

DROP PROCEDURE IF EXISTS `hpapiDbaInsertInsert`$$
CREATE PROCEDURE `hpapiDbaInsertInsert`(
  IN        `modelName` varchar(64) CHARSET ascii
 ,IN        `tableName` varchar(64) CHARSET ascii
 ,IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  INSERT IGNORE INTO `hpapi_dba_insert`
  SET
    `model`=modelName
   ,`table`=tableName
   ,`usergroup`=usergroup
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaInsertDelete`$$
CREATE PROCEDURE `hpapiDbaInsertDelete`(
  IN        `modelName` varchar(64) CHARSET ascii
 ,IN        `tableName` varchar(64) CHARSET ascii
 ,IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  DELETE FROM `hpapi_dba_insert`
  WHERE `model`=modelName
    AND `table`=tableName
    AND `usergroup`=usergroup
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaInsertsForUsergroup`$$
CREATE PROCEDURE `hpapiDbaInsertsForUsergroup`(
  IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  SELECT
    `model`
   ,`table`
  FROM `hpapi_dba_insert`
  WHERE `usergroup`=usergroup
  ORDER BY
    `model`
   ,`table`
  ;
END$$



-- ADMINISTRATE SELECT PERMISSION

DROP PROCEDURE IF EXISTS `hpapiDbaSelectInsert`$$
CREATE PROCEDURE `hpapiDbaSelectInsert`(
  IN        `modelName` varchar(64) CHARSET ascii
 ,IN        `tableName` varchar(64) CHARSET ascii
 ,IN        `columnName` varchar(64) CHARSET ascii
 ,IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  INSERT IGNORE INTO `hpapi_dba_select`
  SET
    `model`=modelName
   ,`table`=tableName
   ,`column`=columnName
   ,`usergroup`=usergroup
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaSelectDelete`$$
CREATE PROCEDURE `hpapiDbaSelectDelete`(
  IN        `modelName` varchar(64) CHARSET ascii
 ,IN        `tableName` varchar(64) CHARSET ascii
 ,IN        `columnName` varchar(64) CHARSET ascii
 ,IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  DELETE FROM `hpapi_dba_select`
  WHERE `model`=modelName
    AND `table`=tableName
    AND `column`=columnName
    AND `usergroup`=usergroup
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaSelectsForUsergroup`$$
CREATE PROCEDURE `hpapiDbaSelectsForUsergroup`(
  IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  SELECT
    `model`
   ,`table`
   ,`column`
  FROM `hpapi_dba_select`
  WHERE `usergroup`=usergroup
  ORDER BY
    `model`
   ,`table`
   ,`column`
  ;
END$$


-- ADMINISTRATE UPDATE PERMISSION

DROP PROCEDURE IF EXISTS `hpapiDbaUpdateInsert`$$
CREATE PROCEDURE `hpapiDbaUpdateInsert`(
  IN        `modelName` varchar(64) CHARSET ascii
 ,IN        `tableName` varchar(64) CHARSET ascii
 ,IN        `columnName` varchar(64) CHARSET ascii
 ,IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  INSERT IGNORE INTO `hpapi_dba_update`
  SET
    `model`=modelName
   ,`table`=tableName
   ,`column`=columnName
   ,`usergroup`=usergroup
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaUpdateDelete`$$
CREATE PROCEDURE `hpapiDbaUpdateDelete`(
  IN        `modelName` varchar(64) CHARSET ascii
 ,IN        `tableName` varchar(64) CHARSET ascii
 ,IN        `columnName` varchar(64) CHARSET ascii
 ,IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  DELETE FROM `hpapi_dba_update`
  WHERE `model`=modelName
    AND `table`=tableName
    AND `column`=columnName
    AND `usergroup`=usergroup
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiDbaUpdatesForUsergroup`$$
CREATE PROCEDURE `hpapiDbaUpdatesForUsergroup`(
  IN        `usergroup` varchar(64) CHARSET ascii
)
BEGIN
  SELECT
    `model`
   ,`table`
   ,`column`
  FROM `hpapi_dba_update`
  WHERE `usergroup`=usergroup
  ORDER BY
    `model`
   ,`table`
   ,`column`
  ;
END$$



-- DATA STRUCTURE

DROP PROCEDURE IF EXISTS `hpapiDbaColumnsTable`$$
CREATE PROCEDURE `hpapiDbaColumnsTable`(
  IN        `modelName` VARCHAR(64) CHARSET ascii
 ,IN        `dbName` VARCHAR(64) CHARSET ascii
 ,IN        `tableName` VARCHAR(64) CHARSET ascii
)
BEGIN
  SELECT
    `hpapi_dba_table`.`model`
   ,`hpapi_dba_table``table`
   ,`hpapi_dba_table`.`title`
   ,`hpapi_dba_table`.`description`
   ,`hpapi_dba_column`.`column`
   ,`INFORMATION_SCHEMA`.`KEY_COLUMN_USAGE`.`CONSTRAINT_NAME` IS NOT NULL AS `isPrimary`
   ,`hpapi_dba_column`.`empty_allowed` AS `emptyAllowed`
   ,`hpapi_dba_column`.`heading`
   ,`hpapi_dba_column`.`hint`
   ,`hpapi_dba_column`.`describes_row` AS `describesRow`
   ,`INFORMATION_SCHEMA`.`COLUMNS`.`IS_NULLABLE` AS `emptyIsNull`
   ,`INFORMATION_SCHEMA`.`COLUMNS`.`CHARACTER_MAXIMUM_LENGTH` AS `characterMaximumLength`
   ,`hpapi_dba_pattern`.`pattern`
   ,`hpapi_dba_pattern`.`constraints`
   ,`hpapi_dba_pattern`.`expression`
   ,`pattern_Input` AS `input`
   ,`hpapi_dba_pattern`.`php_filter` AS `phpFilter`
   ,`hpapi_dba_pattern`.`length_minimum` AS `lengthMinimum`
   ,`hpapi_dba_pattern`.`length_maximum` AS `lengthMaximum`
   ,`hpapi_dba_pattern`.`value_minimum` AS `valueMinimum`
   ,`hpapi_dba_pattern`.`value_maximum` AS `valueMaximum`
  FROM `hpapi_dba_table`
  INNER JOIN `hpapi_dba_column` USING (`model`,`table`)
  INNER JOIN `INFORMATION_SCHEMA`.`COLUMNS`
          ON `COLUMNS`.`TABLE_SCHEMA`=dbName
         AND `COLUMNS`.`TABLE_NAME`=`hpapi_dba_column`.`table`
         AND `COLUMNS`.`COLUMN_NAME`=`hpapi_dba_column`.`column`
  LEFT  JOIN `INFORMATION_SCHEMA`.`KEY_COLUMN_USAGE`
          ON `KEY_COLUMN_USAGE`.`CONSTRAINT_NAME`='PRIMARY'
         AND `KEY_COLUMN_USAGE`.`TABLE_CATALOG`=`COLUMNS`.`TABLE_CATALOG`
         AND `KEY_COLUMN_USAGE`.`TABLE_SCHEMA`=`COLUMNS`.`TABLE_SCHEMA`
         AND `KEY_COLUMN_USAGE`.`TABLE_NAME`=`COLUMNS`.`TABLE_NAME`
         AND `KEY_COLUMN_USAGE`.`COLUMN_NAME`=`COLUMNS`.`COLUMN_NAME`
  INNER JOIN `hpapi_dba_pattern` USING (`pattern`)
  WHERE `INFORMATION_SCHEMA`.`COLUMNS`.`TABLE_CATALOG`='def'
    AND `hpapi_dba_table`.`model`=modelName
    AND `hpapi_dba_table`.`table`=tableName
  GROUP BY
    `hpapi_dba_table`.`model`
   ,`hpapi_dba_table`.`table`
   ,`hpapi_dba_column`.`column`
  ORDER BY
    `hpapi_dba_table`.`model`
   ,`hpapi_dba_table`.`table`
   ,`INFORMATION_SCHEMA`.`COLUMNS`.`ORDINAL_POSITION`
  ;
END$$


DROP PROCEDURE IF EXISTS `hpapiDbaColumnsStrong`$$
CREATE PROCEDURE `hpapiDbaColumnsStrong`(
  IN        `modelName` VARCHAR(64) CHARSET ascii
 ,IN        `dbName` VARCHAR(64) CHARSET ascii
 ,IN        `tableName` VARCHAR(64) CHARSET ascii
)
BEGIN
  SELECT
    modelName AS `model`
   ,`fgn`.`REFERENCED_TABLE_SCHEMA` AS `database`
   ,`fgn`.`REFERENCED_TABLE_NAME` AS `table`
   ,`hpapi_dba_table`.`title`
   ,`fgn`.`REFERENCED_COLUMN_NAME` AS `column`
   ,`hpapi_dba_column`.`empty_allowed` AS `emptyAllowed`
   ,`hpapi_dba_column`.`heading`
   ,`hpapi_dba_column`.`column`=`pri`.`COLUMN_NAME` AS `isPrimary`
   ,`hpapi_dba_column`.`describes_row`!='0' AS `describesRow`
  FROM `INFORMATION_SCHEMA`.`KEY_COLUMN_USAGE` AS `fgn`
  INNER JOIN `hpapi_dba_table`
          ON `hpapi_dba_table`.`model`=modelName
         AND `hpapi_dba_table`.`table`=`REFERENCED_TABLE_NAME`
  LEFT  JOIN `INFORMATION_SCHEMA`.`KEY_COLUMN_USAGE` AS `pri`
          ON `pri`.`TABLE_CATALOG`=`fgn`.`TABLE_CATALOG`
         AND `pri`.`TABLE_SCHEMA`=`fgn`.`REFERENCED_TABLE_SCHEMA`
         AND `pri`.`TABLE_NAME`=`fgn`.`REFERENCED_TABLE_NAME`
  INNER JOIN `hpapi_dba_column` AS `col`
          ON `col`.`model`=modelName
         AND `col`.`table`=`REFERENCED_TABLE_NAME`
         AND `col`.`column`=`REFERENCED_COLUMN_NAME`
         AND (
             `col`.`column`=`pri`.`COLUMN_NAME`
          OR `col`.`describes_row`!='0'
         )
  WHERE `fgn`.`CONSTRAINT_NAME`='PRIMARY'
    AND `fgn`.`TABLE_CATALOG`='def'
    AND `fgn`.`TABLE_SCHEMA`=dbName
    AND `fgn`.`TABLE_NAME`=tableName
    AND `fgn`.`COLUMN_NAME`=`COLUMNS`.`COLUMN_NAME`
    AND (
        `fgn`.`REFERENCED_TABLE_SCHEMA`!=`fgn`.`TABLE_SCHEMA`
     OR `fgn`.`REFERENCED_TABLE_NAME`!=`fgn`.`TABLE_NAME`
    )
  GROUP BY `hpapi_dba_column`.`model`,`hpapi_dba_column`.`table`,`hpapi_dba_column`.`column`
  ORDER BY `hpapi_dba_column`.`model`,`hpapi_dba_column`.`table`,`fgn`.`ORDINAL_POSITION`
  ;
END$$


-- PRIVILEGES

DROP PROCEDURE IF EXISTS `hpapiDbaColumns`$$
CREATE PROCEDURE `hpapiDbaColumns`(
  IN        `modelName` VARCHAR(64) CHARSET ascii
 ,IN        `dbName` VARCHAR(64) CHARSET ascii
)
BEGIN
  SELECT
    `hpapi_dba_table`.`table`
   ,`hpapi_dba_column`.`column`
   ,`cols`.`COLUMN_KEY`='PRI' AS `isPrimary`
   ,`hpapi_dba_column`.`empty_allowed` AS `emptyAllowed`
   ,`cols`.`EXTRA` LIKE '%auto_increment%' AS `isAutoIncrement`
   ,GROUP_CONCAT(
        `hpapi_dba_insert`.`usergroup`
    SEPARATOR '::') AS `inserters`
   ,GROUP_CONCAT(
        `hpapi_dba_select`.`usergroup`
    SEPARATOR '::') AS `selectors`
   ,GROUP_CONCAT(
        `hpapi_dba_update`.`usergroup`
    SEPARATOR '::') AS `updaters`
   ,GROUP_CONCAT(
        CONCAT(`keys`.`CONSTRAINT_NAME`,'.',`keys`.`REFERENCED_TABLE_NAME`,'.',`keys`.`REFERENCED_COLUMN_NAME`)
    SEPARATOR '::') AS `relations`
   ,`hpapi_dba_table`.`title`
   ,`hpapi_dba_table`.`description`
   ,`hpapi_dba_column`.`heading`
   ,`hpapi_dba_column`.`hint`
   ,`hpapi_pattern`.`pattern`
   ,`hpapi_pattern`.`constraints`
   ,`hpapi_pattern`.`expression`
   ,`hpapi_pattern`.`php_filter` AS `phpFilter`
   ,`hpapi_pattern`.`length_minimum` AS `lengthMinimum`
   ,`hpapi_pattern`.`length_maximum` AS `lengthMaximum`
   ,`hpapi_pattern`.`value_minimum` AS `valueMinimum`
   ,`hpapi_pattern`.`value_maximum` AS `valueMaximum`
  FROM `hpapi_dba_table`
  LEFT JOIN `hpapi_dba_insert` USING (`model`,`table`)
  LEFT JOIN `hpapi_dba_column` USING (`model`,`table`)
  LEFT JOIN `hpapi_dba_select` USING (`model`,`table`,`column`,`usergroup`)
  LEFT JOIN `hpapi_dba_update` USING (`model`,`table`,`column`,`usergroup`)
  LEFT JOIN `hpapi_pattern` USING (`pattern`)
  LEFT JOIN `INFORMATION_SCHEMA`.`COLUMNS` AS `cols`
          ON `cols`.`TABLE_CATALOG`='def'
         AND `cols`.`TABLE_SCHEMA`=dbName
         AND `cols`.`TABLE_NAME`=`hpapi_dba_column`.`table`
         AND `cols`.`COLUMN_NAME`=`hpapi_dba_column`.`column`
  LEFT  JOIN `INFORMATION_SCHEMA`.`KEY_COLUMN_USAGE` AS `keys`
          ON `keys`.`TABLE_CATALOG`=`cols`.`TABLE_CATALOG`
         AND `keys`.`TABLE_SCHEMA`=`cols`.`TABLE_SCHEMA`
         AND `keys`.`TABLE_NAME`=`cols`.`TABLE_NAME`
         AND `keys`.`COLUMN_NAME`=`cols`.`COLUMN_NAME`
  WHERE `hpapi_dba_table`.`model`=modelName
  GROUP BY
      `hpapi_dba_table`.`table`
     ,`hpapi_dba_column`.`column`
  ORDER BY
      `hpapi_dba_table`.`table`
     ,`cols`.`ORDINAL_POSITION`
  ;
END$$



DELIMITER ;

