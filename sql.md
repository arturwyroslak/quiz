# SQL Commands for Quiz Tables and Seeding

This file contains the SQL commands to create the necessary tables for the quiz functionality and to seed them with initial data, based on the provided Prisma schema and seed script.

**Note:** The original Prisma schema uses `cuid()` for IDs. This script uses `UUID` with `gen_random_uuid()` as a default for PostgreSQL. The `INSERT` statements use pre-defined UUIDs to maintain relational integrity.

---

## 1. Data Definition Language (DDL) - Table Creation

These commands create the tables for the quiz system.

```sql
-- Create the custom enum type for QuizType
CREATE TYPE "QuizType" AS ENUM ('STYLE', 'FUNCTIONAL');

-- Create the "quizzes" table
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "QuizType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

-- Create the "rooms" table
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "rooms_name_key" ON "rooms"("name");

-- Create the "styles" table
CREATE TABLE "styles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "styles_name_key" ON "styles"("name");

-- Create the "style_images" table
CREATE TABLE "style_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "styleId" TEXT NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "style_images_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "styles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the "quiz_sessions" table
CREATE TABLE "quiz_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "quizId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "quiz_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "quiz_sessions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the "questions" table
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" JSONB,
    "branchingLogic" JSONB,
    "quizId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the "answers" table
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "answers_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the "comments" table
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "styleImageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "comments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_styleImageId_fkey" FOREIGN KEY ("styleImageId") REFERENCES "style_images"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the "style_scores" table
CREATE TABLE "style_scores" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "styleId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "style_scores_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "style_scores_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "styles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "style_scores_sessionId_styleId_key" ON "style_scores"("sessionId", "styleId");

-- Create the "quiz_session_rooms" table
CREATE TABLE "quiz_session_rooms" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "quiz_session_rooms_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quiz_session_rooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

```

---

## 2. Data Manipulation Language (DML) - Seeding Data

These commands insert the initial data into the newly created tables.

