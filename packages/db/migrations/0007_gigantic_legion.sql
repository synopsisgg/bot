CREATE TABLE IF NOT EXISTS "command_users" (
	"twitch_id" varchar(256) PRIMARY KEY NOT NULL,
	"twitch_login" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"hydration_points" integer DEFAULT 0 NOT NULL,
	"hydrated_at" timestamp
);
