CREATE TABLE `twitter_db`.`Tweet` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(50) NULL,
  `CreationDate` DATETIME NULL,
  `Text` VARCHAR(140) NULL,
  PRIMARY KEY (`Id`));
