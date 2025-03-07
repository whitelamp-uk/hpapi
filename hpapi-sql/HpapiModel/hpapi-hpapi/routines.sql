
-- Copyright 2018 Whitelamp http://www.whitelamp.com/

SET NAMES utf8;
SET time_zone = '+00:00';


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiAuthDetails`$$
CREATE PROCEDURE `hpapiAuthDetails`(
  IN        `emailOrToken` VARCHAR(254) CHARSET ascii
)
BEGIN
  -- A null user is the anonymous user which is:
  -- always active, allowed from any remote address, in the "anon" user group
  SELECT
    IFNULL(`hpapi_user`.`id`,0) AS `userId`
   ,IFNULL(`hpapi_user`.`active`,1) AS `active`
   ,IFNULL(`hpapi_user`.`verified`,0) AS `verified`
   ,`hpapi_user`.`key`
   ,`hpapi_user`.`key_expired` AS `keyExpired`
   ,`hpapi_user`.`key_release` AS `respondWithKey`
   ,UNIX_TIMESTAMP(`key_release_until`) AS `keyReleaseUntil`
   ,IFNULL(`hpapi_user`.`remote_addr_pattern`,'^.*$') AS `userRemoteAddrPattern`
   ,IFNULL(`hpapi_user`.`email`,'') AS `email`
   ,`hpapi_user`.`password_hash` AS `passwordHash`
   ,UNIX_TIMESTAMP(`hpapi_user`.`password_expires`) AS `passwordExpires`
   ,UNIX_TIMESTAMP(`hpapi_user`.`password_self_manage_until`) AS `passwordSelfManageUntil`
   ,`hpapi_user`.`token`
   ,UNIX_TIMESTAMP(`hpapi_user`.`token_expires`) AS `tokenExpires`
   ,INET6_NTOA(`hpapi_user`.`token_remote_addr`) AS `tokenRemoteAddr`
   ,`hpapi_usergroup`.`usergroup`
   ,`hpapi_usergroup`.`password_self_manage` AS `passwordSelfManage`
   ,`hpapi_usergroup`.`password_score_minimum` AS `passwordScoreMinimum`
   ,`hpapi_usergroup`.`token_duration_minutes` AS `tokenDurationMinutes`
   ,`hpapi_usergroup`.`remote_addr_pattern` AS `groupRemoteAddrPattern`
  FROM `hpapi_usergroup`
  LEFT JOIN `hpapi_membership`
         ON `hpapi_membership`.`usergroup`=`hpapi_usergroup`.`usergroup`
  LEFT JOIN `hpapi_user`
         ON `hpapi_user`.`id`=`hpapi_membership`.`user_id`
  WHERE
        `hpapi_usergroup`.`usergroup`='anon'
     OR `hpapi_user`.`email`=emailOrToken
     OR `hpapi_user`.`token`=emailOrToken
  ORDER BY `hpapi_user`.`id` IS NULL,`hpapi_usergroup`.`level`,`hpapi_usergroup`.`usergroup`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiColumnPermissions`$$
