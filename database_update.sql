-- ========================================================
-- JemLanka Database Migration & Update Script
-- Database: jemdb
-- ========================================================

USE `jemdb`;

-- 1. Store Table Enhancements (Verification & Banking details)
ALTER TABLE `store`
  ADD COLUMN IF NOT EXISTS `ngja_license` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `brc` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `nic` VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `address_line1` VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `address_line2` VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `postal_code` VARCHAR(20) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `bank_name` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `bank_branch` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `account_holder` VARCHAR(150) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `account_number` VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `city_id` INT DEFAULT NULL;

-- 2. Product Table Enhancements (Gemstone Origin, Cut, Dimensions, Certification, Per-carat pricing)
ALTER TABLE `product`
  ADD COLUMN IF NOT EXISTS `origin` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `certification` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `certificate_number` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `dimensions` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `cut` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `price_per_carat` DOUBLE DEFAULT NULL;

-- 3. Seed Data Typo & Status Corrections
UPDATE `shape` SET `name` = 'Oval' WHERE `name` = 'Ovel';
UPDATE `treatment` SET `name` = 'Heat Treated' WHERE `name` = 'Heat-teatment';
UPDATE `status` SET `name` = 'Out of Stock' WHERE `name` = 'Out-Off stock';
