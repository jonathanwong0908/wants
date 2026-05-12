CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
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