CREATE PROCEDURE `hpapiColumnPermissions`(
)
BEGIN
  SELECT
    `hpapi_column`.`table`
   ,`hpapi_column`.`column`
   ,`hpapi_column`.`model`
   ,`hpapi_column`.`empty_allowed` AS `emptyAllowed`
   ,`hpapi_column`.`empty_is_null` AS `emptyIsNull`
   ,`hpapi_pattern`.`pattern`
   ,`hpapi_pattern`.`constraints`
   ,`hpapi_pattern`.`expression`
   ,`hpapi_pattern`.`php_filter` AS `phpFilter`
   ,`hpapi_pattern`.`length_minimum` AS `lengthMinimum`
   ,`hpapi_pattern`.`length_maximum` AS `lengthMaximum`
   ,`hpapi_pattern`.`value_minimum` AS `valueMinimum`
   ,`hpapi_pattern`.`value_maximum` AS `valueMaximum`
   ,GROUP_CONCAT(`hpapi_insert`.`usergroup` SEPARATOR '::') AS `inserters`
   ,GROUP_CONCAT(`hpapi_update`.`usergroup` SEPARATOR '::') AS `updaters`
  FROM `hpapi_column`
  LEFT JOIN `hpapi_pattern` USING (`pattern`)
  LEFT JOIN `hpapi_insert` USING (`table`,`column`)
  LEFT JOIN `hpapi_update` USING (`table`,`column`)
  GROUP BY `hpapi_column`.`table`,`hpapi_column`.`column`
  ORDER BY
      `hpapi_column`.`model`
     ,`hpapi_column`.`table`
     ,`hpapi_column`.`column`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiGdprAccess`$$
CREATE PROCEDURE `hpapiGdprAccess`(
)
BEGIN
  SELECT
    CONCAT (`hpapi_usergroup`.`usergroup`,': ',`hpapi_usergroup`.`name`) AS `User group`
   ,`hpapi_usergroup`.`remote_addr_pattern` AS `Remote IP pattern`
   ,CONCAT(
      `hpapi_spr`.`model`
     ,'.'
     ,`hpapi_spr`.`spr`
     ,'()'
    ) AS `Stored Procedure`
   ,`hpapi_spr`.`notes` AS `Stored Procedure Notes`
   ,CONCAT(
        `hpapi_method`.`class`
       ,'::'
       ,`hpapi_method`.`method`
       ,'()'
    ) AS `Methods`
   ,`hpapi_method`.`notes` AS `Method Notes`
  FROM `hpapi_usergroup`
  JOIN `hpapi_run`
    ON `hpapi_run`.`usergroup`=`hpapi_usergroup`.`usergroup`
  JOIN `hpapi_method`
    ON `hpapi_method`.`vendor`=`hpapi_run`.`vendor`
   AND `hpapi_method`.`package`=`hpapi_run`.`package`
   AND `hpapi_method`.`class`=`hpapi_run`.`class`
   AND `hpapi_method`.`method`=`hpapi_run`.`method`
  LEFT JOIN `hpapi_call`
         ON `hpapi_call`.`vendor`=`hpapi_run`.`vendor`
        AND `hpapi_call`.`package`=`hpapi_run`.`package`
        AND `hpapi_call`.`class`=`hpapi_run`.`class`
        AND `hpapi_call`.`method`=`hpapi_run`.`method`
  LEFT JOIN `hpapi_spr`
         ON `hpapi_spr`.`model`=`hpapi_call`.`model`
        AND `hpapi_spr`.`spr`=`hpapi_call`.`spr`
  ORDER BY
    `hpapi_usergroup`.`usergroup`
   ,`hpapi_method`.`vendor`
   ,`hpapi_method`.`package`
   ,`hpapi_method`.`class`
   ,`hpapi_method`.`method`
   ,`hpapi_spr`.`model`
   ,`hpapi_spr`.`spr`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiGdprMethodArguments`$$
CREATE PROCEDURE `hpapiGdprMethodArguments`(
)
BEGIN
  SELECT
    CONCAT(
      `hpapi_method`.`vendor`
     ,'/'
     ,`hpapi_method`.`package`
     ,'/'
    ) AS `Package`
   ,CONCAT(
      `hpapi_method`.`class`
     ,'::'
     ,`hpapi_method`.`method`
     ,'()'
    ) AS `Method`
   ,`hpapi_method`.`notes` AS `Method Notes`
   ,`hpapi_methodarg`.`argument` AS `Arg Nr`
   ,`hpapi_methodarg`.`name` AS `Arg Label`
   ,IF(`hpapi_methodarg`.`empty_allowed`=0,'','Yes') AS `Compulsory`
   ,`hpapi_methodarg`.`pattern` AS `Match Pattern`
   ,`hpapi_pattern`.`constraints` AS `Pattern description constant`
   ,`hpapi_pattern`.`expression` AS `Regular expression`
   ,`hpapi_pattern`.`php_filter` AS `PHP validation filter`
   ,`hpapi_pattern`.`length_minimum` AS `Min length`
   ,`hpapi_pattern`.`length_maximum` AS `Max length`
   ,`hpapi_pattern`.`value_minimum` AS `Min value`
   ,`hpapi_pattern`.`value_maximum` AS `Max value`
  FROM `hpapi_method`
  JOIN `hpapi_methodarg`
    ON `hpapi_methodarg`.`vendor`=`hpapi_method`.`vendor`
   AND `hpapi_methodarg`.`package`=`hpapi_method`.`package`
   AND `hpapi_methodarg`.`class`=`hpapi_method`.`class`
   AND `hpapi_methodarg`.`method`=`hpapi_method`.`method`
  JOIN `hpapi_pattern`
    ON `hpapi_pattern`.`pattern`=`hpapi_methodarg`.`pattern`
  ORDER BY
    `hpapi_method`.`vendor`
   ,`hpapi_method`.`package`
   ,`hpapi_method`.`class`
   ,`hpapi_method`.`method`
   ,`hpapi_methodarg`.`argument`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiGdprMethods`$$
CREATE PROCEDURE `hpapiGdprMethods`(
)
BEGIN
  SELECT
    CONCAT(
      `hpapi_method`.`vendor`
     ,'/'
     ,`hpapi_method`.`package`
     ,'/'
    ) AS `Package`
   ,CONCAT(
      `hpapi_method`.`class`
     ,'::'
     ,`hpapi_method`.`method`
     ,'()'
    ) AS `Method`
   ,`hpapi_method`.`notes` AS `Method Notes`
   ,GROUP_CONCAT(
      DISTINCT `hpapi_usergroup`.`name` SEPARATOR ','
    ) AS `User groups`
   ,GROUP_CONCAT(
      CONCAT(
        `hpapi_spr`.`model`
       ,'.'
       ,`hpapi_spr`.`spr`
       ,'()'
      ) SEPARATOR ','
    ) AS `Stored Procedures`
  FROM `hpapi_usergroup`
  JOIN `hpapi_run`
    ON `hpapi_run`.`usergroup`=`hpapi_usergroup`.`usergroup`
  JOIN `hpapi_method`
    ON `hpapi_method`.`vendor`=`hpapi_run`.`vendor`
   AND `hpapi_method`.`package`=`hpapi_run`.`package`
   AND `hpapi_method`.`class`=`hpapi_run`.`class`
   AND `hpapi_method`.`method`=`hpapi_run`.`method`
  JOIN `hpapi_call`
    ON `hpapi_call`.`vendor`=`hpapi_run`.`vendor`
   AND `hpapi_call`.`package`=`hpapi_run`.`package`
   AND `hpapi_call`.`class`=`hpapi_run`.`class`
   AND `hpapi_call`.`method`=`hpapi_run`.`method`
  JOIN `hpapi_spr`
    ON `hpapi_spr`.`model`=`hpapi_call`.`model`
   AND `hpapi_spr`.`spr`=`hpapi_call`.`spr`
  GROUP BY
    `hpapi_method`.`vendor`
   ,`hpapi_method`.`package`
   ,`hpapi_method`.`class`
   ,`hpapi_method`.`method`
  ORDER BY
    `hpapi_method`.`vendor`
   ,`hpapi_method`.`package`
   ,`hpapi_method`.`class`
   ,`hpapi_method`.`method`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiGdprStoredProcedureArguments`$$
