

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



DELIMITER ;

