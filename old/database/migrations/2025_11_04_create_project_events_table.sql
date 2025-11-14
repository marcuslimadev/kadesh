-- Migration to create the project_events table

CREATE TABLE IF NOT EXISTS `project_events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_events_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
