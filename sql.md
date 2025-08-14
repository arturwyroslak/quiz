-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "accountType" TEXT NOT NULL DEFAULT 'PARTNER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verificationToken" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" DATETIME,
    "referralCode" TEXT,
    "referredById" TEXT,
    "nip" TEXT,
    "regon" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "companyName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "preferences" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "estimatedValue" REAL,
    "consentContact" BOOLEAN NOT NULL DEFAULT false,
    "consentPromoMaterials" BOOLEAN NOT NULL DEFAULT false,
    "partnerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "leads_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "position" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "companyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "team_members_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reports_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "emailNewLeads" BOOLEAN NOT NULL DEFAULT true,
    "emailLeadUpdates" BOOLEAN NOT NULL DEFAULT true,
    "emailUserProgram" BOOLEAN NOT NULL DEFAULT true,
    "emailMarketing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "quiz_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "quizId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quiz_sessions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quiz_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionCode" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "quizId" TEXT NOT NULL,
    "branchingLogic" TEXT,
    "relevantRooms" TEXT,
    "tags" TEXT,
    "order" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "answers_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "styles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "style_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "styleId" TEXT NOT NULL,
    "room" TEXT,
    CONSTRAINT "style_images_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "styles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "styleImageId" TEXT NOT NULL,
    "x" REAL,
    "y" REAL,
    "w" REAL,
    "h" REAL,
    "sentiment" TEXT NOT NULL DEFAULT 'neutral',
    "imageTagId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_styleImageId_fkey" FOREIGN KEY ("styleImageId") REFERENCES "style_images" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_imageTagId_fkey" FOREIGN KEY ("imageTagId") REFERENCES "image_tags" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "style_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "styleId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    CONSTRAINT "style_scores_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "style_scores_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "styles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "quiz_session_rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    CONSTRAINT "quiz_session_rooms_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quiz_session_rooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "details" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "image_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "styleImageId" TEXT NOT NULL,
    "detailId" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    CONSTRAINT "image_tags_styleImageId_fkey" FOREIGN KEY ("styleImageId") REFERENCES "style_images" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "image_tags_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "details" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "detail_scores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "detailId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    CONSTRAINT "detail_scores_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "detail_scores_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "details" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");
CREATE UNIQUE INDEX "users_resetPasswordToken_key" ON "users"("resetPasswordToken");
CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");
CREATE UNIQUE INDEX "team_members_email_key" ON "team_members"("email");
CREATE UNIQUE INDEX "user_notifications_userId_key" ON "user_notifications"("userId");
CREATE UNIQUE INDEX "questions_questionCode_key" ON "questions"("questionCode");
CREATE UNIQUE INDEX "styles_name_key" ON "styles"("name");
CREATE UNIQUE INDEX "style_scores_sessionId_styleId_key" ON "style_scores"("sessionId", "styleId");
CREATE UNIQUE INDEX "rooms_name_key" ON "rooms"("name");
CREATE UNIQUE INDEX "image_tags_styleImageId_detailId_x_y_key" ON "image_tags"("styleImageId", "detailId", "x", "y");
CREATE UNIQUE INDEX "detail_scores_sessionId_detailId_key" ON "detail_scores"("sessionId", "detailId");

-- Seeding data
-- Note: The following data is based on the prisma/seed.ts script.
-- It is recommended to run the seed script for a complete and accurate seeding.
-- This SQL script is for reference and manual database setup.
-- WARNING: Running these commands on an existing database may cause conflicts.
-- It is recommended to clear the quiz-related tables before running these inserts.

-- Seed Rooms
INSERT INTO "rooms" ("id", "name") VALUES
('room-1', 'Salon'), ('room-2', 'Sypialnia'), ('room-3', 'Kuchnia'), ('room-4', 'Jadalnia'), ('room-5', 'Łazienka'), ('room-6', 'Przedpokój / Hol'), ('room-7', 'Gabinet / Biuro domowe'), ('room-8', 'Pokój dziecięcy'), ('room-9', 'Pokój młodzieżowy'), ('room-10', 'Garderoba'), ('room-11', 'Pokój gościnny'), ('room-12', 'Pokój hobby / Pracownia'), ('room-13', 'Spiżarnia'), ('room-14', 'Pralnia'), ('room-15', 'Taras / Balkon / Loggia'), ('room-16', 'Ogród zimowy'), ('room-17', 'Pokój fitness / Siłownia domowa'), ('room-18', 'Pokój multimedialny / Kino domowe'), ('room-19', 'Pokój rekreacyjny / Sala zabaw'), ('room-20', 'Pokój dla seniora'), ('room-21', 'Pokój dla niemowlęcia'), ('room-22', 'Kącik dla zwierząt (np. dla psa/kota)'), ('room-23', 'Garaż'), ('room-24', 'Pomieszczenie gospodarcze'), ('room-25', 'Piwnica'), ('room-26', 'Stryszek / Strych');

