PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`currency` text NOT NULL,
	`delay_hours` integer NOT NULL,
	`notify_at` integer NOT NULL,
	`notif_id` text,
	`status` text DEFAULT 'waiting' NOT NULL,
	`created_at` integer NOT NULL,
	`decided_at` integer,
	`note` text
);
--> statement-breakpoint
INSERT INTO `__new_items`("id", "name", "price", "currency", "delay_hours", "notify_at", "notif_id", "status", "created_at", "decided_at", "note") SELECT "id", "name", "price", "currency", "delay_hours", "notify_at", "notif_id", "status", "created_at", "decided_at", "note" FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;