CREATE PROCEDURE `hpapiGdprStoredProcedureArguments`(
)
BEGIN
  SELECT
    CONCAT(
      `hpapi_spr`.`model`
     ,'.'
     ,`hpapi_spr`.`spr`
     ,'()'
    ) AS `Stored Procedure`
   ,`hpapi_spr`.`notes` AS `Stored Procedure Notes`
   ,`hpapi_sprarg`.`argument` AS `Arg Nr`
   ,`hpapi_sprarg`.`name` AS `Arg Label`
   ,IF(`hpapi_sprarg`.`empty_allowed`=0,'','Yes') AS `Compulsory`
   ,`hpapi_sprarg`.`pattern` AS `Match Pattern`
   ,`hpapi_pattern`.`constraints` AS `Pattern description constant`
   ,`hpapi_pattern`.`expression` AS `Regular expression`
   ,`hpapi_pattern`.`php_filter` AS `PHP validation filter`
   ,`hpapi_pattern`.`length_minimum` AS `Min length`
   ,`hpapi_pattern`.`length_maximum` AS `Max length`
   ,`hpapi_pattern`.`value_minimum` AS `Min value`
   ,`hpapi_pattern`.`value_maximum` AS `Max value`
  FROM `hpapi_spr`
  JOIN `hpapi_sprarg`
    ON `hpapi_sprarg`.`model`=`hpapi_spr`.`model`
   AND `hpapi_sprarg`.`spr`=`hpapi_spr`.`spr`
  JOIN `hpapi_pattern`
    ON `hpapi_pattern`.`pattern`=`hpapi_sprarg`.`pattern`
  ORDER BY
    `hpapi_spr`.`model`
   ,`hpapi_spr`.`spr`
   ,`hpapi_sprarg`.`argument`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiGdprStoredProcedures`$$
CREATE PROCEDURE `hpapiGdprStoredProcedures`(
)
BEGIN
  SELECT
    CONCAT(
      `hpapi_spr`.`model`
     ,'.'
     ,`hpapi_spr`.`spr`
     ,'()'
    ) AS `Stored Procedure`
   ,`hpapi_spr`.`notes` AS `Stored Procedure Notes`
   ,GROUP_CONCAT(
      DISTINCT `hpapi_usergroup`.`name` SEPARATOR ','
    ) AS `User groups`
   ,GROUP_CONCAT(
      CONCAT(
        `hpapi_method`.`class`
       ,'::'
       ,`hpapi_method`.`method`
       ,'()'
      ) SEPARATOR ','
    ) AS `Methods`
  FROM `hpapi_usergroup`
  JOIN `hpapi_run`
    ON `hpapi_run`.`usergroup`=`hpapi_usergroup`.`usergroup`
  JOIN `hpapi_method`
    ON `hpapi_method`.`vendor`=`hpapi_run`.`vendor`
   AND `hpapi_method`.`package`=`hpapi_run`.`package`
   AND `hpapi_method`.`class`=`hpapi_run`.`class`
   AND `hpapi_method`.`method`=`hpapi_run`.`method`
  JOIN `hpapi_call`
    ON `hpapi_call`.`vendor`=`hpapi_run`.`vendor`
   AND `hpapi_call`.`package`=`hpapi_run`.`package`
   AND `hpapi_call`.`class`=`hpapi_run`.`class`
   AND `hpapi_call`.`method`=`hpapi_run`.`method`
  JOIN `hpapi_spr`
    ON `hpapi_spr`.`model`=`hpapi_call`.`model`
   AND `hpapi_spr`.`spr`=`hpapi_call`.`spr`
  GROUP BY
    `hpapi_spr`.`model`
   ,`hpapi_spr`.`spr`
  ORDER BY
    `hpapi_spr`.`model`
   ,`hpapi_spr`.`spr`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiGdprUser`$$
