CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "votes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "votes" CASCADE;--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "likes" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_post_like_idx" ON "likes" USING btree ("user_id","post_id");--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "author_id";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "upvotes";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "downvotes";--> statement-breakpoint
DROP TYPE "public"."post_status";--> statement-breakpoint
DROP TYPE "public"."vote_type";