-- Seed Functional Quiz
INSERT INTO "quizzes" ("id", "title", "description", "type", "createdAt", "updatedAt") VALUES
('functional-quiz-1', 'Quiz Funkcjonalny', 'Zdefiniuj swoje potrzeby funkcjonalne, abyśmy mogli dopasować idealne rozwiązania do Twojego wnętrza.', 'FUNCTIONAL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed Questions for Functional Quiz
INSERT INTO "questions" ("id", "quizId", "questionCode", "category", "text", "type", "options", "branchingLogic", "relevantRooms", "tags", "createdAt", "updatedAt") VALUES
('q-lifestyle-1', 'functional-quiz-1', 'LIFESTYLE_1', 'Styl życia i nawyki użytkownika', 'Ile osób mieszka w twoim domu?', 'single-choice', '{"choices": [{"value": "1", "label": "1 osoba"}, {"value": "2", "label": "2 osoby"}, {"value": "3-4", "label": "3-4 osoby"}, {"value": "5+", "label": "5 i więcej"}]}', '{"rules": [{"condition": {"value": "1", "operator": "neq"}, "action": "JUMP", "target": "LIFESTYLE_1_FOLLOWUP"}]}', '["Salon", "Kuchnia", "Jadalnia", "Łazienka", "Przedpokój / Hol", "Gabinet / Biuro domowe", "Pokój dziecięcy", "Pokój młodzieżowy", "Pokój dla seniora", "Pokój dla niemowlęcia", "Pokój rekreacyjny / Sala zabaw", "Pokój gościnny", "Pomieszczenie gospodarcze"]', '["demographics"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-lifestyle-1f', 'functional-quiz-1', 'LIFESTYLE_1_FOLLOWUP', 'Styl życia i nawyki użytkownika', 'Kto to mniej więcej? (np. partner, dzieci, dziadkowie)', 'text', '{"placeholder": "Partner, dzieci, współlokatorzy..."}', NULL, '[]', '["demographics", "follow-up"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-lifestyle-2', 'functional-quiz-1', 'LIFESTYLE_2', 'Styl życia i nawyki użytkownika', 'W jakim wieku są osoby w domu?', 'multiple-choice', '{"choices": [{"value": "0-2", "label": "Niemowlęta (0-2 lata)"}, {"value": "3-10", "label": "Małe dzieci (3-10 lat)"}, {"value": "11-17", "label": "Nastolatki (11-17 lat)"}, {"value": "18-64", "label": "Dorośli (18-64 lata)"}, {"value": "65+", "label": "Seniorzy (65+)"}]}', '{"rules": [{"condition": {"value": "0-2", "operator": "contains"}, "action": "JUMP", "target": "LIFESTYLE_2_FOLLOWUP"}]}', '["Pokój dziecięcy", "Pokój młodzieżowy", "Pokój dla seniora", "Pokój dla niemowlęcia", "Pokój rekreacyjny / Sala zabaw", "Salon", "Kuchnia", "Łazienka", "Przedpokój / Hol"]', '["demographics"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-lifestyle-2f', 'functional-quiz-1', 'LIFESTYLE_2_FOLLOWUP', 'Styl życia i nawyki użytkownika', 'Proszę, podaj liczbę osób w każdej wybranej grupie wiekowej.', 'text', '{"placeholder": "np. Dorośli: 2, Dzieci: 1"}', NULL, '[]', '["demographics", "follow-up"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-lifestyle-3', 'functional-quiz-1', 'LIFESTYLE_3', 'Styl życia i nawyki użytkownika', 'Czy ktoś w domu ma ograniczenia ruchowe lub specjalne potrzeby?', 'single-choice', '{"choices": [{"value": "yes", "label": "Tak"}, {"value": "no", "label": "Nie"}, {"value": "n/a", "label": "Nie wiem/nie dotyczy"}]}', '{"rules": [{"condition": {"value": "yes", "operator": "eq"}, "action": "JUMP", "target": "LIFESTYLE_3_FOLLOWUP"}]}', '["Łazienka", "Pokój dla seniora", "Pokój dziecięcy", "Pokój dla niemowlęcia", "Przedpokój / Hol", "Kuchnia", "Salon", "Pomieszczenie gospodarcze"]', '["accessibility"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-lifestyle-3f', 'functional-quiz-1', 'LIFESTYLE_3_FOLLOWUP', 'Styl życia i nawyki użytkownika', 'Dla ilu osób i w jakich pomieszczeniach należy uwzględnić specjalne potrzeby?', 'text', '{"placeholder": "np. brak progów w łazience lub przedpokoju"}', NULL, '[]', '["accessibility", "follow-up"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-lifestyle-4', 'functional-quiz-1', 'LIFESTYLE_4', 'Styl życia i nawyki użytkownika', 'Czyje potrzeby chcesz uwzględnić w rekomendacjach?', 'single-choice', '{"choices": [{"value": "all", "label": "Wszystkich domowników"}, {"value": "selected", "label": "Wybranych osób"}, {"value": "mine", "label": "Tylko moje"}]}', NULL, '["Salon", "Kuchnia", "Jadalnia", "Sypialnia", "Gabinet / Biuro domowe", "Pokój młodzieżowy", "Pokój dla seniora", "Łazienka"]', '["decision-making"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-functionality-1', 'functional-quiz-1', 'FUNCTIONALITY_1', 'Funkcjonalność i wyposażenie wnętrz', 'Jak wiele rzeczy (ubrań, narzędzi, zapasów) zazwyczaj przechowujecie?', 'slider', '{"min": 1, "max": 5, "referencePoints": [{"value": 1, "label": "Mało"}, {"value": 3, "label": "Średnio"}, {"value": 5, "label": "Dużo"}]}', '{"rules": [{"condition": {"value": 3, "operator": "gt"}, "action": "JUMP", "target": "FUNCTIONALITY_1_FOLLOWUP"}]}', '["Garderoba", "Spiżarnia", "Garaż", "Piwnica", "Stryszek / Strych", "Pomieszczenie gospodarcze", "Przedpokój / Hol"]', '["storage"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('q-functionality-1f', 'functional-quiz-1', 'FUNCTIONALITY_1_FOLLOWUP', 'Funkcjonalność i wyposażenie wnętrz', 'Czy przechowujecie dużo rzeczy sezonowych?', 'single-choice', '{"choices": [{"value": "yes", "label": "Tak"}, {"value": "no", "label": "Nie"}]}', NULL, '[]', '["storage", "follow-up"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- This is a sample of the questions. A full script would contain all questions from the seed file.