CREATE PROCEDURE `hpapiGdprUser`(
  IN        `usr` VARCHAR(254) CHARSET ascii
)
BEGIN
  SELECT
      `hpapi_user`.`id` AS `User ID`
     ,`hpapi_user`.`name` AS `Name`
     ,`hpapi_user`.`email` AS `Email Address`
   ,CONCAT(
      `hpapi_spr`.`model`
     ,'.'
     ,`hpapi_spr`.`spr`
     ,'()'
    ) AS `Stored Procedure`
   ,`hpapi_spr`.`notes` AS `Stored Procedure Notes`
   ,`hpapi_usergroup`.`name` AS `User Group`
   ,CONCAT(
        `hpapi_method`.`class`
       ,'::'
       ,`hpapi_method`.`method`
       ,'()'
    ) AS `Methods`
   ,`hpapi_method`.`notes` AS `Method Notes`
  FROM `hpapi_user`
  JOIN `hpapi_membership`
    ON `hpapi_membership`.`user_id`=`hpapi_user`.`id`
  JOIN `hpapi_usergroup`
    ON `hpapi_usergroup`.`usergroup`=`hpapi_membership`.`usergroup`
  JOIN `hpapi_run`
    ON `hpapi_run`.`usergroup`=`hpapi_usergroup`.`usergroup`
  JOIN `hpapi_method`
    ON `hpapi_method`.`vendor`=`hpapi_run`.`vendor`
   AND `hpapi_method`.`package`=`hpapi_run`.`package`
   AND `hpapi_method`.`class`=`hpapi_run`.`class`
   AND `hpapi_method`.`method`=`hpapi_run`.`method`
  JOIN `hpapi_call`
    ON `hpapi_call`.`vendor`=`hpapi_run`.`vendor`
   AND `hpapi_call`.`package`=`hpapi_run`.`package`
   AND `hpapi_call`.`class`=`hpapi_run`.`class`
   AND `hpapi_call`.`method`=`hpapi_run`.`method`
  JOIN `hpapi_spr`
    ON `hpapi_spr`.`model`=`hpapi_call`.`model`
   AND `hpapi_spr`.`spr`=`hpapi_call`.`spr`
  WHERE `hpapi_user`.`id`=usr
     OR `hpapi_user`.`email` LIKE usr
     OR `hpapi_user`.`name` LIKE usr
  ORDER BY
    `hpapi_user`.`id`
   ,`hpapi_method`.`vendor`
   ,`hpapi_method`.`package`
   ,`hpapi_method`.`class`
   ,`hpapi_method`.`method`
   ,`hpapi_spr`.`model`
   ,`hpapi_spr`.`spr`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiKeyrelease`$$
CREATE PROCEDURE `hpapiKeyrelease`(
  IN        `uid` INT(11) UNSIGNED
 ,IN        `ky` VARCHAR(64) CHARSET ascii
 ,IN        `ts` INT(11) UNSIGNED
)
BEGIN
  UPDATE `hpapi_user`
  SET
    `key`=ky
   ,`key_release`=1
   ,`key_release_until`=FROM_UNIXTIME(ts)
  WHERE `id`=uid
  ;
END $$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiKeyreleaseRevoke`$$
CREATE PROCEDURE `hpapiKeyreleaseRevoke`(
  IN        `em` VARCHAR(254) CHARSET ascii
 ,IN        `ts` INT(11) UNSIGNED
)
BEGIN
  UPDATE `hpapi_user`
  SET
    `key_release`=0
  WHERE `email`=em
     OR UNIX_TIMESTAMP(`key_release_until`)<ts
  ;
