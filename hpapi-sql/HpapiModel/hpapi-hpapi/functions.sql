

DELIMITER $$
DROP FUNCTION IF EXISTS `hpapiCTZIn`$$
CREATE FUNCTION `hpapiCTZIn` (
  t timestamp
) RETURNS timestamp DETERMINISTIC
BEGIN
  IF (@hpapiTimezone IS NULL) THEN BEGIN
    SET @hpapiTimezone = 'Europe/London'
    ;
    END
    ;
  END IF
  ;
  RETURN CONVERT_TZ(t,@hpapiTimezone,'UTC');
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS `hpapiCTZOut`$$
CREATE FUNCTION `hpapiCTZOut` (
  t timestamp
) RETURNS timestamp DETERMINISTIC
BEGIN
  IF (@hpapiTimezone IS NULL) THEN BEGIN
    SET @hpapiTimezone = 'Europe/London'
    ;
    END
    ;
  END IF
  ;
  RETURN CONVERT_TZ(t,'UTC',@hpapiTimezone);
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS `hpapiSplitNth`$$
CREATE FUNCTION `hpapiSplitNth` (
  joinedString varchar(255)
 ,splitter varchar(16)
 ,positionIndex int(4)
) RETURNS varchar(255) CHARSET latin1 DETERMINISTIC
BEGIN
  RETURN REPLACE(
    SUBSTRING(
      SUBSTRING_INDEX(joinedString,splitter,positionIndex)
     ,LENGTH(
        SUBSTRING_INDEX(joinedString,splitter,positionIndex-1)
      ) + 1
    )
   ,splitter
   ,''
  )
  ;
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS `hpapiUUID`$$
CREATE FUNCTION `hpapiUUID` (
) RETURNS binary(16) DETERMINISTIC
BEGIN
  RETURN UNHEX(
    REPLACE(UUID(),'-','')
  );
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS `hpapiUUIDStandard`$$
CREATE FUNCTION `hpapiUUIDStandard` (
  uuidBinary binary(16)
) RETURNS char(36) DETERMINISTIC
BEGIN
  SET @Hexed = HEX(uuidBinary);
  RETURN CONCAT_WS(
    '-'
   ,LOWER(SUBSTR(@Hexed,1,8))
   ,LOWER(SUBSTR(@Hexed,9,4))
   ,LOWER(SUBSTR(@Hexed,13,4))
   ,LOWER(SUBSTR(@Hexed,17,4))
   ,LOWER(SUBSTR(@Hexed,21,12))
  );
END$$


DELIMITER $$
DROP FUNCTION IF EXISTS `hpapiUUIDString`$$
CREATE FUNCTION `hpapiUUIDString` (
  uuidBinary binary(16)
) RETURNS char(32) DETERMINISTIC
BEGIN
  RETURN HEX(uuidBinary);
END$$


DELIMITER ;

