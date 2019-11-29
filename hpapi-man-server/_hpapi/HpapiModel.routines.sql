
-- Copyright 2018 Whitelamp http://www.whitelamp.com/

SET NAMES utf8;
SET time_zone = '+00:00';


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiManBrowse`$$
CREATE PROCEDURE `hpapiManBrowse`(
  IN        `mid` INT(11) UNSIGNED
 ,IN        `v` VARCHAR(64) CHARSET ascii
 ,IN        `p` VARCHAR(64) CHARSET ascii
 ,IN        `c` VARCHAR(64) CHARSET ascii
 ,IN        `m` VARCHAR(64) CHARSET ascii
 ,IN        `lim` INT(11) unsigned
 ,IN        `apiOnly` TINYINT(1) unsigned
 ,IN        `includeDeleted` TINYINT(1) unsigned
 ,IN        `includeDrafts` TINYINT(1) unsigned
 ,IN        `headId` INT(11) UNSIGNED
)
BEGIN
  SELECT
    `p`.`deleted` AS `methodGone`
   ,`p`.`manual_id` AS `manualId`
   ,`p`.`vendor`
   ,`p`.`package`
   ,`p`.`class`
   ,`p`.`method`
   ,`p`.`api_usergroups` AS `apiUsergroups`
   ,`p`.`created`
   ,`p`.`updated`
   ,`c2`.`markdown`
  FROM `hpapi_manpage` AS `p`
  LEFT JOIN (
    SELECT
      `manual_id`
     ,`vendor`
     ,`package`
     ,`class`
     ,`method`
     ,MAX(`head_id`) AS `head_id`
    FROM `hpapi_mancommit`
    WHERE headId IS NULL
       OR `head_id`<=headId
    GROUP BY `manual_id`,`vendor`,`package`,`class`,`method`
  ) AS `c1`
    USING (`manual_id`,`vendor`,`package`,`class`,`method`)
  LEFT JOIN `hpapi_mancommit` AS `c2`
    USING (`manual_id`,`vendor`,`package`,`class`,`method`,`head_id`)
  WHERE `manual_id`=mid
    AND ( `p`.`deleted` =0  OR includeDeleted>0 )
    AND ( `p`.`vendor`  =v  OR (v IS NULL AND `p`.`vendor`  !='') )
    AND ( `p`.`package` =p  OR (p IS NULL AND `p`.`package` !='') )
    AND ( `p`.`class`   =c  OR (c IS NULL AND `p`.`class`   !='') )
    AND ( `p`.`method`  =m  OR (m IS NULL AND `p`.`method`  !='') )
    AND ( LENGTH(`p`.`api_usergroups`)>0 OR apiOnly=0 )
    AND ( `c`.`head_id` IS NOT NULL OR includeDrafts>0 )
  GROUP BY `vendor`,`package`,`class`,`method`
  ORDER BY `vendor`,`package`,`class`,`method`
  LIMIT 0,lim
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiManManuals`$$
CREATE PROCEDURE `hpapiManManuals`(
  IN        `mid` INT(11) UNSIGNED
)
BEGIN
  SELECT
    *
  FROM `hpapi_man`
  WHERE mid IS NULL
     OR `manual_id`=mid
  ORDER BY `id`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiManPage`$$
CREATE PROCEDURE `hpapiManPage`(
  IN        `pageRef` VARCHAR(64) CHARSET ascii
 ,IN        `headId` INT(11) UNSIGNED
)
BEGIN
  SELECT
    `p`.`deleted` AS `methodGone`
   ,`p`.`manual_id` AS `manualId`
   ,`p`.`vendor`
   ,`p`.`package`
   ,`p`.`class`
   ,`p`.`method`
   ,`p`.`api_usergroups` AS `apiUsergroups`
   ,`p`.`created`
   ,`p`.`updated`
   ,`c`.`markdown`
  FROM `hpapi_manpage` AS `p`
  LEFT JOIN `hpapi_mancommit` AS `c`
    USING (`manual_id`,`vendor`,`package`,`class`,`method`)
  WHERE `p`.`reference`=pageRef
    AND ( headId IS NULL OR `c`.`head_id`<=headId )
  ORDER BY `c`.`head_id` DESC
  LIMIT 0,1
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiManPageInsertIgnore`$$
CREATE PROCEDURE `hpapiManPageInsertIgnore`(
  IN        `mid` INT(11) UNSIGNED
 ,IN        `v` VARCHAR(64) CHARSET ascii
 ,IN        `p` VARCHAR(64) CHARSET ascii
 ,IN        `c` VARCHAR(64) CHARSET ascii
 ,IN        `m` VARCHAR(64) CHARSET ascii
 ,IN        `apiUsers` TEXT CHARSET ascii
)
BEGIN
  SET @ref = UUID();
  INSERT IGNORE INTO `hpapi_manpage`
    SET
     ,`manual_id`=mid
     ,`vendor`=v
     ,`package`=p
     ,`class`=c
     ,`method`=m
     ,`reference`=@ref
     ,`api_users`=apiUsers
  ;
  UPDATE `hpapi_manpage`
    SET
      `deleted`=0
  WHERE `manual_id`=mid
    AND `vendor`=v
    AND `package`=p
    AND `class`=c
    AND `method`=m
  ;
  IF ROW_COUNT()>0 THEN 
    INSERT INTO `hpapi_mancommit`
      SET
        `manual_id`=mid
       ,`vendor`=v
       ,`package`=p
       ,`class`=c
       ,`method`=m
       ,`reference`=UUID()
  ;
  END IF;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiManPagesReset`$$
CREATE PROCEDURE `hpapiManPagesReset`(
  IN        `mid` INT(11) UNSIGNED
)
BEGIN
  UPDATE `hpapi_manpage`
    SET
      `deleted`=1
  WHERE `manual_id`=mid
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiManVersion`$$
CREATE PROCEDURE `hpapiManVersion`(
  IN        `versionRef` VARCHAR(64) CHARSET ascii
)
BEGIN
  SELECT
    `p`.`deleted` AS `methodGone`
   ,`p`.`manual_id` AS `manualId`
   ,`p`.`vendor`
   ,`p`.`package`
   ,`p`.`class`
   ,`p`.`method`
   ,`p`.`api_usergroups` AS `apiUsergroups`
   ,`p`.`created`
   ,`p`.`updated`
   ,`c`.`markdown`
  FROM `hpapi_manpage` AS `p`
  JOIN `hpapi_mancommit` AS `c`
    USING (`manual_id`,`vendor`,`package`,`class`,`method`)
  WHERE `c`.`reference`=versionRef
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiManVersionCommit`$$
CREATE PROCEDURE `hpapiManVersionCommit`(
  IN        `ref` varchar(64) CHARSET ascii
 ,IN        `lbl` varchar(64) CHARSET ascii
 ,IN        `md` text CHARSET utf8
)
BEGIN
  SET @mid = ( SELECT `manual_id` FROM `hpapi_mancommit` WHERE `reference`=ref );
  INSERT INTO `hpapi_manhead`
    SET
      `manual_id`=@mid
     ,`label`=lbl
     ,`markdown`=md
  ;
  SET @hid = LAST_INSERT_ID()
  ;
  UPDATE `hpapi_mancommit`
    SET
      `head_id`=@hid
  WHERE `reference`=ref
  LIMIT 1
  ;
  SELECT @hid AS `headId`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiManVersionInsert`$$
CREATE PROCEDURE `hpapiManVersionInsert`(
 ,IN        `mid` int(11) unsigned
 ,IN        `v` varchar(64) CHARSET ascii
 ,IN        `p` varchar(64) CHARSET ascii
 ,IN        `c` varchar(64) CHARSET ascii
 ,IN        `m` varchar(64) CHARSET ascii
 ,IN        `md` text CHARSET utf8
)
BEGIN
  SET @ref = UUID();
  INSERT INTO `hpapi_mancommit`
  SET
    `manual_id`=mid
   ,`vendor`=v
   ,`package`=p
   ,`class`=c
   ,`method`=m
   ,`reference`=@ref
   ,`markdown`=md
  ;
  SELECT @ref AS `reference`
  ;
END$$



DELIMITER ;