END $$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiList`$$
CREATE PROCEDURE `hpapiList`(
  IN        `ref` VARCHAR(64) CHARSET ascii
 ,IN        `lgd` VARCHAR(64) CHARSET ascii
 ,IN        `dbs` VARCHAR(64) CHARSET ascii
 ,IN        `tbl` VARCHAR(64) CHARSET ascii
 ,IN        `ost` INT(11) unsigned
 ,IN        `lmt` INT(11) unsigned
)
BEGIN
  SET @sql = CONCAT(
    'SELECT `'
   ,ref,'`,`',lgd
   ,'` FROM `'
   ,dbs,'`.`',tbl
   ,'` WHERE `deleted`=0 LIMIT '
   ,ost,',',lmt
  )
  ;
  PREPARE stmt FROM @sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
END $$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiLogRequest`$$
CREATE PROCEDURE `hpapiLogRequest`(
  IN        `ts` INT(11) unsigned
 ,IN        `mt` DECIMAL(9,8) unsigned
 ,IN        `ky` VARCHAR(64) CHARSET ascii
 ,IN        `uid` INT(11) unsigned
 ,IN        `em` VARCHAR(254) CHARSET utf8
 ,IN        `rma` VARCHAR(64) CHARSET ascii
 ,IN        `ua` VARCHAR(255) CHARSET ascii
 ,IN        `vdr` VARCHAR(64) CHARSET ascii
 ,IN        `pkg` VARCHAR(64) CHARSET ascii
 ,IN        `cls` VARCHAR(64) CHARSET ascii
 ,IN        `mtd` VARCHAR(64) CHARSET ascii
 ,IN        `sts` VARCHAR(64) CHARSET ascii
 ,IN        `err` VARCHAR(64) CHARSET utf8
 ,IN        `dgn` TEXT CHARSET utf8
)
BEGIN
  INSERT INTO `hpapi_log`
  SET
    `datetime`=FROM_UNIXTIME(ts)
   ,`microtime`=mt
   ,`key`=ky
   ,`user_id`=uid
   ,`email`=em
   ,`remote_addr`=INET6_ATON(rma)
   ,`user_agent`=ua
   ,`vendor`=vdr
   ,`package`=pkg
   ,`class`=cls
   ,`method`=mtd
   ,`status`=sts
   ,`error`=err
   ,`diagnostic`=dgn
  ;
END $$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiMethodargs`$$
CREATE PROCEDURE `hpapiMethodargs`(
  IN        `userId` INT(11) UNSIGNED
 ,IN        `methodVendor` VARCHAR(64) CHARSET ascii
 ,IN        `methodPackage` VARCHAR(64) CHARSET ascii
 ,IN        `methodClass` VARCHAR(64) CHARSET ascii
 ,IN        `methodMethod` VARCHAR(64) CHARSET ascii
)
BEGIN
  SELECT
    `hpapi_package`.`requires_key` AS `requiresKey`
   ,`hpapi_method`.`label` AS `label`
   ,`hpapi_method`.`notes` AS `notes`
   ,`hpapi_methodarg`.`argument` AS `argument`
   ,`hpapi_methodarg`.`name` AS `name`
   ,`hpapi_methodarg`.`empty_allowed` AS `emptyAllowed`
   ,`hpapi_pattern`.`pattern` AS `pattern`
   ,`hpapi_pattern`.`constraints` AS `constraints`
   ,`hpapi_pattern`.`expression` AS `expression`
   ,`hpapi_pattern`.`php_filter` AS `phpFilter`
   ,`hpapi_pattern`.`length_minimum` AS `lengthMinimum`
   ,`hpapi_pattern`.`length_maximum` AS `lengthMaximum`
   ,`hpapi_pattern`.`value_minimum` AS `valueMinimum`
   ,`hpapi_pattern`.`value_maximum` AS `valueMaximum`
   ,IFNULL(`ug`.`remote_addr_pattern`,`anon`.`remote_addr_pattern`) AS `remoteAddrPattern`
  FROM `hpapi_method`
  LEFT JOIN `hpapi_package` USING (`vendor`,`package`)
  LEFT JOIN `hpapi_methodarg` USING (`vendor`,`package`,`class`,`method`)
  LEFT JOIN `hpapi_pattern` USING (`pattern`)
  LEFT JOIN `hpapi_run` USING (`vendor`,`package`,`class`,`method`)
  LEFT JOIN `hpapi_membership`
         ON `hpapi_membership`.`usergroup`=`hpapi_run`.`usergroup`
        AND `hpapi_membership`.`user_id`=userId
  LEFT JOIN `hpapi_usergroup` AS `ug`
         ON `ug`.`usergroup`=`hpapi_membership`.`usergroup`
  LEFT JOIN `hpapi_usergroup` AS `anon`
         ON `anon`.`usergroup`='anon'
  WHERE `hpapi_method`.`vendor`=methodVendor
    AND `hpapi_method`.`package`=methodPackage
    AND `hpapi_method`.`class`=methodClass
    AND `hpapi_method`.`method`=methodMethod
    AND (
        `hpapi_membership`.`user_id` IS NOT NULL
     OR `hpapi_run`.`usergroup`='anon'
    )
  ORDER BY `hpapi_methodarg`.`argument`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiPasswordEmpty`$$
CREATE PROCEDURE `hpapiPasswordEmpty`(
  IN        `uid` INT(11) UNSIGNED
)
BEGIN
  UPDATE `hpapi_user`
  SET
    `password_hash`=''
  WHERE `id`=uid
  ;
END $$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiPatterns`$$
CREATE PROCEDURE `hpapiPatterns`(
)
BEGIN
  SELECT
    `hpapi_pattern`.`pattern`
   ,`hpapi_pattern`.`constraints`
   ,`hpapi_pattern`.`expression`
   ,`hpapi_pattern`.`input`
   ,`hpapi_pattern`.`php_filter` AS `phpFilter`
   ,`hpapi_pattern`.`length_minimum` AS `lengthMinimum`
   ,`hpapi_pattern`.`length_maximum` AS `lengthMaximum`
   ,`hpapi_pattern`.`value_minimum` AS `valueMinimum`
   ,`hpapi_pattern`.`value_maximum` AS `valueMaximum`
  FROM `hpapi_pattern`
  ORDER BY `hpapi_pattern`.`pattern`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiSprargs`$$
CREATE PROCEDURE `hpapiSprargs`(
  IN        `vdr` VARCHAR(64) CHARSET ascii
 ,IN        `pkg` VARCHAR(64) CHARSET ascii
 ,IN        `cls` VARCHAR(64) CHARSET ascii
 ,IN        `mtd` VARCHAR(64) CHARSET ascii
)
BEGIN
  SELECT
    `hpapi_spr`.`model`
   ,`hpapi_spr`.`spr`
   ,`hpapi_spr`.`notes`
   ,`hpapi_sprarg`.`argument`
   ,`hpapi_sprarg`.`name`
   ,`hpapi_sprarg`.`empty_allowed` AS `emptyAllowed`
   ,`hpapi_pattern`.`pattern`
   ,`hpapi_pattern`.`constraints`
   ,`hpapi_pattern`.`expression`
   ,`hpapi_pattern`.`php_filter` AS `phpFilter`
   ,`hpapi_pattern`.`length_minimum` AS `lengthMinimum`
   ,`hpapi_pattern`.`length_maximum` AS `lengthMaximum`
   ,`hpapi_pattern`.`value_minimum` AS `valueMinimum`
   ,`hpapi_pattern`.`value_maximum` AS `valueMaximum`
   ,`hpapi_pattern`.`input`
  FROM `hpapi_method`
  LEFT JOIN `hpapi_call` USING (`vendor`,`package`,`class`,`method`)
  LEFT JOIN `hpapi_spr` USING (`model`,`spr`)
  LEFT JOIN `hpapi_sprarg` USING (`model`,`spr`)
  LEFT JOIN `hpapi_pattern` USING (`pattern`)
  WHERE `hpapi_method`.`vendor`=vdr
    AND `hpapi_method`.`package`=pkg
    AND `hpapi_method`.`class`=cls
    AND `hpapi_method`.`method`=mtd
  GROUP BY `hpapi_spr`.`model`,`hpapi_spr`.`spr`,`hpapi_sprarg`.`argument`
  ORDER BY `hpapi_spr`.`model`,`hpapi_spr`.`spr`,`hpapi_sprarg`.`argument`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiInsertTestUsers`$$