```sql
-- Define UUIDs to be used in INSERT statements
-- Note: In a real scenario, these would be generated by the application or database.
DO $$
DECLARE
    style_quiz_id TEXT := 'clerk_style_quiz_id';
    functional_quiz_id TEXT := 'clerk_functional_quiz_id';
    style_nowoczesny_id TEXT := 'clerk_style_nowoczesny';
    style_minimalistyczny_id TEXT := 'clerk_style_minimalistyczny';
    style_industrialny_id TEXT := 'clerk_style_industrialny';
    style_rustykalny_id TEXT := 'clerk_style_rustykalny';
    style_skandynawski_id TEXT := 'clerk_style_skandynawski';
    style_boho_id TEXT := 'clerk_style_boho';
    style_glamour_id TEXT := 'clerk_style_glamour';
    style_klasyczny_id TEXT := 'clerk_style_klasyczny';
BEGIN

-- Insert Quizzes
INSERT INTO "quizzes" ("id", "title", "description", "type", "updatedAt") VALUES
(style_quiz_id, 'Quiz Stylu', 'Odkryj swój idealny styl wnętrza.', 'STYLE', NOW()),
(functional_quiz_id, 'Quiz Funkcjonalny', 'Zdefiniuj swoje potrzeby funkcjonalne.', 'FUNCTIONAL', NOW());

-- Insert Questions for Functional Quiz
INSERT INTO "questions" ("id", "quizId", "text", "type", "options", "branchingLogic", "updatedAt") VALUES
('clerk_q1', functional_quiz_id, 'Ile osób mieszka w twoim domu?', 'single-choice', '{"choices": ["1 osoba", "2 osoby", "3-4 osoby", "5 i więcej"]}', NULL, NOW()),
('clerk_q2', functional_quiz_id, 'W jakim wieku są osoby w domu?', 'multiple-choice', '{"choices": ["Niemowlęta (0-2 lata)", "Małe dzieci (3-10 lat)", "Nastolatki (11-17 lat)", "Dorośli (18-64 lata)", "Seniorzy (65+)"]}', NULL, NOW()),
('clerk_q3', functional_quiz_id, 'Jak ważne jest miejsce do relaksu?', 'slider', '{"min": 1, "max": 5, "step": 1}', NULL, NOW()),
('clerk_q4', functional_quiz_id, 'Czy ktoś w domu ma ograniczenia ruchowe?', 'single-choice', '{"choices": ["Tak", "Nie"]}', '{"Tak": "clerk_q4_followup"}', NOW()),
('clerk_q4_followup', functional_quiz_id, 'Dla ilu osób i w jakich pomieszczeniach?', 'text', NULL, NULL, NOW()),
('clerk_q5', functional_quiz_id, 'Czy pracujesz lub uczysz się zdalnie?', 'single-choice', '{"choices": ["Tak", "Nie"]}', '{"Tak": "clerk_q5_followup"}', NOW()),
('clerk_q5_followup', functional_quiz_id, 'Ile godzin dziennie średnio?', 'single-choice', '{"choices": ["0-2h", "2-4h", "4-8h", ">8h"]}', NULL, NOW());

-- Insert Styles
INSERT INTO "styles" ("id", "name") VALUES
(style_nowoczesny_id, 'Nowoczesny'),
(style_minimalistyczny_id, 'Minimalistyczny'),
(style_industrialny_id, 'Industrialny'),
(style_rustykalny_id, 'Rustykalny'),
(style_skandynawski_id, 'Skandynawski'),
(style_boho_id, 'Boho'),
(style_glamour_id, 'Glamour'),
(style_klasyczny_id, 'Klasyczny');

-- Insert Style Images
INSERT INTO "style_images" ("id", "styleId", "url") VALUES
(gen_random_uuid(), style_nowoczesny_id, '/images/704970.jpg'),
(gen_random_uuid(), style_minimalistyczny_id, '/images/474881.jpg'),
(gen_random_uuid(), style_industrialny_id, '/images/831465.jpg'),
(gen_random_uuid(), style_rustykalny_id, '/images/75430.jpg'),
(gen_random_uuid(), style_skandynawski_id, '/images/800939.jpg'),
(gen_random_uuid(), style_boho_id, '/images/351204.jpg'),
(gen_random_uuid(), style_glamour_id, '/images/7049701.jpg'),
(gen_random_uuid(), style_klasyczny_id, '/images/image (11).png');

-- Insert Rooms
INSERT INTO "rooms" ("id", "name") VALUES
(gen_random_uuid(), 'Salon'), (gen_random_uuid(), 'Kuchnia'), (gen_random_uuid(), 'Jadalnia'), (gen_random_uuid(), 'Sypialnia główna'),
(gen_random_uuid(), 'Sypialnia dziecięca'), (gen_random_uuid(), 'Sypialnia gościnna'), (gen_random_uuid(), 'Pokój nastolatka'),
(gen_random_uuid(), 'Garderoba'), (gen_random_uuid(), 'Gabinet/biuro domowe'), (gen_random_uuid(), 'Pokój do nauki/pracownia'),
(gen_random_uuid(), 'Biblioteka/pokój do czytania'), (gen_random_uuid(), 'Pokój multimedialny/home cinema'),
(gen_random_uuid(), 'Pokój hobby'), (gen_random_uuid(), 'Pokój fitness/siłownia domowa'), (gen_random_uuid(), 'Łazienka główna'),
(gen_random_uuid(), 'Toaleta osobna'), (gen_random_uuid(), 'Łazienka dziecięca'), (gen_random_uuid(), 'Pokój kąpielowy/spa domowe'),
(gen_random_uuid(), 'Pralnia/suszarnia'), (gen_random_uuid(), 'Przedpokój/hol'), (gen_random_uuid(), 'Korytarz'),
(gen_random_uuid(), 'Wiatrołap'), (gen_random_uuid(), 'Spiżarnia'), (gen_random_uuid(), 'Schowek/gospodarczy'),
(gen_random_uuid(), 'Kotłownia/ pom. techniczne'), (gen_random_uuid(), 'Balkon'), (gen_random_uuid(), 'Taras'),
(gen_random_uuid(), 'Ogród zimowy'), (gen_random_uuid(), 'Patio'), (gen_random_uuid(), 'Garaż'),
(gen_random_uuid(), 'Garaż gym'), (gen_random_uuid(), 'Carport');

END $$;
```
