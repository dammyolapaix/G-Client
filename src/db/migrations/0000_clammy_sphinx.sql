CREATE TYPE "public"."application_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('email', 'google');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'open', 'paid', 'uncollectible', 'void');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'instructor', 'learner');--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(320) NOT NULL,
	"slug" varchar(320) NOT NULL,
	"price" integer NOT NULL,
	"description" text NOT NULL,
	"image" varchar(320) NOT NULL,
	"duration" integer NOT NULL,
	"instructor_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "courses_title_unique" UNIQUE("title"),
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "courses_to_learners" (
	"course_id" uuid NOT NULL,
	"learner_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"application_date" date DEFAULT now() NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"acceptance_decline_date" date,
	CONSTRAINT "courses_to_learners_course_id_learner_id_pk" PRIMARY KEY("course_id","learner_id"),
	CONSTRAINT "courses_to_learners_courseId_learnerId_unique" UNIQUE("course_id","learner_id")
);
--> statement-breakpoint
CREATE TABLE "courses_to_stacks" (
	"course_id" uuid NOT NULL,
	"stack_id" uuid NOT NULL,
	CONSTRAINT "courses_to_stacks_course_id_stack_id_pk" PRIMARY KEY("course_id","stack_id"),
	CONSTRAINT "courses_to_stacks_courseId_stackId_unique" UNIQUE("course_id","stack_id")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" varchar(256) NOT NULL,
	"amount" integer NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"date" date DEFAULT now(),
	"paid_at" date,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(256),
	"location" varchar(256),
	"image" varchar(320),
	"disabled" boolean NOT NULL,
	"bio" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "stacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(320) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "stacks_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"email_verified" timestamp,
	"password" varchar(256),
	"role" "role" DEFAULT 'learner' NOT NULL,
	"provider" "auth_provider" DEFAULT 'email' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_users_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses_to_learners" ADD CONSTRAINT "courses_to_learners_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses_to_learners" ADD CONSTRAINT "courses_to_learners_learner_id_users_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses_to_learners" ADD CONSTRAINT "courses_to_learners_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses_to_stacks" ADD CONSTRAINT "courses_to_stacks_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses_to_stacks" ADD CONSTRAINT "courses_to_stacks_stack_id_stacks_id_fk" FOREIGN KEY ("stack_id") REFERENCES "public"."stacks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;