CREATE PROCEDURE `hpapiInsertTestUsers`(
)
BEGIN
  IF ((SELECT COUNT(`id`) FROM `hpapi_user`) = 0) THEN
    INSERT INTO `hpapi_user` (`id`, `active`, `verified`, `uuid`, `key`, `key_expired`, `key_release`, `key_release_until`, `remote_addr_pattern`, `name`, `notes`, `email`, `password_hash`) VALUES
    (1, 1,	1,	UNHEX('322025bd8ff211e8902b001f16148bc1'),	'89c56ad8-8ff3-11e8-902b-001f16148bc1',	0,	0,	'0000-00-00 00:00:00',	'^.*$',	'Sysadmin Temp',	'Temporary system administrator',	'sysadmin@no.where',	'$2y$10$hLSdApW6.30YLK3ze49uSu7OV0gmS3ZT65pufxDPGiMxsmW3bykeq'),
    (2, 1,	1,	UNHEX('57d2eff78ff311e8902b001f16148bc1'),	'89c56ad8-8ff3-11e8-902b-001f16148bc1',	0,	0,	'0000-00-00 00:00:00',	'^.*$',	'Admin Temp',	'Temporary organisation administrator',	'orgadmin@no.where',	'$2y$10$hLSdApW6.30YLK3ze49uSu7OV0gmS3ZT65pufxDPGiMxsmW3bykeq'),
    (3, 1,	1,	UNHEX('caf791cbd22411e8956a00165e0004e8'),	'caf791fc-d224-11e8-956a-00165e0004e8',	0,	0,	'0000-00-00 00:00:00',	'^.*$',	'Example field staff',	'Example lower-level field staff member',	'test.1@no.where',	'$2y$10$hLSdApW6.30YLK3ze49uSu7OV0gmS3ZT65pufxDPGiMxsmW3bykeq');
    INSERT INTO `hpapi_membership` (`user_id`, `usergroup`) VALUES
    (1,	'sysadmin'),
    (2,	'admin'),
    (3,	'field');
    SELECT 'Inserted test users into hpapi_user and hpapi_membership' AS `Completed`;
  ELSE
    SELECT 'Refusing to add test users - rows found in hpapi_user' AS `Refused`;
  END IF
  ;
