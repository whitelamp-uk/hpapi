
-- Copyright 2018 Whitelamp http://www.whitelamp.com/

SET NAMES utf8;
SET time_zone = '+00:00';

DELIMITER $$



DROP PROCEDURE IF EXISTS `hpapiMyMethods`$$
CREATE PROCEDURE `hpapiMyMethods`(
  IN        `userId` INT(11) UNSIGNED
 ,IN        `authenticated` INT(1) UNSIGNED
)
BEGIN
  SELECT
    GROUP_CONCAT(DISTINCT `membership`.`usergroup` SEPARATOR ',') AS `usergroups`
   ,`vendor`,`package`,`class`,`method`
   ,`label`,`notes`
  FROM `hpapi_method`
  LEFT JOIN `hpapi_run` USING (`vendor`,`package`,`class`,`method`)
  LEFT JOIN `hpapi_membership`
         ON authenticated>'0'
        AND `hpapi_membership`.`usergroup`=`hpapi_run`.`usergroup`
        AND `hpapi_membership`.`user_id`=userId
  WHERE `hpapi_membership`.`user_id` IS NOT NULL
     OR `hpapi_run`.`usergroup`='anon'
  GROUP BY `vendor`,`package`,`class`,`method`
  ORDER BY `vendor`,`package`,`class`,`method`
  ;
END$$


DROP PROCEDURE IF EXISTS `hpapiMyUsergroups`$$
CREATE PROCEDURE `hpapiMyUsergroups`(
  IN        `userId` INT(11) UNSIGNED
 ,IN        `authenticated` INT(1) UNSIGNED
)
BEGIN
  SELECT
    `hpapi_usergroup`.`usergroup`
   ,`hpapi_usergroup`.`name` AS `name` 
   ,`hpapi_level`.`name` AS `securityLevel`
   ,`level`.`notes` AS `securityNotes`
  FROM `hpapi_usergroup`
  LEFT JOIN `hpapi_membership`
         ON `hpapi_membership`.`usergroup`=`hpapi_usergroup`.`usergroup`
        AND (
             `hpapi_membership`.`usergroup`='anon'
          OR (
               authenticated>'0'
           AND `hpapi_membership`.`user_id`=userId
          )
        )
  LEFT JOIN `hpapi_level` USING (`level`)
  WHERE `hpapi_membership`.`usergroup` IS NOT NULL
  ORDER BY `hpapi_level`.`level`
  ;
END$$


DROP PROCEDURE IF EXISTS `hpapiUUID`$$
CREATE PROCEDURE `hpapiUUID`(
)
BEGIN
  SELECT
    UUID() AS `uuid`
  ;
END$$


DELIMITER ;

