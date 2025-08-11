import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rozpoczynam seedowanie bazy danych...');

  // Hash hasła 12345678 dla wszystkich kont testowych
  const hashedPassword = await hash('12345678', 12);

  // 1. Utworzenie kont testowych dla każdej roli
  console.log('👤 Tworzę konta testowe...');

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@artscore.pro',
      name: 'Administrator Systemu',
      password: hashedPassword,
      accountType: 'ADMIN',
      isVerified: true,
      isActive: true,
      referralCode: 'ADMIN001',
    },
  });

  // Partner - osoba fizyczna (polecony przez admina)
  const partner = await prisma.user.create({
    data: {
      email: 'partner@artscore.pro',
      name: 'Jan Kowalski',
      password: hashedPassword,
      accountType: 'PARTNER',
      isVerified: true,
      isActive: true,
      referralCode: 'PARTNER001',
      referredById: admin.id,
      phone: '+48123456789',
      address: 'ul. Partnerska 1, 00-001 Warszawa',
    },
  });

  // Company - firma (polecona przez partnera)
  const company = await prisma.user.create({
    data: {
      email: 'company@artscore.pro',
      name: 'Anna Nowak',
      password: hashedPassword,
      accountType: 'COMPANY',
      isVerified: true,
      isActive: true,
      referralCode: 'COMPANY001',
      referredById: partner.id,
      companyName: 'ArtTech Solutions Sp. z o.o.',
      nip: '1234567890',
      regon: '123456789',
      phone: '+48987654321',
      address: 'ul. Biznesowa 10, 00-002 Warszawa',
    },
  });

  // Team Member (polecony przez firmę)
  const teamMember = await prisma.user.create({
    data: {
      email: 'teammember@artscore.pro',
      name: 'Piotr Wiśniewski',
      password: hashedPassword,
      accountType: 'TEAM_MEMBER',
      isVerified: true,
      isActive: true,
      referredById: company.id,
      phone: '+48555666777',
    },
  });

  console.log('✅ Utworzono konta testowe:');
  console.log(`   - Admin: ${admin.email} (hasło: 12345678)`);
  console.log(`   - Partner: ${partner.email} (hasło: 12345678)`);
  console.log(`   - Company: ${company.email} (hasło: 12345678)`);
  console.log(`   - Team Member: ${teamMember.email} (hasło: 12345678)`);

  // 2. Utworzenie członków zespołu dla firmy
  console.log('👥 Tworzę członków zespołu...');

  const teamMembers = await Promise.all([
    prisma.teamMember.create({
      data: {
        name: 'Marcin Zieliński',
        email: 'marcin.zielinski@arttech.com',
        phone: '+48111222333',
        position: 'Senior Sales Representative',
        status: 'ACTIVE',
        companyId: company.id,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: 'Katarzyna Lewandowska',
        email: 'katarzyna.lewandowska@arttech.com',
        phone: '+48444555666',
        position: 'Marketing Specialist',
        status: 'ACTIVE',
        companyId: company.id,
      },
    }),
    prisma.teamMember.create({
      data: {
        name: 'Tomasz Dąbrowski',
        email: 'tomasz.dabrowski@arttech.com',
        position: 'Junior Sales Associate',
        status: 'INACTIVE',
        companyId: company.id,
      },
    }),
  ]);

  console.log(`✅ Utworzono ${teamMembers.length} członków zespołu`);

  // 3. Utworzenie leadów testowych
  console.log('🎯 Tworzę leady testowe...');

  const leads = await Promise.all([
    // Leady dla partnera
    prisma.lead.create({
      data: {
        firstName: 'Maria',
        lastName: 'Kowalczyk',
        email: 'maria.kowalczyk@example.com',
        phone: '+48123123123',
        address: 'ul. Testowa 1, 00-001 Kraków',
        preferences: 'Zainteresowana rozwiązaniami dla małych firm, preferuje kontakt telefoniczny',
        status: 'PENDING',
        estimatedValue: 5000.00,
        consentContact: true,
        consentPromoMaterials: true,
        partnerId: partner.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Robert',
        lastName: 'Nowicki',
        email: 'robert.nowicki@example.com',
        phone: '+48456456456',
        address: 'ul. Biznesowa 5, 00-002 Gdańsk',
        preferences: 'Potrzebuje rozwiązania dla średniej firmy, pilny termin wdrożenia',
        status: 'CONTACTED',
        estimatedValue: 12000.00,
        consentContact: true,
        consentPromoMaterials: false,
        partnerId: partner.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Agnieszka',
        lastName: 'Wójcik',
        email: 'agnieszka.wojcik@example.com',
        phone: '+48789789789',
        preferences: 'Startup technologiczny, ograniczony budżet',
        status: 'CONVERTED',
        estimatedValue: 3500.00,
        consentContact: true,
        consentPromoMaterials: true,
        partnerId: partner.id,
      },
    }),
    // Leady dla firmy
    prisma.lead.create({
      data: {
        firstName: 'Michał',
        lastName: 'Kaczmarek',
        email: 'michal.kaczmarek@example.com',
        phone: '+48321321321',
        address: 'ul. Korporacyjna 20, 00-003 Wrocław',
        preferences: 'Duża korporacja, potrzeba kompleksowego rozwiązania',
        status: 'PENDING',
        estimatedValue: 25000.00,
        consentContact: true,
        consentPromoMaterials: true,
        partnerId: company.id,
      },
    }),
    prisma.lead.create({
      data: {
        firstName: 'Joanna',
        lastName: 'Mazur',
        email: 'joanna.mazur@example.com',
        phone: '+48654654654',
        address: 'ul. Handlowa 15, 00-004 Poznań',
        preferences: 'Firma rodzinna, potrzebuje prostego rozwiązania',
        status: 'REJECTED',
        estimatedValue: 2000.00,
        consentContact: true,
        consentPromoMaterials: false,
        partnerId: company.id,
      },
    }),
  ]);

  console.log(`✅ Utworzono ${leads.length} leadów testowych`);

  // 4. Utworzenie ustawień powiadomień dla użytkowników
  console.log('🔔 Tworzę ustawienia powiadomień...');

  const notifications = await Promise.all([
    prisma.userNotification.create({
      data: {
        userId: admin.id,
        emailNewLeads: true,
        emailLeadUpdates: true,
        emailUserProgram: true,
        emailMarketing: false,
      },
    }),
    prisma.userNotification.create({
      data: {
        userId: partner.id,
        emailNewLeads: true,
        emailLeadUpdates: true,
        emailUserProgram: true,
        emailMarketing: true,
      },
    }),
    prisma.userNotification.create({
      data: {
        userId: company.id,
        emailNewLeads: true,
        emailLeadUpdates: true,
        emailUserProgram: false,
        emailMarketing: true,
      },
    }),
    prisma.userNotification.create({
      data: {
        userId: teamMember.id,
        emailNewLeads: false,
        emailLeadUpdates: true,
        emailUserProgram: false,
        emailMarketing: false,
      },
    }),
  ]);

  console.log(`✅ Utworzono ustawienia powiadomień dla ${notifications.length} użytkowników`);

  // 5. Utworzenie przykładowych raportów
  console.log('📊 Tworzę przykładowe raporty...');

  const reports = await Promise.all([
    prisma.report.create({
      data: {
        title: 'Raport miesięczny - Styczeń 2024',
        type: 'monthly',
        data: {
          period: '2024-01',
          totalLeads: 15,
          convertedLeads: 3,
          totalCommission: 8500.00,
          conversionRate: 20.0,
        },
        generatedBy: partner.id,
      },
    }),
    prisma.report.create({
      data: {
        title: 'Raport kwartalny Q1 2024',
        type: 'quarterly',
        data: {
          period: 'Q1-2024',
          totalLeads: 45,
          convertedLeads: 12,
          totalCommission: 28000.00,
          conversionRate: 26.7,
          topPerformers: ['Jan Kowalski', 'Anna Nowak'],
        },
        generatedBy: company.id,
      },
    }),
  ]);

  console.log(`✅ Utworzono ${reports.length} przykładowych raportów`);

  // Podsumowanie
  console.log('\n🎉 Seedowanie zakończone pomyślnie!');
  console.log('\n📋 Podsumowanie utworzonych danych:');
  console.log(`   👤 Użytkownicy: 4`);
  console.log(`   👥 Członkowie zespołu: ${teamMembers.length}`);
  console.log(`   🎯 Leady: ${leads.length}`);
  console.log(`   🔔 Ustawienia powiadomień: ${notifications.length}`);
  console.log(`   📊 Raporty: ${reports.length}`);
  
  console.log('\n🔑 Konta testowe (hasło dla wszystkich: 12345678):');
  console.log('   - admin@artscore.pro (Administrator)');
  console.log('   - partner@artscore.pro (Partner - osoba fizyczna)');
  console.log('   - company@artscore.pro (Partner - firma)');
  console.log('   - teammember@artscore.pro (Członek zespołu)');

  // 6. Utworzenie danych dla quizów
  console.log('\n🧠 Tworzę dane dla quizów...');

  const styleQuiz = await prisma.quiz.create({
    data: {
      title: 'Quiz Stylu',
      description: 'Odkryj swój idealny styl wnętrza.',
      type: 'STYLE',
    },
  });

  const functionalQuiz = await prisma.quiz.create({
    data: {
      title: 'Quiz Funkcjonalny',
      description: 'Zdefiniuj swoje potrzeby funkcjonalne.',
      type: 'FUNCTIONAL',
    },
  });

  console.log('✅ Utworzono dwa quizy: Quiz Stylu i Quiz Funkcjonalny.');

  // Pytania do Quizu Funkcjonalnego
  const q1 = { id: 'clerk_q1', quizId: functionalQuiz.id, text: 'Ile osób mieszka w twoim domu?', type: 'single-choice', options: { choices: ['1 osoba', '2 osoby', '3-4 osoby', '5 i więcej'] } };
  const q2 = { id: 'clerk_q2', quizId: functionalQuiz.id, text: 'W jakim wieku są osoby w domu?', type: 'multiple-choice', options: { choices: ['Niemowlęta (0-2 lata)', 'Małe dzieci (3-10 lat)', 'Nastolatki (11-17 lat)', 'Dorośli (18-64 lata)', 'Seniorzy (65+)'] } };
  const q3 = { id: 'clerk_q3', quizId: functionalQuiz.id, text: 'Jak ważne jest miejsce do relaksu?', type: 'slider', options: { min: 1, max: 5, step: 1 } };
  const q4 = { id: 'clerk_q4', quizId: functionalQuiz.id, text: 'Czy ktoś w domu ma ograniczenia ruchowe?', type: 'single-choice', options: { choices: ['Tak', 'Nie'] }, branchingLogic: { 'Tak': 'clerk_q4_followup' } };
  const q4_followup = { id: 'clerk_q4_followup', quizId: functionalQuiz.id, text: 'Dla ilu osób i w jakich pomieszczeniach?', type: 'text' };
  const q5 = { id: 'clerk_q5', quizId: functionalQuiz.id, text: 'Czy pracujesz lub uczysz się zdalnie?', type: 'single-choice', options: { choices: ['Tak', 'Nie'] }, branchingLogic: { 'Tak': 'clerk_q5_followup' } };
  const q5_followup = { id: 'clerk_q5_followup', quizId: functionalQuiz.id, text: 'Ile godzin dziennie średnio?', type: 'single-choice', options: { choices: ['0-2h', '2-4h', '4-8h', '>8h'] } };

  await prisma.question.createMany({
    data: [q1, q2, q3, q4, q4_followup, q5, q5_followup]
  });

  console.log('✅ Dodano pytania do Quizu Funkcjonalnego.');

  // Style dla Quizu Stylu
  const styleNames = [
    'Nowoczesny', 'Minimalistyczny', 'Industrialny', 'Rustykalny',
    'Skandynawski', 'Boho', 'Glamour', 'Klasyczny'
  ];
  const styles = [];
  for (const name of styleNames) {
    const style = await prisma.style.create({
      data: { name },
    });
    styles.push(style);
  }

  // Obrazy dla stylów
  const styleImagesData = [
    { styleName: 'Nowoczesny', url: '/images/704970.jpg' },
    { styleName: 'Minimalistyczny', url: '/images/474881.jpg' },
    { styleName: 'Industrialny', url: '/images/831465.jpg' },
    { styleName: 'Rustykalny', url: '/images/75430.jpg' },
    { styleName: 'Skandynawski', url: '/images/800939.jpg' },
    { styleName: 'Boho', url: '/images/351204.jpg' },
    { styleName: 'Glamour', url: '/images/7049701.jpg' },
    { styleName: 'Klasyczny', url: '/images/image (11).png' },
  ];

  for (const imageData of styleImagesData) {
    const style = styles.find(s => s.name === imageData.styleName);
    if (style) {
      await prisma.styleImage.create({
        data: {
          styleId: style.id,
          url: imageData.url,
        },
      });
    }
  }

  console.log('✅ Dodano style i obrazy dla Quizu Stylu.');

  // Pomieszczenia
  const rooms = [
    "Salon", "Kuchnia", "Jadalnia", "Sypialnia główna", "Sypialnia dziecięca",
    "Sypialnia gościnna", "Pokój nastolatka", "Garderoba", "Gabinet/biuro domowe",
    "Pokój do nauki/pracownia", "Biblioteka/pokój do czytania", "Pokój multimedialny/home cinema",
    "Pokój hobby", "Pokój fitness/siłownia domowa", "Łazienka główna", "Toaleta osobna",
    "Łazienka dziecięca", "Pokój kąpielowy/spa domowe", "Pralnia/suszarnia", "Przedpokój/hol",
    "Korytarz", "Wiatrołap", "Spiżarnia", "Schowek/gospodarczy", "Kotłownia/ pom. techniczne",
    "Balkon", "Taras", "Ogród zimowy", "Patio", "Garaż", "Garaż gym", "Carport"
  ];

  await prisma.room.createMany({
    data: rooms.map(name => ({ name })),
    skipDuplicates: true,
  });

  console.log('✅ Dodano listę pomieszczeń.');

  console.log('\n🔑 Konta testowe (hasło dla wszystkich: 12345678):');
  console.log('   - admin@artscore.pro (Administrator)');
  console.log('   - partner@artscore.pro (Partner - osoba fizyczna)');
  console.log('   - company@artscore.pro (Partner - firma)');
  console.log('   - teammember@artscore.pro (Członek zespołu)');
}

main()
  .catch((e) => {
    console.error('❌ Błąd podczas seedowania:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