END$$

DROP PROCEDURE IF EXISTS `hpapiMethodPrivileges`$$
CREATE PROCEDURE `hpapiMethodPrivileges`(
)
BEGIN
  SELECT
    CONCAT(
      `hpapi_method`.`vendor`
     ,'::'
     ,`hpapi_method`.`package`
     ,'::'
     ,`hpapi_method`.`class`
     ,'::'
     ,`hpapi_method`.`method`
    ) AS `method`
   ,`hpapi_package`.`requires_key` AS `requiresKey`
   ,`hpapi_package`.`remote_addr_pattern` AS `remoteAddrPattern`
   ,`hpapi_package`.`notes` AS `packageNotes`
   ,`hpapi_method`.`notes` AS `methodNotes`
   ,`hpapi_method`.`label` AS `methodLabel`
   ,`hpapi_methodarg`.`argument` AS `argument`
   ,`hpapi_methodarg`.`name` AS `name`
   ,`hpapi_methodarg`.`empty_allowed` AS `emptyAllowed`
   ,`hpapi_pattern`.`pattern`
   ,`hpapi_pattern`.`constraints`
   ,`hpapi_pattern`.`expression`
   ,`hpapi_pattern`.`php_filter` AS `phpFilter`
   ,`hpapi_pattern`.`length_minimum` AS `lengthMinimum`
   ,`hpapi_pattern`.`length_maximum` AS `lengthMaximum`
   ,`hpapi_pattern`.`value_minimum` AS `valueMinimum`
   ,`hpapi_pattern`.`value_maximum` AS `valueMaximum`
   ,`hpapi_run`.`usergroup`
  FROM `hpapi_package`
  LEFT JOIN `hpapi_method` USING (`vendor`,`package`)
  LEFT JOIN `hpapi_methodarg` USING (`vendor`,`package`,`class`,`method`)
  LEFT JOIN `hpapi_pattern` USING (`pattern`)
  LEFT JOIN `hpapi_run` USING (`vendor`,`package`,`class`,`method`)
  ORDER BY
      `hpapi_package`.`vendor`
     ,`hpapi_package`.`package`
     ,`hpapi_method`.`class`
     ,`hpapi_method`.`method`
     ,`hpapi_methodarg`.`argument`
  ;
