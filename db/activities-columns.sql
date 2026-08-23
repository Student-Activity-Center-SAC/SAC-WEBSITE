-- The admin + public activity pages (and the seed routes) expect a richer
-- `activities` shape than the legacy table provides. These columns are additive
-- and backfilled from the existing data, so nothing is lost.
--
-- MySQL 8 has no "ADD COLUMN IF NOT EXISTS"; re-running is a no-op error you
-- can ignore per column that already exists.

ALTER TABLE `activities`
  ADD COLUMN `code`         varchar(64)  NULL,
  ADD COLUMN `title`        text         NULL,
  ADD COLUMN `domain`       varchar(16)  NULL,
  ADD COLUMN `club_slug`    varchar(255) NULL,
  ADD COLUMN `description`  text         NULL,
  ADD COLUMN `competencies` text         NULL,
  ADD COLUMN `month`        varchar(32)  NULL,
  ADD COLUMN `week`         varchar(32)  NULL,
  ADD COLUMN `venue`        varchar(255) NULL,
  ADD COLUMN `time_slot`    varchar(64)  NULL,
  ADD COLUMN `difficulty`   varchar(32)  NULL,
  ADD COLUMN `sdc_credits`  int          NULL DEFAULT 0;

-- Backfill from the legacy columns.
UPDATE `activities` SET
  `code`  = COALESCE(`code`,  CAST(`id` AS CHAR)),
  `title` = COALESCE(`title`, `activity_name`),
  `venue` = COALESCE(`venue`, `activity_venue`);

-- Derive domain + club_slug from the owning club.
UPDATE `activities` a
  JOIN `clubs` c ON c.`id` = a.`club_id`
SET
  a.`domain`    = c.`club_domain`,
  a.`club_slug` = TRIM(BOTH '-' FROM
                    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                      LOWER(c.`club_name`),
                    ' ', '-'), '/', '-'), '&', '-'), '--', '-'), '--', '-'));

-- `code` is the identifier the admin edit/delete routes key on.
CREATE UNIQUE INDEX `idx_activities_code` ON `activities` (`code`);
CREATE INDEX `idx_activities_domain`      ON `activities` (`domain`);
CREATE INDEX `idx_activities_club_slug`   ON `activities` (`club_slug`);
