-- Achievements table used by /admin/achievements.
-- Column shape mirrors the payload sent by AchievementForm.
-- Run on the production DB if /admin/achievements reports a missing table.
CREATE TABLE IF NOT EXISTS `achievements` (
  `id`           varchar(255) NOT NULL,
  `title`        text         NOT NULL,
  `description`  text,
  `year`         varchar(16)  DEFAULT NULL,
  `level`        varchar(64)  DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `club_name`    varchar(255) DEFAULT NULL,
  `domain_code`  varchar(16)  DEFAULT NULL,
  `photo`        text,
  `sort_order`   int          DEFAULT '0',
  `created_at`   timestamp    NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   timestamp    NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