END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiReadme`$$
CREATE PROCEDURE `hpapiReadme`(
  IN        `dbName` VARCHAR(64) CHARSET ascii
 ,IN        `originUrl` VARCHAR(255) CHARSET ascii
 ,IN        `execRef` VARCHAR(255) CHARSET ascii
 ,IN        `branchName` CHAR(64) CHARSET ascii
 ,IN        `commitRef` CHAR(64) CHARSET ascii
)
BEGIN
  SET @table = CONCAT('`',dbName,'`.`hpapi_readme`');
  SET @cre = CONCAT(
    'CREATE TABLE IF NOT EXISTS '
   ,@table
   ,' (`git_origin` varchar(255),
    `git_branch` varchar(255),
    `git_commit` char(64) NOT NULL,
    `execute_ref` char(64) NOT NULL,
    PRIMARY KEY (`git_origin`)
    ) ENGINE=InnoDB DEFAULT CHARSET=ascii;'
  )
  ;
select @cre as `Create SQL`
;
  PREPARE stmt FROM @cre ; EXECUTE stmt ; DEALLOCATE PREPARE stmt
  ;
  SET @ins = CONCAT(
    'INSERT IGNORE INTO '
   ,@table
   ,' (`git_origin`) VALUES (?);'
  )
  ;
select @ins as `Insert SQL`
;
  SET @o = originUrl
  ;
  PREPARE stmt FROM @ins ; EXECUTE stmt USING @o; DEALLOCATE PREPARE stmt
  ;
  SET @upd = CONCAT(
    'UPDATE '
   ,@table
   ,' SET git_branch=?, git_commit=?, execute_ref=? WHERE `git_origin`=? LIMIT 1;'
  )
  ;
select @upd as `Update SQL`
;
  SET @bn = branchName ; SET @cr = commitRef ; SET @er = execRef
  ;
  PREPARE stmt FROM @upd ; EXECUTE stmt USING @er,@bn,@cr,@o; DEALLOCATE PREPARE stmt
  ;
END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiSprPrivileges`$$
CREATE PROCEDURE `hpapiSprPrivileges`(
)
BEGIN
  SELECT
    CONCAT(
      `hpapi_method`.`vendor`
     ,'::'
     ,`hpapi_method`.`package`
     ,'::'
     ,`hpapi_method`.`class`
     ,'::'
     ,`hpapi_method`.`method`
    ) AS `method`
   ,`hpapi_model`.`model`
   ,`hpapi_model`.`notes` AS `modelNotes`
   ,`hpapi_spr`.`spr`
   ,`hpapi_spr`.`notes` AS `sprNotes`
   ,`hpapi_sprarg`.`argument`
   ,`hpapi_sprarg`.`name`
   ,`hpapi_sprarg`.`empty_allowed` AS `emptyAllowed`
   ,`hpapi_pattern`.`pattern`
   ,`hpapi_pattern`.`constraints`
   ,`hpapi_pattern`.`expression`
   ,`hpapi_pattern`.`php_filter` AS `phpFilter`
   ,`hpapi_pattern`.`length_minimum` AS `lengthMinimum`
   ,`hpapi_pattern`.`length_maximum` AS `lengthMaximum`
   ,`hpapi_pattern`.`value_minimum` AS `valueMinimum`
   ,`hpapi_pattern`.`value_maximum` AS `valueMaximum`
  FROM `hpapi_method`
  LEFT JOIN `hpapi_call` USING (`vendor`,`package`,`class`,`method`)
  LEFT JOIN `hpapi_spr` USING (`model`,`spr`)
  LEFT JOIN `hpapi_model` USING (`model`)
  LEFT JOIN `hpapi_sprarg` USING (`model`,`spr`)
  LEFT JOIN `hpapi_pattern` USING (`pattern`)
  ORDER BY
      `hpapi_method`.`vendor`
     ,`hpapi_method`.`package`
     ,`hpapi_method`.`class`
     ,`hpapi_method`.`method`
     ,`hpapi_sprarg`.`argument`
  ;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiToken`$$
CREATE PROCEDURE `hpapiToken`(
  IN        `ui` INT(11) UNSIGNED
 ,IN        `tk` VARCHAR(255) CHARSET ascii
 ,IN        `ts` INT(11) UNSIGNED
 ,IN        `ra` VARCHAR(64) CHARSET ascii
)
BEGIN
  UPDATE `hpapi_user`
  SET
    `token`=tk
   ,`token_expires`=FROM_UNIXTIME(ts)
   ,`token_remote_addr`=INET6_ATON(ra)
  WHERE `id`=ui
  ;
END $$


DELIMITER $$
DROP PROCEDURE IF EXISTS `hpapiTokenExtend`$$
CREATE PROCEDURE `hpapiTokenExtend`(
  IN        `ui` INT(11) UNSIGNED
 ,IN        `ts` INT(11) UNSIGNED
)
BEGIN
  UPDATE `hpapi_user`
  SET
    `token_expires`=FROM_UNIXTIME(ts)
  WHERE `id`=ui
  ;
END $$


DELIMITER ;


