

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."ailments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "senior_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ailments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."appointments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "senior_id" "uuid" NOT NULL,
    "date" "text" NOT NULL,
    "time" "text",
    "doctor" "text" NOT NULL,
    "purpose" "text",
    "location" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."appointments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contacts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "senior_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contacts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."error_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "message" "text" NOT NULL,
    "stack" "text",
    "component_stack" "text",
    "timestamp" timestamp with time zone NOT NULL,
    "user_agent" "text",
    "url" "text",
    "user_id" "uuid",
    "error_type" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."error_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."medications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "senior_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "dosage" "text" NOT NULL,
    "frequency" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."medications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."performance_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "component_name" "text" NOT NULL,
    "load_time" numeric NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "user_agent" "text",
    "url" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."performance_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."seniors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "relationship" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."seniors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "name" "text" NOT NULL,
    "plan" "text" DEFAULT 'free'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."ailments"
    ADD CONSTRAINT "ailments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."error_logs"
    ADD CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."medications"
    ADD CONSTRAINT "medications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."performance_logs"
    ADD CONSTRAINT "performance_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."seniors"
    ADD CONSTRAINT "seniors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_ailments_senior_id" ON "public"."ailments" USING "btree" ("senior_id");



CREATE INDEX "idx_appointments_senior_id" ON "public"."appointments" USING "btree" ("senior_id");



CREATE INDEX "idx_contacts_senior_id" ON "public"."contacts" USING "btree" ("senior_id");



CREATE INDEX "idx_error_logs_error_type" ON "public"."error_logs" USING "btree" ("error_type");



CREATE INDEX "idx_error_logs_severity" ON "public"."error_logs" USING "btree" ("severity");



CREATE INDEX "idx_error_logs_timestamp" ON "public"."error_logs" USING "btree" ("timestamp");



CREATE INDEX "idx_error_logs_user_id" ON "public"."error_logs" USING "btree" ("user_id");



CREATE INDEX "idx_medications_senior_id" ON "public"."medications" USING "btree" ("senior_id");



CREATE INDEX "idx_performance_logs_component" ON "public"."performance_logs" USING "btree" ("component_name");



CREATE INDEX "idx_performance_logs_load_time" ON "public"."performance_logs" USING "btree" ("load_time");



CREATE INDEX "idx_performance_logs_timestamp" ON "public"."performance_logs" USING "btree" ("timestamp");



CREATE INDEX "idx_seniors_user_id" ON "public"."seniors" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."ailments"
    ADD CONSTRAINT "ailments_senior_id_fkey" FOREIGN KEY ("senior_id") REFERENCES "public"."seniors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_senior_id_fkey" FOREIGN KEY ("senior_id") REFERENCES "public"."seniors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_senior_id_fkey" FOREIGN KEY ("senior_id") REFERENCES "public"."seniors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."error_logs"
    ADD CONSTRAINT "error_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."medications"
    ADD CONSTRAINT "medications_senior_id_fkey" FOREIGN KEY ("senior_id") REFERENCES "public"."seniors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seniors"
    ADD CONSTRAINT "seniors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Users can delete own seniors records" ON "public"."seniors" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can insert own seniors records" ON "public"."seniors" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can update own seniors records" ON "public"."seniors" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can view own seniors records" ON "public"."seniors" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."seniors" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."ailments" TO "anon";
GRANT ALL ON TABLE "public"."ailments" TO "authenticated";
GRANT ALL ON TABLE "public"."ailments" TO "service_role";



GRANT ALL ON TABLE "public"."appointments" TO "anon";
GRANT ALL ON TABLE "public"."appointments" TO "authenticated";
GRANT ALL ON TABLE "public"."appointments" TO "service_role";



GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";



GRANT ALL ON TABLE "public"."error_logs" TO "anon";
GRANT ALL ON TABLE "public"."error_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."error_logs" TO "service_role";



GRANT ALL ON TABLE "public"."medications" TO "anon";
GRANT ALL ON TABLE "public"."medications" TO "authenticated";
GRANT ALL ON TABLE "public"."medications" TO "service_role";



GRANT ALL ON TABLE "public"."performance_logs" TO "anon";
GRANT ALL ON TABLE "public"."performance_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."performance_logs" TO "service_role";



GRANT ALL ON TABLE "public"."seniors" TO "anon";
GRANT ALL ON TABLE "public"."seniors" TO "authenticated";
GRANT ALL ON TABLE "public"."seniors" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
