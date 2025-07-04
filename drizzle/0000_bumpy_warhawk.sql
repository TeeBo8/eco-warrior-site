CREATE TABLE "debunking_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"myth" text NOT NULL,
	"reality" text NOT NULL,
	"explanation" text NOT NULL,
	"myth_en" text NOT NULL,
	"reality_en" text NOT NULL,
	"explanation_en" text NOT NULL,
	"source_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
