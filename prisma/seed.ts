import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rozpoczynam seedowanie bazy danych...');

  // Clear existing quiz data to prevent conflicts
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.style.deleteMany({});
  await prisma.detail.deleteMany({});

  const hashedPassword = await hash('12345678', 12);

  // Seed users and other non-quiz data if needed (keeping it minimal for this task)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@artscore.pro' },
    update: {},
    create: {
      email: 'admin@artscore.pro',
      name: 'Administrator Systemu',
      password: hashedPassword,
      accountType: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('✅ Użytkownik admin gotowy.');

  // 1. Seed Rooms
  const roomsList = ["Salon", "Sypialnia", "Kuchnia", "Jadalnia", "Łazienka", "Przedpokój / Hol", "Gabinet / Biuro domowe", "Pokój dziecięcy", "Pokój młodzieżowy", "Garderoba", "Pokój gościnny", "Pokój hobby / Pracownia", "Spiżarnia", "Pralnia", "Taras / Balkon / Loggia", "Ogród zimowy", "Pokój fitness / Siłownia domowa", "Pokój multimedialny / Kino domowe", "Pokój rekreacyjny / Sala zabaw", "Pokój dla seniora", "Pokój dla niemowlęcia", "Kącik dla zwierząt (np. dla psa/kota)", "Garaż", "Pomieszczenie gospodarcze", "Piwnica", "Stryszek / Strych"];
  await prisma.room.createMany({
    data: roomsList.map(name => ({ name })),
    skipDuplicates: true,
  });
  console.log(`✅ Dodano ${roomsList.length} pomieszczeń.`);


  // 2. Seed Functional Quiz
  const functionalQuiz = await prisma.quiz.create({
    data: {
      title: 'Quiz Funkcjonalny',
      description: 'Zdefiniuj swoje potrzeby funkcjonalne, abyśmy mogli dopasować idealne rozwiązania do Twojego wnętrza.',
      type: 'FUNCTIONAL',
    },
  });
  console.log(`✅ Utworzono "${functionalQuiz.title}".`);

  const functionalQuestions = [
    // === 2.1. Styl życia i nawyki użytkownika ===
    {
      questionCode: 'LIFESTYLE_1',
      category: 'Styl życia i nawyki użytkownika',
      text: 'Ile osób mieszka w twoim domu?',
      type: 'single-choice',
      options: { choices: [{ value: '1', label: '1 osoba' }, { value: '2', label: '2 osoby' }, { value: '3-4', label: '3-4 osoby' }, { value: '5+', label: '5 i więcej' }] },
      branchingLogic: { rules: [{ condition: { value: '1', operator: 'neq' }, action: 'JUMP', target: 'LIFESTYLE_1_FOLLOWUP' }] },
      relevantRooms: ["Salon", "Kuchnia", "Jadalnia", "Łazienka", "Przedpokój / Hol", "Gabinet / Biuro domowe", "Pokój dziecięcy", "Pokój młodzieżowy", "Pokój dla seniora", "Pokój dla niemowlęcia"],
      tags: ['demographics'],
    },
    {
      questionCode: 'LIFESTYLE_1_FOLLOWUP',
      category: 'Styl życia i nawyki użytkownika',
      text: 'Kto to mniej więcej? (np. partner, dzieci, dziadkowie)',
      type: 'text',
      options: { placeholder: 'Partner, dzieci, współlokatorzy...' },
      relevantRooms: [],
      tags: ['demographics', 'follow-up'],
    },
    {
        questionCode: 'LIFESTYLE_2',
        category: 'Styl życia i nawyki użytkownika',
        text: 'W jakim wieku są osoby w domu?',
        type: 'multiple-choice',
        options: { choices: [{ value: '0-2', label: 'Niemowlęta (0-2 lata)' }, { value: '3-10', label: 'Małe dzieci (3-10 lat)' }, { value: '11-17', label: 'Nastolatki (11-17 lat)' }, { value: '18-64', label: 'Dorośli (18-64 lata)' }, { value: '65+', label: 'Seniorzy (65+)' }] },
        branchingLogic: { rules: [{ condition: { value: '0-2', operator: 'contains' }, action: 'JUMP', target: 'LIFESTYLE_2_FOLLOWUP_A' }, { condition: { value: '3-10', operator: 'contains' }, action: 'JUMP', target: 'LIFESTYLE_2_FOLLOWUP_B' }] },
        relevantRooms: ["Pokój dziecięcy", "Pokój młodzieżowy", "Pokój dla seniora", "Pokój dla niemowlęcia", "Salon", "Kuchnia", "Łazienka"],
        tags: ['demographics'],
    },
    {
        questionCode: 'LIFESTYLE_2_FOLLOWUP_A',
        category: 'Styl życia i nawyki użytkownika',
        text: 'Ile niemowląt (0-2 lata) mieszka w domu?',
        type: 'text',
        options: { inputType: 'number' },
        relevantRooms: [],
        tags: ['demographics', 'follow-up'],
    },
    {
        questionCode: 'LIFESTYLE_3',
        category: 'Styl życia i nawyki użytkownika',
        text: 'Czy ktoś w domu ma ograniczenia ruchowe lub specjalne potrzeby?',
        type: 'single-choice',
        options: { choices: [{ value: 'yes', label: 'Tak' }, { value: 'no', label: 'Nie' }] },
        branchingLogic: { rules: [{ condition: { value: 'yes', operator: 'eq' }, action: 'JUMP', target: 'LIFESTYLE_3_FOLLOWUP' }] },
        relevantRooms: ["Łazienka", "Pokój dla seniora", "Przedpokój / Hol", "Kuchnia", "Salon"],
        tags: ['accessibility'],
    },
    {
        questionCode: 'LIFESTYLE_3_FOLLOWUP',
        category: 'Styl życia i nawyki użytkownika',
        text: 'Dla ilu osób i w jakich pomieszczeniach należy uwzględnić specjalne potrzeby?',
        type: 'text',
        options: { placeholder: 'np. brak progów w łazience' },
        relevantRooms: [],
        tags: ['accessibility', 'follow-up'],
    },
    {
        questionCode: 'LIFESTYLE_10',
        category: 'Styl życia i nawyki użytkownika',
        text: 'Czy macie zwierzęta domowe?',
        type: 'single-choice',
        options: { choices: [{ value: 'dogs', label: 'Tak, psy' }, { value: 'cats', label: 'Tak, koty' }, { value: 'other', label: 'Tak, inne' }, { value: 'no', label: 'Nie' }] },
        branchingLogic: { rules: [{ condition: { value: 'no', operator: 'neq' }, action: 'JUMP', target: 'LIFESTYLE_10_FOLLOWUP' }] },
        relevantRooms: ["Kącik dla zwierząt (np. dla psa/kota)", "Salon", "Sypialnia", "Kuchnia"],
        tags: ['pets'],
    },
    {
        questionCode: 'LIFESTYLE_10_FOLLOWUP',
        category: 'Styl życia i nawyki użytkownika',
        text: 'Ile ich jest i jakie mają specjalne potrzeby?',
        type: 'text',
        options: { placeholder: 'np. 2 koty, potrzebują drapaka w salonie' },
        relevantRooms: [],
        tags: ['pets', 'follow-up'],
    },
    // === 2.2. Funkcjonalność i wyposażenie wnętrz ===
    {
        questionCode: 'FUNCTIONALITY_1',
        category: 'Funkcjonalność i wyposażenie wnętrz',
        text: 'Jak wiele rzeczy zazwyczaj przechowujecie?',
        type: 'slider',
        options: { min: 1, max: 5, referencePoints: [{ value: 1, label: 'Minimalizm' }, { value: 3, label: 'Średnio' }, { value: 5, label: 'Kolekcjoner' }] },
        relevantRooms: ["Garderoba", "Spiżarnia", "Garaż", "Piwnica", "Stryszek / Strych", "Pomieszczenie gospodarcze"],
        tags: ['storage'],
    },
    {
        questionCode: 'FUNCTIONALITY_14',
        category: 'Funkcjonalność i wyposażenie wnętrz',
        text: 'Jak często macie gości i ile osób?',
        type: 'slider',
        options: { min: 1, max: 5, referencePoints: [{ value: 1, label: 'Rzadko (1-2 osoby)' }, { value: 3, label: 'Co miesiąc (3-4 osoby)' }, { value: 5, label: 'Często (5+ osób)' }] },
        branchingLogic: { rules: [{ condition: { value: 2, operator: 'gt' }, action: 'JUMP', target: 'FUNCTIONALITY_14_FOLLOWUP' }] },
        relevantRooms: ["Pokój gościnny", "Salon", "Jadalnia"],
        tags: ['hospitality'],
    },
    {
        questionCode: 'FUNCTIONALITY_14_FOLLOWUP',
        category: 'Funkcjonalność i wyposażenie wnętrz',
        text: 'Jakie potrzeby mają Wasi goście?',
        type: 'text',
        options: { placeholder: 'np. dodatkowe łóżko, rozkładana sofa' },
        relevantRooms: [],
        tags: ['hospitality', 'follow-up'],
    },
     // === 2.3. Preferencje dotyczące utrzymania i konserwacji ===
    {
        questionCode: 'MAINTENANCE_1',
        category: 'Preferencje dotyczące utrzymania i konserwacji',
        text: 'Ile godzin tygodniowo możecie poświęcić na sprzątanie?',
        type: 'slider',
        options: { min: 1, max: 5, referencePoints: [{ value: 1, label: '< 2h' }, { value: 3, label: '2-5h' }, { value: 5, label: '> 5h' }] },
        relevantRooms: ["Pralnia", "Łazienka", "Kuchnia", "Salon", "Pokój dziecięcy"],
        tags: ['cleaning'],
    },
    {
        questionCode: 'MAINTENANCE_3',
        category: 'Preferencje dotyczące utrzymania i konserwacji',
        text: 'Co jest ważniejsze: łatwe czyszczenie czy trwałość materiałów?',
        type: 'trade-off',
        options: {
            optionA: { value: 'easy_clean', label: 'Łatwe czyszczenie', description: 'Materiały mogą wymagać wymiany szybciej.' },
            optionB: { value: 'durable', label: 'Trwałość', description: 'Materiały mogą być trudniejsze w czyszczeniu.' }
        },
        relevantRooms: ["Kuchnia", "Łazienka", "Salon", "Pokój dziecięcy"],
        tags: ['cleaning', 'materials', 'trade-off'],
    },
    // === 2.4. Preferencje oświetleniowe i klimatyczne ===
    {
        questionCode: 'LIGHTING_1',
        category: 'Preferencje oświetleniowe i klimatyczne',
        text: 'Ile godzin dziennie macie naturalnego światła w kluczowych pomieszczeniach?',
        type: 'slider',
        options: { min: 1, max: 5, referencePoints: [{ value: 1, label: 'Mało (<4h)' }, { value: 3, label: 'Średnio (4-8h)' }, { value: 5, label: 'Dużo (>8h)' }] },
        relevantRooms: ["Ogród zimowy", "Taras / Balkon / Loggia", "Salon", "Kuchnia", "Sypialnia"],
        tags: ['lighting'],
    },
    {
        questionCode: 'LIGHTING_3',
        category: 'Preferencje oświetleniowe i klimatyczne',
        text: 'Jakie światło preferujecie?',
        type: 'image-choice',
        options: {
            choices: [
                { value: 'warm', label: 'Ciepłe', imageUrl: '/images/placeholder.jpg' },
                { value: 'neutral', label: 'Neutralne', imageUrl: '/images/placeholder.jpg' },
                { value: 'cold', label: 'Zimne', imageUrl: '/images/placeholder.jpg' },
            ]
        },
        relevantRooms: ["Sypialnia", "Gabinet / Biuro domowe", "Salon", "Kuchnia"],
        tags: ['lighting', 'ambience'],
    }
  ];

  for (const q of functionalQuestions) {
    await prisma.question.create({
      data: {
        ...q,
        quizId: functionalQuiz.id,
      },
    });
  }

  console.log(`✅ Dodano ${functionalQuestions.length} pytań do Quizu Funkcjonalnego.`);

  console.log('\n🎉 Seedowanie zakończone pomyślnie!');
}

main()
  .catch((e) => {
    console.error('❌ Błąd podczas seedowania:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
